const RIGHT = 2
const LEFT = 0

const COLORS = ["blue", "green", "red", "navy", "maroon", "teal", "black", "gray"]

function addParagraph(text, parent) {
    if (text != 0) {
        p = document.createElement("p")
        p.innerText = text
        p.style.color = (COLORS[text - 1])
        parent.appendChild(p)
    }
}

const equalSets = function(a, b) {
    return a.size == b.size && [...a].map(element => b.has(element)).reduce((previous, current) => previous && current)
}

class Board {
    constructor(width, height, mines) {
        this.width = width
        this.height = height
        this.mines = mines
        this.boardElement = document.getElementById("board")
        this.boardElement.style.gridTemplateColumns = `repeat(${width}, 1fr)`
        this.addMines()
        this.flagged = new Set()
        this.unopened = new Set(new Array(width * height).keys())
            //this.showAllSquares(this.squares)
    }

    showAllSquares(squares) { // this and showAllMines should be one function
        squares.forEach((square, index) => this.showSquare(index, square.squareElement, true, true))
    }

    showSquare(index, squareElement, win, repeated) { // this should just take in index
        squareElement.classList.add("opened")
        if (this.mineSet.has(index)) {
            squareElement.classList.add("mine")
            if (!win) {
                squareElement.classList.add("lost")
                if (!repeated)
                    this.showAllMines(false)
            } else {
                squareElement.classList.add("won")
            }
        } else {
            addParagraph(this.squares[index].value, squareElement)
        }
    }

    revealNeighbors(index) {
        if (this.squares[index].value == 0) {

        }
    }

    showAllMines(win) {
        this.mineSet.forEach(mine => {
            this.showSquare(mine, this.squares[mine].squareElement, win, true)
        })
    }

    addMines() {
        this.mineSet = new Set()
        while (this.mineSet.size < this.mines) {
            this.mineSet.add(Math.floor(Math.random() * this.width * this.height))
        }
        //console.log(this.mineSet)
        this.addNumbers()
    }

    newSquareElement() {
        let squareElement = document.createElement("div")
        squareElement.classList.add("square")
        return squareElement
    }

    addNumbers() {
        this.squares = new Array()

        for (let i = 0; i < this.width * this.height; i++) {
            this.squares[i] = { value: 0, squareElement: this.newSquareElement() }
        }
        this.mineSet.forEach((element) => {
            this.findNeighbors(element).forEach((neighbor) => {
                this.squares[neighbor].value++
            })
        })
        this.squares.forEach((element, index) => {
            this.boardElement.appendChild(element.squareElement)
            this.addListeners(element, index)
        })
    }

    addListeners(element, index) {
        element.squareElement.addEventListener("mousedown", event => {
            if (event.button == RIGHT) {
                element.squareElement.classList.toggle("flag")
                if (this.flagged.has(index)) {
                    this.flagged.delete(index)
                } else {
                    this.flagged.add(index)
                }
            } else if (event.button == LEFT) {
                this.unopened.delete(index)
                this.showSquare(index, element.squareElement)
            }
            this.checkWin()
        })
    }

    checkWin() {
        console.log({ mineSet: this.mineSet, flagged: this.flagged, unopened: this.unopened })

        if (equalSets(this.mineSet, this.flagged) || equalSets(this.mineSet, this.unopened) || equalSets(this.mineSet, new Set([...this.flagged, ...this.unopened]))) {
            this.showAllMines(true)
        }
    }

    findIndex(x, y) {
        return y * this.width + x
    }

    findNeighbors(index) {
        const neighbors = [],
            y = Math.floor(index / this.width),
            x = index % this.width

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const currentX = x + i,
                    currentY = y + j
                if (currentX >= 0 && currentX < this.width && currentY >= 0) {
                    let currentIndex = this.findIndex(currentX, currentY)
                    if (currentIndex != index && currentIndex < this.width * this.height) {
                        neighbors.push(currentIndex)
                    }
                }
            }
        }
        return neighbors
    }
}

function createBoard(width, height, mines) {
    console.log("creating board...")
    const myBoard = new Board(width, height, mines)
    console.log("board creation completed.")
}