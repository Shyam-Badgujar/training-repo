const spacingSlider = document.getElementById('spacing');
const blurSlider = document.getElementById('blur');
const hueSlider = document.getElementById('hue');

const spacingValue = document.getElementById('spacingValue');
const blurValue = document.getElementById('blurValue');
const hueValue = document.getElementById('hueValue');

function updateStyles() {
    document.documentElement.style.setProperty(
        '--spacing',
        spacingSlider.value + 'px'
    );
    document.documentElement.style.setProperty(
        '--blur',
        blurSlider.value + 'px'
    );
    document.documentElement.style.setProperty(
        '--hue',
        hueSlider.value + 'deg'
    );

    spacingValue.textContent = spacingSlider.value + ' px';
    blurValue.textContent = blurSlider.value + ' px';
    hueValue.textContent = hueSlider.value + ' deg';
}

spacingSlider.addEventListener('input', updateStyles);
blurSlider.addEventListener('input', updateStyles);
hueSlider.addEventListener('input', updateStyles);

document.getElementById('resetBtn').addEventListener('click', () => {
    spacingSlider.value = 0;
    blurSlider.value = 0;
    hueSlider.value = 0;
    updateStyles();
});