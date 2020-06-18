var seconds = 0;
var minutes = 0;
var firstClick = false;
var timer;
var matches1 = 0;
var matches2 = 0;
var solvable = false;
var gridLayout = [];
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
    //handles light logic
    buttonLogic();


    console.log(gridLayout);
    console.log(quietPattern1);
    console.log(quietPattern2);
    console.log(matches1);
    console.log(matches2);
    console.log(solvable);
}

function randomizeLayout(){
    gridLayout = [];

    for(var i = 0; i < $(".square").length; i++){
        var randomNum = Math.random();
        if (randomNum < 0.5){
            gridLayout.push(1);
        }else{
            gridLayout.push(0);
        }
    }
    testSolvability();       
}

function testSolvability(){
    matches1 = 0;
    matches2 = 0;

    //testing generated pattern vs first quiet pattern
    for (i = 0; i < gridLayout.length; i++){
        if(gridLayout[i] === 1 && quietPattern1[i] === 1){
            matches1 += 1;
        }
    }

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

        //Light or darken a square when clicked
        $(this).toggleClass('lit');
        //capture current firstClick square
        var clickedLight = $(this).index();

        //handling squares on RIGHT side
        if (clickedLight == 4 || clickedLight == 9 || clickedLight == 14 || clickedLight == 19){
            $(this).prev('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            //handling negative number weirdness
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
    });

    //Reset Button
    $("#reset").on("click", function(){
        reset();
    });

    // //Cheat Button
    // $("#cheat").on("click", function(){
    //     $(".square").removeClass('lit');
    // });

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
        alert("You have won in: " + minutes + " minutes : " + seconds + " seconds!");
    }, 500);
}

function reset(){
    solvable = false;
    firstClick = false;
    randomizeLayout();
    lightBoard();
    //reset timer
    startTimer(1);
}
