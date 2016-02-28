# slackify

Upload files to Slack from your CLI

```sh
slackify file channel
```

Or pipe in `stdin`
```sh
ps -a | slackify channel
```

![slackify](https://cloud.githubusercontent.com/assets/656630/13382387/5d529748-de41-11e5-9b49-f42b06773b2f.gif)



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

#### Send a file to a user
```
slackify file -u user
```

#### Pipe stdin to a user
```
ps -a | slackify -u user
```

#### Upload specific lines of a file
```
slackify file channel --lines 10..30
```

#### Upload the tail of a file
```
slackify error_log support --tail 50
```

#### Add a comment with your file
```
slackify file development -m 'uploaded from slackify'
```
