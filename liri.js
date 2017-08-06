//npm packages
var fs = require('fs');
var colors = require('colors/safe');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

//inputs
var action = process.argv[2];
var searchQuery = process.argv[3];
var movieName;
var songName;
// var nodeArgs = process.argv; 
//     for (var i = 2; i < nodeArgs.length; i++) {
// 	    if(i > 2 && i < nodeArgs.length) {
//             movieName += movieName + "+" + process.argv[i];
//             songName += songName + "+" + process.argv[i];
// 	 }  else {
//             movieName += nodeArgs[i];
//             songName += nodeArgs[i];
//   }
// }

//keys
var twitKey = new Twitter(keys.TwitterKeys);
var spotKey = new Spotify(keys.spotifyKeys);

'use strict';
var inquirer = require('inquirer');

//prompt to get started
var initialPrompt = {
        type: "list",
        name: "questions",
        message: colors.rainbow("What would you like to do? Choose from: "),
        choices: ["Spotify Song Search", "Movie Search", "Twitter Search", "Surprise Me", "Ask for Help"]
    };

function initialize() {
    console.log(`Let's begin!`);
    actionSearch();
}

function actionSearch() {
    inquirer.prompt(initialPrompt).then(function(answers) {
        var a = [];
         var b = [];
for(var i in answers) {
  if(answers.hasOwnProperty(i)){
    a.push(i);
    b.push(answers[i]);
  }
 console.log(a);
 console.log(b);
 var searchIt = b[0];


function doSomething() {
     console.log(searchIt);
  switch(searchIt) {
  case "Twitter Search": 
      console.log("heyyyy");
      tweeter();
      break;
  case "Spotify Song Search": 
      console.log("heyyyyoo");
      spotify();
      break;
  case "Movie Search": 
      console.log("heyyyyheyy");
      movie();
      break;
  case "Ask for Help":
      console.log("heyyyyhelp");
      help();
      break;        
  case "Surprise Me":
      console.log("heyyyysurprise");
      doWhatever();
      break;
  default:
      console.log("oops");
      break;

  }
  }; 
doSomething();      
    }
    });   
};

function tweeter() {
    var Twitter = require("twitter");
    var request = require("request");
    var keys = require("./keys.js");
    var twitKey = new Twitter(keys.twitterKeys);

    var params = { screen_name: "kari_hermann2", count: 20 }    

      twitKey.get('statuses/user_timeline', params, function(err, tweets,response){
    if(err){
      console.log(err);
    }// end if()

    if(response.statusCode === 200) {
     console.log("I suppose I can give you some tweeeets!");
        for (i = 0; i < tweets.length; i++) {
				console.log(colors.rainbow(`\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n`));
                console.log(colors.yellow(`Tweeted on: ${tweets[i].created_at}`));
                console.log(colors.blue(`Tweet: ${tweets[i].text}`));
                fs.appendFileSync('log.txt', "Tweeted on: " + tweets[i].created_at + "\n"); (err) => {
	                if (err) throw err;}
                fs.appendFileSync('log.txt', "Tweet: " + tweets[i].text); (err) => {
	                if (err) throw err;}
                fs.appendFileSync('log.txt', "\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n"); (err) => {
	                if (err) throw err;}
      } // end for()
    } // end if
  }); //end feed
} 
        

function spotify() {
    var songPrompt = {
        name: "songfind",
        message: colors.rainbow("What song would you like me to search?")
    };

    inquirer.prompt(songPrompt).then(function(answers) {
              var e = [];
              var f = [];
            for(var i in answers) {
            if(answers.hasOwnProperty(i)){
                e.push(i);
                f.push(answers[i]);
  }
 console.log(e);
 console.log(f);
 var searchSong = f[0];

    
    var songName = "";

if (searchSong === "") {
		songName = "The Sign";
	} else {
	    songName = searchSong;
    };    
    
 
    var songParams = { type: 'track', query: `${songName}` };

    spotKey.search(songParams, function(error, data) {

        if (error) { 
            console.log("I am error: " + error); 
        }

        for (i = 0 ; i < 20; i++){
            var albumName = data.tracks.items[i].album.name;
            var songName = data.tracks.items[i].name;
            var artistName = data.tracks.items[i].artists[0].name;
            var previewUrl = data.tracks.items[i].preview_url;
            
            if (previewUrl === null){
                previewUrl = "N/A";
            }
            console.log(`Artist(s): ${artistName}`);
            console.log(`Song Name: ${songName}`);
            console.log(`Preview: ${previewUrl}`);
            console.log(`Album: ${albumName}`);
            console.log(colors.rainbow(`-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`));
            
        }
	});
}
})

function movie() {
    var movieKey = keys.omdbKey.key;
    var moviePrompt = {
        name: "moviefind",
        message: colors.rainbow("What movie would you like me to search?")
    };

    inquirer.prompt(moviePrompt).then(function(answers) {
              var c = [];
              var d = [];
            for(var i in answers) {
            if(answers.hasOwnProperty(i)){
                c.push(i);
                d.push(answers[i]);
  }
 console.log(c);
 console.log(d);
 var searchMove = d[0];

    
    var movieName = "";
if (searchMove === undefined) {
		movieName = "Mr. Nobody";
	} else {
	    movieName = searchMove
	};    

    var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${movieKey}`;

    console.log(queryUrl);
    console.log(movieName);
    request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {
    
      var data = JSON.parse(body);
      var title = data.Title;
      var year = data.Year;
      var rated = data.Rated;
      var ratingLength = data.Ratings.length;
      if (ratingLength === 0) {
        var imdbRating = "Sorry this movie is yet to be rated."
      } else {
        var imdbRating = data.Ratings[0].Value;
      }
     if (ratingLength > 1) {
        var tomatoRating = data.Ratings[1].Value;
      } else {
      var tomatoRating = "No one cared enough to rate this movie.";
      }
      var country = data.Country;
      var language = data.Language;
      var plot = data.Plot;
      var actors = data.Actors;

      //console.log info
      console.log(colors.rainbow("Title: " + title));
      console.log(colors.red("Year: " + year));
      console.log(colors.red("Rated: " + rated));
      console.log(colors.yellow("Country: " + country));
      console.log(colors.yellow("Language " + language));
      console.log(colors.green("Plot: " + plot));
      console.log(colors.green("Imdb Rating: " + imdbRating));
      console.log(colors.blue("Tomato Rating: " + tomatoRating));
      console.log(colors.blue("Actors: " + actors));
     //append to text file
      fs.appendFileSync("log.txt", "\n");
      fs.appendFileSync("log.txt", "\n" + "Title: " + title + "\n");
      fs.appendFileSync("log.txt", "\n" + "Rated: " + rated + "\n");
      fs.appendFileSync("log.txt", "\n" + "Country: " + country + "\nc");
      fs.appendFileSync("log.txt", "\n" + "Language: " + language + "\n");
      fs.appendFileSync("log.txt", "\n" + "Plot: " + plot + "\n");
      fs.appendFileSync("log.txt", "\n" + "Imdb Rating: " + imdbRating + "\n");
      fs.appendFileSync("log.txt", "\n" + "Tomato Rating: " + tomatoRating + "\n");
      fs.appendFileSync("log.txt", "\n" + "Actors: " + actors + "\n");
  }
});
}
    })
}

function doWhatever() {
fs.readFile("random.txt", "utf-8", function(err, data) {
    if (err){
            console.log(`Read File Error: ${error}`);
        } else {
            var randomArr = data.split(",");
              var g = [];
              var h = [];
            for(var i in randomArr) {
            if(answers.hasOwnProperty(i)){
                g.push(i);
                h.push(answers[i]);
  }
 console.log(g);
 console.log(h);
 var searchSongRandom = h[0];
            }
            var randomArr = data.split(",");
            spotify();
        }
})
}

function help() {
    
}

}

initialize();