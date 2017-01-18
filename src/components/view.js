import React from 'react';
import {
  View,
  ScrollView,
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
      this.getUsername();
    });
  },
  getInitialState: function() {
    return {
      token: '',
      builtMessages: [],
      buildMessages: false,
      myUsername: '',
    };
  },
  render: function() {

    console.log('rendering');



    if (window.loadMessages) {
      console.log('Loading messages..');
      MessageLoader.getMessages(this.state.token);
      window.loadMessages = false;
      this.state.buildMessages = true;
    }
    if (this.state.builtMessages.length !== window.messages.length) {
      this.state.builtMessages = this.buildMessageDisplay();
      console.log('Messages built: ' + this.state.builtMessages.length);
    }
    else if (this.state.builtMessages.length < 1){
      this.state.builtMessages.push(<Text key={1} style={styles.loading_messages}>{'Loading'}</Text>);
    }
    var _scrollView: ScrollView;
    return (
      <View>
        <View style={styles.toolbar}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#4d3f76'}
            onPress={this.gotoLeftPage}
            >
            <Text style={styles.toolbar_button}>Post</Text>
          </TouchableHighlight>

          <Text style={styles.toolbar_title}>View</Text>

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#4d3f76'}
            onPress={this.gotoRightPage}
            >
            <Text style={styles.toolbar_button}>Account</Text>
          </TouchableHighlight>
        </View>
        <ScrollView
          style={styles.viewBox}
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          onScroll={() => { console.log('onScroll!'); }}
          scrollEventThrottle={200}>
            {this.state.builtMessages}
        </ScrollView>
      </View>
    );
  },
  buildMessageDisplay: function() {
    console.log('Building ' + window.messages.length + ' messages..');
    var messageList = window.messages;
    var displayMessageList = [];
    for (i = 0; i < messageList.length; i++) {
      var username = messageList[i].Username;
      var message = messageList[i].Message;
      var messageDate = messageList[i].MessageDate;
      var messageExpDate = messageList[i].MessageExpDate;
      var messageId = messageList[i].Id;
      var views = messageList[i].Views;
      console.log(this.state.token);
      displayMessageList.push(<Message open={false} parent={this} myUsername={this.state.myUsername} messageViews={views} username={username} message={message} messageDate={messageDate} messageExpDate={messageExpDate} messageId={messageId} token={this.state.token} key={i} />);
    }
    return displayMessageList;
  },
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'post'});
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'account'});
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
      console.log('Token check: ' + response);
      if (response !== 'success') {
          nav.push({ name: 'login'});
          return;
      }
    })
    .catch(function (error) {
      console.log('Error: ' + error);
    });
  },
  getUsername: function() {
    if (this.state.token === null) {
      return;
    }
    var nav = this.props.navigator;
    var setUsername = this.setUsername;
    console.log('Obtaining username..');
    axios({
      method: 'get',
      url: 'http://catkinson-001-site1.htempurl.com/api/Login?token=' + this.state.token + '&username= ',
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      response = response.split(":");
      console.log(response);
      if (response[0] !== 'success') {
          nav.push({ name: 'login'});
          return;
      }
      setUsername(response[1]);
    })
    .catch(function (error) {
      console.log('Error: ' + error);
    });
  },
  setUsername: function(username) {
    console.log('Saving username..');
    this.state.myUsername = username;
  }
});
