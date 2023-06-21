//memilih canvas
const cvs = document.getElementById('cPong');
const ctx = cvs.getContext('2d'); 

// load sounds
let bg = new Audio();
let hit = new Audio();
let wall = new Audio();
let player1Score = new Audio();
let player2Score = new Audio();

bg.src = "Sound/Soundtrack.mp3";
hit.src = "Sound/ponghitNew.mp3";
wall.src = "Sound/ponghitNew.mp3";
player1Score.src = "Sound/comScore.mp3";
player2Score.src = "Sound/userScore.mp3";

//Tombol
const keyPressed = {
    W: false,
    S: false,
    Up: false,
    Down: false
}

//Membuat Player 1
const player1 = {
x : 0,
y : cvs.height/2 - 100/2,
width : 15,
height : 100, 
color : "white",
score : 0,  
speed : 8
}

//Membuat Player 2
const player2 = {
    x : cvs.width - 15,
    y : cvs.height/2 - 100/2,
    width : 15,
    height : 100, 
    color : "white",
    score : 0,  
    speed : 8
}

// Net
const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

//Bola
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 11,
    velocityX : 5,
    velocityY : 5,
    color : "yellow"
}


// fungsi untuk Net
function drawNet(){
    for (let i=0; i <= cvs.height; i += 15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//function untuk rectangle
function drawRect(x,y,w,h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}


//Function untuk lingkaran
function drawCircle(x,y,r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath(); 
    ctx.fill();
}


//function untuk text
function drawText(text,x,y, color){
    ctx.fillStyle = color;
    ctx.font = "70px fantasy";
    ctx.fillText(text,x,y);
}

//Reset Ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 11;
}

// Mendeteksi Tabrakan atau Pantulan
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    return b.right > p.left && b.bottom > p.top && b.left < p.right && 
    b.top < p.bottom;
}

// Fungsi update : Positions, Movement, Score
function update(){
 
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if( ball.x - ball.radius < 0 ){
        player2.score++;
        player2Score.play();
        if(player2.score === 5) {
            player1.score = 0;
            player2.score = 5;
            alert("Player 2 Win!");
            window.location.href="winner.html";
        }
        resetBall();
        document.getElementById("player2-score").textContent = player2.score;
    }
    else if( ball.x + ball.radius > cvs.width){
        player1.score++;
        player1Score.play();
        if(player1.score === 5) {
            player1.score = 5;
            player2.score = 0;
            alert("Player 1 Win!");
            window.location.href="winner.html";
        }
        resetBall();
        document.getElementById("player1-score").textContent = player1.score;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x < cvs.width/2) ? player1 : player2;

    if (collision(ball, player)){
        // play sound
        bg.play();
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

//Fungsi untuk menghidupkan Tombol
function updateKeyPresses() {
    if (keyPressed['W']) {
        if (player1.y > 0) {
            player1.y -= player1.speed;
        }
    }
    if (keyPressed['S']) {
        if (player1.y < cvs.height - player1.height) {
            player1.y += player1.speed;
        }
    }
    if (keyPressed['Up']) {
        if (player2.y > 0) {
            player2.y -= player2.speed;
        }
    }
    if (keyPressed['Down']) {
        if (player2.y < cvs.height - player2.height) {
            player2.y += player2.speed;
        }
    }
}

/**
 * Key Listeners
 */
document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    if (code === 'KeyW') {
        keyPressed['W'] = true;
    }
    if (code === 'KeyS') {
        keyPressed['S'] = true;
    }
    if (code === 'ArrowUp') {
        keyPressed['Up'] = true;
    }
    if (code === 'ArrowDown') {
        keyPressed['Down'] = true;
    }

}, false);

document.addEventListener('keyup', (event) => {
    var name = event.key;
    var code = event.code;

    if (code === 'KeyW') {
        keyPressed['W'] = false;
    }
    if (code === 'KeyS') {
        keyPressed['S'] = false;
    }
    if (code === 'ArrowUp') {
        keyPressed['Up'] = false;
    }
    if (code === 'ArrowDown') {
        keyPressed['Down'] = false;
    }

}, false);

// Menjalankan semua fungsi
function render(){
    //canvas atau lapangan
    drawRect(0, 0, cvs.width, cvs.height,  "#134474");

    //Net
    drawNet();

    //Score
    drawText(player1.score, cvs.width/4, cvs.height/5,  "White");
    drawText(player2.score, 3*cvs.width/4, cvs.height/5,  "White");

    //Papan Player 1 dan Player 2
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);

    //Bola
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    
}

//fungsi game
function game(){
    updateKeyPresses();
    update();
    render();
}

//loop
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);

//Tombol Pause
const pauseButton = document.getElementById('pauseButton');
//fungsi pause
function pause() {
    // menghentikan pergerakan bola
    ball.velocityX = 0;
    ball.velocityY = 0;
    // menghentikan pergerakan pemain
    player1.speed = 0;
    player2.speed = 0;
    // menghentikan suara
    bg.pause();
    hit.pause();
    wall.pause();
    player1Score.pause();
    player2Score.pause();
}

//Tombol play
const playButton = document.getElementById('playButton');
function play() {
// menggerakkan pergerakan bola
ball.velocityX = 5;
ball.velocityY = 5;
// menghentikan pergerakan pemain
player1.speed = 8;
player2.speed = 8;
// menghentikan suara
bg.play();
hit.play();
wall.play();
player1Score.play();
player2Score.play();
}
  


  
