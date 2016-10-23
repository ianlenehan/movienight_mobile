import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Platform,
  AsyncStorage,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Button from '../common/button';
import BackButton from '../common/backButton';
import H1 from '../common/H1';
import setStyles from '../../style';
import UploadImage from '../common/uploadImage';
import ENV from '../../environment';
import * as CryptoJS from 'crypto-js';

class UserForm extends Component {
  constructor() {
    super();
    this.state = {
      nameFirst: '',
      nameLast: '',
      email: '',
      password: '',
      password_confirmation: '',
      image: '',
      errors: [],
      avatarSource: '',
      mode: '',
      cloudinaryStatus: null
    }
  }

  componentWillMount() {
    if (this.props.user) {
      const { name_first, name_last, email, image } = this.props.user;
      this.setState({
        nameFirst: name_first,
        nameLast: name_last,
        email: email,
        image: image,
        cloudinaryStatus: null
      })
    }
    if (this.props.mode) {
      this.setState({ mode: this.props.mode })
    }
  }

  handleCloudinaryUrl(data) {
    console.log("handling data: ", data);
    this.setState({ image: data })
  }

  renderButton() {
    if (this.state.cloudinaryStatus) {
      return (
        <Button text={'Please Wait...'} />
      )
    } else {
      return (
        <Button text={this.props.buttonText} onPress={this.onPressButton.bind(this)} />
      )
    }
  }

  uploading() {
    if (this.state.cloudinaryStatus === null) {
      this.setState({ cloudinaryStatus: 'uploading' })
    } else {
      this.setState({ cloudinaryStatus: null })
    }
  }

  async onPressButton() {
    try {
      let response = await fetch(ENV.API + 'users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name_first: this.state.nameFirst,
            name_last: this.state.nameLast,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
            image: this.state.image,
            mode: this.props.buttonText
          }
        })
      });

      let res = await response.text();
      console.log("res is: ", res);
      this.back();
    } catch(errors) {
      console.log("Error: ", errors);
    }
  }

  back() {
    if (this.props.update) {
      this.props.update();
    }
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        onChangeText={(val) => {this.setState({ nameFirst: val })}}
        value={this.state.nameFirst}
        style={styles.input} placeholder="First Name"
        autoCorrect={false}
        />
        <TextInput
        onChangeText={(val) => {this.setState({ nameLast: val })}}
        value={this.state.nameLast}
        style={styles.input} placeholder="Last Name"
        autoCorrect={false}
        />
        <TextInput
        onChangeText={(val) => {this.setState({ email: val })}}
        value={this.state.email}
        style={styles.input} placeholder="Email"
        autoCorrect={false}
        autoCapitalize={'none'}
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

        <UploadImage uploading={this.uploading.bind(this)} handleUrl={this.handleCloudinaryUrl.bind(this)} />

        <View style={{alignItems: 'center'}}>
          {this.renderButton()}
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

module.exports = UserForm;
