
var start = document.querySelector('#start');
var submitScore = document.querySelector('#submitScore');
var reset = document.querySelector('#reset');

const quizAnswers=[{qindex:"1", qresponse:"A"},{qindex:"2", qresponse:"A"},{qindex:"3", qresponse:"C"},{qindex:"4", qresponse:"D"}];

start.addEventListener('click', function() {nextQuestion();});

submitScore.addEventListener('click', function() {finalizeQuiz();});

reset.addEventListener('click', function() {
    localStorage.setItem("currIndex", 0);
    localStorage.removeItem("userAnswers");
});

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

    //Retrieve the User Results object from local storage - if there isn't one then build it
    //var userAnswers = localStorage.getItem("userAnswers");
    var userAnswers = JSON.parse(localStorage.getItem("userAnswers"));

    if(userAnswers === null) {
        //No answers yet - need to initialize - note: to make this work, we're assuming
        //that qindex here is the same as qindex in the answer array at the top of this script file
        userAnswers = [{qindex: "1", isCorrect: false},{qindex: "2", isCorrect: false},{qindex: "3", isCorrect: false},{qindex: "4", isCorrect: false}];
    }

    console.log(userQIndex,userQResponse);
    
    for(var i=0; i < quizAnswers.length; i++) {

        if(quizAnswers[i].qindex === userQIndex){
            //Found the question - now determine if the answer is correct
            if(quizAnswers[i].qresponse === userQResponse) {
                console.log("Got It RIght");
                userAnswers[i].isCorrect=true;
            }
            else {
                console.log("Incorrect");
                userAnswers[i].isCorrect=false;
            }

            console.log(userAnswers[i].qindex, userAnswers[i].isCorrect);

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

    console.log("Stored Item:", storedIndex);

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
    
    //var currQuestion = document.getElementById("qs00");
    //var nextQuestion = document.getElementById("qs01");

    currQuestion.setAttribute('style', 'display: none');
    nextQuestion.setAttribute('style', 'display: block');

    console.log("CurrIndex", currIndex);

    //Advance index and save for the next button click
    localStorage.setItem("currIndex",(currIndex+1));
    console.log(currPos, nextPos);
  
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

    console.log(userInitials);
    
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

    console.log(quizScore);

}
