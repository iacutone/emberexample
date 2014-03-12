App = Ember.Application.create({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
});

App.Song = Ember.Object.extend({
  title: null,
  rating: null,
  artist: null
});

App.Artist = Ember.Object.extend({
  name: null
});

var artistNames = ['Led Zeppelin', 'Black Moon'];

App.Artists = artistNames.map(function(name){ 
	return App.Artist.create({ name: name });
});

App.Songs = Ember.A();

App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 8 }));
App.Songs.pushObject(App.Song.create({ title: 'Talk Shit', artist: 'Black Moon', rating: 10 }));

App.Router.map(function(){
	this.route('artists', { path: '/artists'} );
});

App.ArtistsRoute = Ember.Route.extend({
	model: function(){
		return App.Artists;
	}
});


