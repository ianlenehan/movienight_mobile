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

class MovieDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movie: {}
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
      console.log("res is: ", res);
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  }

  back() {
    this.props.navigator.pop();
  }

  onPressAddMovie() {
    this.props.navigator.push({ name: '' });
  }

  fixUrl(url) {
    let splitUrl = url.split('://');
    return 'https://' + splitUrl[1];
  }

  render() {
    const { movie } = this.props;
    let url = this.fixUrl(movie["Poster"]);
    return (
      <View style={styles.container}>
        <H1 text={movie["Title"]} />
        <Image
          style={styles.image}
          source={{uri: url}}
          resizeMode='contain'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  },
  image: {
    width: 200,
    height: 300
  }
});

module.exports = MovieDetails;
