#! /usr/bin/env node
'use strict';

import Cli from 'commander';
import Promise from 'bluebird';
import pkg from '../package.json';
import chalk from 'chalk';
import invariant from './invariant';
import * as Print from './print';
import {uploadFile} from './client';
import {readFile, getReadableFileStream} from './fileReader';
import {Spinner} from 'cli-spinner';
import through2 from 'through2';
import request from 'request';
import FormData from 'form-data';
import https from 'https';

const lineParser = lines => lines.split('..').map(Number);
const getAccessToken = () => Cli.token || process.env.SLACKIFY_TOKEN;
const getReadableStream = file => process.stdin.isTTY ? getReadableFileStream(file) : process.stdin;

var spinner = new Spinner('Uploading..');
var fileName;
var channelName;

spinner.setSpinnerString(Spinner.spinners[process.platform === 'win32' ? 0 : 19]);

//
// function getPipedData () {
//   return new Promise((resolve, reject) => {
//     var data = '';
//     process.stdin.on('readable', () => {
//       var chunk;
//       while (chunk = process.stdin.read()) {
//         data += chunk;
//       }
//     });
//     process.stdin.on('end', () => resolve(data));
//   });
// }
//
// function getFile (fileName) {
//   if (process.stdin.isTTY) {
//     return readFile(fileName).then(file => {
//       if (Cli.lines) {
//         invariant(
//           lines[1] > lines[0],
//           'Lines must be a valid range'
//         );
//         return parseIntoLines(file, Cli.lines[0], Cli.lines[1]);
//       } else if (Cli.tail) {
//         return parseTail(file, tail);
//       }
//       return file;
//     });
//   } else {
//     return getPipedData();
//   }
// }
//

//
Cli
  .version(pkg.version)
  .arguments('[file]', 'upload a file to a channel or user')
  .arguments('[channel]', 'the channel to upload to')
  .option('-m --message <message>', 'a comment to add to the file')
  .option('-u --user <user>', 'the user to send the file to')
  .option('-l --lines <l1>..<l2>', 'upload specific lines in a file', lineParser)
  .option('-t --token <token>', 'slack token')
  .option('-tl --tail <tail>', 'tail of a file', Number)
  .action((arg1, arg2) => {
    if (process.stdin.isTTY) {
      fileName = arg1;
      channelName = arg2;
    } else {
      channelName = arg1;
    }
  })
  .parse(process.argv);

const payloadTransformer = (token, channels, filename = '', title = 'Untitled', message = '') => {
  return through2.obj(function (chunk, enc, cb) {
    var formData = {
      channels,
      content: chunk, //.toString(),
      token,
      filename,
      title
    };
    var out = Object.keys(formData).map(key => ({
      name: key,
      value: formData[key]
    }));


    // var qs = Object.keys(formData).map(key => `${key}=${encodeURIComponent(formData[key])}`).join('&');
    // this.push(qs);
    // cb(null, {formData: fm});
    // this.push(new Buffer(JSON.stringify(formData)));
    // cb(null, JSON.stringify({
    //   formData
    // }));
  });
}

const requestTransformer = () => {
  return request({
    method: 'POST',
    url: 'https://slack.com/api/files.upload',
    headers: {
      'Content-Type': 'multipart/form-data'
      // 'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  // return request.post('https://slack.com/api/files.upload');
  return through2(function (chunk, enc, cb) {
    return request({
      method: 'POST',
      url: 'https://slack.com/api/files.upload',
      formData: chunk
    })
  });
};

const responseTransformer = () => {
  return through2(function (chunk, enc, cb) {
    var response = JSON.parse(chunk.toString());
    console.log('das response', response);
    this.push();
    if (response.ok) {
      cb();
    }
    cb(response.error);
  });
}


var form = new FormData();
form.append('file', getReadableStream(fileName))
form.append('token', getAccessToken())
form.append('channels', '#spam')

var req = https.request({
  host: 'slack.com',
  path: '/api/files.upload',
  headers: form.getHeaders()
});

form.pipe(req);

req.on('response', (r) => console.log(r));

console.log('das form', form);

// form.pipe(request('https://slack.com/api/files.upload'))
//   .pipe(responseTransformer());

// form.pipe(requestTransformer())
//   .pipe(responseTransformer())
//   .on('done', () => console.log('done'))
//   .on('error', (error) => console.log('error', error))
//   .on('end', () => console.log('done'));

// var stream = process.stdin.isTTY ? getReadableFileStream(fileName) : process.stdin;
// stream
//   .pipe(payloadTransformer(getAccessToken(), '#spam', 'test'))
//   .pipe(requestTransformer())
//   .pipe(responseTransformer())
//   .on('done', () => console.log('done'))
//   .on('error', (error) => console.log('error', error))
//   .on('end', () => console.log('done'));
//
//
// invariant(
//   getAccessToken(),
//   'Please add SLACKIFY_TOKEN environment variable or provide it as an argument -t --token'
// );
//
// invariant(
//   channelName || Cli.user,
//   'Please specify a target (channel or user) and a filename'
// );
//
// invariant(
//   fileName || !process.stdin.isTTY,
//   'Please specify a filename'
// );
//
// Print.info(`Uploading ${chalk.white(fileName)} to ${chalk.white(channelName || Cli.user)}`)
// spinner.start();
//
// getFile(fileName).then(file => {
//   return uploadFile(
//     getAccessToken(),
//     file,
//     fileName,
//     channelName,
//     Cli.user,
//     Cli.message
//   )
// }).finally(() => {
//   spinner.stop(true);
// }).then(() => {
//   Print.success('Upload complete!');
// }).catch((error) => {
//   Print.error('Upload failed with error', error);
// });
