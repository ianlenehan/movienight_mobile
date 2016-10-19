import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';
import ENV from '../environment';
import strftime from 'strftime';
import H3 from '../components/common/H3';
import GroupMembers from './groupMembers';

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
    let id = this.props.group.id;
    try {
      let response = await fetch(ENV.API + 'groups/events/' + id, {
        method: 'GET'
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
            underlayColor="grey">
            <View style={styles.eventDetails}>
              <Text style={{flex: 3}}>Date {strftime('%a %b %d', date)}</Text>
              <Text style={{flex: 5}}>{event.location}</Text>
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
        eventID: event.id,
        user: this.props.user
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrap}>
          <Image source={{uri: this.props.group.image}} style={styles.image} resizeMode='contain' />
        </View>

        <H3 text={'Members'} />
        <View style={[styles.members, styles.module]}>
          {this.renderMembers()}
        </View>

        <H3 text={'Recent Events'} />
        <View style={[styles.events, styles.module]}>
          {this.renderEvents()}
          <View style={{alignItems: 'center'}}>
            <Button text={'New Event'} onPress={this.newEvent.bind(this)} />
          </View>
        </View>
      </View>
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
    margin: 5
  },
  imageWrap: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  image: {
    height: 150,
    width: 375,
    borderRadius: 5
  },
  members: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  events: {
    flex: 1,
    justifyContent: 'center'
  },
  eventDetails: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 5
  },
});

module.exports = GroupDetail;
