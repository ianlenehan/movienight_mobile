import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import ENV from '../environment';
import Logo from '../components/common/logo';

const ACCESS_TOKEN = 'access_token';

class LoadingPage extends Component {
  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN)
      if(!accessToken) {
        console.log("Token not set");
        this.props.navigator.push({ name: 'buttons' })
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
      let url = ENV.API + 'verify?session&access_token%5D='
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
      this.props.navigator.immediatelyResetRouteStack([{ name: 'login' }])
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Logo />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container : setStyles.container,
  body: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 5
  },
  logo1: {
    fontSize: 42,
    fontFamily: 'Anton'
  },
  logo2: {
    fontSize: 38,
    fontFamily: 'Pacifico'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
  },
});

module.exports = LoadingPage;
