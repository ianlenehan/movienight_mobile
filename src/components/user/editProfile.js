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
import Button from '../common/button';
import BackButton from '../common/backButton';
import setStyles from '../../style';
import UploadImage from '../common/uploadImage';
import UserForm from '../user/userForm';

class EditProfile extends Component {
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

  updateUserSummary() {
    this.props.update();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={'Edit Profile'}/>
        </View>

        <View style={styles.body}>

          <View style={styles.logoView}>
            <Text style={styles.logo1}>Movie</Text>
            <Text style={styles.logo2}>night</Text>
          </View>

          <View>
            <UserForm buttonText={'Update'} user={this.props.user} navigator={this.props.navigator} update={this.updateUserSummary.bind(this)}/>
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

module.exports = EditProfile;
