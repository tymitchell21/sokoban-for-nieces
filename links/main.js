// const mapOriginal = [  
//     "  WWWWW ",  
//     "WWW   W ",  
//     "WOSB  W ",  
//     "WWW BOW ",  
//     "WOWWB W ",  
//     "W W O WW",  
//     "WB XBBOW",  
//     "W   O  W",  
//     "WWWWWWWW"  
// ]

// const map = mapOriginal.map(row => [...row]);
const startButton = document.querySelector('#start-button')
const mapSelector = document.querySelector('#map-selector')
console.log(mapSelector.value)

const directions = {
    ArrowUp: () => move(-1, +0),
    ArrowRight: () => move(+0, +1),
    ArrowDown: () => move(+1, +0),
    ArrowLeft: () => move(+0, -1)
}

const legend = {
    'W': 'walls',
    'S': 'start',
    'B': 'box',
    'O': 'storage',
    'X': 'stored',
    ' ': 'blank'
}

const destination = document.querySelector('#game-wrap');
let winNumber
let finalMap = []
let createMaze = []

function startGame () {
    destination.innerHTML = ''
    const mapChoice = maps[mapSelector.value]
    finalMap = mapChoice.map(row => [...row])

    winNumber = 0
    finalMap.map (x => {
        x.map (y => {
            if (y==='O' || y==='X') {
                winNumber ++
            }
        })
    })

    createMaze = finalMap.map ((cellRow,row)=> {
        createRow(row)
        return cellRow.map ((cell,column) => {
            return addCell(cell,row,column)
        })
    })
}

function addCell (piece,column,row) {
    let newCell = document.createElement('div')

    if (piece === 'B') {
        let box = createBox(legend[piece])
        newCell.appendChild(box)
        newCell.classList.add('blank')
    } else if (piece === 'S') {
        newCell.classList.add(legend[piece])
        newCell.appendChild(createCharacter())
    } else if (piece === 'X') {
        let box = createBox(legend[piece])
        newCell.appendChild(box)
        newCell.classList.add('blank')
    } else {
        newCell.classList.add(legend[piece])
    }

    newCell.id = `[${column}][${row}]`
    newCell.dataset.column = Number(row)
    newCell.dataset.row = Number(column)

    let columnDest = document.getElementById(column)
    columnDest.appendChild(newCell)
    return newCell
}

// creates new column
function createRow (row) {
    let newRow = document.createElement('div')
    newRow.id = row
    newRow.className = 'row'
    destination.appendChild(newRow)
}

// creates the character
function createCharacter () {
    let newCharacter = document.createElement('div')
    newCharacter.id = 'character'

    return newCharacter
}

// create box
function createBox (className) {
    let newBox = document.createElement('div')
    newBox.classList.add(className)

    return newBox
}

// calls directions
function dir (event) {
    event.preventDefault()
    if (!event.key.includes('Arrow')) return
    directions[event.key]();
}

// makes moves
function move (rowOffSet, columnOffSet) {
    const character = document.querySelector('#character')

    const characterRow = Number(character.parentNode.dataset.row)
    const characterColumn = Number(character.parentNode.dataset.column)
    const nextRow = characterRow + rowOffSet
    const nextColumn = characterColumn + columnOffSet
    const nextNextRow = characterRow + (rowOffSet*2)
    const nextNextColumn = characterColumn + (columnOffSet*2)

    const nextCellKey = finalMap[nextRow][nextColumn]
    const nextNextCellKey = finalMap[nextNextRow][nextNextColumn]

    const nextCell = createMaze[nextRow][nextColumn]
    const nextNextCell = createMaze[nextNextRow][nextNextColumn]

    if(nextCellKey === ' ' || nextCellKey === 'S' || nextCellKey === 'O'){
        nextCell.appendChild(character)
    }
    else if((nextCellKey === 'B' && nextNextCellKey === ' ') || (nextCellKey === 'B' && nextNextCellKey === 'S')){
        updateMap(' ','B')
        movePlayerBox('box')
    }
    else if(nextCellKey === 'B' && nextNextCellKey === 'O') {
        updateMap(' ','X')
        movePlayerBox('stored')
        nextNextCell.classList.remove('storage')
        nextNextCell.classList.add('blank')
    }
    else if (nextCellKey === 'X' && nextNextCellKey === ' ') {
        updateMap('O','B')
        movePlayerBox('box')
        nextCell.classList.remove('blank')
        nextCell.classList.add('storage')
    }
    else if (nextCellKey === 'X' && nextNextCellKey === 'O') {
        updateMap('O','X')
        movePlayerBox('stored')
        nextCell.classList.remove('blank')
        nextCell.classList.add('storage')
        nextNextCell.classList.remove('storage')
        nextNextCell.classList.add('blank')
    }

    // moves player and box
    function movePlayerBox (stored) {
        const box = createBox(stored)
    
        nextCell.firstElementChild.remove()
        nextCell.appendChild(character)
        nextNextCell.appendChild(box)
    }

    // updates map array
    function updateMap (valueOfNextCell, valueOfNextNextCell) {
        finalMap[nextRow][nextColumn] = valueOfNextCell
        finalMap[nextNextRow][nextNextColumn] = valueOfNextNextCell
    }

    winCheck()
}// hey

// checks for a win
function winCheck() {
    let count = 0;
    finalMap.map (row => {
        row.map (box => {
            if (box === 'X') count++
        })
    })
    if (count === winNumber) youWin()
}

// displays a win
function youWin() {
    destination.innerHTML = ''
    const jesus = document.createElement('img')
    jesus.src = 'links/img/jesus.gif'
    destination.appendChild(jesus)

    // setTimeout(() => {
    //     location.reload()
    // }, 3000)
}

document.addEventListener('keydown', dir)
startButton.addEventListener('click', startGame)
