import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Button from '../common/button';

const ACCESS_TOKEN = 'access_token';

class authButtons extends Component {
  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN)
      if(!accessToken) {
        console.log("Token not set");
      } else {
        console.log("access token:" + accessToken);
        this.verifyToken(accessToken)
      }
    } catch(error) {
      console.log("Something went wrong");
    }
  }

  async verifyToken(accessToken) {
    try {
      let url = 'http://localhost:3000/api/v1/verify?session&access_token%5D='
      let response = await fetch(url + accessToken)
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        this.props.navigator.immediatelyResetRouteStack([{ name: 'userSummary' }])
      } else {
        let error = res;
        throw error;
      }
    } catch(error) {
      console.log("error response: " + error);
    }
  }


  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={[styles.header, styles.center]}>
          <Text style={styles.logo}>MovieNight</Text>
        </View>
        <Button text={'Sign In'} onPress={this.onSigninPress.bind(this)} />
        <Button text={'Sign Up'} onPress={this.onSignupPress.bind(this)} />
        <View style={[styles.footer, styles.center]}>
          <Text>Please log in or create an account.</Text>
        </View>
      </View>
    );
  }

  onSigninPress() {
    this.props.navigator.immediatelyResetRouteStack([{ name: 'login' }])
  }

  onSignupPress() {
    this.props.navigator.immediatelyResetRouteStack([{ name: 'register' }])
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1
  },
  header: {
    flex: 1
  },
  body: {
    flex: 5
  },
  footer: {
    flex: 1
  },
  logo: {
    fontSize: 18
  }
})

module.exports = authButtons;
