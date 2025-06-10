// Fonction pour vérifier si une année est bissextile
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Fonction principale qui retourne le nombre de jours dans un mois
function getDaysInMonth(month, year = new Date().getFullYear()) {
    switch (month) {
        case 1: // Janvier
            return 31;
        case 2: // Février
            return isLeapYear(year) ? 29 : 28;
        case 3: // Mars
            return 31;
        case 4: // Avril
            return 30;
        case 5: // Mai
            return 31;
        case 6: // Juin
            return 30;
        case 7: // Juillet
            return 31;
        case 8: // Août
            return 31;
        case 9: // Septembre
            return 30;
        case 10: // Octobre
            return 31;
        case 11: // Novembre
            return 30;
        case 12: // Décembre
            return 31;
        default:
            throw new Error("Mois invalide. Veuillez entrer un nombre entre 1 et 12.");
    }
}

// Tests de la fonction
console.log(`Janvier: ${getDaysInMonth(1)} jours`);
console.log(`Février 2024 (bissextile): ${getDaysInMonth(2, 2024)} jours`);
console.log(`Février 2023 (non bissextile): ${getDaysInMonth(2, 2023)} jours`);
console.log(`Avril: ${getDaysInMonth(4)} jours`);

// Test avec l'année actuelle si non spécifiée
console.log(`Février cette année: ${getDaysInMonth(2)} jours`);