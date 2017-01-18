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
      update: 0
    };
  },
  render: function() {
    console.log('test');
    this.state = this.state;
    var reload = this.update;
    if (window.loadMessages) {
      window.loadMessages = false;
      console.log('Loading messages..');
      MessageLoader.getMessages(reload);
    }
    if (window.messages.length < 1) {
      this.state.builtMessages = (<Text key={999} style={styles.loading_messages}>{'Loading'}</Text>);
    }
    else {
      this.state.builtMessages = [];
      this.state.builtMessages = window.messages;
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
  gotoLeftPage: function() {
    this.props.navigator.push({ name: 'post'});
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'account'});
  },
  update: function() {
    this.state.update++
  }
});
