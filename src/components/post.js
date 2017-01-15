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
      token: '',
      message: '',
      position: ''
    };
  },
  render: function() {
    return (
      <View style={styles.body}>
        <View style={styles.navbar}>
          <View style={styles.toolbar}>
            <TouchableHighlight
              style={styles.button}
              underlayColor={'#4d3f76'}
              onPress={this.gotoLeftPage}
              >
              <Text style={styles.toolbarButton}>Account</Text>
            </TouchableHighlight>

            <Text style={styles.toolbarTitle}>Post</Text>

            <TouchableHighlight
              style={styles.button}
              underlayColor={'#4d3f76'}
              onPress={this.gotoRightPage}
              >
              <Text style={styles.toolbarButton}>View</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.input}>
          <View style={styles.messageArea}>
            <TextInput
              focus={true}
              style={styles.messageBox}
              value={this.state.message}
              onChangeText={(text) => this.setState({message: text})}
              placeholder={'Type your post here..'}
              returnKeyLabel={'Post'}
              maxLength={160}
              multiline={true}
              />
          </View>
        </View>
        <View style={styles.submitArea}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.submit}
            >
            <Text style={styles.submitButton}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'account'});
  },
  submit: function() {
    if (this.state.message === '') {
      console.log("No message entered");
      return;
    }
    this.getPosition();
  },
  sendMessage: function() {
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token='+ this.state.token +'&message=' + this.state.message + '&longitude=' + this.state.position[0] + '&latitude=' + this.state.position[1]
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      if (response !== 'success') {
        return;
      }
      this.props.navigator.push({ name: 'view'});
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  getPosition: function() {
    navigator.geolocation.getCurrentPosition(
          (position) => {
            this.state.position = [ position.coords.longitude, position.coords.latitude ];
            console.log(this.state.position);
            this.sendMessage();
          },
          (error) => {
            console.log((JSON.stringify(error)));
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
  },
  testFunction: function() {
    return (
      <View>
        <Text>HAHHAHAHAHAHHAHAHAHAHHA</Text>
      </View>
    )
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'view'});
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
  body: {
    flex: 1,
    flexDirection:'column'
  },
  navbar: {
    flex:1,
    flexDirection:'column',
    alignItems:'flex-start'
  },
  submitArea: {
    backgroundColor: '#328FE6',
    justifyContent: 'flex-end'
  },
  messageBox: {
    flex: 1,
    textAlignVertical: 'bottom'
  },
  submitButton: {
    color:'#fff',
    textAlign:'center',
    padding: 7
  },
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
      fontWeight:'900',
      flex:1
  },
  button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      flex: 1
    },
    input: {
      flex: 10,
      marginTop: 10,
      justifyContent: 'flex-end'
    },
    messageArea: {
      flex: 1,
      justifyContent: 'flex-end'
    }
});
