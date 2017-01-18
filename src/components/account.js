import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import axios from 'axios';
import store from 'react-native-simple-store';
import MessageLoader from './messageLoader';
import Message from './message';
import Auth from './Auth';

var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    Auth.checkToken();
  },
  getInitialState: function() {
    return {

    };
  },
  render: function() {
    if (window.loadMessages) {
      window.loadMessages = false;
      console.log('Loading messages..');
      MessageLoader.getMessages();
      return (this.render());
    }
    return (
      <View>
        <View style={styles.toolbar}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#4d3f76'}
            onPress={this.gotoLeftPage}
            >
            <Text style={styles.toolbar_button}>View</Text>
          </TouchableHighlight>

          <Text style={styles.toolbar_title}>Account</Text>

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#4d3f76'}
            onPress={this.gotoRightPage}
            >
            <Text style={styles.toolbar_button}>Post</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={styles.register_submit_button}
          underlayColor={'#328FE6'}
          onPress={this.logout}
          >
          <Text style={styles.label}>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  },
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'view'});
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'post'});
  },
  logout: function() {
    Auth.deleteSavedToken();
    window.myUsername = '';
    this.props.navigator.push({ name: 'login'});
  }
});
