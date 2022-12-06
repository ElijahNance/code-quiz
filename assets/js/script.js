var home = document.querySelector('#home');
var start = document.querySelector('#start');
var reset = document.querySelector('#reset');
var question01 = document.querySelector("#qs01");
var index = 0;

// start.addEventListener('click', function() {
//     nextQuestion(index);
//     // console.log(me);
//     // question01.setAttribute('style', 'display: block')
//     // home.setAttribute('style', 'display: none') 

// });

start.addEventListener('click', function() {
    nextQuestion();
});

reset.addEventListener('click', function() {
    localStorage.setItem("currIndex", 0);
});



// function nextQuestion(currIndex) {

//     //hide the current section and unhide the next section
//     var currPos = "qs0" + currIndex;
//     var nextPos = "qs0" + (currIndex + 1);

//     //Advance index in time for the next button click
//     index = index++;
//     console.log(currPos, nextPos);
  
// }

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
