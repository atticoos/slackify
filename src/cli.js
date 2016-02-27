#! /usr/bin/env node
'use strict';

import Cli from 'commander';
import ProgressBar from 'progress';
import pkg from '../package.json';
import invariant from './invariant';
import * as Auth from './auth';
import {uploadFile} from './client';

var inputs = {
  files: []
};

const lineParser = lines => lines.split('..').map(Number);

Cli
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
  Cli.user || Cli.channel,
  'Please specify a target (channel or user) and a filename(s)'
);
invariant(
  inputs.files.length > 0,
  'Please specify a filename(s)'
);


var progressBar;
uploadFile(Auth.getAccessToken(), inputs.files, Cli.channel, Cli.user, Cli.message, Cli.lines)
  .on('data', function (chunk) {
    progressBar = progressBar || new ProgressBar('Uploading... [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 25,
      total: parseInt(this.response.headers['content-length'])
    });
    progressBar.tick(chunk.length);
  })
  .on('close', (err) => {
    progressBar.tick(progressBar.total - progressBar.current);
  });
