import React, { Component } from 'react';

const local = 'http://localhost:3000/api/v1/'
const prod = 'https://movienightapi.herokuapp.com/api/v1/';

const ENV = {
  API: local,
}

module.exports = ENV;
