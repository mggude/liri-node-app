// code to read and set any environment variables with the dotenv package
// require("dotenv").config();
var command = process.argv[2];
// var fs = require("fs");
var operator = process.argv.slice(3).join(" ");

function concertThis(artist) {
    var moment = require('moment');
    var axios = require("axios");
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (events) {
            for (var i = 0; i < events.data.length; i++) {
                var dateTime = events.data[i].datetime;
                var eventDate = moment(dateTime);
                console.log(`Artist: ${events.data[i].lineup} \nVenue Name: ${events.data[i].venue.name} \nVenue Location: ${events.data[i].venue.city}, ${events.data[i].venue.country} \nDate of the Event: ${eventDate.format("MM/DD/YYYY")}\n`);
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
        var data = data.tracks.items;
        for (var i = 0; i < data.length; i++) {
            console.log(`Artist: ${data[i].album.artists[0].name} \nSong Title: ${data[i].name} \nSpotify Preview Link: ${data[i].preview_url} \nAlbum Title: ${data[i].album.name}\n`);
        }
    });
}

function movieThis(movie) {
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
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var newSearch = data.split(",");
        var newCommand = newSearch[0];
        var newOperator = newSearch[1];

        switch (newCommand) {
            case "concert-this":
                var artist = newOperator;
                concertThis(artist);
                break;
            case "spotify-this-song":
                var song = newOperator;
                spotifyThis(song);
                break;
            case "movie-this":
                var movie = newOperator;
                movieThis(movie); 
                break;
            default:
                console.log("Hit default!");
                return false;
        }
    });
}

switch (command) {
    case "concert-this":
        var artist = operator;
        concertThis(artist);
        break;
    case "spotify-this-song":
        var song = operator
        // If no song is provided then your program will default to "The Sign" by Ace of Base.
        if (!operator) {
            song = "The Sign Ace of Base";
        }
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