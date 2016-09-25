import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import Button from '../components/common/button';
import H1 from '../components/common/H1';
import setStyles from '../style';


class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: ''
    }
  }

  async createGroup() {
    let groupName = this.state.groupName;
    let userID = this.props.user.id;
    try {
      let response = await fetch('http://localhost:3000/api/v1/groups', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupName,
          id: userID
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


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <H1 text={'Create a new Movie Night Group'} />
        </View>

        <View style={styles.middle}>
          <TextInput
          onChangeText={(val) => {this.setState({ groupName: val })}}
          style={styles.input} placeholder="Group Name"
          autoCorrect={false}
          autoCapitalize={'none'}
          />
          <Button text={'Submit'} onPress={this.createGroup.bind(this)} />
        </View>

        <View style={styles.footer}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  middle: {
    flex: 4,
    backgroundColor: setStyles.backgroundColor,
    justifyContent: 'flex-start',
    padding: 10,
    alignItems: 'center',
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

module.exports = CreateGroup;
