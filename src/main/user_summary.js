import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import setStyles from '../style';
import Button from '../components/common/button';

const ACCESS_TOKEN = 'access_token';

class UserSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      groups: '',
      events: ''
    }
  }
  componentWillMount() {
    this.getToken();
  }

  async fetchUserDetails(token) {
    try {
      console.log("got the token ", token);
      let response = await fetch('http://localhost:3000/api/v1/users/user_details', {
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
      this.setState({user: res.user, groups: res.groups})
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

  async deleteToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN)
      this.props.navigator.immediatelyResetRouteStack([{ name: 'buttons' }])
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  groups() {
    if (this.state.groups.length) {
      return this.state.groups.map((group, index) => {
        return (
          <View key={index}>
            <Text>
              {group.group_name}
            </Text>
          </View>
        );
      })
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <Text>Email: {this.state.user.email}</Text>
          <Button text={'Logout'} onPress={this.onLogoutPress.bind(this)} />
        </View>
        <View style={styles.groups}>

          {this.groups()}
        </View>
        <View style={styles.events}>
          <Text>This is the Events Secion</Text>
        </View>
      </View>
    );
  }
};

module.exports = UserSummary;

const styles = StyleSheet.create({
  container: setStyles.container,
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  groups: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  events: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
