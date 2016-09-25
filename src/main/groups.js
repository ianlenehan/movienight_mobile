import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  AsyncStorage,
  ListView,
  TouchableHighlight
} from 'react-native';
import Button from '../components/common/button';
import Search from '../components/common/search';
import H1 from '../components/common/H1';
import H2 from '../components/common/H2';
import HR from '../components/common/HR';
import setStyles from '../style';

class Groups extends Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      user: '',
      groups: [{}, {}],
      dataSource: ds.cloneWithRows(["", ""]),
      searchText: ''
    }
  }

  componentWillMount() {
    this.fetchGroups()
  }

  async fetchGroups() {
    try {
      let response = await fetch('http://localhost:3000/api/v1/groups', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      let res = await response.json();
      this.setDataSource(res);
    }
    catch(error) {
      console.log("There was an error: ", error);
    }
  }

  setDataSource(groups) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      groups: groups,
      dataSource: ds.cloneWithRows(groups),
      user: this.props.user
    })
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='gray' style={{height: 44}}
      onPress={() => this.selectGroup(rowData)}
      >
        <View>
          <H1 numberOfLines={1} text={rowData.group_name} />
          <HR />
        </View>
      </TouchableHighlight>
    );
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

  getGroupNames(groups) {
    names = [];
    if (groups.length) {
      for (var i = 0; i < groups.length; i++ ) {
       names.push(groups[i].group_name)
      }
      return names;
    }
  }

  groupSearch(text) {
    this.setState({ searchText: text })
    console.log("Text:", text);
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

  backButton() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <H2 text={'Find a Group'} />
        </View>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}
        renderHeader={() => <TextInput
          style={styles.search}
          placeholder="Search..."
          value={this.state.searchText}
          onChangeText={(text) => this.groupSearch(text)}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10
  },
  search: {
    height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  }
});

module.exports = Groups;
