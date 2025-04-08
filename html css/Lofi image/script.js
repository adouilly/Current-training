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

        // Récupérer les valeurs actuelles
        const contrast = contrastSlider.value;
        const brightness = brightnessSlider.value;
        const saturation = saturationSlider.value;
        
        // Récupérer les valeurs sepia et hueRotate du preset actif
        let sepia = 30;
        let hueRotate = 340;
        
        // Si un preset est actif, utiliser ses valeurs
        if (currentPreset && filterPresets[currentPreset]) {
            sepia = filterPresets[currentPreset].sepia;
            hueRotate = filterPresets[currentPreset].hueRotate;
        }

        // Appliquer les filtres CSS avec les bonnes valeurs
        modifiedImage.style.filter = `
            contrast(${contrast}%)
            brightness(${brightness}%)
            saturate(${saturation}%)
            sepia(${sepia}%)
            hue-rotate(${hueRotate}deg)
        `;
    }

    // Ajouter une variable pour suivre le preset actif
    let currentPreset = null;

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

    // Ajouter les nouveaux boutons de filtres
    const purpleBtn = document.getElementById('applyPurple');
    const blueBtn = document.getElementById('applyBlue');
    const pinkBtn = document.getElementById('applyPink');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Définir les présets de filtres
    const filterPresets = {
        lofi: {
            contrast: 120,
            brightness: 90,
            saturation: 80,
            sepia: 30,
            hueRotate: 340
        },
        purple: {
            contrast: 110,
            brightness: 95,
            saturation: 85,
            sepia: 20,
            hueRotate: 280
        },
        blue: {
            contrast: 115,
            brightness: 85,
            saturation: 90,
            sepia: 15,
            hueRotate: 220
        },
        pink: {
            contrast: 105,
            brightness: 100,
            saturation: 95,
            sepia: 10,
            hueRotate: 320
        }
    };

    // Fonction pour appliquer les présets
    function applyPreset(preset) {
        currentPreset = preset;
        const settings = filterPresets[preset];
        contrastSlider.value = settings.contrast;
        brightnessSlider.value = settings.brightness;
        saturationSlider.value = settings.saturation;
        updateLofiEffect();
    }

    // Ajouter les événements pour les nouveaux boutons
    purpleBtn.addEventListener('click', () => applyPreset('purple'));
    blueBtn.addEventListener('click', () => applyPreset('blue'));
    pinkBtn.addEventListener('click', () => applyPreset('pink'));

    // Fonction de téléchargement
    downloadBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = modifiedImage.naturalWidth;
        canvas.height = modifiedImage.naturalHeight;
        
        // Appliquer les filtres sur le canvas
        ctx.filter = modifiedImage.style.filter;
        ctx.drawImage(modifiedImage, 0, 0);
        
        // Créer le lien de téléchargement
        const link = document.createElement('a');
        link.download = 'lofi-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Fonction de réinitialisation
    function resetImage() {
        if (!modifiedImage) return;
        
        currentPreset = null;
        contrastSlider.value = 100;
        brightnessSlider.value = 100;
        saturationSlider.value = 100;
        
        modifiedImage.style.filter = 'none';
        updateLofiEffect();
    }

    // Ajouter l'événement pour le bouton reset
    resetBtn.addEventListener('click', resetImage);
});