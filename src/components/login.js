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

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    store.get('token').then(token => {
      this.state.token = token.loginToken;
      console.log(token);
      console.log('Token found');
      this.checkToken();
    });
  },
  getInitialState: function() {
    return {
      username: '',
      password: '',
      loginResponse: '',
      token: ''
    };
  },
  render: function() {
    return (
      <View style={styles.login_container}>
        <View style={styles.title}>
          <Text style={styles.name}>GeoChat</Text>
        </View>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter Username'}
            maxLength={18}
            multiline={false}
            />

            <TextInput
              style={styles.input}
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              placeholder={'Enter Password'}
              maxLength={18}
              multiline={false}
              />

          <TouchableHighlight
            style={styles.big_button}
            underlayColor={'#328FE6'}
            onPress={this.tryLogin}
            >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.extra_buttons}>
          <TouchableHighlight
            style={styles.half_button}
            underlayColor={'#328FE6'}
            onPress={this.onPress}
            >
            <Text style={styles.half_button_label}>Forgot Password</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.half_button}
            underlayColor={'#328FE6'}
            onPress={this.gotoRegister}
            >
            <Text style={styles.half_button_label}>Register</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  tryLogin: function() {
    var hash = this.hashPassword();
    var currentState = this.state;
    var save = this.saveToken;
    var nav = this.props.navigator;
    console.log('state: ', this.state);
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Login?username='+ this.state.username +'&password=' + hash,
      dataType: "json"
    })
    .then(function (data) {
      this.state = currentState;
      var response = data.request._response.split('"')[1];
      var storeToken = saveToken;
      response = response.split(':');
      console.log(response);
      this.state.loginResponse = response;
      switch(response[0]) {
        case 'success':
          console.log('SUCCESS');
          storeToken(response[1]);
          save();
          nav.push({ name: 'account'});
          break;

        case 'error':
          this.handleBadResponse();
          break;

        default:
          console.log('Error Unknown');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  checkToken: function() {
    if (this.state.token === null) {
      return;
    }
    console.log(this.state.token);
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
      switch(response) {
        case 'success':
          console.log('Loading next page..');
          nav.push({ name: 'account'});
          break;

        case 'error':
          handleBadResponse();
          break;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  saveToken: function(token) {
    try {
      console.log('Saving token: ' + token);
      store.save('token', {loginToken: token});
      this.state.token = token;
      console.log('Token saved');
    } catch (error) {
      console.log(error);
    }
  },
  handleBadResponse: function() {

  },
  hashPassword: function() {
    return CryptoJS.HmacSHA1(this.state.password, this.createSalt()).toString();
  },
  createSalt: function() {
      return CryptoJS.HmacSHA1(this.state.username, "Key").toString();
  },
  gotoRegister: function() {
    this.props.navigator.push({ name: 'register'});
  }
});
