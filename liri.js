require("dotenv").config();

const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

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

function logInfo(command, data) {
  var outPutString;

  outPutString =
    moment().format("MM-DD-YYYY, h:mm:ss a") +
    "\n\n Command: " +
    command +
    "\n\t\t" +
    data +
    "\n-------------------------------------------------------------------------------------\n";
  fs.appendFile("./log.txt", outPutString, function(error) {
    if (error) {
      console.log("ERROR LOGGING");
    }
  });
}

function findConcerts(arg) {
  if (!arg) {
    return usage();
  }
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    arg.replace(" ", "+") +
    "/events?app_id=" +
    concertAPI;
  axios
    .get(queryURL)
    .then(function(response) {
      var concert = response.data;
      console.log("Fetched Concerts: ");
      var concerts = [];
      var logData = "";
      concert.forEach((element) => {
        var data = {
          Venue: element.venue.name,
          Location:
            element.venue.city +
            ", " +
            element.venue.region +
            ", " +
            element.venue.country,
          Date: moment(element.datetime).format("MM/DD/YYYY")
        };
        logData += JSON.stringify(data) + "\n\t\t";
        concerts.push(data);
      });
      console.table(concerts);
      logInfo("concert-this," + arg, logData);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function findSong(arg) {
  if (!arg) {
    // Defaulting to "The Sign" by Ace of Base
    spotify
      .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
      .then(function(data) {
        var logData = "";
        var jData = {
          Artists: "Ace of Base",
          Song: "The Sign",
          Link: data.external_urls.spotify,
          Album: data.album.name
        };
        logData = JSON.stringify(jData);
        console.table(jData);
        logInfo("spotify-this-song, Default: The Sign by Ace of Base", logData);
      })
      .catch(function(error) {
        console.error("Error: " + error);
      });
  } else {
    spotify.search({ type: "track", query: arg }, function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.group("Found Songs");
      var logData = "";
      data.tracks.items.forEach((element) => {
        var data;
        var artists = "";
        // console.log(element);
        element.artists.forEach((artist, idx, array) => {
          if (idx === array.length - 1) {
            artists += artist.name;
          } else {
            artists += artist.name + " & ";
          }
        });
        data = {
          Name: element.name,
          Artists: artists,
          Preview: element.preview_url,
          Album: element.album.name
        };
        console.group(element.name);
        console.log("Artists: " + artists);
        console.log("Preview: " + element.preview_url);
        console.log("Album: " + element.album.name);
        console.groupEnd();

        logData += JSON.stringify(data) + "\n\t\t";
      });
      logInfo("spotify-this-song," + arg, logData);
      console.groupEnd();
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
      var data;
      var logData = "";
      var rating = movie.Ratings.find((r) => {
        return r.source === "Rotten Tomatoes";
      });
      data = {
        Title: movie.Title,
        Year: movie.Year,
        IMDB: movie.imdbRating,
        "Rotten Tomatoes": rating ? rating.Value : "N/A",
        Country: movie.Country,
        Actors: movie.Actors,
        Plot: movie.Plot
      };
      logData = JSON.stringify(data);
      logInfo("movie-this," + arg, logData);
      console.table(data);
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function readFile() {
  fs.readFile("random.txt", "utf8", (error, data) => {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    var instructions = data.split(",");

    instructions[1] = JSON.parse(instructions[1]);
    console.log(instructions);
    executeCommand(instructions);
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
      readFile();
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
