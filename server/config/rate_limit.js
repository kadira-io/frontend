Meteor.startup(function() {
  if(process.env.METEOR_ENV !== "production") {
    Accounts.removeDefaultRateLimit();
  }
});
