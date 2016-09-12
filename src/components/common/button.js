import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import setStyles from '../../style.js'

class Button extends Component {
  render() {
    return (
      <TouchableHighlight
      style={styles.button}
      underlayColor={setStyles.primaryColor}
      onPress={this.props.onPress}
      >
        <Text style={styles.buttonText}>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    borderColor: 'black',
    marginTop: 10,
    width: 150,
    backgroundColor: setStyles.secondaryColor
  },
  buttonText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 14
  }
});

module.exports = Button;
