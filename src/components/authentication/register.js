import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Platform,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
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

  imagePicker() {
    var options = {
      title: 'Select Profile Image',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

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
            <Button text={'Add Image'} onPress={this.imagePicker.bind(this)} />
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
