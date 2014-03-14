App = Ember.Application.create({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
});

App.Song = Ember.Object.extend({
  title: null,
  rating: null,
  artist: null
});

App.Artist = Ember.Object.extend({
  name: null,
  
  slug: function(){
  	return this.get('name').dasherize();
  }.property('name'),
  
  songs: function(){
  	return App.Songs.filterProperty('artist', this.get('name'));
  }.property('name', 'App.Songs.@each.artist')
});

var artistNames = ['Led Zeppelin', 'Black Moon', 'Little Dragon'];

App.Artists = artistNames.map(function(name){ 
	return App.Artist.create({ name: name });
});

App.Songs = Ember.A();

App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 8 }));
App.Songs.pushObject(App.Song.create({ title: 'Talk Shit', artist: 'Black Moon', rating: 10 }));

App.Router.map(function(){
	this.resource('artists', function(){
		this.route('songs', { path: ':slug' });
	});
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function(){
    this.transitionTo('artists');
  }
});

App.ArtistsRoute = Ember.Route.extend({
	model: function(){
		return App.Artists;
	},
  actions: {
    createArtist: function(){
      var name = this.get('controller').get('newArtist');
      var artist = App.Artist.create({ name: name });
      App.Artists.pushObject(artist);
      this.get('controller').set('newArtist', '');
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
	model: function(params){
		return App.Artists.findProperty('slug', params.slug);
	},
  actions: {
    createSong: function(){
    var title = this.get('controller.newSong');
    var artist = this.get('controller.model.name');
    var song = App.Song.create({ title: title, artist: artist });
    App.Songs.pushObject(song);
    this.get('controller').set('newSong', '');
  }
  }
});


