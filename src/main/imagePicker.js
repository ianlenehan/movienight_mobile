import React, { Component } from 'react';
import {
  ImagePickerIOS
} from 'react-native';

class ImagePicker extends Component {
  render() {
    ImagePickerIOS.openSelectDialog({},(assetUri)=>{
      var photo = {
        uri: assetUri,
        type: 'image/jpeg',
        name: 'main.jpg'
      }

      var body = new FormData();
      body.append('file', photo);

      fetch(presignedUrl, {
        method: 'put', body: body
      });
    },()=>{ console.log('failed'); })
  }
}

module.exports = ImagePicker;
