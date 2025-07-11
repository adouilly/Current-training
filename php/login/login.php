<?php
session_start();
// Connexion à la base de données
$host = 'localhost';
$dbname = 'logintest';
$username = 'root';
$password = '';
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LoginMethode</title>
    <script>
        // Fonction pour bloquer complètement le copier-coller sur les champs de mot de passe
        function disableCopyPaste(element) {
            element.addEventListener('paste', function(e) {
                e.preventDefault();
                return false;
            });
            element.addEventListener('copy', function(e) {
                e.preventDefault();
                return false;
            });
            element.addEventListener('cut', function(e) {
                e.preventDefault();
                return false;
            });
            element.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            element.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Appliquer la protection dès que la page se charge
        document.addEventListener('DOMContentLoaded', function() {
            var newPassword = document.getElementById('new_password');
            var confirmPassword = document.getElementById('confirm_password');
            
            if (newPassword) disableCopyPaste(newPassword);
            if (confirmPassword) disableCopyPaste(confirmPassword);
        });
    </script>
</head>
<body>
    <?php
    if (!isset($_SESSION['user'])) {
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
    echo '<a href="?page=CreateAccount"><p>Pas de compte créez en un ici</p></a>';
    }
    else {
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

if (isset($_POST['submitConnection'])) {
    $identifiant = htmlspecialchars($_POST['identifiant'], ENT_QUOTES, 'UTF-8');
    $mot_de_passe = htmlspecialchars($_POST['password'], ENT_QUOTES, 'UTF-8');
    $sql= "SELECT * FROM users WHERE adresse_mail_user = :identifiant";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['identifiant' => $identifiant]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && $mot_de_passe == $result["password_user"]) {
        $_SESSION['user'] = [
            "id_user" => $result['id_user'],
            "nom_user" => $result['nom_user'],
            "prenom_user" => $result['prenom_user'],
            "age_user" => $result['age_user'],
            "adresse_mail_user" => $result['adresse_mail_user']
        ];
        header("Location: login.php");
        echo "<p>Connexion réussie ! Bienvenue " . htmlspecialchars($result['prenom_user'], ENT_QUOTES, 'UTF-8') . "</p>";
    } else {
        echo "<p>Identifiant ou mot de passe incorrect.</p>";
    }
}
    if (isset($_POST['updateUser'])) {
        $nom = htmlspecialchars($_POST['nom'], ENT_QUOTES, 'UTF-8');
        $prenom = htmlspecialchars($_POST['prenom'], ENT_QUOTES, 'UTF-8');
        $age = intval($_POST['age']);
        $email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');
        $userId = $_SESSION['user']['id_user'];
        
        $sql = "UPDATE users SET nom_user = :nom, prenom_user = :prenom, age_user = :age, adresse_mail_user = :email WHERE id_user = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'age' => $age,
            'email' => $email,
            'id' => $userId
        ]);
        
        // Mettre à jour les données de session
        $_SESSION['user']['nom_user'] = $nom;
        $_SESSION['user']['prenom_user'] = $prenom;
        $_SESSION['user']['age_user'] = $age;
        $_SESSION['user']['adresse_mail_user'] = $email;
        
        echo "<p style='color: green;'>Informations mises à jour avec succès !</p>";
    }
    if (isset($_POST['updatePassword'])) {
        $current_password = htmlspecialchars($_POST['current_password'], ENT_QUOTES, 'UTF-8');
        $new_password = htmlspecialchars($_POST['new_password'], ENT_QUOTES, 'UTF-8');
        $confirm_password = htmlspecialchars($_POST['confirm_password'], ENT_QUOTES, 'UTF-8');
        $userId = $_SESSION['user']['id_user'];
        
        // Récupérer le mot de passe actuel de la base de données
        $sql = "SELECT password_user FROM users WHERE id_user = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Vérifier le mot de passe actuel
        if ($current_password == $user['password_user']) {
            // Vérifier que les nouveaux mots de passe correspondent
            if ($new_password === $confirm_password) {
                // Vérifier que le nouveau mot de passe est différent de l'ancien
                if ($new_password !== $current_password) {
                    // Mettre à jour le mot de passe
                    $sql = "UPDATE users SET password_user = :password WHERE id_user = :id";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        'password' => $new_password,
                        'id' => $userId
                    ]);
                    
                    echo "<p style='color: green;'>Mot de passe modifié avec succès !</p>";
                } else {
                    echo "<p style='color: red;'>Le nouveau mot de passe doit être différent de l'ancien.</p>";
                }
            } else {
                echo "<p style='color: red;'>Les nouveaux mots de passe ne correspondent pas.</p>";
            }
        } else {
            echo "<p style='color: red;'>Mot de passe actuel incorrect.</p>";
        }
    }
    if (isset($_POST['logout'])) {
        session_destroy();
        echo "<p>Vous avez été déconnecté.</p>";
        header("Location: login.php");
        exit();
    }
?>
</body>
</html>