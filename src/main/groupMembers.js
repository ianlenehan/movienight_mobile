import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';
import ENV from '../environment';
import strftime from 'strftime';
import H3 from '../components/common/H3';

class GroupMembers extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.photo} source={require('../img/Ian.png')} />
        <Text>{this.props.member.name_first}</Text>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  photo: {
    width: 45,
    height: 45,
    borderRadius: 45/2,
    paddingHorizontal: 15
  },
});

module.exports = GroupMembers;
