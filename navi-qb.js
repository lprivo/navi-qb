
let currDimension;
let qbObj = { icon: "url('templates/images/nqb-icon.png')", dimension: 0, currTop: 0, newTop: 0, currLeft: 0, newLeft: 0, orientation: 0 };
// let history = [];

const getDimension = () => {
    const grid = document.getElementById("gamegrid");
    const dimension = grid.clientHeight / 5;
    return dimension;
}

const getNewDimension = () => {
    const dimension = getDimension();
    const newDimension = { dim: dimension, ratio: currDimension / dimension };
    return newDimension;
}

const gridSetup = (grid) => {

    for (i = 1; i <= 30; i++) {
        const newSquare = document.createElement("div");

        newSquare.setAttribute("id", `sq${i}`);
        newSquare.setAttribute("class", "square");
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
    const top = object.currTop / dimension.ratio;
    const left = object.currLeft / dimension.ratio;
    elem.setAttribute("style", `width: ${dimension.dim}px; height: ${dimension.dim}px; background-image:${object.icon};
    top: ${top}px; left: ${left}px; transform: rotate(${object.orientation}deg)`);
    currDimension = dimension.dim;
}

const setCmdElem = (elem, grid) => {
    const newSlot = document.createElement("div");

    newSlot.setAttribute("id", elem);
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
        const cmdElem = `cmd${i}`;
        setCmdElem(cmdElem, cmdGrid);
    };
    for (i = 5; i <= 8; i++) {
        const cmdElem = `cmd${i}`;
        setCmdElem(cmdElem, cmdGrid);
    };
    for (i = 4; i >= 1; i--) {
        const cmdElem = `cmd${i}`;
        setCmdElem(cmdElem, cmdGrid);
    };
}

const fnGridSetup = () => {
    const fnGrid = document.getElementById("fngrid");

    for (i = 4; i >= 1; i--) {
        const fnElem = `fn${i}`;
        setCmdElem(fnElem, fnGrid);
    };
}

const setArrow = (obj, grid) => {
    const newSlot = document.createElement("div");

    newSlot.setAttribute("class", "iconslot");
    newSlot.setAttribute("ondrop", "drop(event)");
    newSlot.setAttribute("ondragover", "allowDrop(event)");
    newSlot.appendChild(document.createElement("div"));
    newSlot.childNodes[0].setAttribute("id", obj.id);
    newSlot.childNodes[0].setAttribute("class", obj.class);
    newSlot.childNodes[0].setAttribute("draggable", "true");
    newSlot.childNodes[0].setAttribute("ondragstart", "drag(event)");
    newSlot.childNodes[0].setAttribute("ondragover", "null");
    newSlot.childNodes[0].setAttribute("ondrop", "null");
    grid.appendChild(newSlot);
}

const arrowGridSetup = () => {
    const arrowGrid = document.getElementById("arrowgrid");

    for (i = 1; i <= 4; i++) {
        const forward = { id: `forward${i}`, class: "forward" }
        setArrow(forward, arrowGrid);
    };
    for (i = 1; i <= 4; i++) {
        const turnLeft = { id: `turnleft${i}`, class: "turnleft" }
        setArrow(turnLeft, arrowGrid);
    };
    for (i = 1; i <= 4; i++) {
        const turnRight = { id: `turnright${i}`, class: "turnright" }
        setArrow(turnRight, arrowGrid);
    };
    for (i = 1; i <= 4; i++) {
        const negate = { id: `negate${i}`, class: "negate" }
        setArrow(negate, arrowGrid);
    };
    for (i = 1; i <= 4; i++) {
        const func = { id: `func${i}`, class: "func" }
        setArrow(func, arrowGrid);
    }
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
    const className = event.target.className;
    let empty = className === "cmdslot" || className === "iconslot";
    if (empty) {
        event.target.appendChild(document.getElementById(data));
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
        elem.style.left = `${object.currLeft}px`;
    }
}

const goLeft = (comm, object, elem) => {
    if (object.currLeft <= object.newLeft) {
        clearInterval(comm);
    } else {
        object.currLeft--;
        elem.style.left = `${object.currLeft}px`;
    }
}

const goUp = (comm, object, elem) => {
    if (object.currTop <= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop--;
        elem.style.top = `${object.currTop}px`;
    }
}

const goDown = (comm, object, elem) => {
    if (object.currTop >= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop++;
        elem.style.top = `${object.currTop}px`;
    }
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
        switch (object.orientation) {
            case 0:
                object.newTop = object.currTop - dimension;
                const up = setInterval(() => { goUp(up, object, elem) }, 15);
                command = goUp(up, object, elem);
                break;
            case 90:
                object.newLeft = object.currLeft + dimension;
                const right = setInterval(() => { goRight(right, object, elem) }, 15);
                command = goRight(right, object, elem);
                break;
            case 180:
                object.newTop = object.currTop + dimension;
                const down = setInterval(() => { goDown(down, object, elem) }, 15);
                command = goDown(down, object, elem);
                break;
            case -90:
                object.newLeft = object.currLeft - dimension;
                const left = setInterval(() => { goLeft(left, object, elem) }, 15);
                command = goLeft(left, object, elem);
        }
    }
    if (item === "backward") {
        switch (object.orientation) {
            case 0:
                object.newTop = object.currTop + dimension;
                const down = setInterval(() => { goDown(down, object, elem) }, 15);
                command = goDown(down, object, elem);
                break;
            case 90:
                object.newLeft = object.currLeft - dimension;
                const left = setInterval(() => { goLeft(left, object, elem) }, 15);
                command = goLeft(left, object, elem);
                break;
            case 180:
                object.newTop = object.currTop - dimension;
                const up = setInterval(() => { goUp(up, object, elem) }, 15);
                command = goUp(up, object, elem);
                break;
            case -90:
                object.newLeft = object.currLeft + dimension;
                const right = setInterval(() => { goRight(right, object, elem) }, 15);
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

    return commandList;
}

const negItem = (item) => {
    switch (item) {
        case "forward":
            return "backward";
        case "turnright":
            return "turnleft";
        case "turnleft":
            return "turnright";
        default:
            return item;
    }
}

const animQb = () => {
    const grid = document.getElementById("gamegrid");
    const dimension = getDimension(grid);
    const qb = document.getElementById("qb");
    const commandList = getCommandList();

    for (let i = 0; i < commandList.length; i++) {
        let item = commandList[i];

        if (item === "negate") {
            i++;
            item = negItem(commandList[i]);
            ((i) => {         //Immediate Invoking Function Expression(IIFE)
                setTimeout(() => {
                    getNextCommand(item, dimension, qbObj, qb);
                }, 3500 * i);
            })(i);
        }
        else {
            ((i) => {         //Immediate Invoking Function Expression(IIFE)
                setTimeout(() => {
                    getNextCommand(item, dimension, qbObj, qb);
                }, 3500 * i);
            })(i);
        }
    }
}

window.onload = () => {
    const grid = document.getElementById("gamegrid");
    const qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    const dimension = getDimension();
    qbObj.dimension = dimension;
    currDimension = dimension;

    gridSetup(grid);
    cmdGridSetup();
    fnGridSetup();
    arrowGridSetup();
    qbSetup(grid, dimension, qbObj, qb);
    addEventListener("resize", () => { qbResize(qbObj, qb) });
}

