
let grid;
let qb = document.getElementById("qb");
let qbObj = { icon: "url('templates/images/nqb-icon.png')", dimension: 0, position: 0, direction: 0 };

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
    // const qb = document.getElementById("qb");

    // qb.setAttribute("id", "qb");
    qb.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${qbObj.icon}`);
    grid.appendChild(qb);
}

const qbResize = () => {
    const dimension = getDimension();
    qb.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:${qbObj.icon}`);
    console.log('qbObj: ', qbObj);
}

const turn90 = (direction) => {

}

const animQb = () => {
    // const qb = document.getElementById("qb");
    const dimension = getDimension();
    // let pos = 0;
    // let rotateAngle = 90;

    const forward = () => {
        if (qbObj.position === dimension) {
            clearInterval(intVal);
        } else {
            qbObj.position++;
            // qb.style.top = `${pos}px`;
            qb.style.left = `${qbObj.position}px`;
            qb.style.transform = "rotate(90deg)";
        }
    }
    const intVal = setInterval(forward, 15);
}

window.onload = () => {
    grid = document.getElementById("gamegrid");
    qb = document.createElement("div");
    qb.setAttribute("id", "qb");
    qbObj.dimension = getDimension();

    gridSetup(grid);
    qbSetup(grid, getDimension());
}

window.addEventListener("resize", qbResize);
