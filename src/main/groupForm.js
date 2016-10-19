import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import Button from '../components/common/button';
import BackButton from '../components/common/backButton';
import H1 from '../components/common/H1';
import setStyles from '../style';
import UploadImage from '../components/common/uploadImage';

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groupID: '',
      groupImage: '',
      cloudinaryStatus: null
    }
  }

  componentWillMount() {
    if (this.props.group) {
      this.setState({
        groupName: this.props.group.group_name,
        groupID: this.props.group.id,
        groupImage: this.props.group.group_image
      })
    }
  }

  renderButton() {
    if (this.state.cloudinaryStatus) {
      return (
        <Button text={'Please Wait...'} />
      )
    } else {
      return (
        <Button text={'Submit'} onPress={this.sendGroupDetails.bind(this)} />
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

  async sendGroupDetails() {
    try {
      let response = await fetch('http://localhost:3000/api/v1/groups', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.groupName,
          id: this.state.groupID,
          image: this.state.groupImage,
          user_id: this.props.user.id
        })
      });
      let group = await response.json();
      this.visitGroup(group);
    } catch(error) {
      console.log("Hmm...", error);
    }
  }

  visitGroup(group) {
    this.props.navigator.push({
      name: 'group',
      passProps: {
        group: group,
        user: this.props.user
      }
    });
  }

  back() {
    this.props.navigator.pop();
  }

  handleCloudinaryUrl(data) {
    console.log("cloudinray data: ", data);
    this.setState({ groupImage: data })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={'Create MovieNight Group'} onPress={this.back.bind(this)}/>
        </View>
        <View style={styles.body}>
          <View style={styles.middle}>
            <TextInput
            onChangeText={(val) => {this.setState({ groupName: val })}}
            value={this.state.groupName}
            style={styles.input} placeholder="Group Name"
            autoCorrect={false}
            autoCapitalize={'none'}
            />
            <UploadImage uploading={this.uploading.bind(this)} handleUrl={this.handleCloudinaryUrl.bind(this)} />
            {this.renderButton()}
          </View>

          <View style={styles.footer}></View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  body: setStyles.body,
  middle: {
    flex: 4,
    padding: 10,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  header: setStyles.container,
  footer: setStyles.container,
  input: {
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: setStyles.secondaryColor,
    borderRadius: 5,
    backgroundColor: 'white'
  }
});

module.exports = GroupForm;
