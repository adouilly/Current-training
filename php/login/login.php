<?php
// Démarrage de la session pour gérer les connexions utilisateur
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'logintest';
$username = 'root';
$password = '';

// Connexion à la base de données MySQL avec PDO
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
// Configuration pour afficher les erreurs PDO
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ========================================
// TRAITEMENT DES FORMULAIRES (AVANT HTML)
// ========================================

// Traitement de la déconnexion (doit être en premier pour les redirections)
if (isset($_POST['logout'])) {
    // Destruction de la session
    session_destroy();
    // Redirection vers la page de connexion
    header("Location: login.php");
    exit(); // Arrêt de l'exécution du script
}

// Traitement du formulaire de connexion
if (isset($_POST['submitConnection'])) {
    // Sécurisation des données reçues
    $identifiant = htmlspecialchars($_POST['identifiant'], ENT_QUOTES, 'UTF-8');
    $mot_de_passe = htmlspecialchars($_POST['password'], ENT_QUOTES, 'UTF-8');
    
    // Recherche de l'utilisateur dans la base de données
    $sql= "SELECT * FROM users WHERE adresse_mail_user = :identifiant";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['identifiant' => $identifiant]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérification du mot de passe avec hash
    if ($result && password_verify($mot_de_passe, $result["password_user"])) {
        // Connexion réussie : création de la session
        $_SESSION['user'] = [
            "id_user" => $result['id_user'],
            "nom_user" => $result['nom_user'],
            "prenom_user" => $result['prenom_user'],
            "age_user" => $result['age_user'],
            "adresse_mail_user" => $result['adresse_mail_user']
        ];
        // Redirection pour éviter la re-soumission du formulaire
        header("Location: login.php");
        exit();
    } else {
        // Connexion échouée - stocker le message pour l'affichage
        $error_message = "Identifiant ou mot de passe incorrect.";
    }
}

// Variables pour stocker les messages
$success_message = "";
$error_message = isset($error_message) ? $error_message : "";

// Traitement du formulaire de mise à jour des informations personnelles
if (isset($_POST['updateUser'])) {
    // Sécurisation des données reçues
    $nom = htmlspecialchars($_POST['nom'], ENT_QUOTES, 'UTF-8');
    $prenom = htmlspecialchars($_POST['prenom'], ENT_QUOTES, 'UTF-8');
    $age = intval($_POST['age']); // Conversion en entier pour l'âge
    $email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');
    $userId = $_SESSION['user']['id_user'];
    
    // Mise à jour des données en base
    $sql = "UPDATE users SET nom_user = :nom, prenom_user = :prenom, age_user = :age, adresse_mail_user = :email WHERE id_user = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'nom' => $nom,
        'prenom' => $prenom,
        'age' => $age,
        'email' => $email,
        'id' => $userId
    ]);
    
    // Mise à jour des données de session pour refléter les changements
    $_SESSION['user']['nom_user'] = $nom;
    $_SESSION['user']['prenom_user'] = $prenom;
    $_SESSION['user']['age_user'] = $age;
    $_SESSION['user']['adresse_mail_user'] = $email;
    
    $success_message = "Informations mises à jour avec succès !";
}

// Traitement du formulaire de changement de mot de passe
if (isset($_POST['updatePassword'])) {
    // Sécurisation des données reçues
    $current_password = htmlspecialchars($_POST['current_password'], ENT_QUOTES, 'UTF-8');
    $new_password = htmlspecialchars($_POST['new_password'], ENT_QUOTES, 'UTF-8');
    $confirm_password = htmlspecialchars($_POST['confirm_password'], ENT_QUOTES, 'UTF-8');
    $userId = $_SESSION['user']['id_user'];
    
    // Récupération du mot de passe actuel depuis la base de données
    $sql = "SELECT password_user FROM users WHERE id_user = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Vérification du mot de passe actuel avec password_verify pour les mots de passe hachés
    // et comparaison directe pour les anciens mots de passe en clair
    if (password_verify($current_password, $user['password_user']) || $current_password == $user['password_user']) {
        // Vérification que les nouveaux mots de passe correspondent
        if ($new_password === $confirm_password) {
            // Vérification que le nouveau mot de passe est différent de l'ancien
            if ($new_password !== $current_password) {
                // Hachage du nouveau mot de passe pour la sécurité
                $hashedNewPassword = password_hash($new_password, PASSWORD_DEFAULT);
                
                // Mise à jour du mot de passe avec hachage
                $sql = "UPDATE users SET password_user = :password WHERE id_user = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'password' => $hashedNewPassword,
                    'id' => $userId
                ]);
                
                $success_message = "Mot de passe modifié avec succès !";
            } else {
                $error_message = "Le nouveau mot de passe doit être différent de l'ancien.";
            }
        } else {
            $error_message = "Les nouveaux mots de passe ne correspondent pas.";
        }
    } else {
        $error_message = "Mot de passe actuel incorrect.";
    }
}

// Traitement du formulaire de création de compte
if (isset($_POST['submitCreate'])){
    // Sécurisation des données reçues
    $nomCreate = htmlspecialchars($_POST['nomCreate'], ENT_QUOTES, 'UTF-8');
    $prenomCreate = htmlspecialchars($_POST['prenomCreate'], ENT_QUOTES, 'UTF-8');
    $ageCreate = intval($_POST['ageCreate']); // Conversion en entier
    $mailCreate = htmlspecialchars($_POST['mailCreate'], ENT_QUOTES, 'UTF-8');
    $passwordCreate = htmlspecialchars($_POST['passwordCreate'], ENT_QUOTES, 'UTF-8');
    
    // Hachage du mot de passe pour la sécurité
    $hashedPassword = password_hash($passwordCreate, PASSWORD_DEFAULT);
    
    // Insertion du nouvel utilisateur en base de données
    $sqlCreate = "INSERT INTO users (nom_user, prenom_user, age_user, adresse_mail_user, password_user) VALUES (:nom, :prenom, :age, :email, :password)";
    
    $stmtCreate = $pdo->prepare($sqlCreate);
    $stmtCreate->execute([
        'nom' => $nomCreate,
        'prenom' => $prenomCreate,
        'age' => $ageCreate,
        'email' => $mailCreate,
        'password' => $hashedPassword // Stockage du mot de passe haché
    ]);
    
    $success_message = "Compte créé avec succès !";
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LoginMethode</title>
    <script>
        // Fonction pour désactiver le copier-coller sur les champs de mot de passe
        function disableCopyPaste(element) {
            // Bloquer le collage (Ctrl+V)
            element.addEventListener('paste', function(e) {
                e.preventDefault();
                return false;
            });
            // Bloquer la copie (Ctrl+C)
            element.addEventListener('copy', function(e) {
                e.preventDefault();
                return false;
            });
            // Bloquer la coupe (Ctrl+X)
            element.addEventListener('cut', function(e) {
                e.preventDefault();
                return false;
            });
            // Bloquer le glisser-déposer
            element.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            // Désactiver le menu contextuel (clic droit)
            element.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Appliquer la protection dès que la page est chargée
        document.addEventListener('DOMContentLoaded', function() {
            var newPassword = document.getElementById('new_password');
            var confirmPassword = document.getElementById('confirm_password');
            
            // Appliquer la protection aux champs de mot de passe
            if (newPassword) disableCopyPaste(newPassword);
            if (confirmPassword) disableCopyPaste(confirmPassword);
        });
    </script>
</head>
<body>
    <?php
    // Vérifier si l'utilisateur n'est pas connecté
    if (!isset($_SESSION['user'])) {
        // Afficher le formulaire de connexion
        echo ' <h1>Connexion</h1>
    
    <form method="POST" action="">
        <div>
            <label for="identifiant">Identifiant :</label>
            <input type="text" id="identifiant" name="identifiant" required>
        </div>
        
        <div>
            <label for="mot_de_passe">Mot de passe :</label>
            <input type="password" id="mot_de_passe" name="password" required>
        </div>
        
        <div>
            <input type="submit" name="submitConnection" value="Se connecter">
        </div>
    </form>';

    // Afficher le lien pour créer un compte
    echo '<a href="?page=CreateAccount"><p>Pas de compte créez en un ici</p></a>';
    }

    else {
        // Si l'utilisateur est connecté, afficher le tableau de bord
        echo '<div>
            <h1>Tableau de bord</h1>
            <p>Bonjour ' . htmlspecialchars($_SESSION['user']['prenom_user'], ENT_QUOTES, 'UTF-8') . ', vous êtes connecté.</p>
            
            <h2>Modifier mes informations</h2>
            <form method="POST" action="">
                <div>
                    <label for="nom">Nom :</label>
                    <input type="text" id="nom" name="nom" value="' . htmlspecialchars($_SESSION['user']['nom_user'], ENT_QUOTES, 'UTF-8') . '" required>
                </div>
                
                <div>
                    <label for="prenom">Prénom :</label>
                    <input type="text" id="prenom" name="prenom" value="' . htmlspecialchars($_SESSION['user']['prenom_user'], ENT_QUOTES, 'UTF-8') . '" required>
                </div>
                
                <div>
                    <label for="age">Âge :</label>
                    <input type="number" id="age" name="age" value="' . htmlspecialchars($_SESSION['user']['age_user'], ENT_QUOTES, 'UTF-8') . '" required>
                </div>
                
                <div>
                    <label for="email">Email :</label>
                    <input type="email" id="email" name="email" value="' . htmlspecialchars($_SESSION['user']['adresse_mail_user'], ENT_QUOTES, 'UTF-8') . '" required>
                </div>
                
                <div>
                    <input type="submit" name="updateUser" value="Modifier mes informations">
                </div>
            </form>
            
            <h2>Modifier mon mot de passe</h2>
            <form method="POST" action="">
                <div>
                    <label for="current_password">Mot de passe actuel :</label>
                    <input type="password" id="current_password" name="current_password" required>
                </div>
                
                <div>
                    <label for="new_password">Nouveau mot de passe :</label>
                    <input type="password" id="new_password" name="new_password" required 
                           onpaste="return false;" oncopy="return false;" oncut="return false;">
                </div>
                
                <div>
                    <label for="confirm_password">Confirmer le nouveau mot de passe :</label>
                    <input type="password" id="confirm_password" name="confirm_password" required 
                           onpaste="return false;" oncopy="return false;" oncut="return false;">
                </div>
                
                <div>
                    <input type="submit" name="updatePassword" value="Modifier le mot de passe">
                </div>
            </form>
            
            <hr>
            
            <form method="POST" action="">
                <input type="submit" name="logout" value="Se déconnecter">
            </form>
        </div>';
    }
    ?>

    <?php
    // Affichage des messages de succès ou d'erreur
    if (!empty($success_message)) {
        echo "<p style='color: green;'>$success_message</p>";
    }
    if (!empty($error_message)) {
        echo "<p style='color: red;'>$error_message</p>";
    }
    
    // Affichage du formulaire de création de compte si demandé via URL
    if (isset($_GET['page']) && $_GET['page'] == 'CreateAccount') {
        echo '<h1>Créer un compte</h1>
        <form method="POST">
            <div>
                <label for="nomCreate">Nom :</label>
                <input type="text" id="nomCreate" name="nomCreate" required>
            </div>
            <div>
                <label for="prenomCreate">Prénom :</label>
                <input type="text" id="prenomCreate" name="prenomCreate" required>
            </div>
            <div>
                <label for="ageCreate">Âge :</label>
                <input type="number" id="ageCreate" name="ageCreate" required>
            </div>
            <div>
                <label for="mailCreate">Email :</label>
                <input type="email" id="mailCreate" name="mailCreate" required>
            </div>
            <div>
                <label for="passwordCreate">Mot de passe :</label>
                <input type="password" id="passwordCreate" name="passwordCreate" required>
            </div>
            <div>
                <input type="submit" name="submitCreate" value="Créer un compte">
            </div>
        </form>';
        
        if ($success_message == "Compte créé avec succès !") {
            echo "<p><a href='login.php'>Se connecter</a></p>";
        }
    }
    ?>
</body>
</html>