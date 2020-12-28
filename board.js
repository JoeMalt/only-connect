var solution = []; // array of arrays
var remainingWords = []; // initially all 16 words, removed as rows are solved
var numRowsSolved = 0;
var timeRemaining = 0;
var timerInterval;

function initialiseGame(game_solution) {

    // reset global state
    console.log(solution);
    remainingWords = [];
    numRowsSolved = 0;

    console.log("Populating grid");

    solution = game_solution;
    remainingWords = game_solution.flat();
    // TODO separte this out
    drawGrid(shuffleArray(remainingWords));
}

function drawGrid(words) {
    const cells = document.querySelectorAll(".cell");
    for (const [idx, cell] of cells.entries()) {
        cell.innerHTML = words[idx]
        cell.classList.add("default")
        cell.addEventListener("click", cellClicked)
    }
}

function cellClicked(event){
    cell = event.target;
    // if cell is in a solved row, it shouldn't be clickable
    if (cell.classList.contains("correct")){
        console.log("Clicked already-solved item");
        return false;
    }
    // if cell is already selected, deselect it
    if (cell.classList.contains("selected")){
        cell.classList.remove("selected");
        return false;
    }
    // selectedCells.push(cell);
    cell.classList.add("selected");

    // if we have 4 selected cells, proceed to validation
    selectedCells = Array.from(document.getElementsByClassName("selected"));
    if (selectedCells.length < 4){
        return false;
    }
    selectedWords = [];
    for (var i = 0; i < selectedCells.length; i++){
        var cell = selectedCells[i];
        selectedWords.push(cell.innerHTML);
    }
    if(validateSelection(selectedWords)){
        addCorrectRow(selectedWords)
    }
    else {
        // loss of live if applicable
        if (numRowsSolved == 2){
            loseALife();
        }
        // flash the cells briefly red
        for (var i = 0; i < selectedCells.length; i++){
            selectedCells[i].classList.add("incorrect");
        }
        setTimeout(function(){
            for (var i = 0; i < selectedCells.length; i++){
                selectedCells[i].classList.remove("incorrect");
                selectedCells[i].classList.remove("selected");
            }
        }, 600);
        
    }
}

function validateSelection(selectedWords){ 
    selectedWords.sort()
    for (var i = 0; i < solution.length; i++){
        var group = solution[i]
        console.log(group.sort())
        // ugly hack for deep equals
        console.log("group: ", group.sort().toString());
        console.log("selection: ", selectedWords.toString());
        if (group.sort().toString() === selectedWords.toString()){
            console.log("row correct");
            return true;
        }
    }
    console.log("row wrong");
    return false;
}


function addCorrectRow(correctRow) {
    remainingWords = remainingWords.filter(
        function(word) {
            return !correctRow.includes(word);
        }
    )
    correctClass = "correct-".concat(numRowsSolved + 1);
    correctRowStartIdx = numRowsSolved * 4; // where to put the correct row


    allCells = document.getElementsByClassName("cell")
    console.log("adding correct row from idx ", correctRowStartIdx)
    for (var i = 0; i < 4; i++){
        allCells[i + correctRowStartIdx].innerHTML = correctRow[i];
        allCells[i + correctRowStartIdx].classList.remove("selected")
        allCells[i + correctRowStartIdx].classList.add(correctClass)
        allCells[i + correctRowStartIdx].classList.add("correct")
    }
    numRowsSolved++
    if (numRowsSolved == 2){
        showLivesCounter();
    }
    if (numRowsSolved < 3){
        remainingWordsStartIdx = correctRowStartIdx + 4;
        console.log("adding remaining words starting from idx ", remainingWordsStartIdx);
        for (var i = 0; i < remainingWords.length; i++){
            allCells[i + remainingWordsStartIdx].innerHTML = remainingWords[i];
            allCells[i + remainingWordsStartIdx].classList.remove("selected");
        }
    }
    else{
        // board is solved
        // re-populate the 4th row and mark it as correct
        for (var i = 12; i < 16; i++){
            allCells[i].innerHTML = remainingWords[i - 12];
            allCells[i].classList.add("correct-4")
            allCells[i].classList.add("correct")
        }
        boardCompleted();
    }
}

function solveBoard(){
    // force-solve the board after the game ends
    allCells = document.getElementsByClassName("cell");
    for (var row = 0; row < 4; row++){
        for (var col = 0; col < 4; col++){
            idx = row * 4 + col;
            allCells[idx].innerHTML = solution[row][col];
            allCells[idx].classList.remove("selected");
            allCells[idx].classList.add("correct", "correct-" + (row + 1));
        }
    }
}


// from https://github.com/sindresorhus/array-shuffle, licensed under MIT
function shuffleArray(array) {
    for (let index = array.length - 1; index > 0; index--) {
		const newIndex = Math.floor(Math.random() * (index + 1));
		[array[index], array[newIndex]] = [array[newIndex], array[index]];
	}

	return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


