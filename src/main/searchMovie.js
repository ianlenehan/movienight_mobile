import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  View,
  StyleSheet,
  AsyncStorage,
  ListView,
  TouchableHighlight
} from 'react-native';
import Button from '../components/common/button';
import Search from '../components/common/search';
import BackButton from '../components/common/backButton';
import H1 from '../components/common/H1';
import H2 from '../components/common/H2';
import HR from '../components/common/HR';
import setStyles from '../style';
import ENV from '../environment';

class SearchMovie extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      movie: '',
      results: [{}, {}],
      dataSource: ds.cloneWithRows(["", ""]),
      searchText: ''
    }
  }

  componentDidMount() {
    let listViewScrollView = this.refs.listView.getScrollResponder();
    listViewScrollView.scrollTo({y: -10});
    // listViewScrollView.scrollTo({y: 0});
  }

  fixSearchString(string) {
    title = string.split(' ').join('+');
    return title;
  }

  async searchOMDB() {
    let title = this.fixSearchString(this.state.searchText);
    let url = 'https://www.omdbapi.com/?s=' + title + '&r=json';
    console.log(url);
    try {
      let response = await fetch(url, {
        method: 'GET'
      });
      let res = await response.json();
      this.setDataSource(res["Search"]);
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  }

  setDataSource(results) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      results: results,
      dataSource: ds.cloneWithRows(results)
    })
  }

  fixUrl(url) {
    if (url) {
      let splitUrl = url.split('://');
      return 'https://' + splitUrl[1];
    }
  }

  renderRow(rowData, sectionID, rowID) {
    let url = this.fixUrl(rowData["Poster"]);
    return (
      <View style={styles.searchResults}>
      <Image style={styles.thumb} resizeMode='contain' source={{url}} />
      <TouchableHighlight underlayColor='transparent' style={styles.touch}
      onPress={() => this.selectMovie(rowData)}
      >
        <Text numberOfLines={1} style={styles.title}>{rowData["Title"]}</Text>
      </TouchableHighlight>
      </View>
    );
  }

  selectMovie(movie) {
    console.log("Movie pressed: ", movie["Title"], movie["imdbID"]);
    this.props.navigator.push({
      name: 'movieDetails',
      passProps: {
        movie: movie,
        eventID: this.props.eventID,
        update: this.props.update
      }
    });
  }

  getGroupNames(groups) {
    names = [];
    if (groups.length) {
      for (var i = 0; i < groups.length; i++ ) {
       names.push(groups[i].group_name)
      }
      return names;
    }
  }

  movieSearch(text) {
    this.setState({ searchText: text })
    let groups = this.state.groups;
    let filteredGroups = [];
    let searchText = this.state.searchText;
    let re = new RegExp("[" + searchText + "]+")
    for (var i = 0; i < groups.length; i++) {
      if (re.test(groups[i].group_name)) {
        filteredGroups.push(groups[i])
        this.setDataSource(filteredGroups);
      }
    }
  }

  back() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton text={'Search Movies'} onPress={this.back.bind(this)} />
        </View>

        <View style={styles.body}>
          <ListView ref="listView" dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}
          renderHeader={() =>
            <TextInput
            style={styles.search}
            placeholder="Search..."
            value={this.state.searchText}
            onChangeText={(text) => this.setState({searchText: text})}
            returnKeyType={'search'}
            onSubmitEditing={this.searchOMDB.bind(this)}
            />
          }
          />
          <View style={{alignItems: 'center'}}>
            <Button text={'Search'} onPress={this.searchOMDB.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: setStyles.container,
  header: setStyles.header,
  search: {
    height: 30,
    flex: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  body: {
    padding: 10,
    backgroundColor: '#FFD98C',
    borderRadius: 5,
    margin: 10,
    marginTop: 15,
    flex: 10
  },
  searchResults: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2
  },
  thumb: {
    height: 44,
    width: 30,
    marginRight: 5,
    flex: 1,
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 20,
    justifyContent: 'center'
  },
  touch: {
    height: 45,
    flex: 14
  }
});

module.exports = SearchMovie;
