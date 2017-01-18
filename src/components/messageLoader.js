import React from 'react';
import axios from 'axios';
import Auth from './Auth';

export default class MessageLoader extends React.Component {

  render() {
    return null;
  }

  static parseMessage(data) {
    data = data.replace('[{', '');
    data = data.replace('}]', '');
    data = data.replace(/"/gi, '')
    var messages = data.split('},{');
    console.log('Number of messages found: ' + messages.length);
    for (var i = 0; i < messages.length; i++) {
      var messageInfo = messages[i].split(',');
      messages[i] = {
        Id: messageInfo[0].replace('Id:', ''),
        UserId: messageInfo[1].replace('UserId:', ''),
        Username: messageInfo[3].replace('Username:', ''),
        Message: messageInfo[4].replace('Text:', ''),
        MessageDate: messageInfo[5].replace('Date:', ''),
        MessageExpDate: messageInfo[6].replace('ExpirationDate:', ''),
        Views: messageInfo[9].replace('Views:', '')
      }
    }
    return messages;
  }

  static getMessages() {
    console.log('Requesting messages..');
    var parseResponse = this.parseMessage;
    if (window.position !== undefined) {
      axios({
        method: 'get',
        url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + window.token + '&longitude=' + window.position[0] + '&latitude=' + window.position[1],
        dataType: "json"
      })
      .then(function (data) {
        if (data.request._response === null) {
          window.messages = '';
          return;
        }
        window.messages = parseResponse(data.request._response);
        console.log('Messages: ' , window.messages);
        this.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
