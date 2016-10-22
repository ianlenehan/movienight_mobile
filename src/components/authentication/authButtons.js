import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Button from '../common/button';
import setStyles from '../../style';

const ACCESS_TOKEN = 'access_token';

class authButtons extends Component {
  render() {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.body}>
        <View style={[styles.header, styles.center]}>
          <Text style={styles.logo1}>Movie</Text>
          <Text style={styles.logo2}>night</Text>
        </View>
        <Button text={'Sign In'} onPress={this.onSigninPress.bind(this)} />
        <Button text={'Register'} onPress={this.onSignupPress.bind(this)} />
        <View style={[styles.footer, styles.center]}>
          <Text>Please sign in or create an account.</Text>
        </View>
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
  },
  container: setStyles.container,
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: setStyles.secondaryColor
  },
  footer: {
    flex: 1
  },
  logo1: {
    fontSize: 42,
    fontFamily: 'Anton'
  },
  logo2: {
    fontSize: 38,
    fontFamily: 'Pacifico'
  }
})

module.exports = authButtons;
