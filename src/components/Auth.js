import React from 'react';

import {
    Navigator
} from 'react-native';
import axios from 'axios';
import store from 'react-native-simple-store';

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

export default class Auth extends React.Component {
  render() {
    return null;
  }

  static checkToken(page) {
    if (window.token === null) {
      return;
    }
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
            console.log('Loading ' + page + 'page');
            window.nav.push({ name: page});
          }
      }
      else {
        //window.token = null;
        if (page === undefined) {
          //nav.push({ name: 'login'});
        }
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

  static getSavedToken(page) {
    console.log('Getting saved token..');
    try {
      store.get('token').then(token => {
        if (token !== null) {
          window.token = token.loginToken;
          console.log('Token found: ', window.token);
          this.checkToken(page);
        }
        else {
          console.log('No saved token found');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  static deleteSavedToken() {
    store.delete('token');
    window.token = '';
  }

  static hashPassword(username, password) {
    return CryptoJS.HmacSHA1(password, this.createSalt(username)).toString();
  }

  static createSalt(username) {
      return CryptoJS.HmacSHA1(username.toLowerCase(), "Key").toString();
  }
}
