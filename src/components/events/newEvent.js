import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  DatePickerIOS,
  View
} from 'react-native';
import Button from '../common/button';
import BackButton from '../common/backButton';
import setStyles from '../../style';
import ENV from '../../environment';

class NewEvent extends Component {
  constructor() {
    super();
    this.state = {
      location: '',
      date: new Date(),
      errors: []
    }
  }

  componentWillMount() {
    if (this.props.event) {
      this.setState({
        location: this.props.event.location,
        date: new Date(this.props.event.date)
      })
    }
  }

  async onPressCreate() {
    let eventID;
    if (this.props.event) {
      eventID = this.props.event.id
    } else {
      eventID = 0
    }
    try {
      let response = await fetch(ENV.API + 'events', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: {
            location: this.state.location,
            date: this.state.date,
            group_id: this.props.group.id,
            id: eventID
          },
          user: {
            access_token: this.props.user.access_token,
            id: this.props.user.id
          }
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
    if (this.props.header === 'New Event') {
      this.props.navigator.push({
        name: 'eventDetails',
        passProps: {
          eventDetails: eventDetails,
          user: this.props.user,
          group: this.props.group,
          header: this.props.header
        }
      });
    } else {
      this.props.render()
      this.back()
    }
  }

  buttonText() {
    if (this.props.header === 'New Event') {
      return 'Create Event'
    } else {
      return 'Update Event'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={this.props.header} onPress={this.back.bind(this)} />
        </View>
        <View style={styles.body}>
          <TextInput
          onChangeText={(val) => {this.setState({ location: val })}}
          value={this.state.location}
          style={styles.input} placeholder="Location"
          autoCorrect={false}
          />
          <DatePickerIOS
          style={styles.picker}
            date={this.state.date}
            mode="datetime"
            minuteInterval={5}
            value={this.state.date}
            onDateChange={(date) => {this.setState({ date: date })}}
          />
          <View style={styles.buttons}>
            <Button text={this.buttonText()} onPress={this.onPressCreate.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  picker: {
    borderColor: setStyles.primaryColor,
    borderRadius: 5
  },
  body: setStyles.body,
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
