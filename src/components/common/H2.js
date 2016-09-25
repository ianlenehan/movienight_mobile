import React, { Component } from 'react';
import {
  Text
} from 'react-native';

class H2 extends Component {
  render() {
    return (
      <Text
        style={{ fontSize: 18, paddingVertical: 10 }}>
        {this.props.text}
      </Text>
    );
  }
}

module.exports = H2;
