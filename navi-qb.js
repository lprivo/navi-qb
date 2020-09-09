
let grid;
let currDimension;
let qbObj = { icon: "url('templates/images/nqb-icon.png')", dimension: 0, currTop: 0, newTop: 0, currLeft: 0, newLeft: 0, orientation: 0 };
let commandList = ["+90", "forward", "right"];
let history = [];

const getDimension = () => {
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

const turn90 = (direction, object, elem) => {
    if (direction === "+") {
        object.orientation += 90;
    }
    if (direction === "-") {
        object.orientation -= 90;
    }
    elem.style.transform = `rotate(${object.orientation}deg)`;
    // console.log('object.orientation: ', object.orientation);
    // return;
}

const goRight = (comm, object, elem) => {
    if (object.currLeft >= object.newLeft) {
        clearInterval(comm);
    } else {
        object.currLeft++;
        elem.style.left = `${object.currLeft}px`;
    }
    // console.log('goRight: ', object.currLeft);
    // return;
}
const goLeft = (comm, object, elem) => {
    if (object.currLeft <= object.newLeft) {
        clearInterval(comm);
    } else {
        object.currLeft--;
        elem.style.left = `${object.currLeft}px`;
    }
    // console.log('goLeft: ', object.currLeft);
    // return;
}

const goForward = (comm, object, elem) => {
    if (object.currTop <= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop--;
        elem.style.top = `${object.currTop}px`;
    }
    // console.log('goForward: ', object.currTop);
    // return;
}

const goBackward = (comm, object, elem) => {
    if (object.currTop >= object.newTop) {
        clearInterval(comm);
    } else {
        object.currTop++;
        elem.style.top = `${object.currTop}px`;
    }
    // console.log('goBackward: ', object.currTop);
    // return;
}

const getNextCommand = (item, dimension, object, elem) => {
    let command;
    if (item === "+90") {
        // console.log('if: +90', object, elem);
        command = turn90("+", object, elem);
    }
    if (item === "-90") {
        // console.log('if: -90');
        command = turn90("-", object, elem);
    }
    if (item === "right") {
        // console.log('if: right');
        object.newLeft = object.currLeft + dimension;
        const right = setInterval(() => { goRight(right, object, elem) }, 15);
        command = goRight(right, object, elem);
    }
    if (item === "left") {
        // console.log('if: left');
        object.newLeft = object.currLeft + dimension;
        const left = setInterval(() => { goLeft(left, object, elem) }, 15);
        command = goLeft(left, object, elem);
    }
    if (item === "forward") {
        // console.log('if: forward');
        object.newTop = object.currTop - dimension;
        const forward = setInterval(() => { goForward(forward, object, elem) }, 15);
        command = goForward(forward, object, elem);
    }
    if (item === "backward") {
        // console.log('if: backward');
        object.newTop = object.currTop + dimension;
        const backward = setInterval(() => { goBackward(backward, object, elem) }, 15);
        command = goBackward(backward, object, elem);
    }
    return command;
}
const animQb = () => {
    // console.log('animQb: clicked');
    const dimension = getDimension();
    const qb = document.getElementById("qb");

    // (async () => {})();
    for (const item of commandList) {
        // console.log('i: ', item);
        getNextCommand(item, dimension, qbObj, qb);
    }

    console.log('qbObj: ', qbObj);
}

window.onload = () => {
    grid = document.getElementById("gamegrid");
    const qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    const dimension = getDimension();
    qbObj.dimension = dimension;
    currDimension = dimension;

    gridSetup(grid);
    qbSetup(grid, dimension, qbObj, qb);
    addEventListener("resize", () => { qbResize(qbObj, qb) });
}

