import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  AsyncStorage,
  Navigator
} from 'react-native';
import Button from '../common/button';
import setStyles from '../../style';
import ENV from '../../environment';

const ACCESS_TOKEN = 'access_token'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      error: ''
    }
  }

  async storeToken(accessToken) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (error) {
      console.log("something went wrong");
    }
  }

  async getToken() {
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log("token is: " + token);
    } catch (error) {
      console.log("something went wrong");
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      this.getToken()
    } catch (error) {
      console.log("something went wrong");
    }
  }

  async onPressLogin() {
    try {
      let response = await fetch(ENV.API + 'login', {
        method: 'POST',
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

      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        // Handle success
        this.setState({error: ''});
        let accessToken = res;
        this.storeToken(accessToken)
        console.log(("res token:" + accessToken));
      } else {
        let error = res;
        throw error;
      }

    } catch(error) {
      this.removeToken();
      this.setState({error: error});
      console.log("Error: ", error);
    }
    this.props.navigator.immediatelyResetRouteStack([{ name: 'userSummary' }])
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.logo1}>Movie</Text>
            <Text style={styles.logo2}>night</Text>
          </View>

          <View style={styles.middle}>
            <TextInput
            onChangeText={(val) => {this.setState({ email: val })}}
            style={styles.input} placeholder="Email"
            autoCorrect={false}
            autoCapitalize={'none'}
            />
            <TextInput
            onChangeText={(val) => {this.setState({ password: val })}}
            style={styles.input} placeholder="Password"
            secureTextEntry={true}
            />
            <Button text={'Log In'} onPress={this.onPressLogin.bind(this)} />
          </View>

          <View style={styles.footer}></View>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  body: {
    flex: 10,
    marginTop: 25,
    margin: 10,
    padding: 5,
    backgroundColor: setStyles.secondaryColor
  },
  middle: {
    flex: 4,
    justifyContent: 'flex-start',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  module: setStyles.module,
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: setStyles.container,
  input: setStyles.input,
  logo1: {
    fontSize: 42,
    fontFamily: 'Anton'
  },
  logo2: {
    fontSize: 38,
    fontFamily: 'Pacifico'
  }
})

module.exports = Login;
