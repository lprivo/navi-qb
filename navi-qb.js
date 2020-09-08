
let grid;
let qb = document.getElementById("qb");
let qbObj = { icon: "url('templates/images/nqb-icon.png')", dimension: 0, currPos: 0, newPos: 0, orientation: 0 };
let commandList = [];

const getDimension = () => {
    const dimension = grid.clientHeight / 5;
    return dimension;
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

const qbSetup = (grid, dimension) => {
    qb.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${qbObj.icon}; top: ${dimension * 4}px`);
    grid.appendChild(qb);
}

const qbResize = () => {
    const dimension = getDimension();
    qb.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${qbObj.icon}`);
    console.log('qbObj: ', qbObj);
}

const turn90 = (direction) => {
    if (direction === "+") {
        qbObj.orientation += 90;
    }
    if (direction === "-") {
        qbObj.orientation -= 90;
    }
    qb.style.transform = `rotate(${qbObj.orientation}deg)`;
    console.log('qbObj.orientation: ', qbObj.orientation);
}

const goRight = (comm) => {
    if (qbObj.currPos >= qbObj.newPos) {
        clearInterval(comm);
    } else {
        qbObj.currPos++;
        qb.style.left = `${qbObj.currPos}px`;
    }
}

const goForward = (comm) => {
    if (qbObj.currPos >= qbObj.newPos) {
        clearInterval(comm);
    } else {
        qbObj.currPos++;
        qb.style.top = `${qbObj.currPos}px`;
    }
}


const animQb = () => {
    console.log('animQb: clicked');
    const dimension = getDimension();
    qbObj.newPos = qbObj.currPos + dimension;
    console.log('qbObj: ', qbObj);
    // const turn = setInterval(turn90, 15);
    const right = setInterval(goRight, 15);
    // const forward = setInterval(goForward, 15);
    turn90("-");
    goRight(right);
    turn90("+");
    // goForward(forward);
    // switch (command) {

    //     case "forward":
    //         qbObj.newPos = qbObj.currPos + dimension;
    //         forward();
    //         break;
    //     case "backward":

    //         break;
    //     case "left":

    //         break;
    //     case "right":

    //         break;

    //     default:
    //         break;
    // }
    // const intVal = setInterval(forward, 15);

    // const forward = () => {
    //     // console.log('qbObj.currPos: ', qbObj.currPos);
    //     if (qbObj.currPos >= qbObj.newPos) {
    //         clearInterval(intVal);
    //     } else {
    //         qbObj.currPos++;
    //         qb.style.left = `${qbObj.currPos}px`;
    //     }
    // }
}

// const animQb = () => {
//     const qb = document.getElementById("qb");
//     let pos = 0;
//     let rotateAngle = 90;
//     let dimension = 160;
//     const forward = () => {
//         if (pos == 160) {
//             clearInterval(id);
//         } else {
//             pos++;
//             // qb.style.top = `${pos}px`;
//             qb.style.left = `${pos}px`;
//             qb.style.transform = "rotate(90deg)";
//         }
//     }
//     const id = setInterval(forward, 15);
// };

window.onload = () => {
    grid = document.getElementById("gamegrid");
    qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    qbObj.dimension = getDimension();

    gridSetup(grid);
    qbSetup(grid, getDimension());
}

window.addEventListener("resize", qbResize);
