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

const fileUploadPayload = (channels, filename, file, message, token) => ({
  content: file,
  title: filename,
  initial_comment: message,
  filename,
  channels,
  token
});

export function uploadFile (token, file, filename = 'Untitled', channel, user, message = '') {
  var formData = fileUploadPayload(
    toChannelString(channel, user),
    filename,
    file,
    message,
    token
  );

  return request.post({
    url: `${BASE_URL}/files.upload`,
    formData
  })
  .then(JSON.parse)
  .then(rpcResponseHandler)
  .then(response => response.file)
}
