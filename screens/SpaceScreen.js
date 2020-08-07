import React from 'react';
import {Text,ScrollView, StyleSheet, Switch, Image, SectionList, View, RefreshControl} from 'react-native';
import {
  Icon,
} from 'react-native-elements';
import {actions as spaceActions} from "../store/spaces";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Touchable from 'react-native-platform-touchable';
import { WebBrowser, Linking } from "expo";
import moment from 'moment';

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

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.fetchSpace();
    // this.fetchCalendar();
  }

  componentDidUpdate() {
    this.fetchSpace();
    // this.fetchCalendar();
  }

  fetchSpace = () => this.props.fetchSpace(this.props.navigation.getParam("url"));
  fetchCalendar = () => this.props.fetchCalendar(this.props.navigation.getParam("url"));

  getFilteredSpaces = () => this.props.directory[this.props.navigation.getParam("url")];
  getSpace = () => this.getFilteredSpaces().data;
  getCalendar = () => this.getFilteredSpaces().events;

  getLocationSection = () => {
    const section = {
      title: "Location",
      data: []
    };

    if (this.getSpace() && this.getSpace().location) {
      if (this.getSpace().location.address) {
        section.data.push({
          iconName: 'location-on',
          value: (<Text>{this.getSpace().location.address}</Text>),
        });
      }
    }
    return section;
  };

  getContactSection = () => {
    const section = {
      title: "Contact",
      data: []
    };

    if (this.getSpace() && this.getSpace().contact) {
      if (this.getSpace().contact.email) {
        section.data.push({
          iconName: 'email',
          value: (<Text>{this.getSpace().contact.email}</Text>),
        });
      }
      if (this.getSpace().contact.ml) {
        section.data.push({
          iconName: 'contact-mail',
          value: (<Text>{this.getSpace().contact.ml}</Text>),
        });
      }
      if (this.getSpace().contact.twitter) {
        section.data.push({
          type: 'material-community',
          iconName: 'twitter',
          value: (<Text>{this.getSpace().contact.twitter}</Text>),
        });
      }
      if (this.getSpace().contact.irc) {
        section.data.push({
          iconName: 'comment',
          value: (<Text>{this.getSpace().contact.irc}</Text>),
        });
      }
      if (this.getSpace().contact.phone) {
        section.data.push({
          iconName: 'local-phone',
          value: (<Text>{this.getSpace().contact.phone}</Text>),
        })
      }
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
          iconName: 'lock',
          value: (<Text>{this.getSpace().state.open ? "open" : "closed"}</Text>),
        });
      }

      if (this.getSpace().state.lastchange != null) {
        const date = new Date();
        date.setTime(this.getSpace().state.lastchange * 1000);
        section.data.push({
          iconName: 'access-time',
          value: (<Text>{date.toUTCString()}</Text>),
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
            iconName: 'today',
            value: (<Text>{`${moment(event.dtstart.value).format('YYYY-MM-DD HH:mm')} ${event.summary.value}`}</Text>),
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

    const locationSection = this.getLocationSection();
    if (locationSection.data.length > 0) {
      sections.push(locationSection);
    }

    const stateSection = this.getStateSection();
    if (stateSection.data.length > 0) {
      sections.push(stateSection);
    }

    const contactSection = this.getContactSection();
    if (contactSection.data.length > 0) {
      sections.push(contactSection);
    }

    // const eventSection = this.getEvents();
    // if (eventSection.data.length > 0) {
    //   sections.push(eventSection);
    // }

    return sections;
  };

  getHandleUrlPress = (url) => () => {
    WebBrowser.openBrowserAsync(url);
  };

  refreshSpace = () => {
    this.props.fetchSpace(this.props.navigation.getParam("url"), true);
    this.setState({refreshing: false});
  };

  render() {
    return (
      <View
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refreshSpace}
          />
        }
      >
        <View style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}>
          <View style={styles.logoContainer}>
            {this.getLogo()}
          </View>
          <View style={{ flex: 1, flexDirection: "column", flexGrow: 2 }}>
            <Text style={{ fontSize: 28 }}>
              {this.getSpace() && this.getSpace().space}
            </Text>
            {this.getSpace() && <Touchable
              background={Touchable.Ripple('#ccc', false)}
              onPress={this.getHandleUrlPress(this.getSpace().url)}>
              <Text>{this.getSpace() && this.getSpace().url}</Text>
            </Touchable>}
          </View>
        </View>
        <SectionList
          renderItem={({item, index}) => {
            return (
              <View style={styles.textContainer}>
                <Icon
                  name={item.iconName ? item.iconName : "warning"}
                  type={item.type ? item.type : 'material'}
                  style={styles.infoIcon}
                />
                <Text style={styles.sectionListText}>
                  {item.value}
                </Text>
              </View>
            )
          }}
          sections={this.getSections()}
          keyExtractor={(item, index) => item + index}
        />
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{
              false: '#ccc',
              true: '#4169e144'
            }}
            thumbColor={this.getFilteredSpaces().favorite ? '#4169e1ff' : '#999' }
            onValueChange={() => this.props.changeFavorite(this.props.navigation.getParam("url"))}
            value={this.getFilteredSpaces().favorite}
          />
          <Text>
            Show in favorite list
          </Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{
              false: '#ccc',
              true: '#4169e144'
            }}
            thumbColor={this.getFilteredSpaces().pushActive ? '#4169e1ff' : '#999' }
            onValueChange={() => this.props.changePush(this.props.navigation.getParam("url"))}
            value={this.getFilteredSpaces().pushActive}
          />
          <Text>
            Notify me if space opens/closes
          </Text>
        </View>
      </View>

    );
  }
}

SpaceScreen.propTypes = {
  directory: PropTypes.object,
  fetchSpace: PropTypes.func.isRequired,
  fetchCalendar: PropTypes.func.isRequired,
  changeFavorite: PropTypes.func.isRequired,
  changePush: PropTypes.func.isRequired,
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
    marginLeft: 10,
  },
  settings: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  sectionListText: {
    paddingLeft: 10,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceScreen)
