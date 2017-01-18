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

var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    store.get('token').then(token => {
      this.state.token = token.loginToken;
      console.log('Token found');
      this.checkToken();
    });
  },
  getInitialState: function() {
    return {
      token: ''
    };
  },
  render: function() {
    if (window.loadMessages) {
      console.log('Loading messages..');
      MessageLoader.getMessages(this.state.token);
      window.loadMessages = false;
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
      </View>
    );
  },
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'view'});
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'post'});
  },
  checkToken: function() {
    if (this.state.token === null) {
      return;
    }
    var nav = this.props.navigator;
    console.log('Attempting to login with token..');
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Login?token=' + this.state.token,
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      console.log(response);
      if (response !== 'success') {
          nav.push({ name: 'login'});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },

});
