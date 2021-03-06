import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Navigator
} from 'react-native';
import axios from 'axios';
import Auth from './Auth';

var styles = require('./styles');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      open: false,
      viewed: false
    };
  },
  render: function() {
    if (this.state.open === false) {
      return (
        <View style={styles.message}>
          <TouchableHighlight onPress={this.toggleOpen} underlayColor={'#328FE6'}>
            <View>
              <Text style={styles.username}>{this.props.username + ': '}<Text style={styles.message_date}>{this.props.messageDate}</Text></Text>

              <Text style={styles.message_closed_text}>{'Click to show message'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
    else {
      console.log('here');
      if (!this.state.viewed) {
        this.addView(this.props.messageId);
        console.log('viewed');
        this.state.viewed = true;
      }
      if (this.props.username.toLowerCase() === window.myUsername.toLowerCase()) {
        deleteButton = <TouchableHighlight style={styles.delete_button} underlayColor={'#328FE6'} onPress={this.deleteMessage} ><Text style={styles.delete_button_text}>Delete</Text></TouchableHighlight>
      }
      else {
        deleteButton = null;
      }
      return (
        <View style={styles.message}>
          <TouchableHighlight onPress={this.toggleOpen} underlayColor={'#328FE6'}>
            <View>
              <Text style={styles.username}>{this.props.username + ':'}</Text>
              <Text style={styles.message_open_text}>{this.props.message}</Text>
              <Text style={styles.message_date}>{this.props.messageDate}</Text>
              <Text style={styles.message_date}>{'Expires ' + this.props.messageExpDate}</Text>
              <Text style={styles.message_views}>{'Number of views: ' + this.props.messageViews}</Text>
              {deleteButton}
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  },
  addView: function(messageId) {
    console.log('Viewing message..')
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + window.token + '&messageId=' + this.props.messageId,
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  deleteMessage: function() {
    messageId = this.props.messageId;
    var messageToDelete = null;
    var update = this.props.update;
    axios({
      method: 'delete',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + window.token + '&messageId=' + this.props.messageId,
      dataType: "json"
    })
    .then(function (data) {
      var response = data.request._response.split('"')[1];
      console.log(response);
      if (response === 'Message deleted') {
        for (var i = 0; i < window.messages; i++) {
          if (window.messages[i].Id === messageId) {
            messageToDelete = i;
          }
        }
        try {
          window.messages.splice(i, 1);
        }
        catch (error) {
          console.log(error);
        }
      }
      console.log('forcing update');
      update();
    })
    .catch(function (error) {
      console.log(error);
    });
  },

  toggleOpen: function(){
    this.state.open = !this.state.open;
    console.log('Open: ' + this.state.open);
    this.forceUpdate();
  }
});
