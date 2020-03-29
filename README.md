# liri-node-app

### **concert-this**

EXAMPLE: <br> `node liri.js concert-this <artist/band name here> // API CALL`
"https://rest.bandsintown.com/artists/" + artist +
"/events?app_id=codingbootcamp" <br> RETURN:

1. Name of venue
2. Venue Location
3. Date of the Event in ("MM/DD/YYYY")

### **spotify-this-song**

EXAMPLE: `node liri.js spotify-this-song "Name of Song"`

RETURN:

1. Artist(s)
2. Name of the Song
3. Preview link of the song from spotify
4. the album that song is from

CONDITIONALS

**if no song entered,default "The Sign" by Ace of Base**

### movie-this

Example `node liri.js movie-this "movie name"`

RETURN

1. Title of the movie
2. Year the movie came out
3. IMDB Rating of the Movie
4. Rotten Tomatoes Ratingb of the Movie
5. Country where the movie was produced
6. langauge of the movie
7. plot of the movie
8. actors in the movie

CONDITIONALS

**If no movie entered, default to "Mr.Nobody"**

// do-what-it-says // node liri.js do-what-it-says // using the fs node package
read what is inside the random.txt file and make the calls that way
