exports.run = (inv, message, args) => {
var filepath = "./trivia.txt";
var anyoneStart = false;
var anyoneStop = false;
var anyoneAnswer = false;
var startTime = 60000;
var hintTime = 30000;
var skipTime = 45000;
var betweenTime = 15000;

// odii nub he wont understand
var questionNum = 1;
var maxQuestionNum = 150;
var lastRoundWinner = "null";
var roundWinnerScore = 0;
var roundWinnerStreak = 0;
var lastBestTimePlayer = "null";
var lastBestTime = 0;
var lastBestStreakPlayer = "null";
var lastBestStreak = 0;
var players = [];
var names = [];
var scores = [];
var streaks = [];
var times = [];
var bestTimes = [];



var Discord = require("discord.js");
var fs = require("fs");
var inv = new Discord.Client();
var trivia = false;
var paused = false;
var startQuestionNum = questionNum;
var totalQuestions = 0;
var questionTimestamp = 0;
var answerText = "";
var answerArray = [];
var answered = true;
var questionTimeout;
var hintTimeout;
var skipTimeout;
var triviaChannel;
var allQuestionNum;
var attempts = 0;
var special = ["ß", "ç", "ð", "ñ", "ý", "ÿ", "à", "á", "â", "ã", "ä", "å", "æ", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ò", "ó", "ô", "õ", "ö", "ù", "ú", "û", "ü", "ẞ", "Ç", "Ð", "Ñ", "Ý", "Ÿ", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ò", "Ó", "Ô", "Õ", "Ö", "Ù", "Ú", "Û", "Ü"];

function getLine(line_no) {
	var data = fs.readFileSync("shuffled.txt", "utf8");

	var lines = data.split("\n");

	if(+line_no > lines.length){
		throw new Error("File end reached without finding line");
	}

	return lines[+line_no];
}

function startTrivia(message) {
	console.log("Started the trivia");
	randomizeQuestions();
	startQuestionNum = questionNum;
	if (totalQuestions === 0) {
		totalQuestions = maxQuestionNum - questionNum;
	} else { //if second round or after, initialize data
		questionNum = 0;
		startQuestionNum = 0;
		lastRoundWinner = "null";
		roundWinnerScore = 0;
		roundWinnerStreak = 0;
		lastBestTimePlayer = "null";
		lastBestTime = 0;
		lastBestStreakPlayer = "null";
		lastBestStreak = 0;
		players = [];
		names = [];
		scores = [];
		streaks = [];
		times = [];
		bestTimes = [];
	}
	inv.sendMessage(message, "Attention, " + message.author.username + ", the trivia round is starting. (" + totalQuestions + " questions out of " + allQuestionNum + ")", {tts: true});
	trivia = true;
	questionTimeout = setTimeout(askQuestion, startTime, message);
}

function endTrivia(message, finished) {
	clearTimeout(questionTimeout);
	clearTimeout(hintTimeout);
	clearTimeout(skipTimeout);
	if (finished) {
		inv.sendMessage(message, "Attention, " + message.author.username + totalQuestions + " questions have been reached. The trivia round is ending.", {tts: true});
	} else {
		inv.sendMessage(message, "Attention, " + message.author.username + " the trivia round is ending.", {tts: true});
	}
	var bestStreak = streaks.indexOf(Math.max.apply(Math, streaks)); // get index of player with best streak
	var bestBestTime = bestTimes.indexOf(Math.min.apply(Math, bestTimes)); // get index of player with best best time
	var avgTimes = [];
	for (var i = 0; i < times.length; i++) {
		avgTimes.push(times[i] / scores[i]);
	}
	var bestAvgTime = avgTimes.indexOf(Math.min.apply(Math, avgTimes)); // get index of player with best average time

	inv.sendMessage(message, "**1st Place**: <@" + players[0] + "> **Points**: " + scores[0] + " **Best streak**: " + streaks[0] + " **Avg. time**: " + (avgTimes[0] / 1000).toFixed(3) + " sec **Best time**: " + (bestTimes[0] / 1000).toFixed(3) + " sec\n**2nd Place**: <@" + players[1] + "> **Points**: " + scores[1] + " **Best streak**: " + streaks[1] + " **Avg. time**: " + (avgTimes[1] / 1000).toFixed(3) + " sec **Best time**: " + (bestTimes[1] / 1000).toFixed(3) + " sec\n**3rd Place**: <@" + players[2] + "> **Points**: " + scores[2] + " **Best streak**: " + streaks[2] + " **Avg. time**: " + (avgTimes[2] / 1000).toFixed(3) + " sec **Best time**: " + (bestTimes[2] / 1000).toFixed(3) + " sec\n\n**Best streak**: <@" + players[bestStreak] + "> with " + streaks[bestStreak] + "\n**Best time**: <@" + players[bestBestTime] + "> with " + (bestTimes[bestBestTime] / 1000).toFixed(3) + " sec\n**Best avg. time**: <@" + players[bestAvgTime] + "> with " + (avgTimes[bestAvgTime] / 1000).toFixed(3) + " sec");

	trivia = false;
	console.log("Stopped the trivia");
	console.log("1st Place: " + names[0] + " <@" + players[0] + "> Points: " + scores[0] + " Best time: " + bestTimes[0] / 1000);
	console.log("2nd Place: " + names[1] + " <@" + players[1] + "> Points: " + scores[1] + " Best time: " + bestTimes[1] / 1000);
	console.log("3rd Place: " + names[2] + " <@" + players[2] + "> Points: " + scores[2] + " Best time: " + bestTimes[2] / 1000);
	var outputFilename = "results" + Date.now() + ".html";
	fs.writeFileSync(outputFilename, "<html><head><title>Vell Bot Trivia Leaderboard</title></head>\n<body>\n<h1>Winners of round</h1>\n<p>(ended at " + (new Date()).toUTCString() + ")</p>\n<table border=\"1\">\n<tr><th>Rank</th><th>Name</th><th>User ID</th><th>Score</th><th>Best Streak</th><th>Best Time</th><th>Avg. Time</th></tr>");
	for (var i = 0; i < players.length; i++) {
		fs.appendFileSync(outputFilename, "\n<tr><td>" + getOrdinal(i + 1) + "</td><td>" + names[i] + "</td><td>&lt;@" + players[i] + "&gt;</td><td>" + scores[i] + "</td><td>" + streaks[i] + "</td><td>" + (bestTimes[i] / 1000).toFixed(3) + "</td><td>" + ((avgTimes[i]) / 1000).toFixed(3) + "</td></tr>");
	}
	fs.appendFileSync(outputFilename, "\n</table>\n<p>Vell Bot created by <a href=\"https://discordapp.com\">Alphi#9839</a></p>\n</body>\n</html>");
}

function randomizeQuestions() {
	var data;
	try {
		data = fs.readFileSync(filepath, "utf8");
	} catch(err) {
		console.log("File read error.");
		data = "null*null";
	}
	var lines = data.replace(/\r\n/g, "\n").split("\n");

	allQuestionNum = lines.length;
	for(var i = allQuestionNum - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = lines[i];
		lines[i] = lines[j];
		lines[j] = tmp;
	}

	if (maxQuestionNum > lines.length) {
		maxQuestionNum = allQuestionNum;
	}

	if (totalQuestions > lines.length) {
		totalQuestions = allQuestionNum;
	}

	lines = lines.join("\n");
	fs.writeFileSync("shuffled.txt", lines);
	console.log("Questions scrambled to shuffled.txt");
}

function parseAnswer(answer, correct) {
	function clean(unclean) {
		return unclean.toLowerCase().trim().replace(/ß/g,"ss").replace(/à/g,"a").replace(/á/g,"a").replace(/â/g,"a").replace(/ã/g,"a").replace(/ä/g,"a").replace(/å/g,"a").replace(/æ/g,"ae").replace(/ç/g,"c").replace(/ð/g,"d").replace(/è/g,"e").replace(/é/g,"e").replace(/ê/g,"e").replace(/ë/g,"e").replace(/ì/g,"i").replace(/í/g,"i").replace(/î/g,"i").replace(/ï/g,"i").replace(/ñ/g,"n").replace(/ò/g,"o").replace(/ó/g,"o").replace(/ô/g,"o").replace(/õ/g,"o").replace(/ö/g,"o").replace(/ù/g,"u").replace(/ú/g,"u").replace(/û/g,"u").replace(/ü/g,"u").replace(/ý/g,"y").replace(/ÿ/g,"y").replace(/&/g,"and").replace(/-/g," ").replace(/ +(?= )/g,"").replace(/[^a-zA-Z0-9 ]/g, "");
	}
	function cleanTypos(unclean) {
		return unclean.replace(/kn/g,"n").replace(/y/g,"i").replace(/k/g,"c").replace(/x/g,"c").replace(/q/g,"c").replace(/e/g,"a").replace(/ah/g,"a").replace(/u/g,"o").replace(/ph/g,"f").replace(/m/g,"n").replace(/ll/g,"l").replace(/aa/g,"a").replace(/oo/g,"o").replace(/cc/g,"c").replace(/z/g,"s");
	}
	// string is lowercased, trimmed, and multiple spaces removed, é is turned to e, & is turned to and, all non-alphanumeric characters removed
	var cleanAnswer = clean(answer);
	for (var i = 0; i < correct.length; i++) {
		// each answer choice is cleaned and compared
		if ((cleanAnswer === clean(correct[i])) || (cleanTypos(cleanAnswer) === cleanTypos(clean(correct[i])))) {
			return true;
		}
	}
	return false;
}

function askQuestion(message) {
	if (questionNum < maxQuestionNum && trivia) {
		if (attempts > 0) {
			inv.login(process.env(token));
			if (!answered) {
				inv.sendMessage(message, "The last question has been skipped due to connectivity issues. No points will be awarded for it.");
				answered = true;
			}
		}

		var line = getLine(questionNum);
		questionNum++;
		var questionText = line.substring(0,line.indexOf("*")).replace(/_/g,"\\_");
		if (line.indexOf("`") !== -1) {
			answerArray = line.substring(line.indexOf("*")+1,line.indexOf("`")).split("*");
			answerText = answerArray[0] + " (" + line.substring(line.indexOf("`")+1).replace(/_/g,"\\_") + ")";
		} else {
			answerArray = line.substring(line.indexOf("*")+1).split("*");
			answerText = answerArray[0];
		}

		inv.sendMessage(message, (questionNum - startQuestionNum).toString() + ". **" + questionText + "**", {tts: false}, function(error,questionMessage){
			if (error) {
				reconnect();
				questionNum--;
			} else {
				attempts = 0;
				console.log(questionText);
				console.log(answerArray);
				answered = false;
				questionTimestamp = questionMessage.timestamp;
				console.log(questionTimestamp);
				hintTimeout = setTimeout(hint, hintTime, message);
				skipTimeout = setTimeout(skipQuestion, skipTime, message);
			}
		});
	}
	else {
		endTrivia(message, true);
	}
}

function hint(message) {
	var hintType = Math.floor(Math.random() * 3); // 3 types of hint (0, 1, 2)
	var roundHint;
	if (answerArray[0].length < 3) { // if 2 letters or shorter, length hint
		roundHint = answerArray[0].length;
		inv.sendMessage(message, "**Here's a hint** (no. of characters): " + roundHint);
	} else if (answerArray[0].length < 5) { // if 4 letters or shorter, last letter hint
		roundHint = answerArray[0].slice(-1);
		inv.sendMessage(message, "**Here's a hint** (last character): " + roundHint);
	} else if (hintType === 0) { //scramble the hint
		roundHint = hintScramble();
		inv.sendMessage(message, "**Here's a hint** (scrambled): " + roundHint);
	} else if (hintType === 1) { //replace 90% with blanks
		roundHint = hintBlanks();
		inv.sendMessage(message, "**Here's a hint** (fill in the blanks): " + roundHint);
	} else if (hintType === 2) { // fill in the non-vowels
		roundHint = answerArray[0].replace(/[b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z0-9ßçðñýÿẞÇÐÑÝŸ]/g,"\\_");
		if (roundHint === answerArray[0] || roundHint === answerArray[0].replace(/[a-zA-Z0-9ßçðñýÿàáâãäåæèéêëìíîïòóôõöùúûüẞÇÐÑÝŸÀÁÂÃÄÅÆÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜ]/g,"\\_")) { //if hint has no vowels or is all vowels
			if (Math.random < 0.5) { // fill in the blanks
				roundHint = hintBlanks();
				inv.sendMessage(message, "**Here's a hint** (fill in the blanks): " + roundHint);
			} else { // scrambled hint
				roundHint = hintScramble();
				inv.sendMessage(message, "**Here's a hint** (scrambled): " + roundHint);
			}
		} else {
			inv.sendMessage(message, "**Here's a hint** (vowels): " + roundHint);
		}
	}
	console.log(roundHint);
}

function hintScramble() {
	var scrambled = answerArray[0].split(" "),
		n = scrambled.length;
	for(var i = n - 1; i >= 0; i--) {
		var scrambledWord = scrambled[i].split(""),
			m = scrambledWord.length;
		for(var j = m - 1; j > 0; j--) {
			var k = Math.floor(Math.random() * (j + 1));
			var tmp = scrambledWord[j];
			scrambledWord[j] = scrambledWord[k];
			scrambledWord[k] = tmp;
		}
		scrambled[i] = scrambledWord.join("");
	}
	return scrambled.join(" ");
}

function hintBlanks() {
	var blanks = "";
	var s = answerArray[0].split("");
	for(var i = 0;i<s.length;i++){
		var code = s[i].charCodeAt(0);
		// first character is never shown, last character is always shown
		if (i === 0 || ((i !== s.length - 1) && (Math.random() < 0.9) && ((code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123) || (special.indexOf(s[i]) !== -1)))) { // if part of the 90% and alphanumeric or special
			blanks += "\\_";
		}
		else {
			blanks += s[i];
		}
	}
	return blanks;
}

function skipQuestion(message) {
	inv.sendMessage(message, "*Time's up!* **Answer**: " + answerText, {tts: false}, function(error, timestamp){
		if (error) {
			reconnect();
		} else {
			lastRoundWinner = "null";
			answered = true;
			questionTimeout = setTimeout(askQuestion, betweenTime, message);
		}
	});
}

function getOrdinal(n) {
	var s=["th","st","nd","rd"],
		v=n%100;
	return n+(s[(v-20)%10]||s[v]||s[0]);
}

function sortByArray(sortThis, sortBy) {
	var newArray = sortThis;
	newArray.sort(function(a, b) {
		return sortBy[sortThis.indexOf(b)] - sortBy[sortThis.indexOf(a)];
	});
	return newArray;
}

function reconnect() {
	if (attempts === 0) {
		clearTimeout(questionTimeout);
		clearTimeout(hintTimeout);
		clearTimeout(skipTimeout);

		var outputFilename = "results" + Date.now() + ".html";
		fs.writeFileSync(outputFilename, "<html><head><title>Vell Bot Trivia Leaderboard</title></head>\n<body>\n<h1>Winners of round</h1>\n<p style=\"color: red\">(aborted at " + (new Date()).toUTCString() + ")</p>\n<table border=\"1\">\n<tr><th>Rank</th><th>Name</th><th>User ID</th><th>Score</th><th>Best Streak</th><th>Best Time</th><th>Avg. Time</th></tr>");
		for (var i = 0; i < players.length; i++) {
			fs.appendFileSync(outputFilename, "\n<tr><td>" + getOrdinal(i + 1) + "</td><td>" + names[i] + "</td><td>&lt;@" + players[i] + "&gt;</td><td>" + scores[i] + "</td><td>" + streaks[i] + "</td><td>" + (bestTimes[i] / 1000).toFixed(3) + "</td><td>" + ((times[i] / scores[i]) / 1000).toFixed(3) + "</td></tr>");
		}
		fs.appendFileSync(outputFilename, "\n</table>\n<p>Vell Bot created by <a href=\"https://discordapp.com\">Alphi#9839</a></p>\n<h2>Error info:</h2><ul>");
		fs.appendFileSync(outputFilename, "\n<li>var questionNum = " + questionNum + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var maxQuestionNum = " + maxQuestionNum + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var lastRoundWinner = \"" + lastRoundWinner + "\";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var roundWinnerScore = " + roundWinnerScore + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var roundWinnerStreak = " + roundWinnerStreak + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var lastBestTimePlayer = \"" + lastBestTimePlayer + "\";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var lastBestTime = " + lastBestTime + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var lastBestStreakPlayer = \"" + lastBestStreakPlayer + "\";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var lastBestStreak = " + lastBestStreak + ";</li>");
		fs.appendFileSync(outputFilename, "\n<li>var players = [\"" + players.join("\",\"") + "\"];</li>");
		fs.appendFileSync(outputFilename, "\n<li>var names = [\"" + names.join("\",\"") + "\"];</li>");
		fs.appendFileSync(outputFilename, "\n<li>var scores = [" + scores.join() + "];</li>");
		fs.appendFileSync(outputFilename, "\n<li>var streaks = [" + streaks.join() + "];</li>");
		fs.appendFileSync(outputFilename, "\n<li>var times = [" + times.join() + "];</li>");
		fs.appendFileSync(outputFilename, "\n<li>var bestTimes = [" + bestTimes.join() + "];</li></ul>");
		fs.appendFileSync(outputFilename, "\n</body>\n</html>");
		console.log("Connection lost. Existing score data has been dumped.");
		questionTimeout = setTimeout(askQuestion, 10000, triviaChannel);
		console.log("Attempting to reconnect in 10 seconds...");
	} else {
		questionTimeout = setTimeout(askQuestion, 10000, triviaChannel);
		console.log("Attempt failed. Attempting to reconnect in 10 seconds...");
	}
	attempts++;
}

inv.on("error", function(error){
	throw error;
});

inv.on("message", function(message){
	// sets trivia channel
	var privileged;
	if (triviaChannel != null) {
		privileged = (triviaChannel.permissionsOf(message.author).hasPermission("manageServer") || message.author.id === inv.user.id);
	} else if (message.channel.name === "trivia" || message.channel.name === "test") {
		triviaChannel = message.channel;
		privileged = (triviaChannel.permissionsOf(message.author).hasPermission("manageServer") || message.author.id === inv.user.id);
	}
	
	if (message.content === "?info") {
		mybot.deleteMessage(message);
		var authorIndex = players.indexOf(message.author.id);
		var score = scores[authorIndex];
		var streak = streaks[authorIndex];
		var place = getOrdinal(authorIndex + 1);
		var bestTime = (bestTimes[authorIndex] / 1000).toFixed(3);
		var time = times[authorIndex];
		var avgTime = (time / score / 1000).toFixed(3);
		if (typeof score === "undefined") { // if the user hasn't played
			score = "0";
			streak = 0;
			place = "—";
			bestTime = "—";
			avgTime = "—";
		}
		inv.sendMessage(message.author, "Your info:\n**Points**: " + score + " **Place**: " + place + " **Best streak**: " + streak + " **Best time**: " + bestTime + " sec **Avg. time**: " + avgTime + " sec");
	}

	// if anyone says "?top" in the chat or DM it, they get a DM with the top ten
	else if (message.content === "?top" || message.content === "?records") {
		inv.deleteMessage(message);
		var place = 0;
		var topTen = "Top ten:";
		if (players.length === 0) {
			topTen = topTen + "\nNo one yet."
		}
		while ((place < 10) && (place < players.length)) {
			topTen = topTen + "\n**" + getOrdinal(place + 1) + " Place**: <@" + players[place] + "> **Points**: " + scores[place] + " **Best streak**: " + streaks[place] + " **Best time**: " + (bestTimes[place] / 1000).toFixed(3) + " sec **Avg. time**: " + (times[place] / scores[place] / 1000).toFixed(3) + " sec";
			place++;
		}
		inv.sendMessage(message.author, topTen);
	}

	// if anyone says "?help" in the chat or DM it, they get a DM with valid commands
	else if (message.content === "?help") {
		mybot.deleteMessage(message);
		if (triviaChannel == null || anyoneStop || privileged) {
			inv.sendMessage(message.author, "Commands:\n- **!start**: starts the round of trivia\n- **!stop**: ends the round of trivia\n- **!hint**: sends the question's hint now\n- **!skip**: skips the current question\n- **!list** *list*: changes trivia list to the specified list\n- **!pause:**: pauses the round of trivia\n- **!continue**: continues the round of trivia\n- **!questions** *number*: changes number of questions to the specified number\n- **!anyone start**: toggles ability to use !start and !list\n- **!anyone stop**: toggles ability to use !start, !stop, !hint, !skip, !list, !pause, !continue, and !questions\n- **!anyone answer**: toggles ability for server staff to answer\n- **!info**: sends a DM to you with your score and place\n- **!top**: sends a DM to you with the top ten and their scores\n- **!help**: sends a DM to you with information on commands you can use");
		}
		else if (anyoneStart) {
			inv.sendMessage(message.author, "Commands:\n- **!start**: starts the round of trivia\n- **!list** *list*: changes trivia list to the specified list\n- **!info**: sends a DM to you with your score and place\n- **!top**: sends a DM to you with the top ten and their scores\n- **!help**: sends a DM to you with information on commands you can use");
		}
		else {
			inv.sendMessage(message.author, "Commands:\n- **!info**: sends a DM to you with your score and place\n- **!top**: sends a DM to you with the top ten and their scores\n- **!help**: sends a DM to you with information on commands you can use");
		}
	}

	// only executes if in chat channel trivia or test
	else if (message.channel.name === "trivia" || message.channel.name === "test") {
		// only if Rapidash Trivia or people who can manage server types, or if anyoneStart is true
		if (anyoneStart || anyoneStop || privileged) {
			if (!trivia && !paused && message.content === "?start"){ // starts the trivia
				triviaChannel = message.channel;
				inv.deleteMessage(message);
				startTrivia(message);
			} else if (!trivia && !paused && message.content.split(" ")[0] === "?list"){ // changes trivia list
				inv.deleteMessage(message);
				filepath = "./" + message.content.substr(6).trim();
				if (filepath.slice(-4).toLowerCase() !== ".txt") {
					filepath = filepath + ".txt"
				}
				console.log("Trivia list changed to " + filepath);
			}
		}

		// only if Rapidash Trivia or people who can manage server types, or if anyoneStop is true
		if (anyoneStop || privileged) {
			if (trivia && message.content === "?stop"){ // stops the trivia
				inv.deleteMessage(message);
				endTrivia(message, false);
			} else if (trivia && message.content === "?pause"){ // pauses the trivia
				inv.deleteMessage(message);
				trivia = false;
				paused = true;
				clearTimeout(hintTimeout);
				clearTimeout(skipTimeout);
				clearTimeout(questionTimeout);
				if (!answered) {
					questionNum--;
				}
				answered = true;
				inv.sendMessage(message, "*Paused the trivia*");
				console.log("Paused the trivia");
			} else if (!trivia && paused && message.content === "?continue"){ // continues the trivia
				mybot.deleteMessage(message);
				trivia = true;
				paused = false;
				questionTimeout = setTimeout(askQuestion, 1000, triviaChannel);
				inv.sendMessage(message, "*Continuing the trivia*");
				console.log("Continuing the trivia");
			} else if (!answered && message.content === "?hint"){ // gives the hint now
				inv.deleteMessage(message);
				clearTimeout(hintTimeout);
				hint(message);
			} else if (!answered && message.content === "?skip"){ // skips the question
				inv.deleteMessage(message);
				clearTimeout(hintTimeout);
				clearTimeout(skipTimeout);
				skipQuestion(message);
			} else if (message.content === "?anyone start"){ // anyone can start the trivia
				inv.deleteMessage(message);
				anyoneStart = !anyoneStart;
				if (anyoneStart) {
					anyoneStop = false;
					inv.sendMessage(message, "*Anyone can start the trivia*");
					console.log("Anyone can start the trivia");
				} else {
					anyoneStop = false;
					mybot.sendMessage(message, "*Only server staff can start or stop the trivia*");
					console.log("Only server staff can start or stop the trivia");
				}
			} else if (message.content === "?anyone stop"){ // anyone can stop the trivia
				inv.deleteMessage(message);
				anyoneStop = !anyoneStop;
				anyoneStart = anyoneStop;
				if (anyoneStop) {
					inv.sendMessage(message, "*Anyone can start or stop the trivia*");
					console.log("Anyone can start or stop the trivia");
				} else {
					inv.sendMessage(message, "*Only server staff can start or stop the trivia*");
					console.log("Only server staff can start or stop the trivia");
				}
			} else if (message.content === "!anyone answer"){ // anyone can start the trivia
				inv.deleteMessage(message);
				anyoneAnswer = !anyoneAnswer;
				if (anyoneAnswer) {
					inv.sendMessage(message, "*Anyone can answer the trivia*");
					console.log("Anyone can answer the trivia");
				} else {
					inv.sendMessage(message, "*Server staff cannot answer the trivia*");
					console.log("Server staff cannot answer the trivia");
				}
			} else if (!trivia && !paused && message.content.split(" ")[0] === "?questions"){ // changes number of questions
				inv.deleteMessage(message);
				totalQuestions = Math.max(1, parseInt(message.content.substr(11).trim(), 10));
				if (isNaN(totalQuestions)) {
					totalQuestions = maxQuestionNum;
				}
				maxQuestionNum = totalQuestions;
				console.log("Trivia set to ask " + totalQuestions + " questions");
			} else if (!answered && !anyoneAnswer && privileged && parseAnswer(message.content, answerArray)) {
				inv.deleteMessage(message);
			}
		}

		// if answer is correct
		if (!answered && (anyoneAnswer || !privileged) && parseAnswer(message.content, answerArray)) {
			var timeTaken = message.timestamp - questionTimestamp;
			if (timeTaken < 1500 || timeTaken > skipTime || 12000 * message.content.length / timeTaken > 120) { //if they answer in less than 1500 ms, before the question is sent to the server, or WPM is greater than 120
				console.log("*@" + message.author.username + " " + message.author.mention() + " has been banned for suspicious activity* (answered in " + timeTaken + " ms, WPM was " + (12000 * message.content.length / timeTaken).toFixed() + ")");
				inv.banMember(message.author, message.channel.server, 0);
				inv.sendMessage(message.channel, "*" + message.author.mention() + " has been banned for suspicious activity*");
				inv.sendMessage(message.author, "*You have been banned for suspicious activity*");
				inv.deleteMessage(message);
			} else {
				clearTimeout(hintTimeout);
				clearTimeout(skipTimeout);
				var oldRank;
				if (players.indexOf(message.author.id) === -1) { // if player hasn't won before
					players.push(message.author.id);
					names.push(message.author.username);
					scores.push(1);
					streaks.push(1);
					times.push(timeTaken);
					bestTimes.push(timeTaken);
					oldRank = players.length + 1; // rank + 1 to force message
					roundWinnerScore = 1;
					roundWinnerStreak = 1;
				} else { // if player has won before
					var winnerIndex = players.indexOf(message.author.id);
					oldRank = winnerIndex + 1;
					scores[winnerIndex]++;
					roundWinnerScore = scores[winnerIndex];
					times[winnerIndex] += timeTaken;

					if (lastRoundWinner === message.author.id) { // if winner of this and last round are the same
						roundWinnerStreak++;
						if (roundWinnerStreak > streaks[winnerIndex]) { // if this is a longer streak than old best streak
							streaks[winnerIndex] = roundWinnerStreak;
						}
						if (roundWinnerStreak > 5) {
							inv.sendMessage(message, "*" + message.author.mention() + " stretches their streak to " + roundWinnerStreak + "!*");
						}
					} else {
						if (roundWinnerStreak > 5) {
							inv.sendMessage(message, "*<@" + lastBestStreakPlayer + ">'s streak ended at " + roundWinnerStreak + " by " + message.author.mention() + "*");
						}
						roundWinnerStreak = 1;
					}

					if (timeTaken < bestTimes[winnerIndex]) { // if this is a better time than old best time
						bestTimes[winnerIndex] = timeTaken;
					}
					players = sortByArray(players,scores);
					names = sortByArray(names,scores);
					streaks = sortByArray(streaks,scores);
					times = sortByArray(times,scores);
					bestTimes = sortByArray(bestTimes,scores);
					scores.sort(function(a, b) {
					return b - a;
					});
				}

				var rank = players.indexOf(message.author.id) + 1;

				// say correct answer and who entered it
				inv.sendMessage(message, "**Winner**: " + message.author.mention() + " **Answer**: " + answerText + " **Points**: " + roundWinnerScore + " **Place**: " + getOrdinal(rank) + " **Streak**: " + roundWinnerStreak + " **Time**: " + (timeTaken / 1000).toFixed(3) + " sec");
				console.log("Winner: " + message.author.username + " " + message.author.mention() + " Answer: " + message.content + " Points: " + roundWinnerScore + " Place: " + getOrdinal(rank) + " Streak: " + roundWinnerStreak + " Time: " + (timeTaken / 1000).toFixed(3) + " sec");

				// sends message if they moved up in rank
				if (rank < oldRank) {
					inv.sendMessage(message, "*" + message.author.mention() + " has moved up in rank* (" + getOrdinal(rank) + ")");
				}

				// keep track of time record for current round
				if (lastBestTimePlayer === "null") { // if there is no best time yet
					lastBestTimePlayer = message.author.id;
					lastBestTime = timeTaken;
				} else if (timeTaken < lastBestTime) { // if the player beat the last best time
					inv.sendMessage(message, "*" + message.author.mention() + " broke the current round time record with " + (timeTaken / 1000).toFixed(3) + " sec! Previous record holder was <@" + lastBestTimePlayer + "> with " + (lastBestTime / 1000).toFixed(3) + " sec!*");
					lastBestTimePlayer = message.author.id;
					lastBestTime = timeTaken;
				}

				// keep track of streak record for current round
				if (lastBestStreakPlayer === "null") { // if there is no best streak yet
					lastBestStreakPlayer = message.author.id;
					lastBestStreak = roundWinnerStreak;
				} else if (roundWinnerStreak > lastBestStreak) { // if the player beat the last best streak
					if (lastBestStreakPlayer !== message.author.id) {
						inv.sendMessage(message, "*" + message.author.mention() + " broke the current round streak record with " + roundWinnerStreak + "! Previous record holder was <@" + lastBestStreakPlayer + "> with " + lastBestStreak + "!*");
					}
					lastBestStreakPlayer = message.author.id;
					lastBestStreak = roundWinnerStreak;
				}

				// sends message based on streak
				switch (roundWinnerStreak) {
					case 3:
						iinv.sendMessage(message, "*" + inv.user.mention() + " hands " + message.author.mention() + " a jelly-filled donut for getting the last 3 questions!*");
						break;
					case 5:
						inv.sendMessage(message, "*" + inv.user.mention() + " hands " + message.author.mention() + " a diploma for getting the last 5 questions!*");
						break;
					case 10:
						inv.sendMessage(message, "*" + inv.user.mention() + " watches " + message.author.mention() + " speed away from their competitors, kicking their asses! 10 questions!*");
						break;
					case 15:
						inv.sendMessage(message, "*" + inv.user.mention() + " bows before " + message.author.mention() + " who is a trivia Legendary Pokémon...*");
						break;
					case 25:
						inv.sendMessage(message, "*" + inv.user.mention() + " bows before " + message.author.mention() + " who knows more about Pokémon than Arceus...*");
						break;
				}

				// sends message based on points
				switch (roundWinnerScore) {
					case 50:
						inv.sendMessage(message, "*" + inv.user.mention() + " rewards " + message.author.mention() + " with a Ratatta in the top percentage of all Rattata!*");
						break;
					case 100:
						inv.sendMessage(message, "*" + inv.user.mention() + " rewards " + message.author.mention() + " with some shorts that are comfy and easy to wear!*");
						break;
					case 150:
						inv.sendMessage(message, "*" + inv.user.mention() + " rewards " + message.author.mention() + " with a Helix Fossil!*");
						break;
				}

				lastRoundWinner = message.author.id;
				answered = true;
				questionTimeout = setTimeout(askQuestion, betweenTime, message);
			}
		}
	}
});

questionNum -= 1;
console.log("The trivia bot has been started.");

// exit handling stuff
process.stdin.resume();

function exitHandler() {
	inv.sendMessage(triviaChannel, "Attention, " + message.author.username + " the trivia bot has been terminated.", {tts: true}, function(error, message){
		if (trivia) {
			var outputFilename = "results" + Date.now() + ".html";
			fs.writeFileSync(outputFilename, "<html><head><title>Vell Bot Trivia Leaderboard</title></head>\n<body>\n<h1>Winners of round</h1>\n<p style=\"color: red\">(aborted at " + (new Date()).toUTCString() + ")</p>\n<table border=\"1\">\n<tr><th>Rank</th><th>Name</th><th>User ID</th><th>Score</th><th>Best Streak</th><th>Best Time</th><th>Avg. Time</th></tr>");
			for (var i = 0; i < players.length; i++) {
				fs.appendFileSync(outputFilename, "\n<tr><td>" + getOrdinal(i + 1) + "</td><td>" + names[i] + "</td><td>&lt;@" + players[i] + "&gt;</td><td>" + scores[i] + "</td><td>" + streaks[i] + "</td><td>" + (bestTimes[i] / 1000).toFixed(3) + "</td><td>" + ((times[i] / scores[i]) / 1000).toFixed(3) + "</td></tr>");
			}
			fs.appendFileSync(outputFilename, "\n</table>\n<p>Vell Bot created by  <a href=\"https://discordapp.com\">Alphi#9839</a></p>\n<h2>Error info:</h2><ul>");
			fs.appendFileSync(outputFilename, "\n<li>var questionNum = " + questionNum + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var maxQuestionNum = " + maxQuestionNum + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var lastRoundWinner = \"" + lastRoundWinner + "\";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var roundWinnerScore = " + roundWinnerScore + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var roundWinnerStreak = " + roundWinnerStreak + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var lastBestTimePlayer = \"" + lastBestTimePlayer + "\";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var lastBestTime = " + lastBestTime + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var lastBestStreakPlayer = \"" + lastBestStreakPlayer + "\";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var lastBestStreak = " + lastBestStreak + ";</li>");
			fs.appendFileSync(outputFilename, "\n<li>var players = [\"" + players.join("\",\"") + "\"];</li>");
			fs.appendFileSync(outputFilename, "\n<li>var names = [\"" + names.join("\",\"") + "\"];</li>");
			fs.appendFileSync(outputFilename, "\n<li>var scores = [" + scores.join() + "];</li>");
			fs.appendFileSync(outputFilename, "\n<li>var streaks = [" + streaks.join() + "];</li>");
			fs.appendFileSync(outputFilename, "\n<li>var times = [" + times.join() + "];</li>");
			fs.appendFileSync(outputFilename, "\n<li>var bestTimes = [" + bestTimes.join() + "];</li></ul>");
			fs.appendFileSync(outputFilename, "\n</body>\n</html>");
		}
		console.log("The trivia bot has been terminated.");
		if (error) {
			console.log(error);
		}
		process.exit();
	});
}

process.on('exit', exitHandler.bind(null));
process.on('SIGINT', exitHandler.bind(null));
process.on('uncaughtException', exitHandler.bind(null));
}
