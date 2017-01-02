import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

class H4 extends Component {
  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{ fontSize: 10, paddingBottom: 5 }}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

module.exports = H4;
