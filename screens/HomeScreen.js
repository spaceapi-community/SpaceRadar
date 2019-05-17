import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import {
  ListItem
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
          />
        )
        : null;

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <FlatList
                data={Object.values(this.props.spaces).sort(
                  (a, b) =>
                    a.space.toLowerCase().localeCompare(b.space.toLowerCase())
                )}
                style={{ width: '100%' }}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.url}
            />

          </View>
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
    alignItems: 'center',
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
