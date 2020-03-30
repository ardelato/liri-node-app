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
    "https://rest.bandsintown.com/artists/" +
    arg.replace(" ", "+") +
    "/events?app_id=" +
    concertAPI;
  axios
    .get(queryURL)
    .then(function(response) {
      var movie = response.data;
      console.log("Fetched Concerts: ");
      var concerts = [];
      movie.forEach((element) => {
        concerts.push({
          Venue: element.venue.name,
          Location:
            element.venue.city +
            ", " +
            element.venue.region +
            ", " +
            element.venue.country,
          Date: moment(element.datetime).format("MM/DD/YYYY")
        });
      });
      console.table(concerts);
    })
    .catch(function(error) {
      console.log(error.movie.errorMessage);
    });
}

function findSong(arg) {
  if (!arg) {
    // Defaulting to "The Sign" by Ace of Base
    spotify
      .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
      .then(function(data) {
        console.table({
          Artists: "Ace of Base",
          Song: "The Sign",
          Link: data.external_urls.spotify,
          Album: data.album.name
        });
      })
      .catch(function(error) {
        console.error("Error: " + error);
      });
  } else {
    spotify.search({ type: "track", query: arg }, function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      var songs = [];
      data.tracks.items.forEach((element) => {
        var artists = "";
        element.artists.forEach((artist, idx, array) => {
          if (idx === array.length - 1) {
            artists += artist.name;
          } else {
            artists += artist.name + " & ";
          }
        });

        songs.push({
          Artists: artists,
          Song: element.name,
          Link: element.external_urls.spotify,
          Album: element.album.name
        });
      });
      console.table(songs);
    });
  }
}

function findMovie(arg) {
  var query;
  if (!arg) {
    query = "Mr. Nobody";
  } else {
    query = arg;
  }
  axios
    .get("http://www.omdbapi.com/?t=" + query + "&apikey=" + keys.omdb)
    .then(function(response) {
      var movie = response.data;

      var rating = movie.Ratings.find((r) => {
        return r.source === "Rotten Tomatoes";
      });
      console.table({
        Title: movie.Title,
        Year: movie.Year,
        IMDB: movie.imdbRating,
        "Rotten Tomatoes": rating ? rating.Value : "N/A",
        Country: movie.Country,
        Actors: movie.Actors,
        Plot: movie.Plot
      });
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

// Executes the entered command
function executeCommand(args) {
  switch (args[0]) {
    case "concert-this":
      console.log("Finding Concerts");
      findConcerts(args[1]);
      break;
    case "spotify-this-song":
      console.log("Spotifying");
      findSong(args[1]);
      break;
    case "movie-this":
      console.log("Finding Moive");
      findMovie(args[1]);
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
