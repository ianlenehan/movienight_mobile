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
import H1 from '../common/H1';
import setStyles from '../../style';
import UploadImage from '../common/uploadImage';
import ENV from '../../environment';
import * as CryptoJS from 'crypto-js';

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

  // xpostToCloudinary(source) {
  //   cloudinary.config({
  //     cloud_name: ENV.cloudinary.cloud_name,
  //     api_key: ENV.cloudinary.api,
  //     api_secret: ENV.cloudinary.api_secret
  //   });
  //
  //   cloudinary.uploader.upload(source.uri, function(result) {
  //     console.log(result)
  //   });
  // }

  async postToCloudinary(source) {
    let timestamp = (Date.now() / 1000 | 0).toString();
    let api_key = ENV.cloudinary.api;
    let api_secret = ENV.cloudinary.api_secret
    let cloud = ENV.cloudinary.cloud_name;
    let hash_string = 'timestamp=' + timestamp + api_secret
    let signature = CryptoJS.SHA1(hash_string).toString();
    let upload_url = 'https://api.cloudinary.com/v1_1/' + cloud + '/image/upload'

    try {
      let response = await fetch(upload_url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: {
            uri: source.uri,
            type: 'image/jpeg'
          },
          upload_preset: 'bpus4mzg'
        })
      });

      let res = await response.json();
      console.log(res);
    } catch(error) {
      console.log("Error: ", error);
    }
  }

  imagePicker() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source;

        // You can display the image using either:
        //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        this.postToCloudinary(source);

        this.setState({
          avatarSource: source
        });
      }
    });
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
        <View style={styles.body}>
          <View style={{alignItems: 'center'}}>
            <H1 text={'New Account'} />
          </View>

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
          <View style={{alignItems: 'center'}}>
            <UploadImage imagePicker={this.imagePicker.bind(this)} />
            <Button text={'Sign Up'} onPress={this.onPressSignin.bind(this)} />
          </View>
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
  input: setStyles.input
})

module.exports = Register;
