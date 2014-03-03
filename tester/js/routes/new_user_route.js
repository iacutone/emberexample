var user = require('../models/user');

var NewUserRoute = Ember.Route.extend({

  renderTemplate: function() {
    this.render('edit_user', {controller: 'new_user'});
  },

  model: function() {
    return user.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  }

});

module.exports = NewUserRoute;

