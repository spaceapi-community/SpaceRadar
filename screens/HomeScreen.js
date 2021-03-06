import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  View,
  TextInput,
} from 'react-native';
import {
  ListItem,
  Text,
  Icon,
} from 'react-native-elements';
import { connect } from 'react-redux'
import { actions } from '../store/spaces';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => ({
  spaces: state.spaces.directory
});

const mapDispatchToProps = {
  ...actions,
};

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Spaces",
    headerStyle: {
      backgroundColor: '#ccc',
    },
  };

  componentDidMount() {
    this.props.fetchDirectory();
  }

  renderItem = (item) =>
      typeof(item.item) == "object"
        ? (
          <ListItem
            title={item.item.space}
            subtitle={item.item.url}
            onPress={() => this.props.navigation.navigate('SpaceDetails', item.item)}
            rightIcon={
              <Icon
                name={'navigate-next'}
                type={'material'}
              />
            }
          />
        )
        : null;

  spaceFilter = (space) =>
    (this.state && this.state.spaceFilter)
      ? space.space.toLowerCase().includes(this.state.spaceFilter.toLowerCase())
      : true;

  render() {
    const favorites = Object.values(this.props.spaces)
      .filter(space => space.favorite)
      .filter(this.spaceFilter)
      .sort(
        (a, b) =>
          a.space.toLowerCase().localeCompare(b.space.toLowerCase())
      );

    const spaces = Object.values(this.props.spaces)
      .filter(space => !space.favorite)
      .filter(this.spaceFilter)
      .sort(
        (a, b) =>
          a.space.toLowerCase().localeCompare(b.space.toLowerCase())
      );

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon
            name={'search'}
            type={'material'}
            style={styles.infoIcon}
          />
          <TextInput
            style={{
              height: 60,
              paddingLeft: 10,
              width: '100%',
            }}
            placeholder="Search"
            onChangeText={(spaceFilter) => this.setState({spaceFilter})}
          />
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {favorites.length > 0 &&
            (
              <View style={styles.welcomeContainer}>
                <Text h5 style={{ paddingLeft: 15 }}>
                  favorites
                </Text>
                <FlatList
                  data={favorites}
                  style={{ width: '100%' }}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.url}
                />
              </View>
            )
          }
          {spaces.length > 0 &&
            (
              <View style={styles.welcomeContainer}>
                {favorites.length > 0 &&
                  (
                    <Text h5 style={{ paddingLeft: 15 }}>
                      spaces
                    </Text>
                  )
                }
                <FlatList
                  data={spaces}
                  style={{ width: '100%' }}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.url}
                />
              </View>
            )
          }
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  spaces: PropTypes.object,
  fetchDirectory: PropTypes.func.isRequired,
};

HomeScreen.defaultProps = {
  spaces: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 600,
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
