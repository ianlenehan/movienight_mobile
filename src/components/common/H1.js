import React, { Component } from 'react';
import {
  Text
} from 'react-native';

class H1 extends Component {
  render() {
    return (
      <Text
        style={{ fontSize: 20, paddingVertical: 10 }}>
        {this.props.text}
      </Text>
    );
  }
}

module.exports = H1;
