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
  profileImage() {
    if (this.props.member.image !== null) {
      return <Image style={styles.photo} source={{uri: this.props.member.image}} />
    } else {
      return <Image style={styles.photo} source={require('../img/user.png')} />
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.profileImage()}
        <Text>{this.props.member.name_first}</Text>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    height: 60
  },
  photo: {
    width: 45,
    height: 45,
    borderRadius: 45/2,
    paddingHorizontal: 15
  },
});

module.exports = GroupMembers;
