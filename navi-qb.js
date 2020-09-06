
const gridSetup = (grid) => {

    for (i = 1; i <= 20; i++) {
        const newSquare = document.createElement("div");

        newSquare.setAttribute("id", `sq${i}`);
        newSquare.setAttribute("class", "square");
        newSquare.appendChild(document.createElement("p"));
        newSquare.childNodes[0].innerHTML = i;
        grid.appendChild(newSquare);
    };
};

const qbSetup = (grid) => {
    const qb = document.createElement("div");
    let dimension = 160;

    qb.setAttribute("id", "qb");
    qb.setAttribute("style", `width: ${dimension}px; height: ${dimension}px; background-image:url('templates/images/nqb-icon.png')`);
    grid.appendChild(qb);
};

const animQb = () => {
    const qb = document.getElementById("qb");
    let pos = 0;
    let rotateAngle = 90;
    let dimension = 160;
    const forward = () => {
        if (pos == 160) {
            clearInterval(id);
        } else {
            pos++;
            // qb.style.top = `${pos}px`;
            qb.style.left = `${pos}px`;
            qb.style.transform = "rotate(90deg)";
        }
    }
    const id = setInterval(forward, 15);
};

window.onload = () => {
    const grid = document.getElementById("gamegrid");
    const qb = { icon: "templates/images/nqb-icon.png", direction: 0, speed: 1 };

    gridSetup(grid);
    qbSetup(grid);
}
