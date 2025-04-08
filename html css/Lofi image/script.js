document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const originalContainer = document.getElementById('originalImageContainer');
    const modifiedContainer = document.getElementById('modifiedImageContainer');
    const applyLofiBtn = document.getElementById('applyLofi');
    
    // Sliders
    const contrastSlider = document.getElementById('contrast');
    const brightnessSlider = document.getElementById('brightness');
    const saturationSlider = document.getElementById('saturation');
    
    let originalImage = null;
    let modifiedImage = null;

    // Gérer le téléchargement de l'image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Créer et afficher l'image originale
                originalImage = new Image();
                originalImage.src = e.target.result;
                originalContainer.innerHTML = '';
                originalContainer.appendChild(originalImage);
                
                // Créer et afficher l'image modifiée
                modifiedImage = new Image();
                modifiedImage.src = e.target.result;
                modifiedContainer.innerHTML = '';
                modifiedContainer.appendChild(modifiedImage);
                
                // Activer les contrôles
                applyLofiBtn.disabled = false;
                updateLofiEffect();
            };
            reader.readAsDataURL(file);
        }
    });

    // Fonction pour appliquer l'effet lofi
    function updateLofiEffect() {
        if (!modifiedImage) return;

        const contrast = contrastSlider.value;
        const brightness = brightnessSlider.value;
        const saturation = saturationSlider.value;

        // Appliquer les filtres CSS
        modifiedImage.style.filter = `
            contrast(${contrast}%)
            brightness(${brightness}%)
            saturate(${saturation}%)
            sepia(30%)
            hue-rotate(340deg)
        `;
    }

    // Écouter les changements des sliders
    contrastSlider.addEventListener('input', updateLofiEffect);
    brightnessSlider.addEventListener('input', updateLofiEffect);
    saturationSlider.addEventListener('input', updateLofiEffect);

    // Bouton pour appliquer l'effet lofi
    applyLofiBtn.addEventListener('click', () => {
        // Réinitialiser les valeurs par défaut pour un effet lofi typique
        contrastSlider.value = 120;
        brightnessSlider.value = 90;
        saturationSlider.value = 80;
        updateLofiEffect();
    });
});