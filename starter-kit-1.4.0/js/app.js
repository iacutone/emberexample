App = Ember.Application.create({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
});

App.Artist = Ember.Object.extend({
  id: '',
  name: '',
  songs: [],
  
  slug: function(){
    return this.get('name').dasherize();
  }.property('name')
});
  
App.Artist.reopenClass({
  createRecord: function(data){
    var artist = App.artist.create({ id: data.id, name: data.name});
    artist.set('songs', this.extractSongs(data.songs, 'artist'));
    return artist;
  },
  extractSongs: function(dataSongs, artist){
    return dataSongs.map(function(song){
      return App.Song.create({ title: song.title, rating: song.rating, artist: artist });
    });
  }
});

App.Song = Ember.Object.extend({
  id: null,
  title: null,
  rating: null,
  artist: null
});

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
		var artistObjects = Ember.A();
    Ember.$.getJSON('http://localhost:9393/artists', function(artists){
      artists.forEach(function(data){
        artistObjects.pushObject(App.Artist.createRecord(data));
      });
    });
    return artistObjects;
	},
  
  actions: {
    createArtist: function(){
      var name = this.get('controller').get('newName');
      
      Ember.$.ajax('http://localhost:9393/artists', {
        type: 'POST',
        dataType: 'json',
        data: { name: name },
        context: this,
        success: function(data){
          var artist = App.Artist.createRecord(data);
          this.modelFor('artists').pushObject(artist);
          this.get('controller').set('newName', '');
          this.transitionTo('artist.songs', artist);
          },
        error: function(){
          alert('Falied to save artist!');
        }
      });
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
	model: function(params){
		var artist = App.Artist.create();
    var url = 'http://localhost:9393/artists' + params.slug;
    Ember.$.getJSON(url, function(data){
      App.Artist.createRecord(data);
      artist.setProperties({
        id: data.id,
        name: data.name,
        songs: App.Artist.extractSongs(data.songs, artist)
      });
    });
    return artist;
	},
  
  actions: {
    createSong: function(){
    var artist = this.controller.get('model');
    var title = this.controller.get('newTitle');
    Ember.$.ajax('http://localhost:9393/songs',{
      type: 'POST',
      dataType: 'json',
      context: this,
      data: { title: title, artist_id: artist.id },
      success: function(data){
        var song = App.Song.createRecord(data);
        song.set('artist', artist);
        this.modelFor('artists.songs').get('songs').pushObject(song);
        this.get('controller').set('newTitle', '');
      },
      error: function(){
        alert('Failed to create song.');
      }
    });
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
  // sortProperties: ['rating:desc', 'title:asc'],
  // sortedSongs: Ember.computed.sort('model', 'sortProperties'),
  // sortOptions: [
  //   {id: 'rating:desc,title:asc', name: 'Best'},
  //   {id: 'title:asc', name: 'Title asc'}
  // ]
  // selectedSort: 'rating:desc,title:asc',
  
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


