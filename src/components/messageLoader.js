import React from 'react';
import axios from 'axios';
import Auth from './Auth';
import Message from './message';

export default class MessageLoader extends React.Component {

  render() {
    return null;
  }
/*
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
*/
  static getMessages(update) {
    console.log('Requesting messages..');
    var parseResponse = this.parseMessage;
    var formatDate = this.formatDate;
    if (window.position !== undefined) {
      axios({
        method: 'get',
        url: 'http://catkinson-001-site1.htempurl.com/api/Message?token=' + window.token + '&longitude=' + window.position[0] + '&latitude=' + window.position[1],
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (data) {
        var response = JSON.parse(data.request._response);
        if (response === null) {
          window.messages = '';
          return;
        }
        window.messages = [];
        console.log(response);
        for (var i = 0; i < response.length; i++) {
          response[i].PostedDate = formatDate(response[i].PostedDate);
          response[i].ExpirationDate = formatDate(response[i].ExpirationDate);
          window.messages.push(<Message open={false} update={update} messageViews={response[i].Views} username={response[i].Username} message={response[i].Text} messageDate={response[i].PostedDate} messageExpDate={response[i].ExpirationDate} messageId={response[i].Id} key={i} />)
        }
        update();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  static formatDate(date) {
    console.log(date);
    var parsedDate = date.toString().split('T')[0].split('-');
    var parsedTime = date.toString().split('T')[1].split(':');
    if (parsedTime[0] > 12) {
      parsedTime[0] -= 12;
    }
    return parsedTime[0] + ':' + parsedTime[1] + ' ' + parsedDate[1] + '/' + parsedDate[2] + '/' + parsedDate[0];
  }
}
