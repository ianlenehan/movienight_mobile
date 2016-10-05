import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  DatePickerIOS,
  View
} from 'react-native';
import Button from '../components/common/button';
import BackButton from '../components/common/backButton';
import setStyles from '../style';
import ENV from '../environment';

class NewEvent extends Component {
  constructor() {
    super();
    this.state = {
      location: '',
      date: new Date(),
      errors: []
    }
  }

  async onPressCreate() {
    try {
      let response = await fetch(ENV.API + 'events', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: this.state.location,
          date: this.state.date,
          group_id: this.props.group.id
        })
      });
      let eventDetails = await response.json();
      this.viewEvent(eventDetails);
      console.log("event is: ", eventDetails);

    } catch(errors) {
      console.log("Error: ", errors);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  viewEvent(eventDetails) {
    this.props.navigator.push({
      name: 'eventDetails',
      passProps: {
        eventDetails: eventDetails,
        user: this.props.user
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={'New Event'} onPress={this.back.bind(this)} />
        </View>
        <View style={styles.body}>
          <TextInput
          onChangeText={(val) => {this.setState({ location: val })}}
          style={styles.input} placeholder="Location"
          autoCorrect={false}
          />
          <DatePickerIOS
          style={styles.picker}
            date={this.state.date}
            mode="datetime"
            minuteInterval={5}
            onDateChange={(date) => {this.setState({ date: date })}}
          />
          <View style={styles.buttons}>
            <Button text={'Create'} onPress={this.onPressCreate.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: setStyles.backgroundColor,
    justifyContent: 'flex-start',
    paddingBottom: 15,
    paddingHorizontal: 10
  },
  picker: {
    borderColor: setStyles.primaryColor,
    borderRadius: 5
  },
  body: {
    backgroundColor: setStyles.secondaryColor,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flex: 10
  },
  input: setStyles.input,
  buttons: {
    alignItems: 'center',
    paddingTop: 50
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

module.exports = NewEvent;
