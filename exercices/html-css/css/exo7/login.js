document.addEventListener('DOMContentLoaded', function() {
    // Gestionnaire pour le formulaire de connexion
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginMessage = document.getElementById('login-message');
    
    // Regex pour la validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Gérer la visibilité du mot de passe
    const togglePasswordBtn = document.querySelector('.toggle-password');
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Changer l'icône
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Validation lors de la saisie
    emailInput.addEventListener('input', function() {
        if (this.value && !emailRegex.test(this.value)) {
            emailError.textContent = 'Veuillez entrer une adresse email valide.';
        } else {
            emailError.textContent = '';
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value && this.value.length < 8) {
            passwordError.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        } else {
            passwordError.textContent = '';
        }
    });
    
    // Gérer la soumission du formulaire
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Réinitialiser les messages d'erreur
        emailError.textContent = '';
        passwordError.textContent = '';
        loginMessage.textContent = '';
        loginMessage.className = 'login-message';
        
        // Valider l'email
        if (!emailInput.value) {
            emailError.textContent = 'L\'adresse email est requise.';
            return;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Veuillez entrer une adresse email valide.';
            return;
        }
        
        // Valider le mot de passe
        if (!passwordInput.value) {
            passwordError.textContent = 'Le mot de passe est requis.';
            return;
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
            return;
        }
        
        // Simulation d'authentification (à remplacer par votre API)
        if (emailInput.value === 'admin@example.com' && passwordInput.value === 'password123') {
            // Connexion réussie
            loginMessage.textContent = 'Connexion réussie! Redirection...';
            loginMessage.className = 'login-message success';
            
            // Stocker l'état de connexion dans localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', 'Admin');
            
            // Redirection vers le tableau de bord après un délai
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Échec de connexion
            loginMessage.textContent = 'Email ou mot de passe incorrect.';
            loginMessage.className = 'login-message error';
        }
    });
    
    // Ajouter un bouton de connexion Google simulé
    const googleContainer = document.querySelector('.g_id_signin');
    if (googleContainer) {
        // Remplacer le bouton Google par notre propre implémentation
        googleContainer.innerHTML = `
            <button id="fake-google-signin" class="google-signin-btn">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo">
                <span>Se connecter avec Google</span>
            </button>
        `;
        
        // Ajouter les styles pour le bouton Google
        const style = document.createElement('style');
        style.textContent = `
            .google-signin-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background-color: white;
                color: #444;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px 16px;
                font-weight: 500;
                width: 100%;
                max-width: 240px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .google-signin-btn:hover {
                background-color: #f8f8f8;
            }
            .google-signin-btn img {
                width: 18px;
                height: 18px;
            }
        `;
        document.head.appendChild(style);
        
        // Ajouter l'écouteur d'événement pour simuler la connexion Google
        document.getElementById('fake-google-signin').addEventListener('click', function() {
            // Simuler une connexion Google réussie
            const fakeUserData = {
                name: 'Utilisateur Google',
                email: 'utilisateur@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user'
            };
            
            // Afficher un message de succès
            const loginMessage = document.getElementById('login-message');
            loginMessage.textContent = `Connexion réussie en tant que ${fakeUserData.name}! Redirection...`;
            loginMessage.className = 'login-message success';
            
            // Stocker les informations de l'utilisateur
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', fakeUserData.name);
            localStorage.setItem('userEmail', fakeUserData.email);
            localStorage.setItem('userPicture', fakeUserData.picture);
            localStorage.setItem('authProvider', 'google');
            
            // Redirection vers le tableau de bord après un délai
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Supprimer les scripts Google inutilisés
    document.querySelectorAll('script[src*="accounts.google.com"]').forEach(script => {
        script.remove();
    });
});

// Supprimer la fonction handleGoogleSignIn car nous utilisons notre propre implémentation
// function handleGoogleSignIn(response) { ... }

// Fonction pour décoder un jeton JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Vérifier si l'utilisateur est déjà connecté
window.addEventListener('load', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Rediriger vers le tableau de bord
        window.location.href = 'index.html';
    }
});
