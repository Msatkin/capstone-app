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
            <Text style={styles.toolbarButton}>View</Text>
          </TouchableHighlight>

          <Text style={styles.toolbarTitle}>Account</Text>

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#4d3f76'}
            onPress={this.gotoRightPage}
            >
            <Text style={styles.toolbarButton}>Post</Text>
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

var styles = StyleSheet.create({
  toolbar: {
      backgroundColor:'#6E5BAA',
      paddingTop:10,
      paddingBottom:10,
      flexDirection:'row',
      elevation: 10
  },
  toolbarButton: {
      color:'#fff',
      textAlign:'center'
  },
  toolbarTitle: {
      color:'#fff',
      textAlign:'center',
      fontWeight: '900',
      flex:1
  },
  button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      flex: 1
    },
});
