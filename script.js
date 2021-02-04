
class EventEmmitter { //im creating the listener
    constructor() {
        this.listeners = {};
    }


    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }

    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(l => l(message, payload));
        }
    }
    clear() {
        this.listeners = {};
    }
}


//Creating classes
class GameObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    rectFromGameObj() { //gives us the position of the objects
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width
        }
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 99), (this.height = 75);
        this.type = 'Player';
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 3;
        this.points = 0;
    }
    fire() {
        gameObjects.push(new Laser(this.x + 45, this.y - 10));
        this.cooldown = 500;

        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
            } else {
                clearInterval(id);
            }
        }, 200);
    }
    canFire() {
        return this.cooldown === 0;
    }
    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }
    incrementPoints() {
        this.points += 100;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 98), (this.height = 50);
        this.type = 'Enemy';
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id);
            }
            if (this.y === 600) {
                this.img = expImg;
                expSound.play();
                setTimeout(this.dead = true, 100)
            }
        }, 300);
    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = "Laser";
        this.img = laserImg;

        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id)
            }
        }, 100)
    }
}

// Adding sounds
let expSound = new Audio("Assets/ExpSound.mp3");
let fireSound = new Audio("Assets/FireSound.mp3");


//To load images
function loadAsset(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        }
    })
}

//Checking for collision

function intersectRect(r1, r2) {//if false then no collision happened
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
}


const Messages = {
    Move_Left: "Move_Left",
    Move_Right: "Move_Right",
    Move_Up: "Move_Up",
    Move_Down: "Move_Down",
    Fire_Space: "Fire_Space",
    Col_Enemy_Laser: "Col_Enemy_Laser",
    Col_Enemy_Player: "Col_Enemy_Player",
    Game_End_Win: "Game_End_Win",
    Game_End_Loss: "Game_End_Loss",
    Key_Event_Enter: "Key_Event_Enter",
};

let playerImg,
    enemyImg,
    laserImg,
    lifeImg,
    canvas,
    ctx,
    gameObjects = [],
    player,
    gameLoopId,
    eventEmmitter = new EventEmmitter();

//Events

//this is to prevent special keys to ruin my keyup event 
let onKeyDown = function (e) {
    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40:
        case 32:
            e.preventDefault();
            break
        default:
            break;
    }
};
window.addEventListener('keydown', onKeyDown);


window.addEventListener('keyup', (evt) => { //moving the player
    if (evt.key === 'ArrowDown') eventEmmitter.emit(Messages.Move_Down);
    else if (evt.key === 'ArrowUp') eventEmmitter.emit(Messages.Move_Up);
    else if (evt.key === 'ArrowLeft') eventEmmitter.emit(Messages.Move_Left);
    else if (evt.key === 'ArrowRight') eventEmmitter.emit(Messages.Move_Right);
    else if (evt.key === "a") eventEmmitter.emit(Messages.Fire_Space);
    else if (evt.key === "Enter") eventEmmitter.emit(Messages.Key_Event_Enter);
});


function createEnemies() {
    const monsterTotal = 5;
    const monsterWidth = monsterTotal * 98;
    const startx = (canvas.width - monsterWidth) / 2;
    const stopx = startx + monsterWidth;

    for (let x = startx; x < stopx; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            let enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createPlayer() {
    player = new Player(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
    player.img = playerImg;
    gameObjects.push(player);
}

function whatImage() {
    if (player.life === 2) {
        return player2Img
    }
    if (player.life === 1) {
        return player3Img
    }
}

function updateGameObjects() {
    const enemies = gameObjects.filter(go => go.type === "Enemy");
    const lasers = gameObjects.filter(go => go.type === "Laser");
    //Laser hits smth
    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObj(), m.rectFromGameObj())) { //if laser and enemy collide
                m.img = expImg;
                setTimeout(() => {
                    eventEmmitter.emit(Messages.Col_Enemy_Laser, {
                        first: l,
                        second: m,
                    });
                }, 100)

            }
        });
    });
    enemies.forEach((enemy) => {
        const playerRect = player.rectFromGameObj();
        if (intersectRect(playerRect, enemy.rectFromGameObj())) { //if player and enemy collide
            enemy.img = expImg;
            setTimeout(() => {
                eventEmmitter.emit(Messages.Col_Enemy_Player, { enemy });
            }, 200)

        }
    });
    gameObjects = gameObjects.filter(go => !go.dead)
}



function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}



function initGame() {
    gameObjects = [];
    createEnemies();
    createPlayer();

    eventEmmitter.on(Messages.Move_Down, () => {
        player.y += 10;
    });
    eventEmmitter.on(Messages.Move_Up, () => {
        player.y -= 10;
    });
    eventEmmitter.on(Messages.Move_Left, () => {
        player.x -= 20;
    });
    eventEmmitter.on(Messages.Move_Right, () => {
        player.x += 20;
    });
    eventEmmitter.on(Messages.Fire_Space, () => {
        if (player.canFire()) {
            player.fire();
            fireSound.play();
        }
    });
    eventEmmitter.on(Messages.Col_Enemy_Laser, (_, { first, second }) => {
        player.incrementPoints();
        first.dead = true;
        second.dead = true;
        expSound.play();

        if (isEnemyDead()) {
            eventEmmitter.emit(Messages.Game_End_Win);
        }

    })
    eventEmmitter.on(Messages.Col_Enemy_Player, (_, { enemy }) => {
        if (!enemy.dead) {
            enemy.dead = true;
            expSound.play();
            player.decrementLife();
            player.img = whatImage();
        }

        if (isPlayerDead()) {
            eventEmmitter.emit(Messages.Game_End_Loss);
            return
        }
        if (isEnemyDead()) {
            eventEmmitter.emit(Messages.Game_End_Win);
        }
    })
    eventEmmitter.on(Messages.Game_End_Win, () => {
        endGame(true);
    })
    eventEmmitter.on(Messages.Game_End_Loss, () => {
        endGame(false);
    })
    eventEmmitter.on(Messages.Key_Event_Enter, () => {
        resetGame();
    })
}

function endGame(win) {
    clearInterval(gameLoopId);

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win) {
            displayMessage("Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
                "green");
        } else {
            displayMessage("You died !!! Press [Enter] to start a new game Captain Pew Pew", "red");
        }
    }, 200)
}

function isPlayerDead() {
    return player.life <= 0;
}

function isEnemyDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemies.length === 0;
}


function drawLife() {
    const START_POS = canvas.width - 180;
    for (let i = 0; i < player.life; i++) {
        ctx.drawImage(lifeImg, START_POS + 45 * (i + 1), canvas.height - 37);
    }
}

function drawPoints() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'left';
    drawText('Points: ' + player.points, 10, canvas.height - 20);
}

function drawText(message, x, y) {
    ctx.fillText(message, x, y);
}
function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    if (gameLoopId) {
        clearInterval(gameLoopId);
        eventEmmitter.clear();
        initGame();
        gameLoopId = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawPoints();
            drawLife();
            updateGameObjects();
            drawGameObjects(ctx);
        }, 100);
    }
}


window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    playerImg = await loadAsset("Assets/player.png");
    player2Img = await loadAsset("Assets/player2.png");
    player3Img = await loadAsset("Assets/player3.png");
    enemyImg = await loadAsset("Assets/enemyShip.png");
    laserImg = await loadAsset("Assets/laserRed.png");
    expImg = await loadAsset("Assets/explosion.png");
    lifeImg = await loadAsset("Assets/life.png");


    initGame();
    gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, canvas.width, canvas.height) // Creating background
        drawPoints();
        drawLife();
        updateGameObjects();
        drawGameObjects(ctx)

    }, 100);
}












