import React, { Component } from 'react'
import {
  Navigator,
  StyleSheet
} from 'react-native';

import authButtons from './components/authentication/authButtons';
import setStyles from './style';
import Register from './components/authentication/register';
import Login from './components/authentication/login';
import Users from './main/users';
import UserSummary from './main/user_summary';

const routes = {
  buttons: authButtons,
  register: Register,
  login: Login,
  users: Users,
  userSummary: UserSummary
}


class Main extends Component {
  renderScene(route, navigator) {
    let Component = routes[route.name];
    return <Component route={route} navigator={navigator} />;
  }

  render() {
    return (
      <Navigator
      style={styles.container}
      initialRoute={{ name: 'buttons' }}
      renderScene={this.renderScene}
      configureScene={() => { return Navigator.SceneConfigs.FloatFromRight; }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: setStyles.primaryColor
  }
})

module.exports = Main;
