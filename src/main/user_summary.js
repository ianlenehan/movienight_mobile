import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';
import H3 from '../components/common/H3';
import ENV from '../environment';
import strftime from 'strftime';

const ACCESS_TOKEN = 'access_token';

class UserSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      groups: [],
      events: []
    }
  }
  componentWillMount() {
    this.getToken();
  }

  async fetchUserDetails(token) {
    try {
      console.log("got the token ", token);
      let response = await fetch(ENV.API + 'users/user_details', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            access_token: token
          }
        })
      });
      let res = await response.json();
      console.log("res is: ", res);
      this.setState({
        user: res.user,
        groups: res.groups,
        events: res.events
      })
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  }

  async getToken() {
    let token;
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      this.fetchUserDetails(token);
      console.log("token is: " + token);
    } catch (error) {
      console.log("something went wrong");
    }
    token
  }

  onLogoutPress() {
    this.deleteToken();
  }

  imagePicker() {
    ImagePickerIOS.openSelectDialog({},(assetUri)=>{
      var photo = {
        uri: assetUri,
        type: 'image/jpeg',
        name: 'main.jpg'
      }

      console.log(photo);

      // var body = new FormData();
      // body.append('file', photo);
      //
      // fetch(presignedUrl, {
      //   method: 'put', body: body
      // });
    },()=>{ console.log('failed'); })
  }

  async deleteToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN)
      this.props.navigator.immediatelyResetRouteStack([{ name: 'buttons' }])
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  renderGroups() {
    return this.state.groups.map((group, index) => {
      return (
        <TouchableHighlight
          onPress={() => this.selectGroup(group)}
          key={index}
          underlayColor="grey">
          <Text style={setStyles.H2}>{group.group_name}</Text>
        </TouchableHighlight>
      );
    })
  }

  renderEvents() {
    this.state.events.splice(5);
    return this.state.events.map((event, index) => {
      let location = this.trimName(event.location);
      let group = this.getEventGroup(event);
      let date = new Date(Date.parse(event.date));
      return (
        <TouchableHighlight
          onPress={() => this.selectEvent(event)}
          key={index}
          underlayColor="grey">
          <View style={styles.eventDetails}>
            <Text style={{flex: 3.7}}>{strftime('%a %b %d', date)}</Text>
            <Text style={{flex: 5}}>{group}</Text>
            <Text style={{flex: 5}}>{location}</Text>
          </View>
        </TouchableHighlight>
      );
    })
  }

  getEventGroup(event) {
    let g = this.state.groups;
    for (var i = 0; i < g.length; i++) {
      if (g[i].id === event.group_id) {
        return this.trimName(g[i].group_name);
      }
    }
    return "Unknown Group";
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
        user: this.state.user
      }
    });
  }

  findGroups() {
    this.props.navigator.push({
      name: 'groups',
      passProps: { user: this.state.user }
    });
  }

  createGroup() {
    this.props.navigator.push({
      name: 'createGroup',
      passProps: { user: this.state.user }
    });
  }

  selectGroup(group) {
    console.log("Group pressed: ", group);
    this.props.navigator.push({
      name: 'group',
      passProps: {
        group: group,
        user: this.state.user
      }
    });
  }

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.profile, styles.module]}>
          <Image style={styles.photo} source={require('../img/Ian.png')} />
          <Text style={styles.name}>{user.name_first} {user.name_last}</Text>
        </View>
        <H3 text={'My Groups'} />
        <View style={[styles.groups, styles.module]}>
          {this.renderGroups()}
          <View style={styles.buttonView}>
            <Button text={'Find Groups'} onPress={this.findGroups.bind(this)} />
            <Button text={'Create Group'} onPress={this.createGroup.bind(this)} />
          </View>
        </View>
        <H3 text={'Latest Events'} />
        <View style={[styles.events, styles.module]}>
          {this.renderEvents()}
        </View>
        <View style={[styles.userButtons, styles.module]}>
          <Button text={'Logout'} onPress={this.onLogoutPress.bind(this)} />
          <Button text={'Edit Profile'} />
        </View>
      </View>
    );
  }
};

module.exports = UserSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 5
  },
  module: setStyles.module,
  profile: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  groups: {
    flex: 1.5,
    justifyContent: 'space-between',
    alignItems: 'center'
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
  userButtons: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonView: {
    flexDirection: 'row'
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 20
  },
  name: {
    flex: 3,
    fontSize: 18,
    padding: 10
  }
});
