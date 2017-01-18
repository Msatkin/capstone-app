import React from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import { findNodeHandle } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';
import axios from 'axios';
import store from 'react-native-simple-store';
import Auth from './Auth';

var styles = require('./styles');

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
      <View style={styles.register_body}>
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
          <Text style={styles.register_title}>GeoChat</Text>
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
            style={styles.register_submit_button}
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
    var hash = Auth.hashPassword(this.state.username, this.state.password);
    var display = this.displayError;
    var nav = this.props.navigator;
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Register?username='+ this.state.username +'&password=' + hash + '&email=' + this.state.email
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1].split(':');
      console.log(response);
      switch (response[0]) {
        case 'success':
          Auth.saveToken(response[1]);
          nav.push({ name: 'account'});
          break;

        case 'error':
          display(response[1]);
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
