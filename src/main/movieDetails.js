import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  AsyncStorage,
  StyleSheet
} from 'react-native';
import Button from '../components/common/button';
import BackButton from '../components/common/backButton';
import H1 from '../components/common/H1';
import setStyles from '../style';
import ENV from '../environment';
import Icon from 'react-native-vector-icons/FontAwesome';

class MovieDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movie: {"Title": '', "Year": '', "Runtime": '', "Director": '', "Poster": '', "Actors": '', "Plot": ''},
      showButton: true
    }
  }

  componentWillMount() {
    this.getMovie(this.props.movie)
  }

  async getMovie(movie) {
    let imdbID = movie["imdbID"];
    let url = 'https://www.omdbapi.com/?i=' + imdbID + '&plot=full&r=json';
    console.log(url);
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
  }

  fixUrl(url) {
    if (url) {
      let splitUrl = url.split('://');
      return 'https://' + splitUrl[1];
    }
  }

  async addToEvent() {
    let imdbID = this.props.movie["imdbID"];
    let eventID = this.props.eventID;
    try {
      let response = await fetch(ENV.API + 'events/add_movie', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_id: this.props.eventID,
          movie: this.props.movie["imdbID"]
        })
      });
      let eventDetails = await response.json();
      console.log("event update: ", eventDetails);
      this.props.update();
      this.props.navigator.popN(2);
    } catch(error) {
      console.log("error: ", error);
    }
  }

  renderButton() {
    if (this.state.showButton) {
      return (
        <View style={styles.button}>
          <Button text={'Add to Event'} onPress={this.addToEvent.bind(this)} />
        </View>
      )
    }
  }

  renderFull() {
    const { movie } = this.state;
    let url = this.fixUrl(movie["Poster"]);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={'Movie Details'} onPress={this.back.bind(this)} />
        </View>

        <View style={styles.body}>

          <View style={styles.main}>
            <H1 text={' ' + movie["Title"] + ' (' + movie["Year"] + ')'} />
            <Image
              style={styles.image}
              source={{uri: url}}
              resizeMode='contain'
            />
          </View>

          <View style={styles.details}>
            <Text style={styles.detail}>Director: {movie["Director"]}</Text>
            <Text style={styles.detail}>Runtime: {movie["Runtime"]}</Text>
            <Text style={styles.detail}>Actors: {movie["Actors"]}</Text>
            <Text style={styles.detail}>Plot: {movie["Plot"]}</Text>
          </View>
          {this.renderButton()}
        </View>
      </View>
    );
  }

  renderSpinner() {
    return (
      <View style={styles.spinner}>
        <Icon name="spinner" size={20} color="black" />
      </View>
    )
  }

  renderContent() {
    if (this.state.movie["Title"].length > 0) {
      return this.renderFull();
    } else {
      return this.renderSpinner();
    }
  }

  render() {
    const { movie } = this.state;
    let url = this.fixUrl(movie["Poster"]);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={'Movie Details'} onPress={this.back.bind(this)} />
        </View>

        <View style={styles.body}>

          <View style={styles.main}>
            <H1 text={' ' + movie["Title"] + ' (' + movie["Year"] + ')'} />
            <Image
              style={styles.image}
              source={{uri: url}}
              resizeMode='contain'
            />
          </View>

          <View style={styles.details}>
            <Text style={styles.detail}>Director: {movie["Director"]}</Text>
            <Text style={styles.detail}>Runtime: {movie["Runtime"]}</Text>
            <Text style={styles.detail}>Actors: {movie["Actors"]}</Text>
            <Text style={styles.detail}>Plot: {movie["Plot"]}</Text>
          </View>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  header: setStyles.header,
  body: {
    flex: 10,
    margin: 10,
    padding: 10,
    backgroundColor: setStyles.secondaryColor,
    borderRadius: 5
  },
  image: {
    width: 200,
    height: 300
  },
  main: {
    flex: 5,
    alignItems: 'center'
  },
  details: {
    flex: 2,
    marginTop: 5,
    overflow: 'hidden'
  },
  button: {
    alignItems: 'center',
    marginTop: 10
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 300
  }
});

module.exports = MovieDetails;
