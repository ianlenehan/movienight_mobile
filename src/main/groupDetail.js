import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';
import ENV from '../environment';
import strftime from 'strftime';
import H3 from '../components/common/H3';
import GroupMembers from './groupMembers';
import DeviceInfo from 'react-native-device-info';

class GroupDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }
  }

  componentWillMount() {
    this.fetchEvents();
  }

  newEvent() {
    this.props.navigator.push({
      name: 'newEvent',
      passProps: {
        group: this.props.group,
        user: this.props.user,
        header: 'New Event'
      }
    });
  }

  async fetchEvents() {
    try {
      let response = await fetch(ENV.API + 'groups/events', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group: { id: this.props.group.id }
        })
      });
      let events = await response.json();
      this.setState({
        events: events
      })
    } catch(error) {
      console.log("Error: ", error);
    }
  }

  renderEvents() {
    if (this.state.events) {
      this.state.events.splice(5);
      return this.state.events.map((event, index) => {
        let date = new Date(Date.parse(event.date));
        return (
          <TouchableHighlight
            onPress={() => this.selectEvent(event)}
            key={index}
            underlayColor={setStyles.primaryColor}>
            <View style={styles.eventDetails}>
              <Text style={{flex: 3, lineHeight: 20}}>Date {strftime('%a %b %d', date)}</Text>
              <Text style={{flex: 5, lineHeight: 20}}>{event.location}</Text>
            </View>
          </TouchableHighlight>
        );
      })
    }
  }

  renderMembers() {
    return this.props.groupMembers.map((member, index) => {
      return <GroupMembers key={index} member={member} />
    })
  }

  trimName(name) {
    if (name.length > 12) {
      return name.substring(0,12) + '...'
    } else {
      return name;
    }
  }

  selectEvent(event) {
    console.log("Event pressed: ", event);
    this.props.navigator.push({
      name: 'eventDetails',
      passProps: {
        eventDetails: event,
        user: this.props.user
      }
    });
  }

  groupImage() {
    const deviceModel = DeviceInfo.getModel();
    const isiPhone = deviceModel.slice(0, 6) === "iPhone"
    if (isiPhone) {
      return (
        <View style={styles.imageWrap}>
          <Image source={{uri: this.props.group.image}} style={styles.image} />
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.groupImage()}
        <H3 text={'Members'} />
        <View style={styles.module}>
          <ScrollView contentContainerStyle={styles.members}>
            {this.renderMembers()}
          </ScrollView>
        </View>

        <H3 text={'Recent Events'} />
        <View style={[styles.events, styles.module]}>
          <ScrollView>
            <View>
              {this.renderEvents()}
            </View>
          </ScrollView>
          <View style={styles.buttonView}>
            <Button text={'New Event'} onPress={this.newEvent.bind(this)} />
          </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  module: {
    padding: 10,
    backgroundColor: '#FFD98C',
    borderRadius: 5,
    margin: 5,
    flex: 1
  },
  imageWrap: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  image: {
    height: 160,
    width: 300,
    borderRadius: 5
  },
  members: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  events: {
    flex: 1,
    justifyContent: 'space-between'
  },
  eventDetails: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 5
  },
  buttonView: {
    alignItems: 'center'
  }
});

module.exports = GroupDetail;
