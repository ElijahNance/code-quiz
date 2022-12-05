var home = document.querySelector('#home');
var start = document.querySelector('#start');
var question01 = document.querySelector("#qs01");
var index = 0;

start.addEventListener('click', function() {
    nextQuestion(index);
    // console.log(me);
    // question01.setAttribute('style', 'display: block')
    // home.setAttribute('style', 'display: none') 

});


function nextQuestion(currIndex) {
    //hide the current section and unhide the next section
    var currPos = "qs0" + currIndex;
    var nextPos = "qs0" + (currIndex + 1);

    //Advance index in time for the next button click
    index = index++;
    console.log(currPos, nextPos);
  
}
