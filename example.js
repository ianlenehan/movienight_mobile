import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  PixelRatio,
  Alert
} from 'react-native';

import { firebaseAuth, rootRef } from './auth/authentication';
import ImagePicker from 'react-native-image-picker';
import CryptoJS from 'crypto-js';

export class myVideos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      videoURL: '',
      avatarSource: '',
      videoSource: ''
    };
  }

  componentDidMount() {
    let self = this;
    if (!firebaseAuth.currentUser) {
      this.signOut();
    } else {
      let videoRef = rootRef.child(`users/${firebaseAuth.currentUser.uid}/`);
      videoRef.once('value')
        .then(
          (snap) => {
            let userObj = snap.val();
            let videoURL = userObj.videoURL;
            if (videoURL) {
              self.setState({
                avatarSource: videoURL
              });
            }
          }
        )
        .catch(
          (e) => {
            console.log('error', e);
          }
        );
    }
  }

  postToCloudinary(source){
    console.log('arrived at cloudinary helper function');
    console.log('image source passed to cloudinary helper function: ',source);

    let timestamp = (Date.now() / 1000 | 0).toString();
    let api_key = 'yourAPIkey'
    let api_secret = 'yourAPIsecret'
    let cloud = 'yourAccountName'
    let hash_string = 'timestamp=' + timestamp + api_secret
    let signature = CryptoJS.SHA1(hash_string).toString();
    let upload_url = 'https://api.cloudinary.com/v1_1/' + cloud + '/image/upload'

    let xhr = new XMLHttpRequest();
    xhr.open('POST', upload_url);
    xhr.onload = () => {
      let returnedUri = JSON.parse(xhr.response);
      let videoURL = returnedUri.secure_url;
      console.log(videoURL);
      let videoRef = rootRef.child(`users/${firebaseAuth.currentUser.uid}/`);
      videoRef.update({
        videoURL: videoURL
      })
        .then(
          () => {
            console.log('saved to db');
          }
        )
        .catch(
          (e) => {
            console.log('error: ', e);
          }
        );
    };
    let formdata = new FormData();
    formdata.append('file', {uri: source.uri, type: 'image/jpeg', name: 'video.jpg'});
    formdata.append('timestamp', timestamp);
    formdata.append('api_key', api_key);
    formdata.append('signature', signature);
    xhr.send(formdata);

  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

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

        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        AsyncStorage.setItem('avatarSource', JSON.stringify(source));
        this.setState({
          avatarSource: source
        });
        console.log('image source: ',source);
        this.postToCloudinary(source);
      }
    });
  }

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Record a 10 second Video',
      storageOptions: {
        skipBackup: true,
        cameraRoll: true
      },
      durationLimit: 10,
      videoQuality: 'high',
      cameraType: 'front',
      mediaType: 'video',
      noData: true
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = response.uri.replace('file://', '');;
        AsyncStorage.setItem('videoSource', JSON.stringify(source));
        this.setState({
          videoSource: source
        });
        this.postToCloudinary(source);
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
      <ScrollView>

      <View style={styles.container}>

      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
        <View style={[styles.avatar, styles.avatarContainer, {marginTop: 150}]}>
        { this.state.avatarSource === '' ? <Text>Snap a Photo</Text> :
          <Image style={styles.avatar} source={this.state.avatarSource} />
        }
        </View>
      </TouchableOpacity>

    </View>

      </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius:12,
    width: 250,
    height: 300,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  headerView: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42bfc2'
  },
  footerView: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42bfc2',
    bottom: 0
  },
  headerText: {
    color: '#fff',
    paddingTop: 15,
    fontSize: 20
  },
  footerText: {
    color: '#fff',
    fontSize: 20
  },
  labelRowView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    marginTop: 25,
    height: 50
  },
  labelRowText: {
    fontSize: 16,
    color: '#EC5097'
  },
  wrapperHeaderText: {
    color: '#939393',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 15
  },
  wrapperFooterText: {
    color: '#939393',
    fontSize: 16,
    marginTop: 25,
    marginBottom: 25,
    alignSelf: 'center'
  },
  wrapperView: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  wrapperRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    height: 65,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  wrapperRowText: {
    fontSize: 16,
    color: '#939393'
  },
  sliderRowView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  arrowText: {
    fontSize: 30,
    color: '#d3d3d3'
  },
  slider: {
    width: 350,
    height: 10,
    margin: 10,
    padding: 10
  }
});
