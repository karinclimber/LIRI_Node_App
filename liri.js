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
        
        // if (answers.value === "Spotify Song Search") {
        //     console.log(colors.red(`Great! What song would you like me to find?`));
        //     spotify();
        // }
        // else if (answers.value === "Movie Search") {
        //     console.log(colors.yellow(`Great! What movie would you like me to find?`));
        //     movie();
        // }
        // if (b[0] === 'Twitter Search' ) {
            
            //         tweeter();
            // }
        // else if (answers.value === "Surprise Me") {
        //     console.log(colors.blue(`Alright, here's something cool: `));
        //     doWhatever();
        // }
        // else if (answers.value === "Ask for Help") {
        //     console.log(colors.red(`Sorry you're confused. Let me help!`));
        //     help();
        // }
        // else {
        //     console.log(colors.red(`Invalid Entry`));
        // }


var spotify = function() {

}

var movie = function() {

}

function doWhatever() {

}

function help() {
    
}




initialize();