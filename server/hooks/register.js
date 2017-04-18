// Sending Email after User Registered

var format = Npm.require("util").format;

// Can only call onCreateUser once
Accounts.onCreateUser(function(options, user) {
  if(user) {

    // added to metrics
    UserEvents.track("user", "registered", {
      userId: user._id,
      email: AccountsHelpers.getUserEmail(user)
    });
  }

  return user;
});
