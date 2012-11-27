Meteor.publish("posts", function () {
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
});

Meteor.publish("allUsers", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, friends: 1, username: 1}});
});
