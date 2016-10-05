import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import Button from '../components/common/button';
import BackButton from '../components/common/backButton';
import H1 from '../components/common/H1';
import setStyles from '../style';
import strftime from 'strftime';

class EventDetails extends Component {
  back() {
    this.props.navigator.pop();
  }

  onPressAddMovie() {
    this.props.navigator.push({ name: 'searchMovie' });
  }

  render() {
    const { location, date } = this.props.eventDetails;
    let formattedDate = new Date(Date.parse(date));

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={'Event Details'}/>
        </View>
        <View style={styles.body}>
          <View style={{alignItems: 'center'}}>
            <H1 text={location} />
            <Text>{strftime('%a %b %d at %H:%M %p', formattedDate)}</Text>
          </View>
          <Button text={'Add Movie'} onPress={this.onPressAddMovie.bind(this)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 15
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 10,
    margin: 10,
    padding: 10,
    backgroundColor: setStyles.secondaryColor,
    borderRadius: 5
  }
});

module.exports = EventDetails;
