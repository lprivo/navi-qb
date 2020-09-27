export const toggleBTN = (button) => {
    let elem = document.getElementById(button);
    elem.disabled = !elem.disabled;
}

export default toggleBTN;