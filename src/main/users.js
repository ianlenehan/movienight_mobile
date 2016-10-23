import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import ENV from '../environment'

class Users extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {}
    }
  }

  async componentWillMount() {
    try {
      let response = await fetch( ENV.API + 'users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session: {
            email: this.state.email,
            password: this.state.password
          }
        })
      });
    } catch (error) {

    }
  }

  render() {
    return (
      <View style={setStyles.container}>
        <Text>This is the users page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

module.exports = Users;
