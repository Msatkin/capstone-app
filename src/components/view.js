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
import Auth from './Auth';

var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    Auth.checkToken();
  },
  getInitialState: function() {
    return {
      builtMessages: [],
      buildMessages: false,
      myUsername: '',
    };
  },
  render: function() {
    if (window.loadMessages) {
      console.log('Loading messages..');
      MessageLoader.getMessages();
      window.loadMessages = false;
      this.state.buildMessages = true;
    }
    if (this.state.builtMessages.length !== window.messages.length) {
      this.state.builtMessages = this.buildMessageDisplay();
      console.log('Messages built: ' + this.state.builtMessages.length);
      return (this.render());
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
      displayMessageList.push(<Message open={false} parent={this} messageViews={views} username={username} message={message} messageDate={messageDate} messageExpDate={messageExpDate} messageId={messageId} key={i} />);
    }
    return displayMessageList;
  },
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'post'});
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'account'});
  }
});
