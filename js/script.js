var colors = ["BLUE", "GREEN", "RED", "YELLOW"];

function startGame(){
    score.innerHTML = scoreValue;
    time.innerHTML = 30;
    setInterval(timer, 1000);
    reset();
}

var correct = document.getElementById("correct");
var incorrect = document.getElementById("incorrect");
var time = document.getElementById("time");
var score = document.getElementById("score");
var scoreValue = 0

function checkColor(color, correctAnswer){
    if(color == correctAnswer){
        scoreValue++;
        correct.classList.add("fadeAway");
    }else{
        scoreValue--;
        incorrect.classList.add("fadeAway");
    }
    setTimeout(function(){
        correct.classList.remove("fadeAway");
        incorrect.classList.remove("fadeAway");
    }, 1000);
    reset();
    score.innerHTML = scoreValue;
}

function reset(){
    var randomPosition = Math.floor(Math.random() * 2);
    if(randomPosition == 0){
        var color1 = document.getElementById("color1");
        var color2 = document.getElementById("color2");
    }else{
        var color2 = document.getElementById("color1");
        var color1 = document.getElementById("color2");
    }
    document.getElementById("start").style.display = "none";
    var randomColor = Math.floor(Math.random() * 4);
    var correctAnswer = colors[randomColor];
    color1.innerHTML = correctAnswer;
    color2.style.color = correctAnswer;
    if(randomColor + 1 == 4){
        color2.innerHTML = colors[randomColor - 3];
    }else{
        color2.innerHTML = colors[randomColor + 1];
    }
    if(randomColor - 1 == -1){
        color1.style.color = colors[randomColor + 3];
    }else{
        color1.style.color = colors[randomColor - 1];
    }
    addClick("BLUE", correctAnswer);
    addClick("GREEN", correctAnswer);
    addClick("RED", correctAnswer);
    addClick("YELLOW", correctAnswer);
}

function addClick(color, correctAnswer){
    var colorSpan = document.getElementById(color);
    let check = "checkColor(".concat(color, ",", correctAnswer, ")");
    colorSpan.setAttribute("onclick", check);
}

var countdown = 29;

function timer(){
    time.innerHTML = countdown;
    if(countdown == -1){
        alert("Game Over. Score: " + scoreValue);
        location.reload();
    }
    countdown--;
}