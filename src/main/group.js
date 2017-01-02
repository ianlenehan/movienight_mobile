import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
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
      user: {},
      isAMember: false,
      isAdmin: false,
      requests: null
    }
  }

  componentWillMount() {
    this.setState({ user: this.props.user })
    this.getGroupMembers();
    this.checkIsAdmin();
  }

  async approveRequest(request) {
    console.log("approving...");
    try {
      let response = await fetch( ENV.API + 'groups/add_user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: { id: request.user_id },
          request: { id: request.request },
          group: { id: this.props.group.id }
        })
      });

      let res = await response.text();
      Alert.alert(
        "Success!",
        res,
        [ { text: 'OK' } ]
      )
    this.getGroupMembers();
    } catch(error) {
      console.log("Oops: ", error);
    }
  }

  async denyRequest(request) {
    console.log("denied", request);
    try {
      let response = await fetch( ENV.API + 'requests/deny/' + request.request, {
        method: 'GET'
      });
      let res = await response.text();
      Alert.alert(
        "Request Denied!",
        res,
        [ { text: 'OK' } ]
      )
    } catch(error) {
      console.log("Oops: ", error);
    }
  }

  checkRequests() {
    let that = this;
    if (this.props.user.id === this.props.group.group_admin && this.state.requests) {
      console.log("there are requests");
      this.state.requests.map((request) => {
        Alert.alert(
          "New Requests",
          request.user + " Wants To Join",
          [
            {text: 'Approve', onPress: () => this.approveRequest(request) },
            {text: 'Deny', onPress: () => this.denyRequest(request) }
          ]
        )
      })
    }
  }

  async getGroupMembers() {
    try {
      let response = await fetch(ENV.API + 'groups/members', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.user,
          group: {
            id: this.props.group.id
          }
        })
      });
      let res = await response.json();
      console.log(res);
      this.setState({ groupMembers: res.members, requests: res.requests });
      this.checkRequests();
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
      <View style={styles.requestBody}>
        <Button text={'Request to Join'} onPress={this.joinRequest.bind(this)} />
      </View>
    );
  }

  checkIsAdmin() {
    if (this.props.user.id === this.props.group.group_admin) {
      this.setState({ isAdmin: true })
    }
  }

  editGroup() {
    this.props.navigator.push({
      name: 'groupForm',
      passProps: {
        group: this.props.group,
        user: this.state.user,
        update: this.props.update.bind(this)
      }
    });
  }

  async joinRequest() {
    try {
      let response = await fetch( ENV.API + 'groups/join', {
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
      Alert.alert(
        "Join Request",
        res,
        [
          { text: 'OK', onPress: this.backTwo.bind(this) },
        ]
      )
      console.log(res);
    } catch(error) {
      console.log("Oops: ", error);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  backTwo() {
    this.props.navigator.popN(2);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)}
            text={this.props.group.group_name}
            admin={this.state.isAdmin}
            edit={this.editGroup.bind(this)}
            />
        </View>
        <View style={styles.body}>
            {this.checkIsAMember()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  header: setStyles.header,
  body: setStyles.bodyOther,
  requestBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    backgroundColor: setStyles.secondaryColor
  }
});

module.exports = Group;
