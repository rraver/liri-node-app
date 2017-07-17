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


switch (method) {
  case "my-tweets":
    console.log("twitter API");
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
      console.log(body);
      });
    console.log("test");
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

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });
