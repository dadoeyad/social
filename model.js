/*
  Each post is represented by a document in the posts collection:
    owner: user id
    text: String
    public: Boolean
    comments: Array of objects like {user: userId, text: string}
    timestamp: datetime
*/
Posts = new Meteor.Collection("posts");

Posts.allow({
  insert: function (userId, text) {
  	return userId
  },
  update: function (userId, post) {
    return false;
  },
  remove: function (userId, post) {
    return post.owner !== userId;
  }
});

var displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  if (user.username)
    return user.username;
  return user.emails[0].address;
};

Meteor.methods({
	addFriend: function (userId, friend) {
			Meteor.users.update(userId, { $addToSet : { friends : friend._id } });
		}
});