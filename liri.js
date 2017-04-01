// add required files
var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
var omdbApi = require("imdb-api");
var fs = require("fs-extra");

// load keys for twitter
var twitKeys = require("./keys.js");

//console menu set up

console.log("---------------------------------------");
console.log("----        Welcome to LIRI        ----");
console.log("----                               ----");
console.log("----       spotify-this-song       ----");
console.log("----                               ----");
console.log("----           my-tweets           ----");
console.log("----                               ----");
console.log("----           movie-this          ----");
console.log("----                               ----");
console.log("----        do-what-it-says        ----");
console.log("---------------------------------------");

// get command line values
var choice = process.argv[2];
var userInput = process.argv[3];


//check for input value and decide action
if (choice == "my-tweets") {

    twitterCall();
} else if (choice == "spotify-this-song" && userInput != undefined) {

    spot(userInput);

} else if (choice == "movie-this" && userInput != undefined) {

    imdb(userInput);

} else if (choice == "do-what-it-says") {

    yourWay();

} else {

    console.log(choice + " Is not a valid request!");

    return;
};

//twitter function
function twitterCall() {

    var client = new Twitter(twitKeys.twitterKeys);

    var params = {
        count: 20,
        user_id: "myccp",
        screen_name: "myccp"


    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            //display tweets
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet #" + i + ": " + tweets[i].text);
            }

        } else {
            //log errors
            console.log(error);
        }

    });


};

//spotify function
function spot(userInput) {

    spotify.search({
        type: 'track',
        query: userInput
    }, function(err, data) {
        if (err) {
            //log errors
            console.log('Error occurred: ' + err);
            return;
        }




        // check for no record found
        if (data.tracks.total > 0) {

            //if record found console.log values

            var artist = data.tracks.items[0].artists[0].name;
            var track = data.tracks.items[0].name;
            var preview = data.tracks.items[0].preview_url;


            console.log("Artist Name : " + artist);
            console.log("Song Name : " + userInput);
            console.log("Album Name : " + track);
            console.log("Preview Url : " + preview);

        } else {
            // alert error
            console.log("Not A Valid Search !");
            console.log(userInput + " is jibberish! Try Again!");
        }


    });

};

//function imdb api
function imdb(userInput) {

    omdbApi.getReq({
        name: userInput
    }, function(err, res) {

        if (err) {
            // log errors
            console.log(err);
            return;

        }

        //get values
        var movie = res.title;
        var movYear = res.released;
        var movRate = res.rated;
        var movPlot = res.plot;
        var movCountry = res.country;
        var movLang = res.languages;
        var movActors = res.actors;
        var movTomato = res.ratings[1].Source + "  " + res.ratings[1].Value;
        var movUrl = res.imdburl;
        //display values
        console.log("* Movie Title : " + movie);
        console.log("* Release Year : " + movYear);
        console.log("* Movie Rating : " + movRate);
        console.log("* Movie Country : " + movCountry);
        console.log("* Movie Language : " + movLang);
        console.log("* Movie Plot : " + movPlot);
        console.log("* Movie Actors : " + movActors);
        console.log("* Rotten Tomatoes : " + movTomato);
        console.log("* Movie Url : " + movUrl);


    });

};

//function your way
function yourWay() {

    fs.readFile("random.txt", "utf8", function(err, data) {

        // log errors
        if (err) {

            // log errors
            console.log(err);

        }



        var dataArr = data.split(",");


        var userInput = dataArr[1];



        spot(userInput);


    });

};

//end of line
