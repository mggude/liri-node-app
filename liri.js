// code to read and set any environment variables with the dotenv package
// require("dotenv").config();
var command = process.argv[2];
// var fs = require("fs");
operator = process.argv.slice(3).join(" ");

function concertThis() {
    var moment = require('moment');
    var axios = require("axios");
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (events) {
            for (var i = 0; i < events.data.length; i++) {
                var dateTime = events.data[i].datetime;
                var eventDate = moment(dateTime);
                console.log(`Venue Name: ${events.data[i].venue.name}`);
                console.log(`Venue Location: ${events.data[i].venue.city}, ${events.data[i].venue.country}`);
                console.log(`Date of the Event: ${eventDate.format("MM/DD/YYYY")}\n`);
            }
        }
    );
}

function spotifyThis(song) {
    require("dotenv").config();
    var Spotify = require("node-spotify-api");
    var keys = require("./keys");
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items);
    });

    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from

    // If no song is provided then your program will default to "The Sign" by Ace of Base.
}

function movieThis() {
    var axios = require("axios");
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log(
                `Movie title: ${response.data.Title} \nReleased: ${response.data.Year} \nIMDB Rating: ${response.data.imdbRating} \nRotten Tomatoes Rating: ${response.data.Ratings[1].Value} \nProduced in: ${response.data.Country} \nLanguage: ${response.data.Language} \nPlot: ${response.data.Plot} \nActors: ${response.data.Actors}`

            );
        }
    );
}

function doThis() {
    // if "do-what-it-says"
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (err, data) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
    });
}

switch (command) {
    case "concert-this":
        var artist = operator;
        concertThis(artist);
        break;
    case "spotify-this-song":
        var song = operator
        spotifyThis(song);
        break;
    case "movie-this":
        var movie = operator;
        movieThis(movie);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log("Hit default!")
        return false;
}