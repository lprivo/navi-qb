
let currDimension;
let qbObj = { icon: "url('templates/images/nqb-icon_easy.png')", dimension: 0, currTop: 0, newTop: 0, currLeft: 0, newLeft: 0, orientation: 0 };
let stop = false;
let history = [];
let timerId;
let gridObjects = [];
let target;

const debounceFn = (func, delay) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay);

}

const toggleBTN = (button) => {
    let elem = document.getElementById(button);
    elem.disabled = !elem.disabled;
}

const toggleElement = (elem) => {
    let element = document.getElementById(elem);
    element.style.display === "block" ? element.style.display = "none" : element.style.display = "block";
}

function getDimension() {
    const grid = document.getElementById("gamegrid");
    const dimension = grid.clientHeight / 5;
    return dimension;
}

const setGridPositions = (dimension) => {
    gridObjects = [];
    for (i = 0; i < 5; i++) {
        let idOffset = i * 6;
        for (j = 1; j <= 6; j++) {
            let gridObj = {};
            gridObj.id = j + idOffset;
            gridObj.top = i * dimension;
            gridObj.left = (j - 1) * dimension;
            gridObjects.push(gridObj);
        }
    }
    // console.log('gridObjects: ', gridObjects);
}

const getGridTiles = () => {
    let gridTiles = [];
    const gridTile = ["castle", "cornfield", "farm", "lake", "mountain", "shipwreck", "stonehenge", "tree"];
    for (let tile of gridTile) {
        gridTiles.push(`${tile}`);
    }
    for (i = 0; i < 21; i++) {
        gridTiles.push("field");
    }
    const shuffle = (a, l = a.length, r = ~~(Math.random() * l)) => l ? ([a[r], a[l - 1]] = [a[l - 1], a[r]], shuffle(a, l - 1))
        : a;    // shuffling needs optimizing!
    shuffle(gridTiles);

    gridTiles = ["pier", ...gridTiles];

    return gridTiles;
}

const gridSetup = (grid, tiles) => {

    for (i = 1; i <= 30; i++) {
        const newSquare = document.createElement("div");

        newSquare.setAttribute("id", `sq${i}`);
        newSquare.setAttribute("class", "square");
        newSquare.setAttribute("style", `background-image: url('templates/images/${tiles[i - 1]}.png')`);
        newSquare.appendChild(document.createElement("p"));
        newSquare.childNodes[0].innerHTML = i;
        grid.appendChild(newSquare);
        gridObjects[i - 1].icon = `${tiles[i - 1]}`;
    };
}

const qbSetup = (grid, dimension, object, elem) => {
    let fields = [];
    for (let i in gridObjects) {
        if (gridObjects[i].icon === "field") fields.push(i);
    }
    const n = Math.floor(Math.random() * fields.length);
    let orientation = [0, 90, 180, -90];
    const o = Math.floor(Math.random() * orientation.length);

    // object.icon = ;
    object.dimension = dimension;
    object.currTop = gridObjects[fields[n]].top;
    object.currLeft = gridObjects[fields[n]].left;
    object.orientation = orientation[o];
    elem.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${object.icon};
    top: ${object.currTop}px; left: ${object.currLeft}px; transform: rotate(${object.orientation}deg)`);
    grid.appendChild(elem);
}

const qbResize = (object, elem) => {
    const dimension = getDimension();
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

const getMission = () => {
    let mission = "";
    let poi = [];

    for (let i in gridObjects) {
        if (gridObjects[i].icon !== "field") poi.push(i);
    }

    const n = Math.floor(Math.random() * poi.length);

    target = poi[n];
    mission = `Go to the ${gridObjects[poi[n]].icon.toUpperCase()}<br>at square Nr: ${gridObjects[poi[n]].id}!`;

    return mission;
}

const showModal = (id, message) => {
    const parent = document.getElementById("gamegrid");
    let modal = document.createElement("div");

    modal.setAttribute("id", `${id}`);
    modal.setAttribute("class", "modal");
    modal.setAttribute("style", "display: block");
    modal.setAttribute("onclick", `toggleElement("${id}")`);
    modal.appendChild(document.createElement("p"));
    modal.childNodes[0].setAttribute("class", "modal-text");
    modal.childNodes[0].innerHTML = message;
    parent.appendChild(modal);
}

const checkArrived = (object) => {

    let newTop = Math.round(object.currTop);
    let newLeft = Math.round(object.currLeft);
    let top = Math.round(gridObjects[target].top);
    let left = Math.round(gridObjects[target].left);

    if ((top - 10 < newTop && newTop < top + 10) && (left - 10 < newLeft && newLeft < left + 10)) {
        debounceFn(showModal("donemodal", "Arrived.<br>Well Done!"), 3500);
        resetCmd();
    };
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
        checkArrived(object);
    } else {
        object.currLeft++;
        elem.style.left = `${object.currLeft.toFixed(2)}px`;
    }
}

const goLeft = (comm, object, elem) => {
    if (object.currLeft <= object.newLeft) {
        clearInterval(comm);
        checkArrived(object);
    } else {
        object.currLeft--;
        elem.style.left = `${object.currLeft.toFixed(2)}px`;
    }
}

const goUp = (comm, object, elem) => {
    if (object.currTop <= object.newTop) {
        clearInterval(comm);
        checkArrived(object);
    } else {
        object.currTop--;
        elem.style.top = `${object.currTop.toFixed(2)}px`;
    }
}

const goDown = (comm, object, elem) => {
    if (object.currTop >= object.newTop) {
        clearInterval(comm);
        checkArrived(object);
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

const outOfBounds = () => {
    alert("Sorry, I am not allowed out of bounds!");
    resetCmd();
    return;
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
        case "up":
            return "down";
        case "down":
            return "up";
        case "left":
            return "right";
        case "right":
            return "left";
        default:
            return item;
    }
}

const orientForward = (direction, dimension, object, elem, item) => {
    switch (direction) {
        case "up":
            object.newTop = object.currTop - dimension;
            if (object.newTop < -50) {
                outOfBounds();
                break;
            }
            const up = setInterval(() => { goUp(up, object, elem) }, 5);
            command = goUp(up, object, elem);
            history.push(item);
            break;
        case "down":
            object.newTop = object.currTop + dimension;
            if (object.newTop > dimension * 4.5) {
                outOfBounds();
                break;
            }
            const down = setInterval(() => { goDown(down, object, elem) }, 5);
            command = goDown(down, object, elem);
            history.push(item);
            break;
        case "right":
            object.newLeft = object.currLeft + dimension;
            if (object.newLeft > dimension * 5.5) {
                outOfBounds();
                break;
            }
            const right = setInterval(() => { goRight(right, object, elem) }, 5);
            command = goRight(right, object, elem);
            history.push(item);
            break;
        case "left":
            object.newLeft = object.currLeft - dimension;
            if (object.newLeft < -50) {
                outOfBounds();
                break;
            }
            const left = setInterval(() => { goLeft(left, object, elem) }, 5);
            command = goLeft(left, object, elem);
            history.push(item);
    }
    checkArrived(object);
}

const getNextCommand = (dimension, object, elem, item) => {
    let command;

    if (item === "turnright") {
        command = turn90("+", object, elem);
        history.push(item);
    }
    if (item === "turnleft") {
        command = turn90("-", object, elem);
        history.push(item);
    }
    if (item === "forward") {
        const direction = getDirection(object.orientation);
        command = orientForward(direction, dimension, object, elem, item);
    }
    if (item === "backward") {
        const direction = getDirection(object.orientation);
        command = orientForward(negItem(direction), dimension, object, elem, item);
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

function animQb(commandList, pb) {
    const dimension = getDimension();
    const qb = document.getElementById("qb");
    if (stop)
        stop = false;
    for (let i = 0; i < commandList.length; i++) {
        let item = commandList[i];
        if (item === "negate") {
            i++;
            item = negItem(commandList[i]);

        }
        ((i) => {
            setTimeout(() => {
                if (!stop) {
                    getNextCommand(dimension, qbObj, qb, item);
                    if (pb) {
                        toggleBTN("playbackBTN");
                    }
                };
            }, 4000 * i);
        })(i);
    }
}

const playback = () => {
    history.reverse();
    let playBack = history.map(negItem);
    animQb(playBack, false);
    history = [];
    toggleBTN("playbackBTN");
}

window.onload = () => {
    const grid = document.getElementById("gamegrid");
    const gridTiles = getGridTiles();
    const qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    const dimension = getDimension();
    qbObj.dimension = dimension;
    currDimension = dimension;


    setGridPositions(dimension);
    gridSetup(grid, gridTiles);
    cmdGridSetup();
    fnGridSetup();
    iconGridSetup();
    qbSetup(grid, dimension, qbObj, qb);
    toggleBTN("playbackBTN");
    addEventListener("resize", () => {
        setGridPositions(getDimension());
        debounceFn(() => qbResize(qbObj, qb), 500);
    });
    debounceFn(() => { showModal("missionmodal", getMission()) }, 3000);
}
