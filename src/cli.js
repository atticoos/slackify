#! /usr/bin/env node
'use strict';

import cli from 'commander';
import pkg from '../package.json';
import invariant from './invariant';
import * as Auth from './auth';
import Slack from './client';

var inputs = {
  files: []
};

const lineParser = lines => lines.split('..').map(Number);

cli
  .version(pkg.version)
  .arguments('[files]', 'upload a file(s) to a channel or user')
  .option('-m --message <message>', 'a comment to add to the file')
  .option('-c --channel <channel>', 'the channel to upload the file to')
  .option('-u --user <user>', 'the user to send the file to')
  .option('-l --lines <l1>..<l2>', 'upload specific lines in a file', lineParser)
  .action((files) => {
    inputs.files = files;
  })
  .parse(process.argv);

invariant(
  Auth.hasAccessTokenFile(),
  'Please create a .slackify file in your home directory with an access token'
);

invariant(
  Auth.getAccessToken(),
  'Please provide an access token in your .slackify file'
);

invariant(
  cli.user || cli.channel,
  'Please specify a target (channel or user) and a filename(s)'
);
invariant(
  inputs.files.length > 0,
  'Please specify a filename(s)'
);

const client = new Slack(Auth.getAccessToken());
const agnosticClientUploader = client => (u, c) => {
  return (file) => u ? client.uploadFileToUser(u, file) : client.uploadFileToChannel(c, file);
};
const clientUploader = agnosticClientUploader(client);
const upload = clientUploader(cli.user, cli.channel);

upload(inputs.files)
  .then(file => {
    if (cli.message) {
      return client.commentOnFile(file.id, cli.message);
    }
    return file;
  }).then(resp => {
    console.log('uploaded!');
  }).catch(error => {
    console.error('error', error);
  })
