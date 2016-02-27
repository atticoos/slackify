'use strict';

import fs from 'fs';

const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
const PREFERENCE_FILENAME = '.slackify';

function getPreferences() {
  var preferenceFile = fs.readFileSync(`${HOME}/${PREFERENCE_FILENAME}`);
  return JSON.parse(preferenceFile.toString());
}

export function hasAccessTokenFile () {
  return fs.existsSync(`${HOME}/${PREFERENCE_FILENAME}`);
}

export function getAccessToken () {
  var preferences = getPreferences();
  return preferences.token;
}
