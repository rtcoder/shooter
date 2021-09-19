window.addEventListener('resize', resize);
window.addEventListener('click', () => {
    if (mouseOverEndGameButton) {
        game.newGame();
        mouseOverEndGameButton = false;
    }
});
window.addEventListener('mousemove', updateMousePosition);
document.querySelector('#new-game')
    .addEventListener('click', showCharacters)
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup);
[...document.querySelectorAll('.characters img')]
    .forEach(img =>
        img.addEventListener('click', selectCharacter))
window.onload = resize;

function keydown(event) {
    if (event.keyCode === 32) {
        KEYS.SPACE = true
    }
    if (event.keyCode === 38) {
        KEYS.UP = true
    }
    if (event.keyCode === 40) {
        KEYS.DOWN = true
    }
}

function keyup(event) {
    if (event.keyCode === 32) {
        KEYS.SPACE = false;
    }
    if (event.keyCode === 38) {
        KEYS.UP = false;
    }
    if (event.keyCode === 40) {
        KEYS.DOWN = false;
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function selectCharacter(event) {
    const name = event.target.getAttribute('src');
    game.setPlayerName(name);
    newGame();
}

function showCharacters() {
    document.body.classList.add('game-select-character');
}

function newGame() {
    loopId = requestAnimationFrame(loop)
    document.body.classList.remove('game-select-character');
    document.body.classList.add('game-start');
}

function updateMousePosition(event) {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
}
