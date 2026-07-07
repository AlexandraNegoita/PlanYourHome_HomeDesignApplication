"use strict";
//document.getElementById('configurationMenu')?.style.setProperty('display', 'block');
document.getElementById('configurationMenu')?.style.setProperty('z-index', '10');
const toggleTarget = (sel) => {
    const EL_targets = document.querySelectorAll(sel);
    EL_targets.forEach(EL => EL.classList.toggle("is-active"));
};
const EL_toggleButtons = document.querySelectorAll("[data-toggle]");
EL_toggleButtons.forEach(EL => EL.addEventListener("click", (ev) => {
    if (!(ev.target instanceof HTMLButtonElement)) {
        return;
    }
    else {
        if (ev.currentTarget instanceof HTMLElement)
            toggleTarget(ev.currentTarget.dataset.toggle);
    }
}));
$(function () {
    var rangePercent = $('[type="range"]').val();
    $('[type="range"]').on('change input', function () {
        rangePercent = $('[type="range"]').val();
        $('h4').html(rangePercent + '<span></span>');
        $('[type="range"], h4>span').css('filter', 'hue-rotate(-' + rangePercent + 'deg)');
        // $('h4').css({'transform': 'translateX(calc(-50% - 20px)) scale(' + (1+(rangePercent/100)) + ')', 'left': rangePercent+'%'});
        if (typeof (rangePercent) == 'number') {
            $('h4').css({ 'transform': 'translateX(-50%) scale(' + (1 + (rangePercent / 100)) + ')', 'left': rangePercent + '%' });
        }
    });
});
// document.getElementById('options')?.style.setProperty('display', 'block');
