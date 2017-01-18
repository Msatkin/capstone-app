'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1
  },
  //-------------------------------------------------------------Login
  big_button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6',
    maxHeight: 50
  },
  half_button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#328FE6',
    marginTop: 5,
    backgroundColor: '#32c5e6',
    maxHeight: 30
  },
  half_button_label: {
    width: 125,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extra_buttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: '600',
    color: '#ffffff'
  },
  login_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  input_container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: 3,
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 2,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  //------------------------------------------------------navbar
  toolbar: {
      backgroundColor:'#6E5BAA',
      paddingTop:10,
      paddingBottom:10,
      flexDirection:'row',
      elevation: 10
  },
  toolbar_button: {
      color:'#fff',
      textAlign:'center'
  },
  toolbar_title: {
      color:'#fff',
      textAlign:'center',
      fontWeight: '900',
      flex:1
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1
  },
  //---------------------------------------------------View screen
  loading_messages: {
    fontSize: 20,
    alignSelf: 'center'
  },
  viewBox: {
    flex: 1,
  },
  //---------------------------------------------------Post Screen
  body: {
    flex: 1,
    flexDirection:'column'
  },
  navbar: {
    flex:1,
    flexDirection:'column',
    alignItems:'flex-start'
  },
  submit_area: {
    backgroundColor: '#328FE6',
    justifyContent: 'flex-end'
  },
  message_box: {
    flex: 1,
    textAlignVertical: 'bottom'
  },
  submit_button: {
    color:'#fff',
    textAlign:'center',
    padding: 7
  },
  post_input: {
    flex: 10,
    marginTop: 10,
    justifyContent: 'flex-end'
  },
  message_area: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  //------------------------------------------------------Register screen
  container_error_messages: {

  },
  error_message: {
    fontWeight: '600',
    color: '#ff0000'
  },
  error_message_final: {
    fontWeight: '600',
    color: '#ff0000',
    marginBottom: 5,
  },
  back_button: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    backgroundColor: '#32c5e6',
    maxHeight: 50
  },
  back_button_text: {
    width: 130,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  register_title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: '600',
    color: '#ffffff'
  },
  container_title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    flex: 1,
  },
  register_body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  register_container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  register_input: {
    margin: 3,
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderWidth: 2,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  register_submit_button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6',
    maxHeight: 50
  },
  message: {
    backgroundColor: '#32c5e6',
    margin: 7,
    padding: 7,
    borderRadius: 5,
  },
  username: {
    fontWeight: '600',
  },
  message_text: {

  },
  message_date: {
    fontWeight: '400'
  },
  message_closed_text: {
    alignSelf: 'center',
    margin: 7,
  },
  expiration_delay_picker: {
    marginTop: 10
  },
  delete_button: {
    alignItems: 'center',
    margin: 3
  },
  delete_button_text: {
    backgroundColor: '#6E5BAA',
    padding: 10,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
  }
});
