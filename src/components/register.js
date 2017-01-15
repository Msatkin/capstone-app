import React from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import { findNodeHandle } from 'react-native'
import TextInputState from 'react-native/lib/TextInputState'
import axios from 'axios';

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      confirm_password: '',
      email: '',
      border_color: ['#328FE6','#328FE6','#328FE6','#328FE6'],
      error: ['','',''],
      textbox_focus: [true, false, false, false],
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableHighlight
            style={styles.back_button}
            underlayColor={'#328FE6'}
            onPress={this.gotoLogin}
            >
            <Text style={styles.back_button_text}>Back to Login</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container_title}>
          <Text style={styles.title}>GeoChat</Text>
        </View>
        <View style={styles.register_container}>
          <Text style={styles.error_message}>{this.state.error[2]}</Text>
          <Text style={styles.error_message}>{this.state.error[1]}</Text>
          <Text style={styles.error_message_final}>{this.state.error[0]}</Text>
          <TextInput
            focus={this.state.textbox_focus[0]}
            style={[styles.input, {borderColor: this.state.border_color[0]}]}
            value={this.state.email}
            onChangeText={(text) => this.setState({email: text})}
            placeholder={'Enter Email'}
            returnKeyLabel={'Next'}
            multiline={false}
            onSubmitEditing={() => this.focusTextInput(this.refs.usernameInput)}
            />
          <TextInput
            ref={'usernameInput'}
            focus={this.state.textbox_focus[1]}
            style={[styles.input, {borderColor: this.state.border_color[1]}]}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter Username'}
            maxLength={18}
            multiline={false}
            returnKeyLabel={'Next'}
            onSubmitEditing={() => this.focusTextInput(this.refs.passwordInput)}
            />

          <TextInput
            ref={'passwordInput'}
            focus={this.state.textbox_focus[2]}
            style={[styles.input, {borderColor: this.state.border_color[2]}]}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            placeholder={'Enter Password'}
            maxLength={18}
            multiline={false}
            returnKeyLabel={'Next'}
            onSubmitEditing={() => this.focusTextInput(this.refs.confirmPasswordInput)}
            />
          <TextInput
            ref={'confirmPasswordInput'}
            focus={this.state.textbox_focus[3]}
            style={[styles.input, {borderColor: this.state.border_color[3]}]}
            value={this.state.confirm_password}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({confirm_password: text})}
            placeholder={'Confirm Password'}
            maxLength={18}
            multiline={false}
            returnKeyLabel={'Done'}
            onSubmitEditing={(event) => this.tryRegister()}
            />

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.tryRegister}
            >
            <Text style={styles.label}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  tryRegister: function() {
    this.state.error = ['', '', ''];
    this.state.border_color = ['#328FE6','#328FE6','#328FE6','#328FE6'];
    console.log('attempting..')
    if (this.verifyInfo()) {
      this.attemptAccountCreation();
    }
  },
  attemptAccountCreation: function() {
    var hash = this.hashPassword();
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Register?username='+ this.state.username +'&password=' + hash + '&email=' + this.state.email
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      switch (response.request._response) {
        case 'success':
        console.log("success");
          this.props.navigator.push({ name: 'account'});
          break;

        case 'email':
          this.displayError('That email is already taken');
          this.state.email = '';
          break;

        case 'username':
          this.displayError('That username is already taken');
          this.state.username = '';
          break;

        case 'fail':
          this.displayError('Registration has failed unexpectedly');
          break;

        default:
          console.log(response);
          break;
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
  gotoLogin: function() {
    this.props.navigator.push({ name: 'login'});
  },
  verifyInfo: function () {
    var isPasswordValid = this.verifyPasswords();
    var isEmailValid = this.verifyEmail();
    var isUsernameValid = this.verifyUsername();

    if (isPasswordValid && isEmailValid && isUsernameValid) {
      return true;
    }
    this.forceUpdate();
    return false;
  },
  verifyPasswords: function() {
    if (this.state.password !== this.state.confirm_password) {
      this.state.border_color[2] = '#ff0000';
      this.state.border_color[3] = '#ff0000';
      this.state.password = '';
      this.state.confirm_password = '';
      this.displayError('Passwords do not match')
    }
    else if (this.state.password.length < 8) {
      this.state.border_color[2] = '#ff0000';
      this.state.border_color[3] = '#ff0000';
      this.state.password = '';
      this.state.confirm_password = '';
      this.displayError('Password must be at least 8 charaters')
    }
    else {
      return true;
    }
    return false;
  },
  verifyEmail: function() {
    if (this.state.email === '') {
      this.state.border_color[0] = '#ff0000';
      this.state.password = '';
      this.state.confirm_password = '';
      this.displayError('Please enter an email')
      return false;
    }
    return true;
  },
  verifyUsername: function() {
    if (this.state.username === '') {
      this.state.border_color[1] = '#ff0000';
      this.state.password = '';
      this.state.confirm_password = '';
      this.displayError('Please enter a username')
      return false;
    }
    return true;
  },
  displayError: function(message) {
    if (this.state.error[0] === '') {
      this.state.error[0] = message;
    }
    else if (this.state.error[1] === '') {
      this.state.error[1] = message;
    }
    else {
      this.state.error[2] = message;
    }
  },
  focusTextInput: function(node) {
    try {
      TextInputState.focusTextInput(findNodeHandle(node))
    } catch(e) {
      console.log("Couldn't focus text input: ", e.message)
    }
  }
});
var styles = StyleSheet.create({
  container_error_messages: {

  },
  error_message: {
    fontWeight: '600',
    color: '#ff0000'
  },
  error_message_final: {
    fontWeight: '600',
    color: '#ff0000',
    marginBottom: 5,
  },
  container_title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    flex: 1,
  },
  back_button: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    backgroundColor: '#32c5e6',
    maxHeight: 50
  },
  back_button_text: {
    width: 130,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  title: {
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
  register_container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: 3,
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
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
