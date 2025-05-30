const testjs = document.getElementById('elem');

testjs.addEventListener("click", () => {
    const isChanged = testjs.classList.toggle("changed");
    if (isChanged) {
        console.log("Classe 'changed' ajoutée");
        startRGBEffect(testjs);
    } else {
        console.log("Classe 'changed' retirée");
        stopRGBEffect(testjs);
    }
});

