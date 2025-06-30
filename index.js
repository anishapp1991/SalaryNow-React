/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from './Redux/Reducer';

const store = createStore(authReducer);

const AppRedux = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

AppRegistry.registerComponent(appName, () => AppRedux);
