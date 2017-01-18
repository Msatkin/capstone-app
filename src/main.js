import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Navigator
} from 'react-native';
import axios from 'axios';
import Auth from './components/Auth';

var Login = require('./components/login');
var Account = require('./components/account');
var Register = require('./components/register');
var Post = require('./components/post');
var ViewMessages = require('./components/view');
var styles = require('./components/styles');

var ROUTES = {
  login: Login,
  account: Account,
  register: Register,
  post: Post,
  view: ViewMessages
};

module.exports = React.createClass({
  watchID: null,
  componentDidMount: function() {
    window.messages = '';
    window.loadMessages = false;
    var loadMessages = this.getMessages;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.position = [ position.coords.longitude, position.coords.latitude ];
        console.log('Global Position: ' + window.position);
        window.loadMessages = true;
        this.forceUpdate();
      },
      (error) => console.log(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    window.watchID = navigator.geolocation.watchPosition((position) => {
      window.position = [ position.coords.longitude, position.coords.latitude ];
      console.log('Global Position: ' + window.position);
      window.loadMessages = true;
      this.forceUpdate();
    });
  },
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  },
  render: function() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromBottomAndroid; } }
      />
    );
  }
});
