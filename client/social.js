
Meteor.subscribe("posts");
Meteor.subscribe('allUsers');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.posts.posts = function () {
  var friends = Meteor.users.findOne(this.userId, {fields: {friends: 1}});
  if (friends) {
    if (friends.friends) {
      var allowners = _.toArray(friends.friends);
      allowners.push(this.userId);
      return Posts.find({owner: { $in : allowners }}, {sort: {timestamp: -1}});
    };
    return Posts.find({owner: this.userId}, {sort: {timestamp: -1}});
  };
  return Posts.find({owner: this.userId}, {sort: {timestamp: -1}});
};

Template.newPost.events({
  'click .save': function (event, template){
    var text = template.find(".text").value;

    if (text.length){
    var timestamp = (new Date()).getTime();
    Posts.insert({
      owner: this.userId,
      text: text,
      timestamp: timestamp
    });
    } else {
      Session.set("postError",
                  "Nothing to post");
    }
  }
});

Template.posts.displayName = function () {
  var user = Meteor.users.findOne(this.owner);
  return displayName(user);
};


Template.addDialog.events({
  'click .save': function (event, template) {
    var email = template.find(".Email").value;
    var friend = Meteor.users.findOne({'emails.address': email});

    if (friend) {
      Meteor.call('addFriend', userId, friend);
      Session.set("addError", false);
      Session.set("showAddDialog", false);
    } else {
      Session.set("addError",
                  "No such user");
    }
  },

  'click .cancel': function () {
    Session.set("showAddDialog", false);
  }
});

Template.addDialog.addError = function () {
  return Session.get("addError");
};

var openAddDialog = function () {
  Session.set("showAddDialog", true);
};

Template.page.showAddDialog = function () {
  return Session.get("showAddDialog");
};

Template.page.events({
  'click #add': function(event, template){
    openAddDialog();
    return false;
  }
});