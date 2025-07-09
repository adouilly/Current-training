<?php
// EXERCICE PDO 


echo "<h1>Exercice PDO </h1>";

// ========================================
// ÉTAPE 1 : CONNEXION À LA BASE DE DONNÉES
// ========================================
echo "<h2>Étape 1 : Connexion à la BDD</h2>";

try {
    $host = 'localhost';
    $dbname = 'rpg';
    $username = 'root';
    $password = '';
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
    $pdo = new PDO($dsn, $username, $password);
    
    echo "<p style='color: green;'>✅ Connexion réussie !</p>";
    
} catch (PDOException $e) {
    die("<p style='color: red;'>❌ Erreur : " . $e->getMessage() . "</p>");
}

// ========================================
// ÉTAPE 2 : REQUÊTE SQL
// ========================================
echo "<h2>Étape 2 : Requête SQL</h2>";

$sql = "SELECT * FROM personnage";
echo "<p>Ma requête : <strong>$sql</strong></p>";

// ========================================
// ÉTAPE 3 : EXÉCUTION (prepare + execute)
// ========================================
echo "<h2>Étape 3 : Exécution (prepare + execute)</h2>";

$stmt = $pdo->prepare($sql);
$stmt->execute();

echo "<p>✅ Requête préparée et exécutée</p>";

// ========================================
// ÉTAPE 4 : EXPLOITATION avec fetchAll()
// ========================================
echo "<h2>Étape 4 : Récupération des données avec fetchAll()</h2>";

$personnages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<p>Nombre de personnages trouvés : <strong>" . count($personnages) . "</strong></p>";

// ========================================
// ÉTAPE 5 : UTILISATION DU FOREACH
// ========================================
echo "<h2>Étape 5 : Affichage avec foreach</h2>";

echo "<table border='1' style='border-collapse: collapse;'>";
echo "<tr>";
echo "<th>ID</th>";
echo "<th>Nom</th>";
echo "<th>Level</th>";
echo "</tr>";

foreach ($personnages as $personnage) {
    echo "<tr>";
    echo "<td>" . $personnage['idPersonnage'] . "</td>";
    echo "<td>" . $personnage['nom'] . "</td>";
    echo "<td>" . $personnage['level'] . "</td>";
    echo "</tr>";
}

echo "</table>";

echo "<hr>";
echo "<h2> Résumé exercice !</h2>";
echo "<p><strong>Les 5 étapes PDO :</strong></p>";
echo "<ol>";
echo "<li>✅ Connexion à la BDD</li>";
echo "<li>✅ Requête SQL</li>";
echo "<li>✅ Exécution (prepare + execute)</li>";
echo "<li>✅ Exploitation avec fetchAll()</li>";
echo "<li>✅ Utilisation du foreach</li>";
echo "</ol>";

// ========================================
// ÉTAPE 6 : CARTES DE PERSONNAGES (JOIN + Mise en page)
// ========================================
echo "<h2>Étape 6 : Cartes de personnages avec JOIN</h2>";

// Requête avec JOIN pour récupérer les informations d'UN SEUL personnage
$sqlCarte = "SELECT 
    p.idPersonnage,
    p.nom, 
    p.surnom, 
    p.level,
    c.nom as classe,
    c.description as description_classe,
    c.baseForce,
    c.baseAgi,
    c.baseIntel,
    a.nom as arme,
    a.degat,
    a.levelMin as arme_level_min,
    ta.libelle as type_arme,
    ta.estDistance
FROM personnage p 
INNER JOIN classe c ON p.idClasse = c.idClasse
INNER JOIN arme a ON p.idArmeUtilise = a.idArme
INNER JOIN typearme ta ON a.idTypeArme = ta.idTypeArme
WHERE p.idPersonnage = :idPersonnage";

$stmtCarte = $pdo->prepare($sqlCarte);
$idPersonnageChoisi = 1; // Choisir le personnage avec l'ID 1
$stmtCarte->execute(['idPersonnage' => $idPersonnageChoisi]);
$personnageComplet = $stmtCarte->fetch(PDO::FETCH_ASSOC);

echo "<p>Affichage du personnage <strong>" . $personnageComplet['nom'] . "</strong> :</p>";

// Style CSS pour les cartes
echo "<style>
.carte-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 0;
}
.carte-personnage {
    border: 3px solid #2c3e50;
    border-radius: 15px;
    padding: 20px;
    width: 350px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
.carte-personnage:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
.carte-header {
    text-align: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #34495e;
}
.nom-personnage {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}
.surnom {
    font-style: italic;
    color: #7f8c8d;
    margin: 5px 0;
}
.level-badge {
    display: inline-block;
    background: #e74c3c;
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
    margin-top: 5px;
}
.info-section {
    margin: 15px 0;
}
.info-title {
    font-weight: bold;
    color: #34495e;
    border-bottom: 1px solid #bdc3c7;
    padding-bottom: 3px;
    margin-bottom: 8px;
}
.classe-info {
    background: #3498db;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin: 10px 0;
}
.arme-info {
    background: #e67e22;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin: 10px 0;
}
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
}
.stat-item {
    text-align: center;
    background: #ecf0f1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #bdc3c7;
}
.stat-value {
    font-weight: bold;
    font-size: 18px;
    color: #2c3e50;
}
.stat-label {
    font-size: 12px;
    color: #7f8c8d;
}
.type-distance {
    background: #27ae60;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 12px;
}
.type-melee {
    background: #c0392b;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 12px;
}
</style>";

// Affichage d'UNE SEULE carte avec les données récupérées
echo "<div class='carte-container'>";

// Plus besoin de foreach, on affiche directement la carte du personnage
echo "<div class='carte-personnage'>";

// Header de la carte
echo "<div class='carte-header'>";
echo "<h3 class='nom-personnage'>" . $personnageComplet['nom'] . "</h3>";
if ($personnageComplet['surnom']) {
    echo "<p class='surnom'>\"" . $personnageComplet['surnom'] . "\"</p>";
}
echo "<span class='level-badge'>Level " . $personnageComplet['level'] . "</span>";
echo "</div>";

// Informations de classe
echo "<div class='info-section'>";
echo "<div class='classe-info'>";
echo "<div class='info-title'>🛡️ CLASSE</div>";
echo "<strong>" . $personnageComplet['classe'] . "</strong><br>";
echo "<small>" . $personnageComplet['description_classe'] . "</small>";

// Statistiques de base
echo "<div class='stats-grid'>";
echo "<div class='stat-item'>";
echo "<div class='stat-value'>" . $personnageComplet['baseForce'] . "</div>";
echo "<div class='stat-label'>FORCE</div>";
echo "</div>";
echo "<div class='stat-item'>";
echo "<div class='stat-value'>" . $personnageComplet['baseAgi'] . "</div>";
echo "<div class='stat-label'>AGILITÉ</div>";
echo "</div>";
echo "<div class='stat-item'>";
echo "<div class='stat-value'>" . $personnageComplet['baseIntel'] . "</div>";
echo "<div class='stat-label'>INTEL</div>";
echo "</div>";
echo "</div>";
echo "</div>";
echo "</div>";

// Informations d'arme
echo "<div class='info-section'>";
echo "<div class='arme-info'>";
echo "<div class='info-title'>⚔️ ARME ÉQUIPÉE</div>";
echo "<strong>" . $personnageComplet['arme'] . "</strong><br>";
echo "Type: " . $personnageComplet['type_arme'] . " ";

if ($personnageComplet['estDistance']) {
    echo "<span class='type-distance'>À DISTANCE</span>";
} else {
    echo "<span class='type-melee'>CORPS À CORPS</span>";
}

echo "<br><br>";
echo "💥 <strong>Dégâts: " . $personnageComplet['degat'] . "</strong><br>";
echo "🔒 Level minimum: " . $personnageComplet['arme_level_min'];
echo "</div>";
echo "</div>";

echo "</div>"; // Fin carte-personnage

echo "</div>"; // Fin carte-container
?>