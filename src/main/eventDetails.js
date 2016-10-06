import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import Button from '../components/common/button';
import BackButton from '../components/common/backButton';
import H1 from '../components/common/H1';
import setStyles from '../style';
import strftime from 'strftime';
import ENV from '../environment';

const ACCESS_TOKEN = 'access_token';

class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      event: {},
      attendees: [],
      attending: false,
      movie: {},
      token: ''
    }
  }

  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    let token;
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      this.setState({ token: token });
      this.fetchEvent(token);
    } catch (error) {
      console.log("something went wrong");
    }
  }

  async fetchEvent(token) {
    try {
      let id = this.props.eventID;
      let response = await fetch(ENV.API + 'events/find', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            access_token: token
          },
          event: {
            id: id
          }
        })
      });
      let res = await response.json();
      console.log("new event: ", res);
      this.setState({
        event: res.event,
        attendees: res.attendees,
        attending: res.attending
      });
      this.fetchMovie(res.event.imdb_id);
    } catch(error) {
      console.log("error: ", error);
    }
  }

  async fetchMovie(imdbID) {
    let url = 'https://www.omdbapi.com/?i=' + imdbID + '&plot=full&r=json';
    try {
      let response = await fetch(url, {
        method: 'GET'
      });
      let res = await response.json();
      this.setState({ movie: res })
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  onPressAddMovie() {
    this.props.navigator.push({
      name: 'searchMovie',
      passProps: { eventID: this.state.event.id }
    });
  }

  fixUrl(url) {
    if (url) {
      let splitUrl = url.split('://');
      return 'https://' + splitUrl[1];
    }
  }

  attendance() {
    if (this.state.attending) {
      return <Button text={'Attending'} onPress={this.notAttending.bind(this)} />
    } else {
      return <Button text={'Not Attending'} onPress={this.attending.bind(this)} />
    }
  }

  async attending() {
    try {
      let response = await fetch(ENV.API + 'events/attending', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: { access_token: this.state.token },
          event: { id: this.state.event.id }
        })
      });
      let res = await response.json();
      console.log("attendees: ", res);
      this.setState({
        attendees: res,
        attending: true
      });
    } catch(error) {
      console.log("error: ", error);
    }
  }

  async notAttending() {
    try {
      let response = await fetch(ENV.API + 'events/not_attending', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: { access_token: this.state.token },
          event: { id: this.state.event.id }
        })
      });
      let res = await response.json();
      console.log("attendees: ", res);
      this.setState({
        attendees: res,
        attending: false
      });
    } catch(error) {
      console.log("error: ", error);
    }
  }

  renderButton() {
    if (this.state.event.imdb_id && this.state.event.imdb_id.length) {
      return <Button text={'Change Movie'} onPress={this.onPressAddMovie.bind(this)} />
    } else {
      return <Button text={'Add Movie'} onPress={this.onPressAddMovie.bind(this)} />
    }
  }

  render() {
    const { location, date } = this.state.event;
    let formattedDate = new Date(Date.parse(date));
    let poster = this.fixUrl(this.state.movie["Poster"]);

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <BackButton onPress={this.back.bind(this)} text={'Event Details'}/>
        </View>

        <View style={styles.body}>
          <View style={styles.module}>
            <View style={{alignItems: 'center'}}>
              <H1 text={location} />
            </View>
            <View style={styles.details}>
              <View style={styles.detailHalf}>
                <Text style={{fontWeight: 'bold'}}>When</Text>
                <Text>{strftime('%a %b %d at %H:%M %p', formattedDate)}</Text>
                <Text>  </Text>
                <Text style={{fontWeight: 'bold'}}>Movie</Text>
                <Text>{this.state.movie["Title"]}</Text>
                <Text>  </Text>
                {this.attendance()}
                {this.renderButton()}
              </View>
              <View style={styles.imageHalf}>
                <Image
                  source={{uri: poster}}
                  style={styles.image}
                  resizeMode='contain'
                  />

              </View>
            </View>
          </View>

          <View style={[styles.module, styles.attendees]}>
            <Text>Attending</Text>
          </View>
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
  },
  module: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: setStyles.secondaryColor,
    borderRadius: 5
  },
  details: {
    flex: 1.5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  attendees: {
    flex: 1
  },
  image: {
    width: 200,
    height: 200
  },
  detailHalf: {
    justifyContent: 'flex-end',
    flex: 1
  },
  imageHalf: {
    justifyContent: 'flex-end',
    flex: 1
  }
});

module.exports = EventDetails;
