var token;
var game = [];
var answers = [];
var currentQuestion = 0;
var correctAnswers = 0;
var requestedQuestions = 0;

//Shows the question for the requested index
function showQuestion(num) {
    currentQuestion = num;
    var buttons = [];
	//Answers[0] contains the randomized 0-3 index
	buttons[answers[0]] = game[num].correct_answer;
	//Answers[1]-[3] contains the predisposed index around the randomized one
	buttons[answers[1]] = game[num].incorrect_answers[0];
    buttons[answers[2]] = game[num].incorrect_answers[1];
    buttons[answers[3]] = game[num].incorrect_answers[2];
	//Set doms
    document.getElementById("question").innerHTML = game[num].question;
    document.getElementById("abt1").innerHTML = buttons[0];
    document.getElementById("abt2").innerHTML = buttons[1];
    document.getElementById("abt3").innerHTML = buttons[2];
    document.getElementById("abt4").innerHTML = buttons[3];
};

//Starting point from the "sbt1" in index.html
function start() {
   //Clear previous game data
	clearData();
    //Call callback method to fetch a token and then construct the game url
	getToken(buildUrl);
   
	//Set doms for game style, hides helper and and aside elements
	var a = document.getElementById("selection");
    var b = document.getElementById("quiz");
    document.getElementById("completed").style.display = "none";
    document.getElementById("sidebar2").style.display = "none";
    document.getElementById("birdie").style.display = "none";
    document.getElementById("sideimg").style.visibility = "hidden"
    document.getElementById("sidep1").style.visibility = "hidden"
    document.getElementById("sidep2").style.visibility = "hidden"
	//
    if (a.style.display === "none") {
        a.style.display = "block";
        b.style.display = "none";

    } else {
        a.style.display = "none";
        b.style.display = "block";

    }
};
//Callback method to randomize first and display after
function display(num) {
    randomizeAnswer(num, showQuestion)
};


//Build the URL 
function buildUrl() {
    var sub = document.getElementById("subject").value;
    var amm = document.getElementById("ammount").value;
    var dif = document.getElementById("difficulty").value;
    document.getElementById("progress").max = amm;
    document.getElementById("progress").value = 0;
    requestedQuestions = amm;
    url = "https://opentdb.com/api.php?amount=" + amm + "&category=" + sub + "&difficulty=" + dif + "&type=multiple&token=" + token
	//Fetch the game
	retrieveGame(url);
};

//Fetch the json quiz data and store it in the game var
function retrieveGame(url) {
    var response = null;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(xhttp.responseText);
            if (response.response_code == 0) {
                game = response.results;
				//Show the first question
			   display(0);
            } else {
                //Basic error handling
				document.getElementById("question").innerHTML = "Api couldnt handle your request please try again :)";
            }
        }

    };
    xhttp.open("GET", url);
    xhttp.send();
};

//Randomize the 4 answers locations so the correct wont be at the same spot every time.
//Calls back to showQuestion();
function randomizeAnswer(num, callback) {
    //answers[0] holds the button index for correct answer
	answers[0] = Math.floor(Math.random() * 4);
  switch (answers[0]) {
        //If correct answer is located at answers [3] allocate the wrong answers to the other fields
		case 3:
            answers[1] = 2;
            answers[2] = 1;
            answers[3] = 0;
            callback(num);
            break;
		//If correct answer is located at answers [2] allocate the wrong answers to the other fields       
	   case 2:
            answers[1] = 3;
            answers[2] = 1;
            answers[3] = 0;
            callback(num);
            break;
        //If correct answer is located at answers [1] allocate the wrong answers to the other fields
		case 1:
            answers[1] = 3;
            answers[2] = 2;
            answers[3] = 0;
            callback(num);
            break;
        //If correct answer is located at answers [0] allocate the wrong answers to the other fields
		case 0:
            answers[1] = 3;
            answers[2] = 2;
            answers[3] = 1;
            callback(num);
            break;
    }
};
	//Guess method called from the "answer-btn" buttons in the index.html 
function guess(choice) {
	//check if user guesssed right
    if (choice == answers[0]) {
        correctAnswers++;
    }
	//check if its time to stop
    if (currentQuestion + 1 == requestedQuestions) {
        finish();
    } else {
        display(currentQuestion + 1);
        document.getElementById("progress").value = currentQuestion;
	}
	}

//Completed quiz show results & correct elements
function finish() {
    var a = document.getElementById("selection");
    var b = document.getElementById("quiz");
    var c = document.getElementById("completed");
    if (a.style.display === "none") {
        a.style.display = "none";
        b.style.display = "none";
        c.style.display = "block";
    } else {
        a.style.display = "none";
        b.style.display = "none";
    }
    document.getElementById("result").innerHTML = correctAnswers + "/" + requestedQuestions;
    document.getElementById("score").max = requestedQuestions;
    document.getElementById("score").value = correctAnswers;
	
}
//Get a token so we wont have repeat questions, token lives after game completion for "play again" but doesnt survive a page refresh.
function getToken(callback) {
    var response = null;
    var xhttp = new XMLHttpRequest();
    response = xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(xhttp.responseText);
            if (response.response_code == 0) {
                token = response.token;
                callback();

            } else {

            }
        }
    };

    xhttp.open("GET", "https://opentdb.com/api_token.php?command=request");
    xhttp.send();

}

//Clear the vars for a new game
function clearData() {
    game = [];
    answers = [];
    currentQuestion = 0;
    correctAnswers = 0;
    requestedQuestions = 0;
};