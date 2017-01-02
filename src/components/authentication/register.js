import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  Platform,
  AsyncStorage,
  View
} from 'react-native';
import Button from '../common/button';
import BackButton from '../common/backButton';
import H1 from '../common/H1';
import setStyles from '../../style';
import UploadImage from '../common/uploadImage';
import UserForm from '../user/userForm';
import Logo from '../common/logo';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: [],
      avatarSource: ''
    }
  }

  handleCloudinaryUrl(data) {
    console.log("handling cloud url: ", data);
  }

  back() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={'New Account'}/>
        </View>

        <View style={styles.body}>

          <Logo size={'small'}/>

          <View style={{flex: 8}}>
            <UserForm navigator={this.props.navigator} buttonText={'Sign Up'} />
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  header: setStyles.header,
  body: {
    flex: 10,
    marginTop: 25,
    margin: 10,
    padding: 5,
    backgroundColor: setStyles.secondaryColor
  },
  input: setStyles.input,
  logo1: setStyles.logo1,
  logo2: setStyles.logo2,
  logoView: setStyles.logoView
})

module.exports = Register;
