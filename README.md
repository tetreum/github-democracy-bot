# github-democracy-bot
A Github democracy bot that can be hosted in Google Scripts

This bot will let users allow/deny PR(pull requests) using PR's comments as votation.


# Instructions

1. Go to [Google Scripts](https://script.google.com) and create a new script, ex "Github bot".
2. Create a [user token](https://github.com/settings/tokens) for the account that will close/merge the PRs and ensure that the account has those permissions on the repo.
3. Go to [bot.gs](https://github.com/tetreum/github-democracy-bot/blob/master/bot.gs) and copy it's contents to your google script.
4. Edit `botConfig` var with your settings
5. Then on the toolbar select -> Publish -> as website (set a new version) and copy the url that googles gives you (must end with /exc)
6. Again, toolbar -> Resources -> Libraries -> Add this `1LMl6pyG9YqJksQNCdFF3BMLJ_iOitixeKjD_50dRjHl8AkJY5nI0uUq3` ([it's Github API wrapper for gs](https://github.com/tetreum/github.gs))
7. Back to Github, go to your repo -> Settings -> Hooks -> Add webhook

7.1 Set as `Payload URL` your google url (the /exc).

7.2 Content type: `www-form`

7.3 Select as event triggers: `Issue comments` . (For Github, PR comments == Issue comments..)
