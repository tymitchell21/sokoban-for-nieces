const mapOriginal = [  
    "  WWWWW ",  
    "WWW   W ",  
    "WOSB  W ",  
    "WWW BOW ",  
    "WOWWB W ",  
    "W W O WW",  
    "WB XBBOW",  
    "W   O  W",  
    "WWWWWWWW"  
]

const map = mapOriginal.map(row => [...row]);

const map2 = [  
    "    WWWWW          ",  
    "    W   W          ",  
    "    WB  W          ",  
    "  WWW  BWW         ",  
    "  W  B B W         ",  
    "WWW W WW W   WWWWWW",  
    "W   W WW WWWWW  OOW",  
    "W B  B          OOW",  
    "WWWWW WWW WSWW  OOW",  
    "    W     WWWWWWWWW",  
    "    WWWWWWW        "  
 ]

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
        newCell.classList.add('storage')
    } else {
        newCell.classList.add(legend[piece])
    }

    newCell.id = `[${column}][${row}]`
    newCell.dataset.column = Number(row)
    newCell.dataset.row = Number(column)

    let columnDest = document.getElementById(column)
    columnDest.appendChild(newCell)
}

// creates new column
function createColumn (column) {
    let newCell = document.createElement('div')
    newCell.id = column
    newCell.className = 'column'
    destination.appendChild(newCell)
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

    const nextCellKey = map[nextRow][nextColumn]
    const nextNextCellKey = map[nextNextRow][nextNextColumn]

    const nextCell = document.getElementById(`[${nextRow}][${nextColumn}]`)
    const nextNextCell = document.getElementById(`[${nextNextRow}][${nextNextColumn}]`)

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
    }else if (nextCellKey === 'X' && nextNextCellKey === ' ') {
        updateMap('O','B')
        movePlayerBox('box')
    }

    // moves player and box
    function movePlayerBox (stored) {
        const box = createBox(stored)
    
        nextCell.firstElementChild.remove()
        nextCell.appendChild(character)
        nextNextCell.appendChild(box)
    }

    // updates map array
    function updateMap (value1, value2) {
        map[characterRow+rowOffSet][characterColumn + columnOffSet] = value1
        map[characterRow+(rowOffSet*2)][characterColumn + (columnOffSet*2)] = value2
    }

    winCheck()
}

// checks for a win
function winCheck() {
    let count = 0;
    map.map (row => {
        row.map (box => {
            if (box === 'X') count++
        })
    })
    if (count === 7) youWin()
}

// displays a win
function youWin() {
    destination.innerHTML = ''
    const jesus = document.createElement('img')
    jesus.src = 'links/img/jesus.gif'
    destination.appendChild(jesus)
}

// runs youWon() function
function youWon() {
    win.style.display = 'block'
    start.innerHTML = 'Try Again'
    start.style.display = 'block'
    document.removeEventListener('keydown', dir);
}

// builds maze when start button is clicked
const createMaze = map.map ((x,column)=> {
        createColumn(column)
        x.map ((z,row) => {
            addCell(z,column,row)
        })
})

document.addEventListener('keydown', dir)