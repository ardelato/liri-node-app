require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

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
