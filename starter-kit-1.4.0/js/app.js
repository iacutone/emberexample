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

App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 5 }));
App.Songs.pushObject(App.Song.create({ title: 'Talk Shit', artist: 'Black Moon', rating:4 }));

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
      this.get('controller').set('newTitle', '');
      this.transitionTo('artists.songs', artist);
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
	model: function(params){
		return App.Artists.findProperty('slug', params.slug);
	},
  
  actions: {
    createSong: function(){
    var artist = this.controller.get('model.name');
    var title = this.controller.get('newTitle');
    var song = App.Song.create({ title: title, artist: artist });
    App.Songs.pushObject(song);
    this.controller.set('newTitle', '');
    }
  }
});

App.StarRating = Ember.View.extend({
  templateName: 'star-rating',
  classNames: ['rating-panel'],
  
  rating: Ember.computed.alias('context.rating'),
  fullStars: Ember.computed.alias('rating'),
  numStars: Ember.computed.alias('maxRating'),
  
  stars: function(){
    var ratings = [];
    var fullStars = this.starRange(1, this.get('fullStars'), 'full');
    var emptyStars = this.starRange(this.get('fullStars') + 1, this.get('numStars'), 'empty');
    Array.prototype.push.apply(ratings, fullStars);
    Array.prototype.push.apply(ratings, emptyStars);
    return ratings;
  }.property('fullStars', 'numStars'),
  
  starRange: function(start, end, type){
    var starsData = [];
    for (var i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    }
    return starsData;
  },
  actions: {
    setRating: function(){
      var newRating = Ember.$(event.target).data('rating');
      this.set('rating', newRating);
    }
  }
});

App.ArtistsController = Ember.ArrayController.extend({
  newName: '',
  disabled: function(){
    return Ember.isEmpty(this.get('newName'));
  }.property('newName')
});

App.ArtistsSongsController = Ember.ObjectController.extend({
  newSongPlaceholder: function(){
    return 'New ' + this.get('name') + ' song.';
  }.property('name'),
  
  songCreationStarted: false,
  canCreateSong: function(){
    return this.get('songCreationStarted') || this.get('songs.length');
  }.property('songCreationStarted', 'songs.length'),
  
  actions: {
    enableSongCreation: function(){
      this.set('songCreationStarted', true);
    }
  }
});


