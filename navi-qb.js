
let currDimension;
let qbObj = { icon: "url('templates/images/nqb-icon_easy.png')", dimension: 0, currTop: 0, newTop: 0, currLeft: 0, newLeft: 0, orientation: 0 };
let stop = false;
let history = [];
let timerId;

const getDimension = () => {
    const grid = document.getElementById("gamegrid");
    const dimension = grid.clientHeight / 5;
    return dimension;
}

const getNewDimension = () => {
    const newDimension = getDimension();
    return newDimension;
}

const getGridTiles = () => {
    let gridTiles = [];
    const gridTile = ["castle", "cornfield", "farm", "lake", "mountain", "shipwreck", "tree", "stonehenge"];
    for (let tile of gridTile) {
        gridTiles.push(`url('templates/images/${tile}.png')`);
    }
    for (i = 0; i < 21; i++) {
        gridTiles.push("url('templates/images/field.png')");
    }
    const shuffle = (a, l = a.length, r = ~~(Math.random() * l)) => l ? ([a[r], a[l - 1]] = [a[l - 1], a[r]], shuffle(a, l - 1))
        : a;    // shuffling needs optimizing!
    shuffle(gridTiles);

    gridTiles = ["url('templates/images/pier.png')", ...gridTiles];

    return gridTiles;
}

const gridSetup = (grid, tiles) => {

    for (i = 1; i <= 30; i++) {
        const newSquare = document.createElement("div");

        newSquare.setAttribute("id", `sq${i}`);
        newSquare.setAttribute("class", "square");
        newSquare.setAttribute("style", `background-image:${tiles[i - 1]}`)
        newSquare.appendChild(document.createElement("p"));
        newSquare.childNodes[0].innerHTML = i;
        grid.appendChild(newSquare);
    };
}

const qbSetup = (grid, dimension, object, elem) => {
    // object.icon = ;
    object.dimension = dimension;
    object.currTop = dimension * 4;
    elem.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${object.icon}; top: ${object.currTop}px`);
    grid.appendChild(elem);
}

const qbResize = (object, elem) => {
    const dimension = getNewDimension();
    let ratio = dimension / currDimension;
    object.currTop *= ratio;
    object.currLeft *= ratio;
    elem.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${object.icon};
    top: ${object.currTop}px; left: ${object.currLeft}px; transform: rotate(${object.orientation}deg)`);
    currDimension = dimension;
}

const setCmdSlot = (slot, grid) => {
    const newSlot = document.createElement("div");

    newSlot.setAttribute("id", slot);
    newSlot.setAttribute("class", "cmdslot");
    newSlot.setAttribute("ondrop", "drop(event)");
    newSlot.setAttribute("ondragover", "allowDrop(event)");
    if (i === 1) {
        newSlot.setAttribute("style", "background-image: url('templates/images/StArrow.png')");
    }
    if (i >= 5 && i <= 8) {
        newSlot.setAttribute("style", "transform: rotate(180deg)");
    }
    grid.appendChild(newSlot);
}

const cmdGridSetup = () => {
    const cmdGrid = document.getElementById("cmdgrid");

    for (i = 12; i >= 9; i--) {
        const cmdSlot = `cmd${i}`;
        setCmdSlot(cmdSlot, cmdGrid);
    };
    for (i = 5; i <= 8; i++) {
        const cmdSlot = `cmd${i}`;
        setCmdSlot(cmdSlot, cmdGrid);
    };
    for (i = 4; i >= 1; i--) {
        const cmdSlot = `cmd${i}`;
        setCmdSlot(cmdSlot, cmdGrid);
    };
}

const fnGridSetup = () => {
    const fnGrid = document.getElementById("fngrid");

    for (i = 4; i >= 1; i--) {
        const fnSlot = `fn${i}`;
        setCmdSlot(fnSlot, fnGrid);
    };
}

const setIcon = (cmd, offset) => {
    for (i = 1; i <= 4; i++) {
        const slot = document.getElementById(`iconslot${i + offset}`);
        const obj = { id: `${cmd}${i}`, class: `${cmd}` };
        const newIcon = document.createElement("div");

        newIcon.setAttribute("id", obj.id);
        newIcon.setAttribute("class", obj.class);
        newIcon.setAttribute("draggable", "true");
        newIcon.setAttribute("ondragstart", "drag(event)");
        newIcon.setAttribute("onclick", "sglClick(event)");
        newIcon.setAttribute("title", `iconslot${i + offset}`); //there might be a more appropriate way to store original parent info?
        slot.appendChild(newIcon);
    }
}


const iconSetup = () => {
    setIcon("forward", 0);
    setIcon("turnleft", 4);
    setIcon("turnright", 8);
    setIcon("negate", 12);
    setIcon("func", 16);
}

const iconGridSetup = () => {
    const iconGrid = document.getElementById("icongrid");

    for (i = 1; i <= 20; i++) {
        const newSlot = document.createElement("div");

        newSlot.setAttribute("id", `iconslot${i}`);
        newSlot.setAttribute("class", "iconslot");
        newSlot.setAttribute("ondrop", "drop(event)");
        newSlot.setAttribute("ondragover", "allowDrop(event)");
        iconGrid.appendChild(newSlot);
    }

    iconSetup();
}

//Dragging command icons
const allowDrop = (event) => {
    event.preventDefault();
}

const drag = (event) => {
    event.dataTransfer.setData("text", event.target.id);
}

const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    let empty = ["cmdslot", "iconslot"].includes(event.target.className);
    if (empty) {
        event.target.appendChild(document.getElementById(data));
    }
}

const findEmptySlot = () => {
    for (i = 1; i <= 12; i++) {
        let slot = document.getElementById(`cmd${i}`);
        if (!slot.childNodes[0]) return slot;
    }
}

const sglClick = (event) => {
    event.preventDefault();
    const icon = event.target;
    const parent = document.getElementById(icon.title);
    const slot = findEmptySlot();

    if (icon.parentElement.id === icon.title) {
        slot.appendChild(icon);
    }
    else {
        parent.appendChild(icon);
    }
}

const turn90 = (direction, object, elem) => {
    if (direction === "+") {
        object.orientation += 90;
    }
    if (direction === "-") {
        object.orientation -= 90;
    }
    elem.style.transform = `rotate(${object.orientation}deg)`;
}

const goRight = (comm, object, elem) => {
    if (object.currLeft >= object.newLeft) {
        clearInterval(comm);
    } else {
        object.currLeft++;
        elem.style.left = `${object.currLeft.toFixed(2)}px`;
    }
}

const goLeft = (comm, object, elem) => {
    if (object.currLeft <= object.newLeft) {
        clearInterval(comm);
    } else {
        object.currLeft--;
        elem.style.left = `${object.currLeft.toFixed(2)}px`;
    }
}

const goUp = (comm, object, elem) => {
    if (object.currTop <= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop--;
        elem.style.top = `${object.currTop.toFixed(2)}px`;
    }
}

const goDown = (comm, object, elem) => {
    if (object.currTop >= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop++;
        elem.style.top = `${object.currTop.toFixed(2)}px`;
    }
}

const getDirection = (orientation) => {
    let direction = (orientation / 90) % 4;
    if (direction === 0) return "up";
    if ([1, -3].includes(direction)) return "right";
    if ([2, -2].includes(direction)) return "down";
    if ([-1, 3].includes(direction)) return "left";
}

const getNextCommand = (item, dimension, object, elem) => {
    let command;

    if (item === "turnright") {
        command = turn90("+", object, elem);
    }
    if (item === "turnleft") {
        command = turn90("-", object, elem);
    }
    if (item === "forward") {
        const direction = getDirection(object.orientation);
        switch (direction) {
            case "up":
                object.newTop = object.currTop - dimension;
                const up = setInterval(() => { goUp(up, object, elem) }, 5);
                command = goUp(up, object, elem);
                break;
            case "right":
                object.newLeft = object.currLeft + dimension;
                const right = setInterval(() => { goRight(right, object, elem) }, 5);
                command = goRight(right, object, elem);
                break;
            case "down":
                object.newTop = object.currTop + dimension;
                const down = setInterval(() => { goDown(down, object, elem) }, 5);
                command = goDown(down, object, elem);
                break;
            case "left":
                object.newLeft = object.currLeft - dimension;
                const left = setInterval(() => { goLeft(left, object, elem) }, 5);
                command = goLeft(left, object, elem);
        }
    }
    if (item === "backward") {
        switch (object.orientation) {
            case 0:
                object.newTop = object.currTop + dimension;
                const down = setInterval(() => { goDown(down, object, elem) }, 5);
                command = goDown(down, object, elem);
                break;
            case 90:
                object.newLeft = object.currLeft - dimension;
                const left = setInterval(() => { goLeft(left, object, elem) }, 5);
                command = goLeft(left, object, elem);
                break;
            case 180:
                object.newTop = object.currTop - dimension;
                const up = setInterval(() => { goUp(up, object, elem) }, 5);
                command = goUp(up, object, elem);
                break;
            case -90:
                object.newLeft = object.currLeft + dimension;
                const right = setInterval(() => { goRight(right, object, elem) }, 5);
                command = goRight(right, object, elem);
        }
    }
    return command;
}

const getFuncList = () => {
    let funcList = [];
    for (f = 1; f <= 4; f++) {
        let child = document.getElementById(`fn${f}`).childNodes[0];
        if (child) {
            let cmdClass = child.getAttribute("class");
            if (cmdClass === "func") {
                alert("Infinite loops not allowed!\nRemove function call from function list.");
            }
            else {
                funcList.push(cmdClass);
            }
        }
        else {
            break;
        }
    }

    return funcList;
}

const getCommandList = () => {
    let commandList = [];
    for (i = 1; i <= 12; i++) {
        let child = document.getElementById(`cmd${i}`).childNodes[0];
        if (child) {
            let cmdClass = child.getAttribute("class");
            if (cmdClass === "func") {
                let funkList = getFuncList();
                for (j = 0; j < funkList.length; j++) {
                    commandList.push(funkList[j]);
                }
            }
            else {
                commandList.push(cmdClass);
            }
        }
        else {
            break;
        }
    }

    // console.log('commandList: ', commandList);
    return commandList;
}

const negItem = (item) => {
    switch (item) {
        case "forward":
            return "backward";
        case "backward":
            return "forward";
        case "turnright":
            return "turnleft";
        case "turnleft":
            return "turnright";
        default:
            return item;
    }
}

const animQb = (commandList) => {
    const grid = document.getElementById("gamegrid");
    const dimension = getDimension(grid);
    const qb = document.getElementById("qb");

    if (stop) stop = false;

    for (let i = 0; i < commandList.length; i++) {
        let item = commandList[i];

        if (item === "negate") {
            i++;
            item = negItem(commandList[i]);
        }

        ((i) => {         //Immediate Invoking Function Expression(IIFE)
            setTimeout(() => {
                if (!stop) {
                    getNextCommand(item, dimension, qbObj, qb);
                    history.push(item);
                };
            }, 4000 * i);
        })(i);
    }
}

const replay = () => {

    history.reverse();
    let playBack = history.map(negItem);
    history = [];
    animQb(playBack);
}


const resetCmd = () => {

    for (i = 1; i <= 12; i++) {
        const cmdSlot = document.getElementById(`cmd${i}`);
        if (cmdSlot.childNodes[0]) cmdSlot.childNodes[0].remove();
    }
    for (i = 1; i <= 4; i++) {
        const fnSlot = document.getElementById(`fn${i}`);
        if (fnSlot.childNodes[0]) fnSlot.childNodes[0].remove();
    }
    for (i = 1; i <= 20; i++) {
        const iconSlot = document.getElementById(`iconslot${i}`);
        if (iconSlot.childNodes[0]) iconSlot.childNodes[0].remove();
    }
    iconSetup();
    stop = true;
}

const debounceFn = (func, delay) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay);
}

window.onload = () => {
    const grid = document.getElementById("gamegrid");
    const gridTiles = getGridTiles();
    const qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    const dimension = getDimension();
    qbObj.dimension = dimension;
    currDimension = dimension;

    gridSetup(grid, gridTiles);
    cmdGridSetup();
    fnGridSetup();
    iconGridSetup();
    qbSetup(grid, dimension, qbObj, qb);
    addEventListener("resize", () => { debounceFn(qbResize(qbObj, qb), 500) });
}
