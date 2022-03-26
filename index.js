//Global scope

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let player = new Paddle(5, 125, 10, 40); // used as constructor function
let computer = new Paddle(520, 125, 10, 150); // used as constructor function

let ball = {
    x: 270, y: 150, radius: 6, ballSpeedX: 2, ballSpeedY: 0,
    reverseX : function() {
        this.ballSpeedX *= -1;
    },
    reverseY : function() {
        this.ballSpeedY *= -1;
    },
    reset : function() {
        this.x = 270,
        this.y = 150;
        this.ballSpeedX = 2;
        this.ballSpeedY = 0;
    },
    ballIsBouncing : function() {
        return ball.ballSpeedY != 0;
    },
    modifyBallSpeedXby : function(increaseGameSpeed) { 
        increaseGameSpeed = this.ballSpeedX < 0 ? increaseGameSpeed * -1 : increaseGameSpeed; 
        let nextValue = this.ballSpeedX + increaseGameSpeed;
        nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;
        this.ballSpeedX = nextValue;  
    },
    modifyBallSpeedYby : function(increaseGameSpeed) {
        increaseGameSpeed = this.ballSpeedY < 0 ? increaseGameSpeed * -1 : increaseGameSpeed;
        this.ballSpeedY += increaseGameSpeed;
    }
}; // object literal.

function Paddle(x, y, width, height) {
    // Constructor function for thr paddle x2 (player and computer).
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ballSpeedIncrease = 0;
    this.ballHitWall = function(ball) {
        let leftSideTable = this.x;
        let rightSideTable = this.x + this.width;
        let topOfTable = this.y;
        let bottomOfTable = this.y + this.height;
            if (ball.x > leftSideTable && ball.x < rightSideTable && ball.y > topOfTable && ball.y < bottomOfTable) {
                return true;
            } 
        return false;
    };
    this.move = function(keyCode) {
        let nextY = this.y;
        
        if (keyCode == 80) { 
            nextY += -2.5;
            this.ballSpeedIncrease = 1.5;
        } else if (keyCode == 76) { 
            nextY += 2.5;
            this.ballSpeedIncrease = 1.5;
        } else {
            this.ballSpeedIncrease = 0;
        }

        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 300 ? 300 - this.height : nextY;
        this.y = nextY;
    }
};

function drawPaddle(Paddle) {
    ctx.fillStyle = "#87CEFA"; //LightSkyBlue
    ctx.fillRect(Paddle.x, Paddle.y, Paddle.width, Paddle.height)
    
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false); //reads variable ball line 6.
    ctx.fillStyle = "#FF8C00"; //DarkOrange
    ctx.fill();
};

function movingBall() {
        ball.x += ball.ballSpeedX;
        ball.y += ball.ballSpeedY;
            if (ball.x <= 0) { //|| ball.x >= 535
                alert('Computer Won');
                ball.reset();
            }
            if (ball.x >= 535) {
                alert('Player Won');
                ball.reset();
            }
            if (ball.y <= 0 || ball.y >= 291) {
                ball.reverseY()
            }

        let ballHitPlayerPaddle = player.ballHitWall(ball);
        let ballHitComputerPaddle = computer.ballHitWall(ball);
            if (ballHitPlayerPaddle || ballHitComputerPaddle) {
                ball.reverseX();
                ball.modifyBallSpeedXby(0.25);
                let speedUpValue = ballHitPlayerPaddle ? player.ballSpeedIncrease : computer.ballSpeedIncrease;
                ball.modifyBallSpeedYby(speedUpValue);
            }
            for(let keyCode in heldDown) {
                player.move(keyCode);
            }
            let computerAiPapple = computer.y + (computer.height / 2);
                if (computerAiPapple < ball.y) {
                    computer.move(76)
                }
                if (computerAiPapple > ball.y) {
                    computer.move(80);
                }
};

function drawGame() {
    // setTimeOut clock function at line 9.
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, 550, 300);
    drawPaddle(player);
    drawPaddle(computer);
    drawBall(ball);
};

function clock() {
    movingBall();
    drawGame(); 
    window.setTimeout("clock()", 1000/50);
};

let heldDown = {};
window.addEventListener("keydown", function(event) {
    heldDown[event.keyCode] = true;
    }, false);

window.addEventListener("keyup", function(event) {
    delete heldDown[event.keyCode];
    }, false);

clock(); // Renders all graphics before being called.
