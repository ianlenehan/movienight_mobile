import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';
import H1 from '../components/common/H1';
import BackButton from '../components/common/backButton';
import GroupDetail from './groupDetail';
import ENV from '../environment';

class Group extends Component {
  constructor(props) {
    super(props)
    this.state = {
      groupMembers: {},
      user: '',
      isAMember: false,
      joinResponse: ''
    }
  }

  componentWillMount() {
    this.setState({ user: this.props.user })
    this.getGroupMembers();
  }

  async getGroupMembers() {
    try {
      let groupID = this.props.group.id
      let response = await fetch(ENV.API + 'groups/' + groupID + '/members', {
        method: 'GET',
      });
      let members = await response.json();
      this.setState({ groupMembers: members });
    } catch(error) {
      console.log("There was an error fetching users: ", error);
    }
  }

  checkIsAMember() {
    for (var i = 0; i < this.state.groupMembers.length; i++) {
      if (this.state.groupMembers[i].email === this.state.user.email) {
        return <GroupDetail
          user={this.state.user}
          groupMembers={this.state.groupMembers}
          group={this.props.group}
          navigator={this.props.navigator}
        />
      }
    }
    return this.isNotAMember();
  }

  isNotAMember() {
    return (
      <View style={styles.body}>
        <Button text={'Request to Join'} onPress={this.joinRequest.bind(this)} />
        <Text>{this.state.joinResponse}</Text>
      </View>
    );
  }

  async joinRequest() {
    try {
      let response = await fetch('http://localhost:3000/api/v1/groups/join', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.user,
          group: this.props.group
        })
      });

      let res = await response.text();
      this.setState({ joinResponse: res })
      console.log(res);
    } catch(error) {
      console.log("Oops: ", error);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={setStyles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={this.props.group.group_name}/>
        </View>
        <View style={styles.body}>
          {this.checkIsAMember()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 15
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 10,
    marginTop: 5,
    marginBottom: 5
  }
});

module.exports = Group;
