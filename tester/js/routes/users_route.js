var User = require('../models/user');

var UserRoute = Ember.Route.extend({

  model: function() {
    return User.find();
  }

});

module.exports = UserRoute;

