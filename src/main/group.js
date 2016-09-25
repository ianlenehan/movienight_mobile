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
import GroupDetail from './groupDetail';

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
      let response = await fetch('http://localhost:3000/api/v1/groups/' + groupID + '/members', {
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
        return <GroupDetail user={this.state.user} groupMembers={this.state.groupMembers} />
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



  render() {
    return (
      <View style={setStyles.container}>
        <View style={styles.header}>
          <H1 text={this.props.group.group_name} />
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
    flex: 1
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = Group;
