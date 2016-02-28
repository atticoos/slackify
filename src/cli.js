#! /usr/bin/env node
'use strict';

import Cli from 'commander';
import ProgressBar from 'progress';
import pkg from '../package.json';
import invariant from './invariant';
import {uploadFile, attachCommentToFile} from './client';

var progressBar;
var inputs = {
  files: []
};

const lineParser = lines => lines.split('..').map(Number);
const getAccessToken = () => process.env.SLACKIFY_TOKEN || Cli.token;

Cli
  .version(pkg.version)
  .arguments('[files]', 'upload a file(s) to a channel or user')
  .option('-m --message <message>', 'a comment to add to the file')
  .option('-c --channel <channel>', 'the channel to upload the file to')
  .option('-u --user <user>', 'the user to send the file to')
  .option('-l --lines <l1>..<l2>', 'upload specific lines in a file', lineParser)
  .option('-t --token <token>', 'slack token')
  .action((files) => {
    inputs.files = files;
  })
  .parse(process.argv);

invariant(
  getAccessToken(),
  'Please add SLACKIFY_TOKEN environment variable or provide it as an argument -t --token'
);

invariant(
  Cli.user || Cli.channel,
  'Please specify a target (channel or user) and a filename(s)'
);
invariant(
  inputs.files.length > 0,
  'Please specify a filename(s)'
);

const uploadCompleteHandler = (token, comment) => (err, resp) => {
  if (err || !resp.ok) {
    if (resp.error === 'invalid_auth') {
      console.error('An invalid access token was provided');
    } else {
      console.error('Unable to upload your file for reason:', resp.error);
    }
    return;
  }

  if (comment && !err && resp.ok) {
    attachCommentToFile(token, resp.file.id, comment);
  }
  console.log('Upload & complete!');
};


uploadFile(
  getAccessToken(),
  inputs.files,
  Cli.channel,
  Cli.user,
  Cli.message,
  Cli.lines,
  uploadCompleteHandler(getAccessToken(), Cli.message)
).on('data', function (chunk) {
  progressBar = progressBar || new ProgressBar('Uploading... [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 25,
    total: parseInt(this.response.headers['content-length'])
  });
  progressBar.tick(chunk.length);
}).on('end', function (err, x) {
  progressBar.tick(progressBar.total - progressBar.current);
});
