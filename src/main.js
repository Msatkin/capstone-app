import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Navigator
} from 'react-native';

var Login = require('./components/login');
var Account = require('./components/account');
var Register = require('./components/register');

var ROUTES = {
  login: Login,
  account: Account,
  register: Register
};

module.exports = React.createClass({
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

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
