require("dotenv").config();

const axios = require("axios");
const moment = require("moment");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var concertAPI = keys.concert;

// Outputs the right way to use the program
function usage() {
  console.group("Error! Enter any of the following commands:");
  console.log("node liri.js concert-this '<artist/band name>");
  console.log("node liri.js spotify-this-song '<song name>'");
  console.log("node liri.js movie-this '<movie name>'");
  console.log("node liri.js do-what-it-says");
  console.groupEnd();
}

function findConcerts(arg) {
  var queryURL =
    "https://rest.bandsintown.com/artists/celine+dion/events?app_id=" +
    concertAPI;
  axios
    .get(queryURL)
    .then(function(response) {
      console.log("Fetched Concerts: ");
      var concerts = [];
      response.data.forEach((element) => {
        var m = moment(element.datetime, "MM/DD/YYYY");
        concerts.push({
          Venue: element.venue.name,
          Location:
            element.venue.city +
            ", " +
            element.venue.region +
            ", " +
            element.venue.country,
          Date: m.format()
        });
      });
      console.table(concerts);
    })
    .catch(function(error) {
      console.log("ERROR" + error);
    });
}
// Executes the entered command
function executeCommand(args) {
  switch (args[0]) {
    case "concert-this":
      console.log("Finding Concert");
      findConcerts(args[1]);
      break;
    case "spotify-this-song":
      console.log("Spotifying");
      break;
    case "movie-this":
      console.log("Finding Moive");
      break;
    case "do-what-it-says":
      console.log("Reading File");
      break;
    default:
      console.log("Command <" + args[0] + "> not found");
      usage();
  }
}

if (process.argv.length <= 2) {
  return usage();
}

var arguments = process.argv.slice(2);
console.log("Arguements: " + arguments);

executeCommand(arguments);

//concert-this

// EXAMPLE
// node liri.js concert-this <artist/band name here>
// API CALL "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
// RETURN
// Name of venue, Venue Location, Date of the Event in ("MM/DD/YYYY")

// spotify-this-song
// node liri.js spotify-this-song "Name of Song"
// RETURN
// Artist(s), Name of the Song, Preview link of the song from spotify, the album that song is from
// CONDITIONALS
// No song, default "The Sign" by Ace of Base

// movie-this
// node liri.js movie-this "movie name"
// RETURN
// Title of the movie, Year the movie came out, IMDB Rating of the Movie, Rotten Tomatoes Rating of the Movie, Country where the movie was produced, langauge of the movie, plot of the movie, actors in the movie
// CONDITIONALS
// No movie, default to "Mr. Nobody"

// do-what-it-says
// node liri.js do-what-it-says
// using the fs node package read what is inside the random.txt file and make the calls that way
