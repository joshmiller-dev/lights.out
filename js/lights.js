let seconds = 0;
let minutes = 0;
let moves = 0;
let firstClick = false;
var solving = false;
let timer;
let matches1 = 0;
let matches2 = 0;
let solvable = false;
let gridLayout = [];
let firstRow = [];
let secondRow = [];
let thirdRow = [];
let fourthRow = [];
const emptyRow = [0, 0, 0, 0, 0].toString();
const quietPattern1 = [1, 0, 1, 0, 1, 
                       1, 0, 1, 0, 1, 
                       0, 0, 0, 0, 0, 
                       1, 0, 1, 0, 1,
                       1, 0, 1, 0, 1];

const quietPattern2 = [1, 1, 0, 1, 1, 
                       0, 0, 0, 0, 0, 
                       1, 1, 0, 1, 1, 
                       0, 0, 0, 0, 0,
                       1, 1, 0, 1, 1];


init();

function init(){

    //randomizing layout
    randomizeLayout();
    //lights up board if solvable
    lightBoard();
    //handles button logic
    buttonLogic();

    // console.log(gridLayout);
    // console.log(quietPattern1);
    // console.log(quietPattern2);
    // console.log(matches1);
    // console.log(matches2);
    // console.log(solvable);
}


function randomizeLayout(){
    //reset layout each time
    gridLayout = [];

    for(var i = 0; i < $(".square").length; i++){
        var randomNum = Math.random();
        if (randomNum < 0.5){
            gridLayout.push(0);
        }else{
            gridLayout.push(1);
        }
    }
    testSolvability();       
}


function testSolvability(){
    matches1 = 0;
    matches2 = 0;

    //testing generated pattern vs first quiet pattern (comparing number of lit lights)
    for (i = 0; i < gridLayout.length; i++){
        if(gridLayout[i] === 1 && quietPattern1[i] === 1){
            matches1 += 1;
        }
    }

    //number of matches must be even, otherwise start over
    if (matches1 % 2 != 0){
        randomizeLayout();
    }else{
        //test against second pattern if passes first test
        for (i = 0; i < gridLayout.length; i++){
            if(gridLayout[i] === 1 && quietPattern2[i] === 1){
                matches2 += 1;
            }
        }
        if (matches2 % 2 != 0){
            randomizeLayout();
        }else{
            solvable = true;
        }
    }
}


function lightBoard(){
    if (solvable == true){
        for (i = 0; i < gridLayout.length; i++){
            if (gridLayout[i] == 1){
                $(".square").eq(i).toggleClass('lit');
            }
        }
    }
}

function buttonLogic(){

    $(".square").on("click", function(){
        //Only start timer on first click
        if (firstClick == false){
            startTimer();
        }
        //set firstClick to true now
        firstClick = true;

        //track moves
        moves += 1;
        $("#moves").text(moves);

        //capture current firstClick square (by index)
        let clickedLight = $(this).index();
        //Light or darken a square when clicked
        $(this).toggleClass('lit');


        //handling squares on RIGHT side
        if (clickedLight == 4 || clickedLight == 9 || clickedLight == 14 || clickedLight == 19){
            $(this).prev('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            //handling negative number wrapping
            if(clickedLight - 5 >= 0){
                $(".square").eq(clickedLight - 5).toggleClass('lit');
            }

        //handling squares on LEFT side
        }else if (clickedLight == 5 || clickedLight == 10 || clickedLight == 15 || clickedLight == 20) {
            $(this).next('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            if(clickedLight - 5 >= 0){
                $(".square").eq(clickedLight - 5).toggleClass('lit');
            }

        }else{
            //otherwise handle middle squares as normal
            $(this).prev('.square').toggleClass('lit');
            $(this).next('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            if(clickedLight - 5 >= 0){
                $(".square").eq(clickedLight - 5).toggleClass('lit');
            }
        }
    
        //handling win condition
        if($(".square:not(.lit)").length === 25){
            setTimeout(function(){
                gameWin();
            }, 500);
        }

        //updating the gridlayout as we go
        for (i = 0; i < gridLayout.length; i++){
            if ($(".square").eq(i).hasClass("lit")){
                gridLayout[i] = 1;
            }else{
                gridLayout[i] = 0;
            }
        }

        firstRow = gridLayout.slice(0,5).toString();
        secondRow = gridLayout.slice(5, 10).toString();
        thirdRow = gridLayout.slice (10, 15).toString();
        fourthRow = gridLayout.slice (15, 20).toString();
    
        if(solving == true){
            solveGame();
        }
        //remove marked squares if following solution
        if ($(this).hasClass("mark")){
            $(this).removeClass('mark');
        }

    });


    //Reset Button
    $(".reset").on("click", function(){
        reset();
    });

}

function startTimer(x){
    //Handle the reset
    if (x == 1){
        clearInterval(timer);
        seconds = 0;
        minutes = 0;
        $("#seconds").text("0" + seconds);
        $("#minutes").text(minutes);
    }else{
        timer =  setInterval(function(){
        if(seconds < 59){
            seconds += 1;
            //Keep the zero for single digit
            if(seconds <10){
                $("#seconds").text("0" + seconds);
            }else{
                $("#seconds").text(seconds);
            }
        }else{
            seconds = 0;
            minutes += 1;
            $("#minutes").text(minutes);
        }
        }, 1000);
    }
}


function gameWin(){
    clearInterval(timer);
    setTimeout(function(){
        alert("You have won in: " + minutes + " minutes, " + seconds + " seconds using " + moves + " moves!");
    }, 500);
}

function reset(){
    moves = 0;
    $("#moves").text(moves);
    solvable = false;
    firstClick = false;
    if ($(".square").hasClass("mark")){
        $(".square").removeClass('mark');
    }
    solvable = false;
    firstRow = [];
    secondRow = [];
    thirdRow = [];
    fourthRow = [];
    randomizeLayout();
    lightBoard();
    //reset timer
    startTimer(1);
}

$(".solve").on("click", function(){
    //remove previously marked squares
    for (i = 0; i < gridLayout.length; i++){
        $(".square").eq(i).removeClass("mark");
    }
    solving = true;
    solveGame();
});

function solveGame(){
    
    //mark solution squares for first row
    if (firstRow !== emptyRow){
        for (var i = 0; i < 5; i++){
            if ($(".square").eq(i).hasClass("lit")){
                $(".square").eq(i + 5).addClass('mark');
            }else{
                $(".square").eq(i + 5).removeClass('mark');
            }
        }
    }

    //if first row is fully unlit, solve second row, and so on...
    if (firstRow == emptyRow){
        for (var i = 5; i < 10; i++){
            if ($(".square").eq(i).hasClass("lit")){
                $(".square").eq(i + 5).addClass('mark');
            }else{
                $(".square").eq(i + 5).removeClass('mark');
            }
        }       
    }
    if (secondRow == emptyRow){
        for (var i = 10; i < 15; i++){
            if ($(".square").eq(i).hasClass("lit")){
                $(".square").eq(i + 5).addClass('mark');
            }else{
                $(".square").eq(i + 5).removeClass('mark');
            }
        }      
    }
    if (thirdRow == emptyRow){
        for (var i = 15; i < 20; i++){
            if ($(".square").eq(i).hasClass("lit")){
                $(".square").eq(i + 5).addClass('mark');
            }else{
                $(".square").eq(i + 5).removeClass('mark');
            }
        }
    }
    if (firstRow == emptyRow && secondRow == emptyRow && thirdRow == emptyRow && fourthRow == emptyRow){
        //final steps
        //if light A5 is on, mark D1 and E1
        //if light B5 is on, mark B1 and E1
        //if light C5 is on, mark D1
        if ($(".square").eq(20).hasClass("lit")){
            $(".square").eq(3).addClass('mark');
            $(".square").eq(4).addClass('mark');
        }else if ($(".square").eq(21).hasClass("lit")){
            $(".square").eq(1).addClass('mark');
            $(".square").eq(4).addClass('mark');
        }else if ($(".square").eq(22).hasClass("lit")){
            $(".square").eq(3).addClass('mark');
        }  
    }
}

