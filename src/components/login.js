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
      username: '',
      password: '',
      loginResponse: '',
      token: ''
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.name}>GeoChat</Text>
        </View>
        <View style={styles.loginContainer}>
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
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.tryLogin}
            >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.extra_buttons}>
          <TouchableHighlight
            style={styles.small_button}
            underlayColor={'#328FE6'}
            onPress={this.onPress}
            >
            <Text style={styles.small_button_label}>Forgot Password</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.small_button}
            underlayColor={'#328FE6'}
            onPress={this.gotoRegister}
            >
            <Text style={styles.small_button_label}>Register</Text>
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
      response = response.split(':');
      console.log(response);
      console.log('state: ', this.state);
      this.state.loginResponse = response;
      switch(response[0]) {
        case 'success':
          console.log('SUCCESS');
          this.state.token = response[1];
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
  saveToken: function() {
    try {
      console.log(this.state.token);
      store.save('token', {loginToken: this.state.token});
      //DB.loginToken.add(this.state.token, 'token')
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

var styles = StyleSheet.create({
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extra_buttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: '600',
    color: '#ffffff'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  loginContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: 3,
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 2,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6',
    maxHeight: 50
  },
  small_button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#328FE6',
    marginTop: 5,
    backgroundColor: '#32c5e6',
    maxHeight: 30
  },
  small_button_label: {
    width: 125,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  }
});
