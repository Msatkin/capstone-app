import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Navigator
} from 'react-native';
import axios from 'axios';

var styles = require('./styles');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      open: false,
      viewed: false,
      token: ''
    };
  },
  render: function() {
    if (this.state.open === false) {
      return (
        <View style={styles.message}>
          <TouchableHighlight onPress={this.toggleOpen}>
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
      if (this.props.username.toLowerCase() === this.props.myUsername.toLowerCase()) {
        deleteButton = <TouchableHighlight style={styles.delete_button} onPress={this.deleteMessage} ><Text style={styles.delete_button_text}>Delete</Text></TouchableHighlight>
      }
      else {
        deleteButton = null;
      }
      return (
        <View style={styles.message}>
          <TouchableHighlight onPress={this.toggleOpen}>
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
    console.log('token', this.props.token);
    axios({
      method: 'post',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + this.props.token + '&messageId=' + this.props.messageId,
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
  deleteMessage: function(messageId) {
    axios({
      method: 'delete',
      url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + this.props.token + '&messageId=' + this.props.messageId,
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

  toggleOpen: function(){
    this.state.open = !this.state.open;
    console.log('Open: ' + this.state.open);
    this.forceUpdate();
  }
});
