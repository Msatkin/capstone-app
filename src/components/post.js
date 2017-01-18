import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Picker,
  AsyncStorage
} from 'react-native';
import axios from 'axios';
import store from 'react-native-simple-store';
import MessageLoader from './messageLoader';
import Auth from './Auth';

var styles = require('./styles');

module.exports = React.createClass({
  componentDidMount: function() {
    Auth.checkToken();
  },
  getInitialState: function() {
    return {
      message: '',
      position: '',
      expirationDelay: 3
    };
  },
  render: function() {
    if (window.loadMessages) {
      console.log('Loading messages..');
      MessageLoader.getMessages();
      window.loadMessages = false;
    }
    return (
      <View style={styles.body}>
        <View style={styles.navbar}>
          <View style={styles.toolbar}>
            <TouchableHighlight
              style={styles.button}
              underlayColor={'#4d3f76'}
              onPress={this.gotoLeftPage}
              >
              <Text style={styles.toolbar_button}>Account</Text>
            </TouchableHighlight>

            <Text style={styles.toolbar_title}>Post</Text>

            <TouchableHighlight
              style={styles.button}
              underlayColor={'#4d3f76'}
              onPress={this.gotoRightPage}
              >
              <Text style={styles.toolbar_button}>View</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View>
          <Picker
            style={styles.expiration_delay_picker}
            selectedValue={this.state.expirationDelay}
            onValueChange={(delay) => this.setState({expirationDelay: delay})}>
            <Picker.Item label="Message will expire in 1 day" value="1" />
            <Picker.Item label="Message will expire in 2 days" value="2" />
            <Picker.Item label="Message will expire in 3 days" value="3" />
            <Picker.Item label="Message will expire in 4 days" value="4" />
            <Picker.Item label="Message will expire in 5 days" value="5" />
            <Picker.Item label="Message will expire in 6 days" value="6" />
            <Picker.Item label="Message will expire in 7 days" value="7" />
          </Picker>
        </View>
        <View style={styles.post_input}>
          <View style={styles.message_area}>
            <TextInput
              focus={true}
              style={styles.message_box}
              value={this.state.message}
              onChangeText={(text) => this.setState({message: text})}
              placeholder={'Type your post here..'}
              returnKeyLabel={'Post'}
              maxLength={160}
              multiline={true}
              />
          </View>
        </View>
        <View style={styles.submit_area}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.submit}
            >
            <Text style={styles.submit_button}>Submit</Text>
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
    this.sendMessage();
  },
  sendMessage: function() {
    if (window.position === undefined) {
      return;
    }
    var nav = this.props.navigator;
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token='+ window.token +'&message=' + this.state.message + '&longitude=' + window.position[0] + '&latitude=' + window.position[1] + '&delay=' + this.state.expirationDelay
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      if (response !== 'success') {
        return;
      }
      MessageLoader.getMessages();
      nav.push({ name: 'view'});
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  gotoRightPage: function() {
    this.props.navigator.push({ name: 'view'});
  }
});
