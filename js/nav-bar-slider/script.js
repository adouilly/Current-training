document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav a');
    const slider = document.querySelector('.slider');

    function moveSlider(e) {
        slider.style.width = `${e.target.offsetWidth}px`;
        slider.style.left = `${e.target.offsetLeft}px`;
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            links.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            moveSlider(e);
        });
    });

    // Initialiser le slider sur le premier lien
    if (links.length) {
        moveSlider({ target: links[0] });
        links[0].classList.add('active');
    }
});