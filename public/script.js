var play = document.getElementById("play");
var color1 = document.getElementById("color1");
var color2 = document.getElementById("color2");
var restart = document.getElementById("restart");
var score = document.getElementById("score");
var save = document.getElementById("save");
var correct = document.getElementById("correct");
var incorrect = document.getElementById("incorrect");
var info = document.getElementById("info");
var bar = document.getElementById("bar");

var colors = ["PURPLE", "BLUE", "PINK", "ORANGE", "GREEN"];
var hexColors = ["#7F58AF", "#64C5EB", "#E84D8A", "#FEB326", "#6D8B74"];

var scoreValue = 0

function startGame() {
    play.style.display = "none";
    setInterval(timer, 1000);
    bar.classList.add("fadeIn");
    color1.style.display = "block";
    color2.style.display = "block";
    color3.style.display = "block";
    reset();
}

function checkColor(color, correctAnswer) {
    if (color == correctAnswer) {
        scoreValue++;
        correct.classList.add("fadeAway");
    } else {
        scoreValue--;
        incorrect.classList.add("fadeAway");
    }
    setTimeout(function () {
        correct.classList.remove("fadeAway");
        incorrect.classList.remove("fadeAway");
    }, 1000);
    reset();
}

function reset() {
    var randomPosition = Math.floor(Math.random() * 6);
    if (randomPosition == 0) {
        var color1 = document.getElementById("color1");
        var color2 = document.getElementById("color2");
        var color3 = document.getElementById("color3");
    } else if (randomPosition == 1) {
        var color1 = document.getElementById("color1");
        var color3 = document.getElementById("color2");
        var color2 = document.getElementById("color3");
    } else if (randomPosition == 2) {
        var color2 = document.getElementById("color1");
        var color1 = document.getElementById("color2");
        var color3 = document.getElementById("color3");
    } else if (randomPosition == 3) {
        var color2 = document.getElementById("color1");
        var color3 = document.getElementById("color2");
        var color1 = document.getElementById("color3");
    } else if (randomPosition == 4) {
        var color3 = document.getElementById("color1");
        var color1 = document.getElementById("color2");
        var color2 = document.getElementById("color3");
    } else if (randomPosition == 5) {
        var color3 = document.getElementById("color1");
        var color2 = document.getElementById("color2");
        var color1 = document.getElementById("color3");
    }

    var randomColor = Math.floor(Math.random() * 5);
    var correctAnswer = colors[randomColor];
    color1.innerHTML = correctAnswer;
    color2.style.color = hexColors[randomColor];

    do {
        var randomWrong1 = Math.floor(Math.random() * 5);
    }while(randomWrong1 == randomColor);

    do {
        var randomWrong2 = Math.floor(Math.random() * 5);
    }while(randomWrong2 == randomColor || randomWrong2 == randomWrong1);

    do {
        var randomWrong3 = Math.floor(Math.random() * 5 );
    }while(randomWrong3 == randomColor || randomWrong3 == randomWrong1 || randomWrong3 == randomWrong2)

    do {
        var randomWrong4 = Math.floor(Math.random() * 5 );
    }while(randomWrong4 == randomColor || randomWrong4 == randomWrong1 || randomWrong4 == randomWrong2 || randomWrong4 == randomWrong3)

    color2.innerHTML = colors[randomWrong1];

    color1.style.color = hexColors[randomWrong2];

    color3.innerHTML = colors[randomWrong3];
    color3.style.color = hexColors[randomWrong4];

    addClick("PURPLE", correctAnswer);
    addClick("BLUE", correctAnswer);
    addClick("PINK", correctAnswer);
    addClick("ORANGE", correctAnswer);
    addClick("GREEN", correctAnswer);
}

function addClick(color, correctAnswer) {
    var colorSpan = document.getElementById(color);
    let check = "checkColor(".concat(color, ",", correctAnswer, ")");
    colorSpan.setAttribute("onclick", check);
}

function removeClick(color) {
    var colorSpan = document.getElementById(color);
    colorSpan.removeAttribute("onclick");
}

function restartGame() {
    restart.style.display = "none";
    score.innerHTML = "PLAY";
    save.style.display = "none";
    location.reload();
}

function saveScore() {
    const URL = "/auth/save"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        score: scoreValue
    }));
    restart.style.display = "none";
    score.innerHTML = "PLAY";
    save.style.display = "none";
    info.classList.add("fadeInfo");
    setTimeout(function () {
        info.classList.remove("fadeInfo");
        location.reload();
    }, 3000);
}

var countdown = 19;

function timer() {
    if (countdown == 0) {
        clearInterval(timer);
        color1.style.display = "none";
        color2.style.display = "none";
        color3.style.display = "none";
        bar.classList.remove("fadeIn");
        removeClick("PURPLE");
        removeClick("BLUE");
        removeClick("PINK");
        removeClick("ORANGE");
        removeClick("GREEN");
        score.style.display = "block";
        save.style.display = "block";
        restart.style.display = "block";
        score.innerHTML = "SCORE: " + scoreValue;
        save.innerHTML = "SAVE";
        restart.innerHTML = "RESTART";
    }
    countdown--;
}