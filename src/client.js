'use strict';

import request from 'request-promise';
import invariant from './invariant';
import {
  readFile,
  parseIntoLines,
  parseTail
} from './fileReader';

const BASE_URL = 'https://slack.com/api';

const rpcResponseHandler = response => {
  if (response.ok) {
    return response;
  }
  throw response.error;
}

const toChannelString = (channel, user) => {
  var targets = [];
  if (channel) {
    targets.push(`#${channel}`);
  }
  if (user) {
    targets.push(`@${user}`);
  }
  return targets.join(',');
}

export function uploadFile (token, file, filename = 'Untitled', channel, user, message = '') {
  var formData = {
    content: file,
    title: filename,
    initial_comment: message,
    channels: toChannelString(channel, user),
    filename,
    token
  };

  return request.post({
    url: `${BASE_URL}/files.upload`,
    formData
  })
  .then(JSON.parse)
  .then(rpcResponseHandler)
  .then(response => response.file)
}
