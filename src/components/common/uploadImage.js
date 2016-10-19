import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Alert,
  AsyncStorage,
  Platform,
  AppState,
} from 'react-native';
import Button from './button';
import setStyles from '../../style'

import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import ENV from '../../environment';
import * as CryptoJS from 'crypto-js';

export default class UploadImage extends Component {
  state = {
    types: [],
    status: {},
    avatarSource: ''
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
        source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        //Or:
        // if (Platform.OS === 'android') {
        //   source = {uri: response.uri, isStatic: true};
        // } else {
        //   source = {uri: response.uri.replace('file://', ''), isStatic: true};
        // }
        this.props.uploading();
        this.postToCloudinary(source);

        this.setState({
          avatarSource: source
        });
      }
    });
  }

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
          file: source.uri,
          api_key: api_key,
          timestamp: timestamp,
          signature: signature
        })
      });

      let res = await response.json();
      console.log(res.secure_url);
      this.props.uploading();
      this.props.handleUrl(res.secure_url);
    } catch(error) {
      console.log("Error: ", error);
    }
  }

  componentDidMount() {
    let types = Permissions.getPermissionTypes()
    this.setState({ types })
    this._updatePermissions(types)
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  //update permissions when app comes back from settings
  _handleAppStateChange(appState) {
    if (appState == 'active') {
      this._updatePermissions(this.state.types)
    }
  }

  _updatePermissions(types) {
    Permissions.checkMultiplePermissions(types)
      .then(status => this.setState({ status }))
  }

  _requestPermission(permission) {
    Permissions.requestPermission(permission)
      .then(res => {
        this.setState({
          status: {...this.state.status, [permission]: res}
        })
        if (res != 'authorized') {
          Alert.alert(
            'Whoops!',
            "There was a problem getting your permission. Please enable it from settings.",
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: Permissions.openSettings },
            ]
          )
        } else {
          this.imagePicker()
        }
      }).catch(e => console.warn(e))
  }

  render() {
    return (
      <View>
        <TouchableHighlight style={styles.imageButton} onPress={this._requestPermission.bind(this, 'photo')} underlayColor='transparent' >
          <Text style={styles.buttonText}>
            Photo
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  imageButton: {
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    padding: 4,
    borderRadius: 5,
    backgroundColor: setStyles.primaryColor,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18
  }
})
