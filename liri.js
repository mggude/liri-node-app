var command = process.argv[2];
var fs = require("fs");
var operator = process.argv.slice(3).join(" ");

function concertThis(artist) {
    var moment = require('moment');
    var axios = require("axios");
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (events) {
            var concerts = [];
            for (var i = 0; i < events.data.length; i++) {
                var dateTime = events.data[i].datetime;
                var eventDate = moment(dateTime);
                var concertData = {
                    Artist: events.data[i].lineup,
                    Venue: events.data[i].venue.name,
                    City: events.data[i].venue.city,
                    Date: eventDate.format("MM/DD/YYYY"),
                }
                concerts.push(concertData);
            } 
            for (var i = 0; i < concerts.length; i++) {
                logResponseData(concerts[i]);
                console.log();
            }
            
            appendApiDataToLog("./DB/bandsintown_storage.txt", concerts);
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
        var songs = [];
        for (var i = 0; i < data.length; i++) {
            var songsData = {
                Artist: data[i].album.artists[0].name,
                Title: data[i].name,
                Preview: data[i].preview_url,
                Album: data[i].album.name
            }
            songs.push(songsData);
        }
        for (var i = 0; i < songs.length; i++) {
            logResponseData(songs[i]);
            console.log();
        }
        appendApiDataToLog("./DB/spotifySongs_storage.txt", songs);
    });
}

function movieThis(movie) {
    var axios = require("axios");
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            var movieData = {
                Title: response.data.Title,
                Year: response.data.Year,
                Rating: response.data.imdbRating,
                Country: response.data.Country,
                Language: response.data.Language,
                Plot: response.data.Plot,
                Actors: response.data.Actors
            }
            logResponseData(movieData);
            appendApiDataToLog("./DB/omdb_storage.txt", movieData);
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
                console.log(artist);
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
        // If no movie is provided then your program will default to "Mr. Nobody"
        if (!operator) {
            movie = "Mr Nobody";
        }
        movieThis(movie);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log("Hit default!")
        return false;
}

function appendApiDataToLog(fileName, data) {
    var parsedData = JSON.stringify(data, null, 2);
    fs.appendFile(fileName, parsedData, function (err) {
        if (err) throw err;
        console.log();
    });
}

function logResponseData(data) {
    for (key in data) {
        console.log(`${key}: ${data[key]}`);
    }
}