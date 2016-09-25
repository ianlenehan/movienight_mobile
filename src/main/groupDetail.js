import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import setStyles from '../style';

class GroupDetail extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You are a member of this group.</Text>
        <Text>{this.props.user.name_first}</Text>
        <Text>Members</Text>
        <Text>{this.props.groupMembers[0].email}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: setStyles.container
});

module.exports = GroupDetail;
