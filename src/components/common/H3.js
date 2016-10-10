import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

class H3 extends Component {
  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{ fontSize: 14, paddingTop: 5, fontWeight: 'bold' }}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

module.exports = H3;
