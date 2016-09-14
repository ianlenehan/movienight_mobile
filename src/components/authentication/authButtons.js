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
    this.props.navigator.push({ name: 'login' })
  }

  onSignupPress() {
    this.props.navigator.push({ name: 'register' })
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
