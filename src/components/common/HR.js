import React, { Component } from 'react';
import {
  View
} from 'react-native';
import setStyles from '../../style';

class HR extends Component {
  render() {
    return (
      <View style={{ height: 1, backgroundColor: setStyles.secondaryColor }} />
    );
  }
}

module.exports = HR;
