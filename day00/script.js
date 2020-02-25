player = {
    x: 0,
    y: 0,
    moveLeft: function() {
        this.x -= 1;
    },
    moveRight: function() {
        this.x += 1;
    },
    moveUp: function() {
        this.y -= 1;
    },
    moveDown: function() {
        this.y += 1;
    },
    savings: 0
};

money = {
    x: 3,
    y: 3,
    available: true
};

const playerElement = document.getElementById("player");
const moneyElement = document.getElementById("money");
const scoreElement = document.getElementById("score");

function update()
{
    player.x = Math.max(0, Math.min(8, player.x));
    player.y = Math.max(0, Math.min(5, player.y));

    if (money.available && player.x === money.x && player.y === money.y)
    {
        player.savings += 1;
        money.available = false;
    }

    playerElement.style = createPositionStyle(player);
    moneyElement.style = createPositionStyle({ ...money, visible: money.available });
    scoreElement.textContent = `$${player.savings}.00`;
}

function createPositionStyle(anchor)
{
    return `
    position: absolute;
    left: ${anchor.x * 128}px;
    top: ${anchor.y * 128 + 128}px;
    visibility: ${mapVisibility(anchor.visible)};
    `;
}

function mapVisibility(bool)
{
    if (bool === undefined || bool)
        return "visible";
    return "hidden";
}

function handleKeyPress(event)
{
    if (event.code === "ArrowUp")
        player.moveUp();
    else if (event.code === "ArrowRight")
        player.moveRight();
    else if (event.code === "ArrowDown")
        player.moveDown();
    else if (event.code === "ArrowLeft")
        player.moveLeft();

    update();
}

document.addEventListener('keydown', handleKeyPress);
update();