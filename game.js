/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector('#game');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#pResult');
const game = canvas.getContext('2d');

window.addEventListener('load',resizeGame);
window.addEventListener('resize',resizeGame);   

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined
}

let positionInitial = {
    x: undefined,
    y: undefined
}

const giftPosition = {
    x: undefined,
    y: undefined
}

let enemiesPosition = [];

function startGame() {
    game.font=elementsSize+'px Verdana';
    game.textAlign='end';
    let map = maps[level];

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    
    if(!map) {
        gameWin();
        return;
    }

    let arrayDeObjetos = map.split('  ');
    let arrayPuro = arrayDeObjetos.filter((e) => e.length > 1);
    const arrayUsado = [];

    arrayPuro.forEach(element => {
        arrayDeStrings = element.split('');
        arrayUsado.push(arrayDeStrings);
    });

    showLives();
    enemiesPosition = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    positionInitial.x = undefined;
    positionInitial.y = undefined;

    for(j=1; j<=10; j++) {
        let rowUsada = arrayUsado[j - 1];

        for(i=1; i <= 10; i++) {
            let objetodeLaRow = rowUsada[i - 1];

            if (objetodeLaRow === 'O') {
                if (!playerPosition.x && !playerPosition.y){

                    playerPosition.x = elementsSize*i + 15;
                    playerPosition.y = elementsSize*j - 10;

                    positionInitial.x = elementsSize*i + 15;
                    positionInitial.y = elementsSize*j - 10;
                }
            } else if (objetodeLaRow === 'I') {
                giftPosition.x = elementsSize*i + 15;
                giftPosition.y = elementsSize*j - 10;
            } else if (objetodeLaRow === 'X') {
                    enemiesPosition.push({
                    x : elementsSize*i + 15,
                    y : elementsSize*j - 10
                })
            }
            game.fillText(emojis[objetodeLaRow], elementsSize * i + 15, elementsSize * j - 10);
        }
    }
    movePlayer(); 
}

function movePlayer() {
    const gifCollisionX = playerPosition.x == giftPosition.x;
    const gifCollisionY = playerPosition.y == giftPosition.y;
    const gifCollision = gifCollisionX && gifCollisionY;

    if(gifCollision) {
        levelWin();
    }

    const enemyCollision = enemiesPosition.find(enemy => {
        const enemyCollisionX = enemy.x == playerPosition.x;
        const enemyCollisionY = enemy.y == playerPosition.y;
        return enemyCollisionX && enemyCollisionY;
    })

    if(enemyCollision) {
        levelLose();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function resizeGame() {

    if(window.innerHeight>window.innerWidth) {
        canvasSize=window.innerWidth*0.8;
    } else {
        canvasSize=window.innerHeight*0.8;
    }
    elementsSize = Math.floor(canvasSize / 10); 

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function levelWin() {
    level++;
    startGame();
}

function levelLose() {
    lives--;
    if(lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    clearInterval(timeInterval);
    const recordTime =  localStorage.getItem('record-time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {    
        if (recordTime >= playerTime) {
            localStorage.setItem('record-time', playerTime);
            pResult.innerHTML='Superaste el recordddddd!!!';
        } else {
            pResult.innerHTML='Lo siento no superaste la marca anterior :(';
        }
    } else {
        localStorage.setItem('record-time', playerTime);
        pResult.innerHTML = 'Nuevo record establecido';
    }
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = '';   
    heartsArray.forEach(heart => {
        spanLives.append(heart);    
    });
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record-time');
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key === 'ArrowUp')moveUp();
    else if (event.key === 'ArrowDown') moveDown();
    else if (event.key === 'ArrowLeft') moveLeft();
    else if (event.key === 'ArrowRight') moveRight();
}

function moveUp() {
    if (playerPosition.y === elementsSize - 10) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame(); 
    }
}
function moveLeft() {
    if (playerPosition.x === elementsSize + 15) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame(); 
    }
    
}
function moveRight() {
    if (playerPosition.x + elementsSize >= (elementsSize * 9) + 95) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame(); 
    }
}

function moveDown() {
    if (playerPosition.y === (elementsSize * 10) - 10) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame(); 
    }
}