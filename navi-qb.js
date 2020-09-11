
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
    event.target.appendChild(document.getElementById(data));
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
        const negate = { id: `Negate${i}`, class: "negate" }
        setArrow(negate, arrowGrid);
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

const goForward = (comm, object, elem) => {
    if (object.currTop <= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop--;
        elem.style.top = `${object.currTop}px`;
    }
}

const goBackward = (comm, object, elem) => {
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
    if (item === "right") {
        object.newLeft = object.currLeft + dimension;
        const right = setInterval(() => { goRight(right, object, elem) }, 15);
        command = goRight(right, object, elem);
    }
    if (item === "left") {
        object.newLeft = object.currLeft + dimension;
        const left = setInterval(() => { goLeft(left, object, elem) }, 15);
        command = goLeft(left, object, elem);
    }
    if (item === "forward") {
        object.newTop = object.currTop - dimension;
        const forward = setInterval(() => { goForward(forward, object, elem) }, 15);
        command = goForward(forward, object, elem);
    }
    if (item === "backward") {
        object.newTop = object.currTop + dimension;
        const backward = setInterval(() => { goBackward(backward, object, elem) }, 15);
        command = goBackward(backward, object, elem);
    }
    return command;
}

const getCommandList = () => {
    let commandList = [];
    for (i = 1; i <= 12; i++) {
        const cmd = document.getElementById(`cmd${i}`);
        let child = cmd.childNodes[0];
        if (child) {
            let cmdClass = child.getAttribute("class");
            commandList.push(cmdClass);
        }
        else {
            break;
        }
    }

    return commandList;
}

const animQb = () => {
    // console.log('animQb: clicked');
    const grid = document.getElementById("gamegrid");
    const dimension = getDimension(grid);
    const qb = document.getElementById("qb");
    const commandList = getCommandList();

    for (let i = 0; i < commandList.length; i++) {
        const item = commandList[i];
        ((i) => {         //Immediate Invoking Function Expression(IIFE)
            setTimeout(() => {
                console.log('i: ', i);
                getNextCommand(item, dimension, qbObj, qb);
            }, 3500 * i);
        })(i);
    }
    console.log('qbObj: ', qbObj);
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

