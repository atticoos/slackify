#! /usr/bin/env node
'use strict';

import Cli from 'commander';
import pkg from '../package.json';
import chalk from 'chalk';
import invariant from './invariant';
import * as Print from './print';
import {uploadFile} from './client';
import {Spinner} from 'cli-spinner';

const lineParser = lines => lines.split('..').map(Number);
const getAccessToken = () => Cli.token || process.env.SLACKIFY_TOKEN;

var spinner = new Spinner('Uploading..');
var file;
var channel;

spinner.setSpinnerString(Spinner.spinners[process.platform === 'win32' ? 0 : 19]);

Cli
  .version(pkg.version)
  .arguments('[file]', 'upload a file to a channel or user')
  .arguments('[channel]', 'the channel to upload to')
  .option('-m --message <message>', 'a comment to add to the file')
  .option('-u --user <user>', 'the user to send the file to')
  .option('-l --lines <l1>..<l2>', 'upload specific lines in a file', lineParser)
  .option('-t --token <token>', 'slack token')
  .option('-tl --tail <tail>', 'tail of a file', Number)
  .action((fileName, channelName) => {
    file = fileName;
    channel = channelName;
  })
  .parse(process.argv);

invariant(
  getAccessToken(),
  'Please add SLACKIFY_TOKEN environment variable or provide it as an argument -t --token'
);

invariant(
  channel || Cli.user,
  'Please specify a target (channel or user) and a filename'
);

invariant(
  !!file,
  'Please specify a filename'
);

Print.info(`Uploading ${chalk.white(file)} to ${chalk.white(channel || Cli.user)}`)
spinner.start();
uploadFile(
  getAccessToken(),
  file,
  channel,
  Cli.user,
  Cli.message,
  Cli.lines,
  Cli.tail
).finally(() => {
  spinner.stop(true);
}).then(() => {
  Print.success('Upload complete!');
}).catch((error) => {
  Print.error('Upload failed with error', error);
});
