var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
// var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var colors = require("colors/safe");
var prompt = require("prompt");

var twitKey = new Twitter({
	consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// var spotKey = new Spotify({
// 	   id: keys.spotifyKeys.id,
//     secret: keys.spotifyKeys.secret
// });

var inputs = process.argv;
var action = process.argv[2];
var query = process.argv[3];


prompt.message = colors.blue("Type one of the following: my-tweets, spotify-this-song, movie-this, or do-whateer-it-says");
prompt.delimiter = colors.cyan("\n");

prompt.start();
// // //asks the user what option they have chosen from the information given in the prompt message
prompt.get({
  properties: {
      userInput: {
          description: colors.rainbow('What do you choose?')
      }
  }
}, function(err, result){
  userInput = result.userInput;
  //based on what the user inputs different things are done

  //if user enters tweets it will run the myTwitter function
  if(userInput == "my-tweets"){
      tweeter();
  } 
// //   //if the user enters spotify-this-song it will prompt you and ask for the song you want to look up and then it will run the mySpotify function based on those results. if the user doesnt enter a song it defaults to whats my age again and gets that information
  else if(userInput == "spotify-this-song"){
      prompt.get({
          properties: {
              userSelection: {
                  description: colors.rainbow('What song do you want to look up?')
              }
          }
      }, function(err, result){

          if(result.userSelection === ""){
              userSelection = "I want it that way";
          } else{
              userSelection = result.userSelection;
          }
          spotify(userSelection);
      });
  } 
// //   // if the user selects movie it will prompt the user to state what movie they want to look up and then it will get that information from omdb api if the prompt is left blank the function will default and look up Mr Nobody and reutrn that information
  else if(userInput == "movie-this"){
      prompt.get({
          properties: {
              userSelection: {
                  description: colors.rainbow('What movie do you want to look up?')
              }
          }
      }, function(err, result){
          if (result.userSelection === " "){
              userSelection = "Mr. Nobody";
          } else {
              userSelection = result.userSelection;
              movie(userSelection);
          }
      });
// //   //if the user chooses 'surprise' then the function lastOption is run using the information from the random.txt file
  } else if(userInput == "do-what-it-says"){
      doWhatever();
  };
});

startLiri();

function startLiri() {
	switch (action) {
		case 'my-tweets':
			tweeter();
			break;

		case 'spotify-this-song':
			spotify();
			break;

		case 'movie-this':
			movie();
			break;

		case 'do-what-it-says':
			doWhatever();
			break;
		case " ":
			console.log("Please try again!");
			break;	
}
}

function tweeter() {
	var params = { screen_name: "kari_hermann2", count: 20 }
	 twitKey.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error;

        console.log("I suppose I can give you some tweeeets!");
        for (i = 0; i < tweets.length; i++) {
				console.log(colors.rainbow("\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n"));
                console.log("Tweeted on: " + tweets[i].created_at);
                console.log("Tweet:" + tweets[i].text);
                fs.appendFileSync('log.txt', "Tweeted on: " + tweets[i].created_at + "\n"); (err) => {
	                if (err) throw err;}
                fs.appendFileSync('log.txt', "Tweet: " + tweets[i].text); (err) => {
	                if (err) throw err;}
                fs.appendFileSync('log.txt', "\n-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n"); (err) => {
	                if (err) throw err;}
		}
	 });
}



// function spotify() {
//     // define search parameters
//     // options for type: artist, album or track
//     var searchString = "The Sign"; // search parameter
//     if (search) {
//         searchString = search;
//     }
//     var songParams = { type: 'track', query: `${searchString}` };

//     spotKey.search(songParams, function(error, data) {
//         if (error) { console.log("I am error: " + error); }

//         for (i = 0 ; i < 20; i++){
//             var albumName = data.tracks.items[i].album.name;
//             var songName = data.tracks.items[i].name;
//             var artistName = data.tracks.items[i].artists[0].name;
//             var previewUrl = data.tracks.items[i].preview_url;
            
//             if (previewUrl === null){
//                 previewUrl = "N/A";
//             }
//             console.log(`Artist(s): ${artistName}`);
//             console.log(`Song Name: ${songName}`);
//             console.log(`Preview: ${previewUrl}`);
//             console.log(`Album: ${albumName}`);
//             console.log("------------------------------");
//         }
// 	});
// }

function movie(){
// //   //use request to access the omdb api and input the type variable that is defined above as the movie we are searching for
    var movieName = process.argv;
    var movieKey = keys.omdbKey.key;

    var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${movieKey}`;

    request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
      
// //       //JSON.parse the body of the result and store it in the variable json for easier access
      json = JSON.parse(body);
// //       //console.log each of the different things we need to get from the omdb api and add a title for each item and use the colors npm to make the title name a different color than the result for better user access
      console.log(colors.blue('Title: ') + json.Title);
      console.log(colors.blue('Year: ') + json.Year);
      console.log(colors.blue('Rated: ') + json.Rated);
      console.log(colors.blue('Country: ') + json.Country);
      console.log(colors.blue('Language: ') + json.Language);
      console.log(colors.blue('Director: ') + json.Director);
      console.log(colors.blue('Actors: ') + json.Actors);
      console.log(colors.blue('Plot: ') + json.Plot);
      console.log(colors.blue('imdbRating: ') + json.imdbRating);
      console.log(colors.blue('Rotten Tomatoes Rating: ') + json.tomatoRating);
      console.log(colors.blue('Rotten Tomatoes URL: ') + json.tomatoURL);

// //       //append the results to the log.txt file
      fs.appendFileSync('log.txt', "\n");
      fs.appendFileSync("log.txt", "\n" + "Title: " + json.Title + "\n");
      fs.appendFileSync("log.txt", "Year: " + json.Year + "\n");
      fs.appendFileSync("log.txt", "Rated: " + json.Rated + "\n");
      fs.appendFileSync("log.txt", "Country: " + json.Country + "\n");
      fs.appendFileSync("log.txt", "Language: " + json.Language + "\n");
      fs.appendFileSync("log.txt", "Director: " + json.Director + "\n");
      fs.appendFileSync("log.txt", "Actors: " + json.Actors + "\n");
      fs.appendFileSync("log.txt", "Plot: " + json.Plot + "\n");
      fs.appendFileSync("log.txt", "imdbRating: " + json.imdbRating + "\n");
      fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + json.tomatoRating + "\n");
      fs.appendFileSync("log.txt", "Rotten Tomatoes URL: " + json.tomatoURL + "\n");
    }
  })
}


// function movie(){
//     var query = process.argv;
//     var movieKey = keys.omdbKey.key;

//     var queryUrl = `http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=${movieKey}`;

//     request(queryUrl, function(error, response, body) {

//     // If the request is successful
//     if (!error && response.statusCode === 200) {

//         //    * Title of the movie.
//         //    * Year the movie came out.
//         //    * IMDB Rating of the movie.
//         //    * Rotten Tomatoes Rating of the movie.
//         //    * Country where the movie was produced.
//         //    * Language of the movie.
//         //    * Plot of the movie.
//         //    * Actors in the movie.

//         // Then log the Release Year for the movie
//         console.log("---------------------------------");
//         console.log("Title: " + JSON.parse(body).Title);
//         console.log("Year: " + JSON.parse(body).Year);
//         console.log("Country: " + JSON.parse(body).Country);
//         console.log("Language: " + JSON.parse(body).Language);
//         console.log("Release date: " + JSON.parse(body).Released);
//         console.log("Plot: " + JSON.parse(body).Plot);
//         console.log("Ratings:");
//         if (JSON.parse(body).Ratings[0].Value === [null]) {
//             return console.log("N/A  <-- IMDB");
//         } else {
//             console.log(JSON.parse(body).Ratings[0].Value + " <-- IMDB");
//         }
//         if (JSON.parse(body).Ratings[1].Value === null) {
//             return console.log("N/A  <-- Rotten Tomatoes");
//         } else {
//             console.log(JSON.parse(body).Ratings[1].Value + " <-- Rotten Tomatoes");
//         };
//         console.log("Plot: " + JSON.parse(body).Plot);
//         console.log("Actors: " + JSON.parse(body).Actors);
//         console.log("---------------------------------");
//     };
//   });
// }

function doWhatever(){
    fs.readFile("random.txt", "utf-8", function(err, data){
        if (err){
            console.log(`Read File Error: ${error}`);
        };

        var commandArr = data.split(",");
        command = commandArr[0];
        search = commandArr[1];
        startLiri();
    });
}
