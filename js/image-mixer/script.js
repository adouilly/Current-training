document.addEventListener('DOMContentLoaded', () => {
    const contentImage = document.getElementById('contentImage');
    const styleImage = document.getElementById('styleImage');
    const originalContainer = document.getElementById('originalImageContainer');
    const styleContainer = document.getElementById('styleImageContainer');
    const resultContainer = document.getElementById('resultImageContainer');
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const styleStrength = document.getElementById('styleStrength');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImg = null;
    let styleImg = null;
    let resultImg = null;

    // Fonction pour afficher une image
    function displayImage(file, container) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            container.innerHTML = '';
            container.appendChild(img);
            return img;
        };
        reader.readAsDataURL(file);
    }

    // Gestionnaires d'événements pour le upload d'images
    contentImage.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            originalImg = displayImage(e.target.files[0], originalContainer);
        }
    });

    styleImage.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            styleImg = displayImage(e.target.files[0], styleContainer);
        }
    });

    // Fonction pour générer l'image stylisée
    async function generateStylizedImage() {
        if (!originalImg || !styleImg) {
            alert('Veuillez d\'abord charger les deux images');
            return;
        }

        // Ici, vous devrez implémenter l'appel à votre API de style transfer
        // Par exemple, en utilisant l'API Replicate ou un autre service similaire
        try {
            // Simuler un chargement pour l'exemple
            resultContainer.innerHTML = '<div class="loading">Génération en cours...</div>';
            
            // Remplacer ce setTimeout par votre appel API réel
            setTimeout(() => {
                // Pour l'exemple, on clone juste l'image originale
                resultImg = originalImg.cloneNode(true);
                resultContainer.innerHTML = '';
                resultContainer.appendChild(resultImg);
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de la génération:', error);
            alert('Une erreur est survenue lors de la génération');
        }
    }

    // Événements pour les boutons
    generateBtn.addEventListener('click', generateStylizedImage);

    resetBtn.addEventListener('click', () => {
        if (resultImg) {
            resultContainer.innerHTML = '';
            promptInput.value = '';
            styleStrength.value = 50;
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (resultImg) {
            const link = document.createElement('a');
            link.download = 'styled-image.png';
            link.href = resultImg.src;
            link.click();
        }
    });
});