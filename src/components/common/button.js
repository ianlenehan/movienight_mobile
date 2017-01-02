import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import setStyles from '../../style'

class Button extends Component {
  render() {
    return (
      <TouchableHighlight
      style={styles.button}
      underlayColor={setStyles.secondaryColor}
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
    borderRadius: 3,
    padding: 5,
    borderColor: setStyles.primaryColor,
    margin: 5,
    width: 130,
    height: 35,
    backgroundColor: setStyles.primaryColor
  },
  buttonText: {
    fontSize: 14
  }
});

module.exports = Button;
