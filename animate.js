/*global score*/
var score = 0;
var isGameOver = 0;
window.addEventListener("resize", center);
document.addEventListener("click", shoot);
function center() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    document.getElementById("player").style.left = (w / 2) + "px";
    document.getElementById("start").style.left = (w / 2) + "px";
}

document.addEventListener('mousemove', (event) => {
    //  console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
    var player = document.getElementById("player");
    var pspawn = document.getElementById("pspawn");

    var x1 = player.offsetLeft;
    var y1 = window.innerHeight - pspawn.offsetHeight + player.offsetTop;

    var x2 = event.clientX;
    var y2 = event.clientY;

    var t = (x1 - x2) / (y2 - y1);
    var rad = Math.atan(t);
    var deg = rad * (180 / 3.141592653);
    //console.log(t + " " + deg);
    player.style.transform = "rotate(" + deg + "deg)";
});


function shoot() {
    // console.log("shoot");
    var player = document.getElementById("player");
    player.style.backgroundImage = "url('src/ps-removebg-preview.png')";
    setTimeout(function () { player.style.backgroundImage = "url('src/player.png')"; }, 200);
}

window.onload = function () {
    var width = window.innerWidth;

    var strt = document.createElement("button");
    strt.setAttribute("id", "start");
    strt.style.position = "absolute";
    strt.style.height = "40px";
    strt.style.width = "100px";
    strt.innerHTML = "START";
    strt.style.color = "yellow";
    strt.style.fontSize = "20px";
    strt.style.border = "none";
    strt.style.backgroundColor = "purple";
    strt.style.top = "50%";
    strt.style.left = (width / 2) + "px";
    strt.style.transform = "translate(-50%,-50%)";
    strt.addEventListener("click", function () {
        strt.style.visibility = "hidden";
        startGame();
    })
    var parent = document.getElementById("game");
    parent.appendChild(strt);
}
function startGame() {

    center();
    document.getElementById("player").style.visibility = "visible";

    //create life
    var lifebar = document.getElementById("life");
    for (var i = 0; i < 3; i++) {
        var life = document.createElement("div");
        life.setAttribute("id", "l" + i);
        life.style.backgroundImage = "url('src/life.png')";
        life.style.backgroundSize = "cover";
        life.style.height = "40px";
        life.style.width = "40px";
        life.style.margin = "10px";
        lifebar.appendChild(life);
    }
    var speed = 1;
    var loop = setInterval(function () {
        console.log("speed: " + speed);
        if (score != 0 && score % 2 == 0)
            speed += 0.1;                       // speed factor
        var pos = 0;//virus pos;
        var xindex = Math.random() * window.innerWidth;
        if (isGameOver == 0)
            createVirus(xindex, pos, speed);
        else
            clearInterval(loop);
    }, 1000);

}
function createVirus(xindex, pos, speed) {
    var loop = null;
    var fadeout = null;
    var parent = document.getElementById("bg");
    var x = document.createElement("div");
   
    x.style.position = "absolute";
    x.style.top = "-10px";
    x.style.left = xindex + "px";
    var vindex = parseInt((Math.random() * 3) + 1, 10);
    var clickCount = 0;
    if(score != 0 && score%10 ==0){
        x.style.backgroundImage = "url('src/boss.png')";
        x.style.height = "100px";
        x.style.width = "100px";
        //listener
        
        x.addEventListener("click", function () {
        clickCount++;
        if (clickCount == 2) {
            clearInterval(loop);
            clearInterval(fadeout);
            x.remove();
            score+=3;
            document.getElementById("score").innerHTML = "Score: " + score;
        }
    });
    }
    else{
        x.style.backgroundImage = "url('src/v" + vindex + ".png')";
        x.style.height = "60px";
        x.style.width = "60px";
        //listener
      
        x.addEventListener("click", function () {
        clickCount++;
        if (clickCount == 1) {
            clearInterval(loop);
            clearInterval(fadeout);
            x.remove();
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
        }
    });
    }
    x.style.backgroundSize = "cover";
    parent.appendChild(x);
    //animation
    var border = parseInt(window.innerHeight * 0.6, 10);
    var flag = 0;
    loop = setInterval(function () {
        // console.log(pos);
        pos += speed;
        x.style.top = pos + "px";
        if (flag == 0 && pos >= border) {
            flag = 1;
            var i = 9;
            fadeout = setInterval(function () {
                x.style.opacity = "0." + i;
                if (i == 0) {
                    clearInterval(fadeout);
                    clearInterval(loop);
                    x.remove();
                    dead();
                }
                i--;
            }, 100);

        }
    }, 10);
    
}
var lifeCount = 3;
function dead() {
    if (lifeCount > 0) {
        console.log("life " + lifeCount);
        var life = document.getElementById("l" + (lifeCount - 1));
        life.style.visibility = "hidden";
        lifeCount--;
    }
    if (lifeCount == 0) {
        //gave over
        isGameOver = 1;
        if(window.localStorage.getItem('highestscore') < score)
            window.localStorage.setItem('highestscore', score);

        var parent = document.getElementById("game");
        var gameover = document.createElement("div");
        gameover.setAttribute("id", "gameover");
        gameover.style.height = "200px";
        gameover.style.width = "400px";
        gameover.style.fontFamily = "'Pacifico', cursive";
        gameover.style.position = "absolute";
        gameover.innerHTML = "GAME OVER";
        gameover.style.textAlign = "center";
        gameover.style.paddingTop = "140px";
        gameover.style.fontSize = "30px";
        gameover.style.fontWeight = "bold";
        var width = window.innerWidth;
        var height = window.innerHeight;
        gameover.style.left = (width / 2) + "px";
        gameover.style.top = (height / 2) + "px";
        gameover.style.zIndex = "10";
        gameover.style.transform = "translate(-50%, -50%)";
        gameover.style.backgroundColor = "white";
        parent.appendChild(gameover);
        var highestScore = document.createElement("div");
        highestScore.style.margin="10px";
        highestScore.style.fontSize = "20px";
        highestScore.style.fontFamily = "'Pacifico', cursive";
        highestScore.innerHTML="Highest Score: "+window.localStorage.getItem('highestscore');
        var Score = document.createElement("div");
        Score.style.margin="10px";
        Score.style.fontSize = "20px";
        Score.style.fontFamily = "'Pacifico', cursive";
        Score.innerHTML="Your Score: "+score;
        gameover.appendChild(highestScore);
        gameover.appendChild(Score);
    }
}