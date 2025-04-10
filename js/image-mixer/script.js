// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs DOM
    const contentImage = document.getElementById('contentImage');
    const styleImage = document.getElementById('styleImage');
    const originalContainer = document.getElementById('originalImageContainer');
    const styleContainer = document.getElementById('styleImageContainer');
    const resultContainer = document.getElementById('resultImageContainer');
    const generateBtn = document.getElementById('generateBtn');
    const styleStrength = document.getElementById('styleStrength');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImg = null;
    let styleImg = null;
    let resultImg = null;
    let model = null;

    // Charger le modèle TensorFlow.js
    async function loadModel() {
        try {
            model = await tf.loadGraphModel('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2', { fromTFHub: true });
            console.log('Modèle chargé avec succès');
            generateBtn.disabled = false;
        } catch (error) {
            console.error('Erreur lors du chargement du modèle:', error);
        }
    }

    // Fonction pour afficher une image
    function displayImage(file, container) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    container.innerHTML = '';
                    container.appendChild(img);
                    resolve(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Fonction pour convertir une image en base64
    function imageToBase64(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    }

    // Modifier la fonction generateStylizedImage
    async function generateStylizedImage() {
        if (!originalImg || !styleImg) {  // Enlever la vérification de model
            alert('Veuillez charger les deux images');
            return;
        }

        try {
            if (!model) {
                alert('Le modèle est en cours de chargement, veuillez patienter quelques secondes...');
                return;
            }

            resultContainer.innerHTML = '<div class="loading">Génération en cours...</div>';

            // Préparer les images pour TensorFlow
            const contentTensor = tf.browser.fromPixels(originalImg)
                .toFloat()
                .div(255.0)
                .expandDims();
            
            const styleTensor = tf.browser.fromPixels(styleImg)
                .toFloat()
                .div(255.0)
                .expandDims();

            // Appliquer le style
            const strength = parseFloat(styleStrength.value) / 100;
            const result = await model.predict([contentTensor, styleTensor]);

            // Convertir le résultat en image
            const stylizedImage = await tf.browser.toPixels(result.squeeze());
            
            // Afficher le résultat
            const canvas = document.createElement('canvas');
            canvas.width = originalImg.width;
            canvas.height = originalImg.height;
            const ctx = canvas.getContext('2d');
            const imageData = new ImageData(stylizedImage, originalImg.width);
            ctx.putImageData(imageData, 0, 0);

            resultImg = new Image();
            resultImg.onload = () => {
                resultContainer.innerHTML = '';
                resultContainer.appendChild(resultImg);
            };
            resultImg.src = canvas.toDataURL();

            // Libérer la mémoire
            tf.dispose([contentTensor, styleTensor, result]);

        } catch (error) {
            console.error('Erreur:', error);
            resultContainer.innerHTML = 'Une erreur est survenue lors de la génération';
        }
    }

    // Fonction de réinitialisation
    function resetAll() {
        originalImg = null;
        styleImg = null;
        resultImg = null;
        
        originalContainer.innerHTML = '';
        styleContainer.innerHTML = '';
        resultContainer.innerHTML = '';
        
        contentImage.value = '';
        styleImage.value = '';
        promptInput.value = '';
        styleStrength.value = 50;
    }

    // Ajout des validations pour les images
    function validateImage(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png'];
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Format d\'image non supporté (uniquement JPG et PNG)');
        }
        
        if (file.size > maxSize) {
            throw new Error('Image trop volumineuse (maximum 10MB)');
        }
    }

    // Modification des gestionnaires d'événements pour l'upload
    contentImage.addEventListener('change', async (e) => {
        try {
            if (e.target.files[0]) {
                console.log('Chargement de l\'image source...');
                validateImage(e.target.files[0]);
                originalImg = await displayImage(e.target.files[0], originalContainer);
                console.log('Image source chargée avec succès');
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image source:', error);
            alert(error.message);
            e.target.value = ''; // Reset l'input file
        }
    });

    styleImage.addEventListener('change', async (e) => {
        try {
            if (e.target.files[0]) {
                console.log('Chargement de l\'image de style...');
                validateImage(e.target.files[0]);
                styleImg = await displayImage(e.target.files[0], styleContainer);
                console.log('Image de style chargée avec succès');
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image de style:', error);
            alert(error.message);
            e.target.value = '';
        }
    });

    generateBtn.addEventListener('click', generateStylizedImage);
    resetBtn.addEventListener('click', resetAll);
    
    downloadBtn.addEventListener('click', () => {
        if (resultImg) {
            const link = document.createElement('a');
            link.download = 'styled-image.png';
            link.href = resultImg.src;
            link.click();
        }
    });

    // Charger le modèle au démarrage
    loadModel();
});

// Fonctions utilitaires (en dehors du DOMContentLoaded)
function imageToBase64(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg').split(',')[1];
}

async function waitForResult(predictionId) {
    const checkInterval = 1000;
    while (true) {
        const response = await fetch(`${API_URL}/check-prediction/${predictionId}`);
        const prediction = await response.json();
        
        if (prediction.status === 'succeeded') {
            return prediction;
        } else if (prediction.status === 'failed') {
            throw new Error('La génération a échoué');
        }
        
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
}
