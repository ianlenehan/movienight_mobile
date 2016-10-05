import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';

class GroupDetail extends Component {

  newEvent() {
    this.props.navigator.push({
      name: 'newEvent',
      passProps: {
        group: this.props.group,
        user: this.props.user
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.image, styles.module]}>
          <Text>Image Goes Here</Text>
        </View>
        <View style={[styles.members, styles.module]}>
          <Text>{this.props.user.name_first}, you are a member of this group.</Text>
          <Text>Members</Text>
          <Text>{this.props.groupMembers[0].email}</Text>
        </View>
        <View style={[styles.events, styles.module]}>
        <Text>Events</Text>

        <Button text={'New Event'} onPress={this.newEvent.bind(this)} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  module: setStyles.module,
  image: {
    flex: 3
  },
  members: {
    flex: 3
  },
  events: {
    flex: 3
  }
});

module.exports = GroupDetail;
