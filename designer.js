"use strict";
// Get the modal
let modal = document.getElementById("designerModal");
// Get the button that opens the modal
let btn = document.getElementById("openDesignerButton");
// Get the <span> element that closes the modal
let span = document.getElementById("closeDesigner");
if (btn) {
    // When the user clicks on the button, open the modal
    btn.innerHTML = `Designer  <i class="fa-solid fa-wand-magic-sparkles fa-2xl fa-fw"  style="margin-left: 1em;"></i>`;
    btn.onclick = function () {
        if (modal)
            modal.style.display = "block";
    };
}
if (span) {
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        if (modal)
            modal.style.display = "none";
    };
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        if (modal)
            modal.style.display = "none";
    }
};
let buttonGenerate = document.getElementById("buttonGenerate");
if (buttonGenerate) {
    buttonGenerate.addEventListener('click', () => {
        if (modal)
            modal.style.display = "none";
    });
}
