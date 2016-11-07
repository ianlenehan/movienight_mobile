import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  Navigator,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import setStyles from '../../style';

class BackButton extends Component {
  isAdmin() {
    if (this.props.admin) {
      return (
        <TouchableHighlight
        onPress={this.props.edit}
        underlayColor={'transparent'}
        style={styles.right}>
          <Icon name="cog" size={20} color="grey" />
        </TouchableHighlight>
      )
    } else {
      return <View style={styles.right} />
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={'transparent'}
        style={styles.left}>
          <Icon name="chevron-left" size={20} color="#3d9bfe" />
        </TouchableHighlight>
        <View style={styles.title}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
        {this.isAdmin()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: setStyles.secondaryColor,
    height: 30,
    alignItems: 'flex-end'
  },
  title: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 19,
    fontFamily: 'Codystar'
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});

module.exports = BackButton;
