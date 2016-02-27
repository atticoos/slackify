'use strict';

import Slack from 'slack-node';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';

const validResponseParser = resp => {
  if (!resp.ok) {
    throw resp.error;
  }
  return resp;
};

const normalizeFilename = filename => path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);

const fileUploadPayload = (channel, filename) => ({
  file: fs.createReadStream(normalizeFilename(filename)),
  filename,
  title: 'test',
  channels: '#spam'
});

class SlackClient {

  constructor (token) {
    this.client = Promise.promisifyAll(new Slack(token));
  }

  uploadFile (channel, filename) {
    var payload = fileUploadPayload(channel, filename);
    return this.client.apiAsync('files.upload', payload)
      .then(validResponseParser)
      .then(response => response.file);
  }

  commentOnFile (file, comment) {
    return this.client.apiAsync('files.comments.add', {file, comment})
      .then(validResponseParser)
      .then(response => response.comment);
  }
}

export default SlackClient;
