var botConfig = {
  min_votes: 2, // min votes to accept/deny a PR
  positive: ['+1'], // strings that will be matched as OK
  negative: ['-1'], // strings that will be matched as NO
  github: {
    username: "YOUR_USERNAME",
    repo: "YOUR_REPO_PATH", // ex: github-democracy-bot
    token: "b5htrh5h5tghh7" // How to get a user token: https://github.com/settings/tokens
  }
};

function doPost(e) {
  var payload = JSON.parse(e.parameters.payload);
  var issue = payload.issue;
  
  // ignore new comments on closed PRs, regular issues or nonvotation comments
  if (issue.state != "open" || typeof issue.pull_request === "undefined" || !isVotationComment(payload.comment.body)) {
    return;
  }
  checkVotation(issue.number, issue.user.id);
  
  return ContentService.createTextOutput("{}");
}

function isVotationComment (comment) {
  return !(botConfig.positive.indexOf(comment) === -1 && botConfig.negative.indexOf(comment) === -1);
}

function checkVotation (issue, creator) {
  
  var gh = new Github.Github(botConfig.github);
  var comments = gh.getIssueComments(issue);
  var votes = {
    positive: 0,
    negative: 0,
  };
  var voters = [];
  var comment;

  for(var c in comments) {
    comment = comments[c];
    
    // avoid duplicated && pr creator votes
    if (voters.indexOf(comment.user.id) !== -1 || comment.user.id == creator) {
      continue;
    }

    if (botConfig.positive.indexOf(comment.body) !== -1) {
      votes.positive++;
      voters.push(comment.user.id);
    } else if (botConfig.negative.indexOf(comment.body) !== -1) {
      votes.negative++;
      voters.push(comment.user.id);
    }
  }
  
  var success;

  if(votes.positive >= botConfig.min_votes) {
    success = gh.mergePR(issue).merged;
  } else if(votes.negative >= botConfig.min_votes) {
    success = (gh.closePR(issue).state == "closed");
  }
  
  return success;
}
