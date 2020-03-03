const width = 10;
const height = 10;

// Our "domain" objects, they are simple objects that implement the logic without worrying about presentation
class Game
{
    constructor(width, height, minesCount)
    {
        this.reset(width, height, minesCount);
    }

    // These members are for "public" use e.g. on the document

    flag(x, y)
    {
        if (this.isGameOver())
            return;

        const cell = this.getCell(x, y);
        if (cell.flagged || this.getNumberOfFlags() < this.maxNumberOfFlags)
            cell.flag();
    }

    open(x, y)
    {
        if (this.isGameOver())
            return;
        
        const cell = this.getCell(x, y);

        if (cell.containsMine)
        {
           this.die();
        }
        else
        {
            cell.open();
        }
    }

    reset(width, height, minesCount)
    {
        this.cellsGrid = createCellsGrid(width, height, minesCount);
        this.width = width;
        this.height = height;
        this.maxNumberOfFlags = minesCount;
        this.gameOver = null;
    }

    // These members are for "protected" use e.g. internally and for presentation

    isGameOver()
    {
        return this.gameOver !== null;
    }

    getCell(x, y)
    {
        return this.cellsGrid.getItem(x, y);
    }

    getNumberOfFlags()
    {
        return this.cellsGrid.getItems().filter(cell => cell.flagged).length;
    }

    getNumberOfMinesIn3x3(x, y)
    {
        let count = 0;
        for (let i = -1; i <= 1; i++ )
        {
            for (let j = -1; j <= 1; j++ )
            {
                const cell = this.getCell(x + i, y + j);
                if (cell !== undefined && cell.containsMine)
                    count++;
            }
        }

        return count;
    }

    // These members are for "private" use

    die()
    {
        this.gameOver = new GameOver(true);
    }
}

class Cell
{
    constructor(containsMine)
    {
        this.containsMine = containsMine;
        this.opened = false;
        this.flagged = false;
    }

    flag()
    {
        if (this.opened)
            return;
        
        this.flagged = !this.flagged;
    }

    open()
    {
        this.opened = true;
        this.flagged = false;
    }
}

class GameOver
{
    constructor(mineWasDetonated)
    {
        this.mineWasDetonated = mineWasDetonated;
    }
}

// Utility class for working in coordinate space
class Grid
{
    constructor()
    {
        this.items = { };
    }

    addItem(x, y, item)
    {
        const previousItem = this.getItem(x, y);
        if (previousItem !== undefined)
        {
            console.error(`Warning: overwriting item at (${x},${y})!`)
        }
        this.items[`${x},${y}`] = item;
    }

    getItem(x, y)
    {
        return this.items[`${x},${y}`];
    }

    getItems()
    {
        return Object.values(this.items);
    }
}

// Create a grid composed of cells containing the specified number of randomly-placed mines
function createCellsGrid(width, height, minesCount)
{
    const randomIntSet = createRandomIntSet(width * height, minesCount);
    const cellsGrid = new Grid();

    for ( let x = 0; x < width; x++ )
    {
        for ( let y = 0; y < height; y++ )
        {
            const isMineCell = randomIntSet.has(y * width + x);
            cellsGrid.addItem(x, y, new Cell(isMineCell));
        }
    }

    return cellsGrid;
}

// Create a set of random ints of a given size with the given bound
function createRandomIntSet(exclusiveMaximum, count)
{
    const set = new Set()
    while (set.size < count)
    {
        set.add(Math.floor(Math.random() * exclusiveMaximum))
    }

    return set;
}

// Presentation below

const boardSectionElement = document.getElementById("board");

let game = new Game(width, height, 10);

function resetGame()
{
    game.reset(width, height, 10);
    render();
}

function onResetButton()
{
    resetGame();
}

function onCellRightClicked(x, y)
{
    game.flag(x, y);
    render();
}

function onCellLeftClicked(x, y)
{
    game.open(x, y);
    render();
}

function createCellElement(x, y)
{
    const cell = game.getCell(x, y);
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");

    if (game.isGameOver() && cell.containsMine)
    {
        cellElement.classList.add("mine");
        return cellElement;
    }

    if (!cell.opened)
    {
        if (cell.flagged)
        {
            cellElement.classList.add("flag");
        }
        else
        {
            cellElement.classList.add("block");
        }
    }
    else
    {
        const numberOfNeighborMines = game.getNumberOfMinesIn3x3(x, y);
        if (numberOfNeighborMines > 0)
        {
            const numberClassName = toNumberClassName(numberOfNeighborMines);
            cellElement.classList.add(numberClassName);
        }
    }

    return cellElement;
}

const rightButton = 2;
const leftButton = 0;

function render()
{
    boardSectionElement.innerHTML = "";
    boardSectionElement.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            let cellElement = createCellElement(x, y);

            cellElement.addEventListener("mousedown", event =>
            {
                if (event.button == rightButton)
                {
                    onCellRightClicked(x, y);
                }
                else if (event.button == leftButton)
                {
                    onCellLeftClicked(x, y);
                }
            });

            boardSectionElement.appendChild(cellElement);
        }   
    }
}

function toNumberClassName(number)
{
    switch (number)
    {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        case 6:
            return "six";
        case 7:
            return "seven";
        case 8:
            return "eight";
        
    }
}

resetGame();