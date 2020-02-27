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

        this.getCell(x, y).flag();
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

    getNumberOfMinesIn3x3(x, y)
    {
        let count = 0;
        for (let i = -1; i <= 1; i++ )
        {
            for (let j = -1; j <= 1; j++ )
            {
                const cell = getCell(x + i, y, + j);
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
        this.flagged = !this.flagged;
    }

    open()
    {
        this.opened = true;
    }
}

class GameOver
{
    constructor(mineWasDetonated, finalScore)
    {
        this.mineWasDetonated = mineWasDetonated;
        this.finalScore = finalScore;
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

const game = new Game(10, 10, 10);
console.log(game);
game.flag(0, 0);
game.flag(1, 1);
game.flag(2, 2);
console.log(game);