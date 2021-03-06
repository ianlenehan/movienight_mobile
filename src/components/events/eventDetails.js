import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableHighlight,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Button from '../common/button';
import BackButton from '../common/backButton';
import H1 from '../common/H1';
import H2 from '../common/H2';
import H3 from '../common/H3';
import H4 from '../common/H4';
import setStyles from '../../style';
import strftime from 'strftime';
import ENV from '../../environment';
import GroupMembers from '../../main/groupMembers';
import StarRating from 'react-native-star-rating';
import DeviceInfo from 'react-native-device-info';
import RNCalendarEvents from 'react-native-calendar-events';
import Icon from 'react-native-vector-icons/FontAwesome';

const ACCESS_TOKEN = 'access_token';

class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      event: {},
      attendees: [],
      attending: false,
      movie: {},
      group: '',
      token: '',
      rating: 0,
      averageRating: 0,
    }
  }

  componentDidMount() {
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
            id: this.props.eventDetails.id
          }
        })
      });
      let res = await response.json();
      this.setState({
        event: res.event,
        group: res.group,
        attendees: res.attendees,
        attending: res.attending
      });
      this.fetchMovie(res.event.imdb_id);
      this.fetchRating();
    } catch(error) {
      console.log("error: ", error);
    }
  }

  async fetchMovie(imdbID) {
    let url = 'https://www.omdbapi.com/?i=' + imdbID + '&plot=short&r=json';
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

  renderMembers() {
    return this.state.attendees.map((member, index) => {
      return <GroupMembers key={index} member={member} />
    })
  }

  back() {
    if (this.props.header) {
      this.props.navigator.immediatelyResetRouteStack([{ name: 'userSummary' }]);
    } else {
      this.props.navigator.pop();
    }
  }

  onPressAddMovie() {
    this.props.navigator.push({
      name: 'searchMovie',
      passProps: {
        eventID: this.state.event.id,
        update: this.getToken.bind(this)
      }
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

  editEvent() {
    this.props.navigator.push({
      name: 'newEvent',
      passProps: {
        event: this.state.event,
        user: this.props.user,
        group: this.state.group,
        render: this.getToken.bind(this)
      }
    });
  }

  async fetchRating() {
    let id = this.state.event.id
    let user_id = this.props.user.id
    try {
      let response = await fetch(ENV.API + 'events/show_rating', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: { id: user_id },
          event: { id: id }
        })
      });
      let res = await response.json();
      console.log("Success: ", res);
      const rating = res.rating || 0
      this.setState({ rating: rating.rating_score, averageRating: res.average })
    } catch(error) {
      console.log("error: ", error);
    }
  }

  eventHasFinished() {
    return new Date() > new Date(this.state.event.date)
  }

  showMovieDetails() {
    Alert.alert(
      this.state.movie["Title"],
      "Director: " + this.state.movie["Director"] + "\n" +
      "Runtime: " + this.state.movie["Runtime"]  + "\n" +
      "Actors: " + this.state.movie["Actors"],
      [
        {text: 'Close'},
      ]
    )
  }

  async onStarRatingPress(rating) {
    if (this.eventHasFinished()) {
      this.setState({ rating: rating })
      try {
        let response = await fetch(ENV.API + 'events/rating', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: {
              access_token: this.state.token
            },
            event: {
              id: this.props.eventDetails.id,
              rating: rating
            }
          })
        });
        let res = await response.json();
        this.setState({ averageRating: res.average })
        console.log("Success: ", res);
      } catch(error) {
        console.log("error: ", error);
      }
    } else {
      Alert.alert(
        'Hang on!',
        "You can rate this event after it has finished.",
        [
          {text: 'OK', onPress: this.setState({ rating: this.state.rating }) },
        ]
      )
    }
  }

  moviePoster() {
    const poster = this.fixUrl(this.state.movie["Poster"]);
    const deviceModel = DeviceInfo.getModel();
    const isiPad = deviceModel.slice(0, 6) === "iPad"

    if (!isiPad) {
      return (
        <TouchableHighlight
          onPress={this.showMovieDetails.bind(this)}
          style={styles.imageHalf}
          underlayColor='transparent'
          >
          <Image
            source={{uri: poster}}
            style={styles.poster}
            resizeMode='contain'
            />
        </TouchableHighlight>
      )
    }
  }

  checkCalendarAuthorization() {
    RNCalendarEvents.authorizationStatus()
      .then(status => {
        this._authorizeCalendar()
      })
      .catch(error => {
       console.log("Error", error);
      });
  }

  _authorizeCalendar() {
    RNCalendarEvents.authorizeEventStore()
      .then(status => {
        this._addToCalendar()
      })
      .catch(error => {
       console.log("Error", error);
      });
  }

  _addToCalendar() {
    const title = "MovieNight Event"
    const startDate = this.state.event.date
    const tempDate = new Date(this.state.event.date)
    const endDate = new Date(tempDate.setHours(tempDate.getHours()+2))
    const settings = {
      location: this.state.event.location,
      startDate,
      endDate: endDate.toISOString()
    }
    RNCalendarEvents.saveEvent(title, settings)
      .then(id => {
        Alert.alert(
          settings.location,
          "This MovieNight event has been added to your calendar!",
          [ {text: 'Cool'} ]
        )
      })
      .catch(error => {
       console.log("Error", error);
      });
  }

  calendarButton() {
    return (
      <TouchableHighlight 
        onPress={this.checkCalendarAuthorization.bind(this)}
        underlayColor='transparent'
        >
        <Icon
          style={{paddingTop: 10, paddingBottom: 10}}
          name="calendar-plus-o" size={20} color="black" />
      </TouchableHighlight>
    )
  }

  render() {
    const { location, date } = this.state.event;
    let formattedDate = strftime('%a %b %d at %l:%M %p', (new Date(Date.parse(date))));

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <BackButton text={this.state.group.group_name}
          admin={true}
          edit={this.editEvent.bind(this)}
          onPress={this.back.bind(this)} text={'Event Details'}/>
        </View>

        <View style={styles.body}>
            <View style={[styles.module, styles.top]}>
              <View style={{alignItems: 'center'}}>
                <H2 text={location} />
                <H4 text={this.state.group.group_name} />
              </View>

              <ScrollView contentContainerStyle={styles.details}>
                <View style={styles.detailHalf}>
                  <Text style={{fontWeight: 'bold'}}>When</Text>
                  <Text>{date ? formattedDate : 'Loading...'}</Text>
                  {this.calendarButton()}
                  <Text style={{fontWeight: 'bold'}}>Movie</Text>
                  <Text>{this.state.movie["Title"]}</Text>
                  <Text>  </Text>
                  {this.attendance()}
                  {this.renderButton()}
                </View>

                {this.moviePoster()}

              </ScrollView>
            </View>
            <H3 text={'Attendees'} />
            <View style={styles.module}>
              <ScrollView contentContainerStyle={styles.attendees}>
                {this.renderMembers()}
              </ScrollView>
            </View>
            <View style={styles.starsView}>
              <Text style={styles.ratingText}>
                Rate Event:
              </Text>
              <View style={styles.stars}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.rating}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                  starColor={setStyles.redColor}
                  emptyStarColor={setStyles.secondaryColor}
                  emptyStar={'star'}
                  fullStar={'star'}
                  starSize={25}
                />
              </View>
            <Text style={styles.avgRating}>Average Rating: {this.state.averageRating}</Text>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  header: setStyles.header,
  body: setStyles.bodyOther,
  module: {
    padding: 10,
    backgroundColor: '#FFD98C',
    borderRadius: 5,
    margin: 5,
    flex: 1
  },
  details: {
    flex: 1.5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  attendees: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  top: {
    flex: 2.8
  },
  poster: {
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
  },
  starsView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stars: {
    flex: 1.8,
    alignItems: 'center'
  },
  ratingText: {
    fontWeight: 'bold',
    flex: 1,
    paddingLeft: 5
  },
  avgRating: {
    fontSize: 10,
    flex: 1,
    textAlign: 'right',
    paddingRight: 5
  }
});

module.exports = EventDetails;
