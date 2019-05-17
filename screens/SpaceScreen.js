import React from 'react';
import {ScrollView, StyleSheet, Image, SectionList, View} from 'react-native';
import {
  Text,
} from 'react-native-elements';
import {actions as spaceActions} from "../store/spaces";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Touchable from 'react-native-platform-touchable';
import {WebBrowser} from "expo";

const mapStateToProps = (state) => ({
  directory: state.spaces.directory,
});

const mapDispatchToProps = {
  ...spaceActions,
};

class SpaceScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('space', ''),
      headerStyle: {
        backgroundColor: '#ccc',
      },
    };
  };

  componentDidMount() {
    this.fetchSpace();
    this.fetchCalendar();
  }

  componentDidUpdate() {
    this.fetchSpace();
    this.fetchCalendar();
  }

  fetchSpace = () => {
    if (!this.getSpace()) {
      this.props.fetchSpace(this.props.navigation.getParam("url"));
    }
  };

  fetchCalendar = () => {
    if (!this.getCalendar()) {
      this.props.fetchCalendar(this.props.navigation.getParam("url"));
    }
  };

  getFilteredSpaces = () => this.props.directory[this.props.navigation.getParam("url")];
  getSpace = () => this.getFilteredSpaces().data;
  getCalendar = () => this.getFilteredSpaces().events;

  getContactSection = () => {
    const section = {
      title: "Contact",
      data: []
    };

    if (this.getSpace() && this.getSpace().contact) {
      if (this.getSpace().contact.email) {
        section.data.push({
          image: require("../assets/images/envelope-regular.png"),
          value: this.getSpace().contact.email,
        });
      }
      if (this.getSpace().contact.ml) {
        section.data.push({
          image: require("../assets/images/mail-bulk-solid.png"),
          value: this.getSpace().contact.ml,
        });
      }
      if (this.getSpace().contact.twitter) {
        section.data.push({
          image: require("../assets/images/twitter-brands.png"),
          value: this.getSpace().contact.twitter,
        });
      }
      if (this.getSpace().contact.irc) {
        section.data.push({
          image: require("../assets/images/comments-regular.png"),
          value: this.getSpace().contact.irc,
        });
      }
      if (this.getSpace().contact.phone) {
        section.data.push({
          image: require("../assets/images/phone-solid.png"),
          value: this.getSpace().contact.phone,
        })
      }
    }
    return section;
  };

  getAddressSection = () => {
    const section = {
      title: "Address",
      data: [

      ],
    };

    if (this.getSpace() && this.getSpace().location && this.getSpace().location.address) {
      section.data.push({
        image: require("../assets/images/map-marked-alt-solid.png"),
        value: this.getSpace().location.address,
      });
    }

    return section;
  };

  getStateSection = () => {
    const section = {
      title: 'State',
      data: [],
    };

    if (this.getSpace() && this.getSpace().state) {
      if (this.getSpace().state.open != null) {
        section.data.push({
          image: require("../assets/images/lock-solid.png"),
          value: this.getSpace().state.open ? "open" : "closed",
        });
      }

      if (this.getSpace().state.lastchange != null) {
        const date = new Date();
        date.setTime(this.getSpace().state.lastchange * 1000);
        section.data.push({
          image: require("../assets/images/clock-regular.png"),
          value: date.toUTCString(),
        });
      }
    }

    return section;
  };

  getEvents = () => {
    const section = {
      title: 'Events',
      data: [],
    };

    if (Array.isArray(this.getCalendar())) {
      const currentDate = new Date();
      this.getCalendar()
        .sort((a,b) => {
          return a.dtstart.value > b.dtstart.value
        })
        .forEach(event => {
        if (event.dtstart.value > currentDate) {
          section.data.push({
            value: `${event.dtstart.value.toLocaleDateString("de_DE")} ${event.summary.value}`,
          });
        }
      });
    }

    return section;
  };

  getLogo = () => {
    if (this.getSpace()
      && this.getSpace().logo) {
      return (
        <Image
          style={{height: 100, width: 100}}
          resizeMode={'contain'}
          source={{uri: this.getSpace().logo}}
        />
      );
    }
  };

  getSections = () => {
    const sections = [];

    const stateSection = this.getStateSection();
    if (stateSection.data.length > 0) {
      sections.push(stateSection);
    }

    const addressSection = this.getAddressSection();
    if (addressSection.data.length > 0) {
      sections.push(addressSection);
    }

    const contactSection = this.getContactSection();
    if (contactSection.data.length > 0) {
      sections.push(contactSection);
    }

    const eventSection = this.getEvents();
    if (eventSection.data.length > 0) {
      sections.push(eventSection);
    }
    return sections;
  };

  getHandleUrlPress = (url) => () => {
    WebBrowser.openBrowserAsync(url);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{flex: 1, flexDirection: "row", alignItems: "center",}}>
          <View style={styles.logoContainer}>
            {this.getLogo()}
          </View>
          <View style={{ flex: 1, flexDirection: "column", flexGrow: 2 }}>
            <Text h3>{this.getSpace() && this.getSpace().space}</Text>
            {this.getSpace() && <Touchable
              background={Touchable.Ripple('#ccc', false)}
              onPress={this.getHandleUrlPress(this.getSpace().url)}>
              <Text>{this.getSpace() && this.getSpace().url}</Text>
            </Touchable>}
          </View>
        </View>
        <View>
          <SectionList
            renderItem={({item, index}) => {
              return (
                <View style={{flex: 1, flexDirection: "row", alignItems: "center",}}>
                  <Image
                    style={styles.infoIcon}
                    source={item.image ? item.image : require("../assets/images/blank.png")}
                  />
                  <Text key={index}>
                    {item.value}
                  </Text>
                </View>
              )
            }}
            renderSectionHeader={({section: {title}}) => (
              <View style={{marginTop: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {title}
                </Text>
              </View>
            )}
            sections={this.getSections()}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </ScrollView>
    );
  }
}

SpaceScreen.propTypes = {
  directory: PropTypes.object,
  fetchSpace: PropTypes.func.isRequired,
  fetchCalendar: PropTypes.func.isRequired,
};

SpaceScreen.defaultProps = {
  directory: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 5,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    flexGrow: 1,
  },
  infoIcon: {
    width: 20,
    height: 20,
    margin: 3,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceScreen)