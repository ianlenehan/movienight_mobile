import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import setStyles from '../style';

class Group extends Component {
  render() {
    return (
      <View style={setStyles.container}>
        <Text>This is the groups page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

module.exports = Group;
