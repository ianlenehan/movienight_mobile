import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class Logo extends Component {
  whichSize() {
    if (this.props.size === 'small') {
      return (
        <View style={styles.logoView}>
          <Text style={styles.logo1small}>Movie</Text>
          <Text style={styles.logo2small}>night</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.logoView}>
          <Text style={styles.logo1}>Movie</Text>
          <Text style={styles.logo2}>night</Text>
        </View>
      )
    }
  }
  render() {
    return (
      this.whichSize()
    )
  }
}

module.exports = Logo;

const styles = StyleSheet.create({
  logo1: {
    fontSize: 42,
    fontFamily: 'Anton'
  },
  logo2: {
    fontSize: 38,
    fontFamily: 'Pacifico'
  },
  logo1small: {
    fontSize: 28,
    fontFamily: 'Anton'
  },
  logo2small: {
    fontSize: 24,
    fontFamily: 'Pacifico'
  },
  logoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
