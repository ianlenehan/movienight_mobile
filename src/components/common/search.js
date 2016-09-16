import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet
} from 'react-native';

class Search extends Component {
  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

module.exports = Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },
  input: {
    height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  }
});
