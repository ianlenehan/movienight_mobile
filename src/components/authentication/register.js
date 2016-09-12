import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import Button from '../common/button';
import setStyles from '../../style';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: []
    }
  }

  async onPressSignin() {
    try {
      let response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
          }
        })
      });

      let res = await response.text();
      console.log("res is: ", res);

    } catch(errors) {

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        onChangeText={(val) => {this.setState({ email: val })}}
        style={styles.input} placeholder="Email"
        autoCorrect={false}
        autoCapitalize={'none'}
        />
        <TextInput
        onChangeText={(val) => {this.setState({ name: val })}}
        style={styles.input} placeholder="Name"
        autoCorrect={false}
        />
        <TextInput
        onChangeText={(val) => {this.setState({ password: val })}}
        style={styles.input} placeholder="Password"
        secureTextEntry={true}
        />
        <TextInput
        onChangeText={(val) => {this.setState({password_confirmation:val})}}
        style={styles.input} placeholder="Password Comfirmation"
        secureTextEntry={true}
        />

        <Button text={'Sign In'} onPress={this.onPressSignin.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: setStyles.backgroundColor,
    justifyContent: 'flex-start'
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  }
})

module.exports = Register;
