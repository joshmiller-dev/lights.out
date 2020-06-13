const squares = document.querySelectorAll('.square');
var seconds = 0;
var minutes = 0;
var clicked = false;
var timer;


init();

function init(){
    //handles light logic
    lightLogic();
    //randomizing layout
    randomizeLayout();
}

//Reset Button
$("#reset").on("click", function(){
    reset();
});

//Cheat Button
$("#cheat").on("click", function(){
    $(".square").removeClass('lit');
});


function lightLogic(){
    //Light or darken a square when clicked
    $(".square").on("click", function(){
     
        //Only start timer on first click
        if (clicked == false){
            startTimer(0);
        }
        //set clicked to true now
        clicked = true;

        //Light or darken a square when clicked
        $(this).toggleClass('lit');
        //capture current clicked square
        var clickedLight = $(this).index();

        //handling squares on RIGHT side
        if (clickedLight == 4 || clickedLight == 9 || clickedLight == 14 || clickedLight == 19){
            $(this).prev('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            //handling negative number weirdness
            if(clickedLight - 5 > 0){
                $(".square").eq(clickedLight - 5).toggleClass('lit');
            }
            // console.log(clickedLight);
            // console.log($(".square:not(.lit)").length);
        //handling squares on LEFT side
        }else if (clickedLight == 5 || clickedLight == 10 || clickedLight == 15 || clickedLight == 20) {
            $(this).next('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            if(clickedLight - 5 > 0){
                $(".square").eq(clickedLight - 5).toggleClass('lit');
            }

        }else{
            //otherwise handle middle squares as normal
            $(this).prev('.square').toggleClass('lit');
            $(this).next('.square').toggleClass('lit');
            $(".square").eq(clickedLight + 5).toggleClass('lit');
            if(clickedLight - 5 > 0){
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


}

console.log();

function randomizeLayout(){
    for(var i = 0; i < squares.length; i++){
        //make sure too many are not lit up at start & cover cases where reset was hit
        if ($(".lit").length < 20 || clicked == false){
            var randomNum = Math.random();
            if (randomNum < 0.5){
                squares[i].classList.toggle('lit');
            }
        }else{
            return
        }
    }
}

function startTimer(x){
    //Handle the reset if x = 1
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
    // $(".banner").css("background-color", "black");
    // $(".body").css("background-color", "black");
    setTimeout(function(){
        alert("You have won in: " + minutes + " minutes : " + seconds + " seconds!");
    }, 500);
}

function reset(){
    clicked = false;
    randomizeLayout();
    startTimer(1);
}

