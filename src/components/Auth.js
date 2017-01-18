import React from 'react';

import {
    Navigator
} from 'react-native';
import axios from 'axios';
import store from 'react-native-simple-store';

export default class Auth extends React.Component {
  render() {
    return null;
  }

  static checkToken(page) {
    if (window.token === null) {
      return;
    }
    console.log(window.token);
    console.log('Attempting to login with token..');
    axios({
      method: 'get',
      url: 'http://catkinson-001-site1.htempurl.com/api/Login?token=' + window.token,
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1].split(':');
      if (response[0] === 'success') {
        window.myUsername = response[1];
          console.log('User ' + response[1] + ' has been authenticated');
          if (page !== undefined) {
          window.nav.push({ name: page});
          }
      }
      else {
      nav.push({ name: 'login'});
        console.log(response);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  static saveToken(token) {
    try {
      console.log('Saving token: ' + token);
      window.token = token;
      store.save('token', {loginToken: token});
      console.log('Token saved');
    } catch (error) {
      console.log(error);
    }
  }

  static getSavedToken() {
    try {
      store.get('token').then(token => {
        window.token = token.loginToken;
        console.log('Token found: ', window.token);
        this.checkToken();
      });
    } catch (error) {
      console.log(error);
    }
  }

}
