
var start = document.querySelector('#start');
var submitScore = document.querySelector('#submitScore');
var resetNew = document.querySelector('#resetNew');
var clearScores = document.querySelector('#clearScores');

const quizAnswers=[{qindex:"1", qresponse:"A"},{qindex:"2", qresponse:"A"},{qindex:"3", qresponse:"C"},{qindex:"4", qresponse:"D"}];

start.addEventListener('click', function() {nextQuestion();});

submitScore.addEventListener('click', function() {finalizeQuiz();});

resetNew.addEventListener('click', function() {
    localStorage.setItem("currIndex", 0);
    localStorage.removeItem("userAnswers");

    var qSections = document.getElementsByClassName("qSection");

    for(var i=0; i < qSections.length; i++) {
        var sectionID = "qs0" + i;

        if (i===0) {
            //Show this section because it's the start of the quiz
            document.getElementById(sectionID).setAttribute('style', 'display: block');
        }
        else {
            //Everyone else gets hidden
            document.getElementById(sectionID).setAttribute('style', 'display: none');
        }
    }
});

clearScores.addEventListener('click', function() {
    localStorage.removeItem("highScores");
    var highScoreDisplay = document.getElementById("highScoreDisplay");
    highScoreDisplay.innerHTML = "";

})


function processUserResponse(ansButton){
    //This is a wrapper to process the user responses to questions
    //First it calls the function to evaluate the answer and then
    //it advances to the next question / section of the quiz
    evaluateAnswer(ansButton);
    nextQuestion();
}

function evaluateAnswer(ansButton) {
    
    var userQIndex = ansButton.getAttribute("data-qindex");
    var userQResponse = ansButton.getAttribute("data-qresponse");

    //Retrieve the User Results object from local storage
    var userAnswers = JSON.parse(localStorage.getItem("userAnswers"));

    if(userAnswers === null) {
        //to make this work, we're assuming
        //that qindex here is the same as qindex in the answer array at the top of this script file
        userAnswers = [{qindex: "1", isCorrect: false},{qindex: "2", isCorrect: false},{qindex: "3", isCorrect: false},{qindex: "4", isCorrect: false}];
    }
    
    for(var i=0; i < quizAnswers.length; i++) {

        if(quizAnswers[i].qindex === userQIndex){
            //Found the question - now determine if the answer is correct
            if(quizAnswers[i].qresponse === userQResponse) {
                userAnswers[i].isCorrect=true;
            }
            else {
                userAnswers[i].isCorrect=false;
            }

            //Break out of the loop
            break;
        }
    }

    //Save the results back to local storage
    localStorage.setItem("userAnswers",JSON.stringify(userAnswers));
}
function nextQuestion() {
    
    var storedIndex = localStorage.getItem("currIndex");
    var currIndex = 0;

    if (currIndex == null) {
        //No index set - init at 0
        currIndex = 0;
    }
    else {
        //Convert local storage value to number
        currIndex = Number(storedIndex);
    }

    //hide the current section and unhide the next section
    var currPos = "qs0" + currIndex;
    var nextPos = "qs0" + (currIndex + 1);

    var currQuestion = document.querySelector('#' + currPos);
    var nextQuestion = document.querySelector('#' + nextPos);

    currQuestion.setAttribute('style', 'display: none');
    nextQuestion.setAttribute('style', 'display: block');

    console.log("CurrIndex", currIndex);

    //Advance index and save for the next button click
    localStorage.setItem("currIndex",(currIndex+1));
  
}

function finalizeQuiz(){
    //Validate that player put in their initials, then score and store quiz results
    //and then move to High Score page
    
    var userInitials = document.getElementById("playerInitials").value;

    //Validate there's something to put
    if(userInitials === null){
        window.alert("Please enter your initials");
        return;
    }
    else if (userInitials.length===0 || userInitials.length > 3){
        window.alert("Initials should be at least one character and no more than three characters. No spaces are allowed.");
        return;
    }
    
    //Retrieve results
    var userAnswers = JSON.parse(localStorage.getItem("userAnswers"));

    if(userAnswers === null) {
        //No answers returned - notify user
        window.alert("We could not find your test results. Are you sure you took the test?");
    } 

    //Score the test - the AC didn't specify a scoring formula so we're going with pct
    //Use the loop to calculate total questions asked and total correct so we can get a score
    var totalQuestions = 0;
    var totalCorrect = 0;

    for (var i=0; i < userAnswers.length; i++){
        totalQuestions = totalQuestions + 1;
        
        if(userAnswers[i].isCorrect) {
            totalCorrect = totalCorrect + 1;
        }
    }
    
    var quizScore = 100 * (totalCorrect / totalQuestions);

    //Pull High Scores list from local storage, the add this user to the top of the array
    var highScores=JSON.parse(localStorage.getItem("highScores"));

    if (highScores === null) {
        //Since we don't have an array there yet initialize a blank one
        highScores = [];
    }

    var userResult = {initials: userInitials, score: quizScore};
    highScores.unshift(userResult);
    localStorage.setItem("highScores",JSON.stringify(highScores));

    //Update the high score display
    var highScoreDisplay = document.getElementById("highScoreDisplay");
    var tableMarkup = "<table>";

    for(var i=0; i < highScores.length; i++) {
        tableMarkup= tableMarkup + "<tr>";
        tableMarkup= tableMarkup + "<td>" + highScores[i].initials + "</td>";
        tableMarkup= tableMarkup + "<td>" + highScores[i].score + "</td>";
        tableMarkup= tableMarkup + "</tr>";
    }

    tableMarkup = tableMarkup + "</table>";
    highScoreDisplay.innerHTML = tableMarkup;

    //Move to the next section of the quiz
    nextQuestion();

}
