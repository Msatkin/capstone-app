import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Navigator
} from 'react-native';
import axios from 'axios';

export default class MessageLoader extends React.Component {

  render() {
    return null;
  }

  static parseMessage(data) {
    data = data.replace('[{', '');
    data = data.replace('}]', '');
    data = data.replace(/"/gi, '')
    var messages = data.split('},{');
    console.log(messages);
    for (var i = 0; i < messages.length; i++) {
      var messageInfo = messages[i].split(',');
      messages[i] = {
        Id: messageInfo[0].replace('Id:', ''),
        Username: messageInfo[1].replace('UserId:', ''),
        Message: messageInfo[3].replace('Username:', ''),
        Message: messageInfo[4].replace('Text:', ''),
        MessageDate: messageInfo[5].replace('Date:', '')
      }
      console.log(messages[i]);
      return messages;
    }
  }

  static getMessages(token) {
    console.log('Requesting messages..');
    var parseResponse = this.parseMessage;
    if (window.position !== undefined) {
      axios({
        method: 'get',
        url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + token + '&longitude=' + window.position[0] + '&latitude=' + window.position[1],
        dataType: "json"
      })
      .then(function (data) {
        window.messages = parseResponse(data.request._response);
        console.log('Messages: ' , window.messages);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
