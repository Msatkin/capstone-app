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
import Auth from './Auth';

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    window.nav = this.props.navigator;
    Auth.getSavedToken();
  },
  getInitialState: function() {
    return {
      username: '',
      password: ''
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
    var nav = this.props.navigator;
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Login?username='+ this.state.username +'&password=' + hash,
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1].split(':');
      console.log(response);
      if (response[0] === 'success') {
        console.log('Login successful');
        Auth.saveToken(response[1]);
        nav.push({ name: 'account'});
      }
      else {
        console.log('Error Unknown');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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
