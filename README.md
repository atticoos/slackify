# slackify

Upload files to Slack from your CLI

```sh
slackify filename.js --channel develop
```

### Installation

Install the `slackify` package globally from `npm`
```
npm install -g slackify
```

Obtain a Test OAuth token from [Slack's test token generator](https://api.slack.com/docs/oauth-test-tokens).

Add an environment variable containing this token
```sh
export SLACKIFY_TOKEN=xoxp-xxxxxx-xxxxxx-xxxxx
```
Or inlucde it as an option when using slackify `slackify -t xoxp-xxxxxx-xxxxxx-xxxxx`

### Usage
```
slackify [options] [files]

Options:

  -h, --help              output usage information
  -V, --version           output the version number
  -m --message <message>  a comment to add to the file
  -c --channel <channel>  the channel to upload the file to
  -u --user <user>        the user to send the file to
  -l --lines <l1>..<l2>   upload specific lines in a file
  -t --token <token>      slack token
```
