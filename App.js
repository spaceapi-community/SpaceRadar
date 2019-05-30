import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {AppLoading, Font, Icon, Localization} from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import 'babel-polyfill';
import thunkMiddleware from 'redux-thunk'
import persistedReducer from './store';
import { persistStore } from 'redux-persist'
import moment from 'moment';

import { PersistGate } from 'redux-persist/integration/react'

let store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));
let persistor = persistStore(store);

moment().locale(Localization.locale);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <PersistGate loading={<AppLoading />} persistor={persistor}>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </View>
          </PersistGate>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
});
