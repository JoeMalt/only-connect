
/* State machine for game state including multiple rounds 

States: (TODO)

START (starting state, transient)
-> transitions automatically 
ROUND_LOADED (user prompted to start)
ROUND_RUNNING
ROUND_SOLVED (user prompted to submit links)
ROUND_TIMEOUT (user prompted to view solution, which transitions to ROUND_SOLVED)

*/

var GAME_STATE = "START"

var livesLeft = 3;

function loadRound() {
    // fetch the JSON file name from the GET query
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    wall = urlParams.get("wall")

    fetch("/" + wall + ".json").then(
        response => response.json())
        .then(
            data => {
                document.getElementById("round-title").innerText = data['title'];
                setTimer(data['time']);
                setBoardBlurred(true);
                initialiseGame(data['rows'])
            }
        );
}

function setTimer(time){
    timeRemaining = time;
    renderTimeRemaining();
}

function renderTimeRemaining(){
    document.getElementById("clock-counter").innerHTML = fmtMSS(timeRemaining)
}

function timerTick(){
    timeRemaining--;
    renderTimeRemaining();
    if (timeRemaining <= 0){
        timerExpired();
        stopTimer();
    }
}

function stopTimer(){
    clearInterval(timerInterval);
}

function startTimer(){
    timerInterval = setInterval(timerTick, 1000);
}

function setBoardBlurred(blurredState) {
    if (blurredState){
        document.getElementById("board").classList.add("blurred");
    }
    else {
        document.getElementById("board").classList.remove("blurred");
    }
}

function setBoardLocked(lockedState){
    if (lockedState){
        document.getElementById("board").classList.add("no-interact");
    }
    else {
        document.getElementById("board").classList.remove("no-interact");
    }
}

function timerExpired() {
    setBoardLocked(true);
    document.getElementById("instructions-timeout").classList.remove("hidden");
    document.getElementById("instructions-timeout").innerHTML = document.getElementById("instructions-timeout").innerHTML.replace("$POINTS", numRowsSolved);
}

function boardCompleted(){
    stopTimer();
    document.getElementById("instructions-success").classList.remove("hidden");
}

function outOfLives(){
    stopTimer();
    setBoardLocked(true);
    document.getElementById("instructions-nomorelives").classList.remove("hidden");
    document.getElementById("instructions-nomorelives").innerHTML = document.getElementById("instructions-nomorelives").innerHTML.replace("$POINTS", numRowsSolved);
}

function startRound(){
    startTimer();
    setBoardBlurred(false);
    setBoardLocked(false);
    document.getElementById("start-round-button").classList.add("hidden");
}

function showLivesCounter(){
    document.getElementById("lives-left").classList.remove("hidden");
    updateLivesCounter();
}

function updateLivesCounter(){
    document.getElementById("lives-left").innerHTML = livesLeft + " lives remaining"
}

function loseALife(){
    livesLeft--;
    updateLivesCounter();
    if (livesLeft == 0){
        outOfLives();
    }
}

// format M:SS given number of sections
// from https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
function fmtMSS(s){
    return(s-(s%=60))/60+(9<s?':':':0')+s
}
