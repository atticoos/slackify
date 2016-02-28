# slackify

Upload files to Slack from your CLI

```sh
slackify file channel
```

![slackify](https://cloud.githubusercontent.com/assets/656630/13376874/820e819e-dd94-11e5-932e-156234c014e9.gif)


### Installation

Install the `slackify` package globally from `npm`
```
npm install -g slackify
```

Obtain a Test OAuth token from [Slack's test token generator](https://api.slack.com/docs/oauth-test-tokens) or create a new Bot under your organization _yourorganization_.slack.com/services/new/bot.

Add an environment variable containing this token
```sh
export SLACKIFY_TOKEN=xoxp-xxxxxx-xxxxxx-xxxxx
```
Or include it as an option when using slackify `slackify -t xoxp-xxxxxx-xxxxxx-xxxxx`

### Usage
```
  Usage: slackify [options] [file] [channel]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -m --message <message>  a comment to add to the file
    -u --user <user>        the user to send the file to
    -l --lines <l1>..<l2>   upload specific lines in a file
    -t --token <token>      slack token
    -tl --tail <tail>       tail of a file
```
