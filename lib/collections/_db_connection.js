SmellServer = DDP.connect("smell.cqt.nl");
DDP.loginWithPassword(SmellServer, {username: Meteor.settings.userName}, Meteor.settings.password, function (error) {
    if (!error) {
      console.log("Logged in!");
    } else {
      console.log(error);
    }
});