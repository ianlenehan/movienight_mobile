import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  Alert,
  AsyncStorage,
  Navigator
} from 'react-native';
import Button from '../common/button';
import BackButton from '../common/backButton';
import setStyles from '../../style';
import ENV from '../../environment';
import Logo from '../common/logo';

const ACCESS_TOKEN = 'access_token'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      error: '',
      buttonText: 'Log In'
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

  onPressLogin() {
    if (this.state.buttonText === 'Log In') {
      this.setState({ buttonText: 'Connecting...'} );
      this.logUserIn();
    }
  }

  async logUserIn() {
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
        this.props.navigator.immediatelyResetRouteStack([{ name: 'userSummary' }])
      } else {
        let error = res;
        throw error;
      }

    } catch(error) {
      this.removeToken();
      this.setState({error: error});
      Alert.alert("Alert!", error, [
        { text: 'Oops' },
      ]);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={'Log In'}/>
        </View>

        <View style={styles.body}>

          <View style={styles.middle}>
            <TextInput
            onChangeText={(val) => {this.setState({ email: val })}}
            style={styles.input} placeholder="Email"
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            onSubmitEditing={(event) => {
              this.refs.password.focus();
            }}
            />
            <TextInput
            ref='password'
            onChangeText={(val) => {this.setState({ password: val })}}
            style={styles.input} placeholder="Password"
            secureTextEntry={true}
            returnKeyType={'done'}
            />
          <Button text={this.state.buttonText} onPress={this.onPressLogin.bind(this)} />
          </View>

          <Logo />

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
  header: setStyles.header,
  footer: setStyles.container,
  input: setStyles.input,
})

module.exports = Login;
