import React, { Component } from 'react';

const local = 'http://localhost:3000/api/v1/'
const prod = 'https://movienightapi.herokuapp.com/api/v1/';

const ENV = {
  API: local,
  cloudinary: {
    cloud_name: 'ianlenehan',
    api: '763857653399167',
    api_secret: 'T6xVSQNJKp6P1AIHcgzf20nlfpI'
  }
}

module.exports = ENV;
