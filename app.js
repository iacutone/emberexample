window.App = Ember.Application.create({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
  LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
});

App.Router.map(function(){
  this.resource('users', function(){
    this.resource('user', { path:'/:user_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });
});

App.ApplicationAdapter = DS.FixtureAdapter;

App.UsersRoute = Ember.Route.extend({
  model: function(){
    return this.store.find('user');
  }
});

App.UsersController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true // false = descending
});

App.UsersController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true // false = descending
});

App.IndexRoute = Ember.Route.extend({
  redirect: function(){
    this.transitionTo('users');
  }
});