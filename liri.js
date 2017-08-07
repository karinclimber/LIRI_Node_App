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
//get the bot running
function initialize() {
	console.log(colors.white(`Let's get started. Choose 'Ask for Help' for instructions!`));
	actionSearch();
}
//prompt to decide which fucntion to run, switch function 
function actionSearch() {
	inquirer.prompt(initialPrompt).then(function(answers) {
		var a = [];
		var b = [];
		for (var i in answers) {
			if (answers.hasOwnProperty(i)) {
				a.push(i);
				b.push(answers[i]);
			}
			// console.log(a);
			// console.log(b);
			var searchIt = b[0];

			function doSomething() {
				console.log(searchIt);
				switch (searchIt) {
					case "Twitter Search":
						// console.log("heyyyy");
						tweeter();
						break;
					case "Spotify Song Search":
						// console.log("heyyyyoo");
						spotify();
						break;
					case "Movie Search":
						// console.log("heyyyyheyy");
						movie();
						break;
					case "Ask for Help":
						// console.log("heyyyyhelp");
						help();
						break;
					case "Surprise Me":
						// console.log("heyyyysurprise");
						doWhatever();
						break;
					default:
						// console.log("oops");
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
	var params = {
		screen_name: "kari_hermann2",
		count: 20
	}
	twitKey.get('statuses/user_timeline', params, function(err, tweets, response) {
		if (err) {
			console.log(err);
		} // end of error/if statement
		if (response.statusCode === 200) {
			console.log(colors.rainbow("Tweets for you: "));
			for (i = 0; i < tweets.length; i++) {
				console.log(colors.rainbow(`\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n`));
				console.log(colors.yellow(`Tweeted on: ${tweets[i].created_at}`));
				console.log(colors.blue(`Tweet: ${tweets[i].text}`));
				fs.appendFileSync('log.txt', "Tweeted on: " + tweets[i].created_at + "\n");
				(err) => {
					if (err) throw err;
				}
				fs.appendFileSync('log.txt', "Tweet: " + tweets[i].text);
				(err) => {
					if (err) throw err;
				}
				fs.appendFileSync('log.txt', "\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n");
				(err) => {
					if (err) throw err;
				}
			}
		}
	});
}

function spotify() {
	var songPrompt = {
		name: "songfind",
		message: colors.rainbow("What song would you like me to search?")
	};
	inquirer.prompt(songPrompt).then(function(answers) {
		var e = [];
		var f = [];
		for (var i in answers) {
			if (answers.hasOwnProperty(i)) {
				e.push(i);
				f.push(answers[i]);
			}
			// console.log(e);
			// console.log(f);
			var searchSong = f[0];
			var songName = "";
			if (searchSong === "") {
				songName = "Ace of Base The Sign";
			} else {
				songName = searchSong;
			};
			var songParams = {
				type: 'track',
				query: `${songName}`
			};
			spotKey.search(songParams, function(error, data) {
				if (error) {
					console.log(error);
				}
				for (i = 0; i < 5; i++) {
					var albumName = data.tracks.items[i].album.name;
					var songName = data.tracks.items[i].name;
					var artistName = data.tracks.items[i].artists[0].name;
					var previewUrl = data.tracks.items[i].preview_url;
					if (previewUrl === null) {
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
}

function movie() {
	var moviePrompt = {
		name: "moviefind",
		message: colors.rainbow("What movie would you like me to search?")
	};
	inquirer.prompt(moviePrompt).then(function(answers) {
		var c = [];
		var d = [];
		for (var i in answers) {
			if (answers.hasOwnProperty(i)) {
				c.push(i);
				d.push(answers[i]);
			}
			// console.log(c);
			// console.log(d);
			var searchMove = d[0];
			var movieKey = keys.omdbKey.key;
			var movieName = "";
			if (searchMove.length === 0) {
				movieName = "Mr. Nobody";
			} else {
				movieName = searchMove;
			};
			var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${movieKey}`;
			// console.log(queryUrl);
			console.log(movieName);
			request(queryUrl, function(error, response, body) {
				// If the request is successful
				if (!error && response.statusCode === 200) {
					//help from Corey! Breaking down movie response and displaying in the console
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
		if (err) {
			console.log("ERROR");
		} else {
			var randomArr = data.split(",");
			console.log(randomArr[1])
				// for (var i in randomArr) {
				// if (data.hasOwnProperty(i)) {
				//     g.push(i);
				//     h.push(data[i]);
				// }
		}
		//search the random.txt file song
		var searchSongRandom = randomArr[1];
		var songParams = {
			type: 'track',
			query: `${searchSongRandom}`
		};
		spotKey.search(songParams, function(error, data) {
			if (error) {
				console.log("I am error: " + error);
			}
			for (i = 0; i < 5; i++) {
				var albumName = data.tracks.items[i].album.name;
				var songName = data.tracks.items[i].name;
				var artistName = data.tracks.items[i].artists[0].name;
				var previewUrl = data.tracks.items[i].preview_url;
				if (previewUrl === null) {
					previewUrl = "N/A";
				}
				console.log(`Artist(s): ${artistName}`);
				console.log(`Song Name: ${songName}`);
				console.log(`Preview: ${previewUrl}`);
				console.log(`Album: ${albumName}`);
				console.log(colors.rainbow(`-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+`));
			}
		});
	})
}
//suggestion from Corey
//help function to show user how to use
function help() {
	console.log(`Do You Need Help?

LIRI is a search tool that searches a database and returns a result based on your search query. You can look up a movie, a song, or the top twenty tweets of the provided user. I will eventually be adding the option to search any user’s tweets.

To run LIRI, run node.js liri.js.

You will be prompted as such:

Let's begin!
? What would you like to do? Choose from:  (Use arrow keys)
  Spotify Song Search
  Movie Search
  Twitter Search
  Surprise Me
  Ask for Help

Based on your choice, you will be able to search a movie, song, my tweets, or a surprise!

Movie Search will then prompt you for a movie name. If you provide one, for example, “Titanic,” you will see:

Title: Titanic
Year: 1997
Rated: PG-13
Country: USA
Language English, Swedish
Plot: A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.
Imdb Rating: 7.7/10
Tomato Rating: 88%
Actors: Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates

If you do not provide a movie, I will surprise you with a movie. 

Song Search will then prompt you for a song name. If you provide one, for example, “Bohemian Rhapsody,” you will see:

Artist(s): Queen
Song Name: Bohemian Rhapsody - Digital Remaster
Preview: N/A
Album: The Platinum Collection,

As well as the to 4 other versions that Spotify has of the song or a similar title. If you do not provide one, I will again surprise you with a song. 

Twitter Search will provide my last 20 tweets. I will eventually provide the option to search all tweets!

Let me know if you have any other questions!
`)
}
initialize();