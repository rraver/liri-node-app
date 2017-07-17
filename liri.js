var method = process.argv[2];
var value = process.argv[3];
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var spotifyPackage = require('node-spotify-api');
var spotify = new spotifyPackage({
  id: keys.spotifyKeys.clientID,
  secret: keys.spotifyKeys.clientSecret
});
var twitter = require('twitter');
var twitterclient = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

switch (method) {
  case "my-tweets":
    twitterclient.get('statuses/user_timeline', function(error, tweets, response) {
      tweets.forEach(function(infoTweet){
        console.log();
        console.log("Tweet: " + infoTweet.text);
        console.log("Tweeted on: " + infoTweet.created_at)
      })
      console.log(error);
    });
    break;
  case "spotify-this-song":
    if (value == undefined) {
      value = "The Sign";
      }
    spotifyAction();
    break;
  case "movie-this":
    if (value == undefined) {
      value = "Mr. Nobody."
    }
    request("http://www.omdbapi.com/?apikey=" + keys.omdbKeys.key + "&t=" + value, function(error, response, body) {
      var results = JSON.parse(body);
      console.log("Title of the movie: " + results.Title)
      console.log("Year the movie came out: " + results.Year)
      console.log("IMDB rating of the move: " + results.imdbRating)
      console.log("Country where the movie was produced: " + results.Country)
      console.log("Language of the movie: " + results.Language)
      console.log("Plot of the movie:" + results.Plot)
      console.log("Actors in the movie: " + results.Actors);
      });
    break;
  case "do-what-it-says":
    fs.readFile('./random.txt', 'utf8', function read(err, data) {
      if (err) {
        throw err;
      }
      content = data.split(",");
      value = content[1];
      spotifyAction();
      });
  break;
}

function spotifyAction() {
  spotify.search({ type: 'track', query: value }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var results = data;
  console.log("Artist(s) Name: " + results.tracks.items[0].artists[0].name)
  console.log("The song's name: " + results.tracks.items[0].name)
  console.log("A preview link of the song from Spotify " + results.tracks.items[0].preview_url)
  console.log("The album the song is from is: " + results.tracks.items[0].album.name);
  });
}
