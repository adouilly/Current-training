/**
 * Gestion des widgets du tableau de bord
 * Dashboard widget management
 */

document.addEventListener('DOMContentLoaded', () => {
    // S'assurer qu'aucun indicateur de drag n'est présent au chargement
    clearDropIndicators();
    
    // Initialiser les widgets
    initWidgets();
    
    // Vérifier si les fonctions de gestion des widgets sont correctement exportées
    verifyWidgetFunctions();
    
    // Ajouter un nettoyage périodique au cas où des styles persistent
    const cleanupInterval = setInterval(() => {
        const isDragging = document.querySelector('.dragging, .widget-ghost');
        if (!isDragging) {
            clearDropIndicators();
        }
    }, 3000);
    
    // Nettoyer l'intervalle lors de la fermeture de la page
    window.addEventListener('beforeunload', () => {
        clearInterval(cleanupInterval);
    });
    
    // Optimiser l'affichage des widgets en mode compact
    setTimeout(() => {
        document.querySelectorAll('.widget.compact').forEach(widget => {
            // Même logique que dans toggleWidgetView pour les widgets déjà compact
            const summaryEl = widget.querySelector('.compact-summary');
            const headerHeight = widget.querySelector('.widget-header')?.offsetHeight || 0;
            const summaryHeight = summaryEl?.offsetHeight || 0;
            
            if (summaryEl) {
                // Masquer tous les éléments non essentiels
                Array.from(widget.children).forEach(child => {
                    if (!child.classList.contains('widget-header') && !child.classList.contains('compact-summary')) {
                        child.style.display = 'none';
                        child.style.height = '0';
                    }
                });
                
                // Appliquer la hauteur exacte nécessaire
                widget.style.height = (headerHeight + summaryHeight) + 'px';
            }
        });
    }, 300);
});

/**
 * Vérifier que les fonctions de widget sont correctement exportées
 * Verify that widget functions are correctly exported
 */
function verifyWidgetFunctions() {
    if (!window.WidgetManager) {
        console.error('WidgetManager non disponible - réinitialisation');
        window.WidgetManager = {
            toggleWidgetSize,
            toggleWidgetView,
            removeWidget,
            generateCompactSummary,
            saveWidgetState,
            restoreWidgetStates,
            refreshWidgetData
        };
    }
}

/**
 * Initialisation des widgets
 */
function initWidgets() {
    // Initialiser tous les widgets
    initAllWidgets();
    
    // Ajouter les écouteurs d'événements pour les contrôles
    addWidgetControlListeners();
    
    // Restaurer l'état des widgets
    restoreWidgetStates();
    
    // Écouter les mises à jour en temps réel
    if (window.LiveData) {
        window.LiveData.addListener(updateWidgetsWithLiveData);
    }
    
    // Ajouter une classe pour montrer que les widgets sont prêts
    document.querySelectorAll('.widget').forEach(widget => {
        widget.classList.add('widget-ready');
    });
}

/**
 * Mise à jour des widgets avec les données en temps réel
 */
function updateWidgetsWithLiveData(data) {
    // Mettre à jour les widgets de statistiques
    if (data.stats) {
        Object.entries(data.stats).forEach(([key, value]) => {
            const widget = document.querySelector(`.widget[data-widget-id="stats-${key}"]`);
            if (!widget) return;
            
            const statValue = widget.querySelector('.stat-value');
            const statChange = widget.querySelector('.stat-change');
            
            if (statValue) {
                let formattedValue = value.total.toLocaleString();
                if (value.currency) formattedValue += value.currency;
                statValue.textContent = formattedValue;
            }
            
            if (statChange) {
                statChange.textContent = (value.change >= 0 ? '+' : '') + value.change + '%';
                statChange.className = `stat-change ${value.trend === 'up' ? 'positive' : 'negative'}`;
            }
            
            // Mettre à jour le résumé si en mode compact
            if (widget.classList.contains('compact')) {
                generateCompactSummary(widget);
            }
        });
    }
}

/**
 * Initialisation de tous les widgets
 */
function initAllWidgets() {
    // Initialiser les widgets de statistiques
    initStatsWidgets();
    
    // Initialiser les autres types de widgets
    initTableWidgets();
    initContactWidgets();
}

/**
 * Initialiser les widgets de statistiques
 */
function initStatsWidgets() {
    const statsWidgets = document.querySelectorAll('.widget[data-widget-id^="stats-"]');
    
    statsWidgets.forEach(widget => {
        // Ajouter l'animation de comptage pour les valeurs
        const statsValue = widget.querySelector('.stat-value');
        if (statsValue) {
            animateNumber(statsValue);
        }
    });
}

/**
 * Animer le décompte d'un nombre
 */
function animateNumber(element) {
    if (!element) return;
    
    const finalValue = element.innerText;
    let value = '';
    
    // Si c'est un nombre avec devise, extraire le nombre
    if (finalValue.includes('€')) {
        const match = finalValue.match(/([0-9,]+)/);
        if (match) {
            value = match[1].replace(',', '');
        }
    } else {
        // Enlever toute ponctuation pour obtenir juste le nombre
        value = finalValue.replace(/[^\d]/g, '');
    }
    
    // Si la conversion a échoué, ne pas animer
    if (isNaN(parseInt(value))) return;
    
    // Définir une valeur de départ
    let startValue = 0;
    let duration = 1500;
    let startTime = null;
    
    // Animation avec requestAnimationFrame
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * parseInt(value));
        
        // Formater le nombre selon le format original
        if (finalValue.includes('€')) {
            element.innerText = currentValue.toLocaleString() + '€';
        } else if (finalValue.includes(',')) {
            element.innerText = currentValue.toLocaleString();
        } else {
            element.innerText = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.innerText = finalValue; // Rétablir la valeur exacte à la fin
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Initialiser les widgets de tableau
 */
function initTableWidgets() {
    const tableWidgets = document.querySelectorAll('.widget[data-widget-id="recent-orders"]');
    
    tableWidgets.forEach(widget => {
        // Ajouter des fonctionnalités aux tableaux si nécessaire
        const tableRows = widget.querySelectorAll('tbody tr');
        tableRows.forEach((row, index) => {
            // Ajouter un délai pour l'animation d'apparition
            setTimeout(() => {
                row.classList.add('row-visible');
            }, index * 100);
            
            // Ajouter une interaction pour le clic sur un bouton
            const actionBtn = row.querySelector('.btn-sm');
            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // On pourrait afficher des détails sur la commande ici
                    alert('Affichage des détails de la commande');
                });
            }
        });
    });
}

/**
 * Initialiser les widgets de contact
 */
function initContactWidgets() {
    const contactWidgets = document.querySelectorAll('.widget[data-widget-id="quick-contact"]');
    
    contactWidgets.forEach(widget => {
        const form = widget.querySelector('form');
        if (form) {
            // Ajouter des attributs id manquants aux champs
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach((input, index) => {
                if (!input.id) {
                    // Si l'élément n'a pas d'id, en générer un
                    const label = input.previousElementSibling;
                    if (label && label.tagName === 'LABEL' && label.getAttribute('for')) {
                        // Utiliser l'attribut 'for' du label si disponible
                        input.id = label.getAttribute('for');
                    } else {
                        input.id = `form-field-${index}`;
                        // Mettre à jour le label si existant
                        if (label && label.tagName === 'LABEL') {
                            label.setAttribute('for', input.id);
                        }
                    }
                }
                
                // S'assurer que l'attribut name est présent
                if (!input.name && input.id) {
                    input.name = input.id;
                }
            });
            
            // Gestion de la soumission du formulaire
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Simuler un envoi de formulaire
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé';
                        
                        // Réinitialiser le formulaire
                        setTimeout(() => {
                            this.reset();
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }, 2000);
                    }, 1500);
                }
            });
        }
    });
}

/**
 * Ajouter les écouteurs d'événements pour les contrôles des widgets
 * Add event listeners for widget controls
 */
function addWidgetControlListeners() {
    document.querySelectorAll('.widget').forEach(widget => {
        // Rendre tout le header draggable
        const header = widget.querySelector('.widget-header');
        if (header) {
            header.classList.add('draggable');
            
            // Ajouter l'événement pour drag & drop sur tout le header
            header.addEventListener('mousedown', (e) => {
                // Ne pas déclencher le drag si on clique sur un bouton
                if (e.target.closest('button')) return;
                
                startDragWidget(e, widget);
            });
        }
        
        // Ajout du bouton de mise à jour
        const controls = widget.querySelector('.widget-controls');
        if (controls && !controls.querySelector('.refresh-widget')) {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'refresh-widget';
            refreshBtn.title = 'Rafraîchir';
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            refreshBtn.addEventListener('click', () => refreshWidgetData(widget));
            
            // Insérer avant le bouton toggle-size (ou en premier)
            const firstBtn = controls.querySelector('button');
            if (firstBtn) {
                controls.insertBefore(refreshBtn, firstBtn);
            } else {
                controls.appendChild(refreshBtn);
            }
        }
        
        // Gestion du bouton de redimensionnement
        const resizeBtn = widget.querySelector('.toggle-size');
        if (resizeBtn) {
            // S'assurer de supprimer tout gestionnaire d'événement existant
            resizeBtn.removeEventListener('click', () => toggleWidgetSize(widget));
            // Ajouter un nouveau gestionnaire d'événement
            resizeBtn.addEventListener('click', function() {
                toggleWidgetSize(widget);
            });
        }
        
        // Gestion du bouton de vue compacte
        const viewBtn = widget.querySelector('.toggle-view');
        if (viewBtn) {
            // S'assurer de supprimer tout gestionnaire d'événement existant
            viewBtn.removeEventListener('click', () => toggleWidgetView(widget));
            // Ajouter un nouveau gestionnaire d'événement
            viewBtn.addEventListener('click', function() {
                toggleWidgetView(widget);
            });
        }
        
        // Gestion du bouton de suppression
        const removeBtn = widget.querySelector('.remove-widget');
        if (removeBtn) {
            // S'assurer de supprimer tout gestionnaire d'événement existant
            removeBtn.removeEventListener('click', () => removeWidget(widget));
            // Ajouter un nouveau gestionnaire d'événement
            removeBtn.addEventListener('click', function() {
                removeWidget(widget);
            });
        }
    });
    
    // Log pour vérifier que les écouteurs sont ajoutés
    console.log('Écouteurs d\'événements de widgets ajoutés');
}

/**
 * Fonction qui démarre le drag d'un widget
 * Function that starts the widget drag operation
 * @param {MouseEvent} e - L'événement de souris / Mouse event
 * @param {HTMLElement} widget - Widget à déplacer / Widget to be moved
 */
function startDragWidget(e, widget) {
    e.preventDefault();
    
    // Position initiale de la souris / Initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Position initiale du widget / Initial widget position
    const rect = widget.getBoundingClientRect();
    const startLeft = rect.left;
    const startTop = rect.top;
    
    // Créer un clone visuel pour le drag / Create visual clone for dragging
    const ghost = widget.cloneNode(true);
    ghost.classList.add('widget-ghost');
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.position = 'fixed';
    ghost.style.top = rect.top + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.7';
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);
    
    // Marquer le widget comme en cours de déplacement / Mark widget as being moved
    widget.classList.add('dragging');
    
    // Fonction pour gérer le déplacement / Function to handle movement
    function handleMouseMove(moveEvent) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        
        // Déplacer le clone / Move the clone
        ghost.style.transform = `translate(${dx}px, ${dy}px)`;
        
        // Marquer les emplacements potentiels de drop / Mark potential drop locations
        markPotentialDropZone(moveEvent, widget);
    }
    
    // Fonction pour la fin du déplacement / Function for end of movement
    function handleMouseUp(upEvent) {
        // Supprimer les écouteurs temporaires / Remove temporary listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Supprimer le clone / Remove the clone
        ghost.remove();
        
        // Supprimer la classe de dragging / Remove dragging class
        widget.classList.remove('dragging');
        
        // Placer le widget à sa nouvelle position / Place widget at its new position
        moveWidgetToDropZone(upEvent, widget);
        
        // Nettoyer les indicateurs de drop / Clean drop indicators
        clearDropIndicators();
        
        // Réorganiser les widgets après le drop / Reorganize widgets after drop
        reorganizeWidgetsAfterDrop();
    }
    
    // Ajouter les écouteurs temporaires / Add temporary listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Changer la taille d'un widget
 * Change widget size
 */
function toggleWidgetSize(widget) {
    console.log('Fonction toggleWidgetSize appelée');
    
    const currentSize = widget.getAttribute('data-size') || 'small';
    let newSize;
    
    // Cycle des tailles
    switch (currentSize) {
        case 'small': newSize = 'medium'; break;
        case 'medium': newSize = 'large'; break;
        case 'large': newSize = 'full'; break;
        case 'full': newSize = 'small'; break;
        default: newSize = 'small';
    }
    
    console.log(`Changement de taille: ${currentSize} -> ${newSize}`);
    
    // Appliquer la nouvelle taille
    widget.setAttribute('data-size', newSize);
    
    // Appliquer les classes CSS correspondantes
    widget.classList.remove('small', 'medium', 'large', 'full');
    widget.classList.add(newSize);
    
    // Redimensionner manuellement avec les styles de grille
    const sizes = {
        'small': { cols: 1, rows: 1 },
        'medium': { cols: 2, rows: 1 },
        'large': { cols: 3, rows: 2 },
        'full': { cols: 4, rows: 2 }
    };
    
    // Appliquer la taille à l'élément avec un style direct
    if (sizes[newSize]) {
        widget.style.gridColumn = `span ${sizes[newSize].cols}`;
        widget.style.gridRow = `span ${sizes[newSize].rows}`;
    }
    
    // Sauvegarder la taille
    saveWidgetState(widget);
    
    // Recalculer la disposition
    setTimeout(() => {
        reorganizeWidgetsAfterResize();
    }, 50);
}

/**
 * Basculer la vue d'un widget entre normale et compacte
 * Toggle widget view between normal and compact
 */
function toggleWidgetView(widget) {
    console.log('Bascule de la vue du widget:', widget.getAttribute('data-widget-id'));
    
    // Ajouter une animation de transition
    widget.style.transition = "all 0.3s ease";
    
    // Basculer la classe compact
    widget.classList.toggle('compact');
    
    const isCompact = widget.classList.contains('compact');
    const viewBtn = widget.querySelector('.toggle-view');
    
    if (viewBtn) {
        viewBtn.innerHTML = isCompact ? 
            '<i class="fas fa-expand"></i>' : 
            '<i class="fas fa-compress"></i>';
        viewBtn.title = isCompact ? 'Vue étendue' : 'Vue compacte';
    }
    
    // Générer ou cacher le résumé
    if (isCompact) {
        // S'assurer que le widgetContent est masqué immédiatement
        const widgetContent = widget.querySelector('.widget-content');
        if (widgetContent) {
            widgetContent.style.display = 'none';
        }
        
        // S'assurer que le résumé compact existe
        let summaryEl = widget.querySelector('.compact-summary');
        if (!summaryEl) {
            summaryEl = document.createElement('div');
            summaryEl.className = 'compact-summary';
            widget.appendChild(summaryEl);
        } else {
            // Réinitialiser l'affichage au cas où il avait été masqué
            summaryEl.style.display = 'flex';
        }
        
        // Générer le contenu du résumé
        generateCompactSummary(widget);
        
        // Forcer le recalcul de la disposition pour éliminer l'espace blanc
        setTimeout(() => {
            // Nettoyer tous les styles qui pourraient influencer la hauteur
            widget.style.minHeight = '';
            widget.style.maxHeight = '';
            widget.style.height = 'auto';
            
            // Masquer tous les éléments non essentiels
            Array.from(widget.children).forEach(child => {
                if (!child.classList.contains('widget-header') && !child.classList.contains('compact-summary')) {
                    child.style.display = 'none';
                    child.style.height = '0';
                }
            });
            
            // Recalculer la hauteur nécessaire
            const headerHeight = widget.querySelector('.widget-header')?.offsetHeight || 0;
            const summaryHeight = summaryEl.offsetHeight || 0;
            
            // Appliquer la hauteur exacte nécessaire
            widget.style.height = (headerHeight + summaryHeight) + 'px';
        }, 50);
    } else {
        // Réinitialiser tous les styles pour le mode normal
        widget.style.height = '';
        widget.style.minHeight = '';
        widget.style.maxHeight = '';
        
        // Réactiver l'affichage du contenu
        Array.from(widget.children).forEach(child => {
            child.style.display = '';
            child.style.height = '';
        });
        
        // Assurer que le widget-content est visible
        const widgetContent = widget.querySelector('.widget-content');
        if (widgetContent) {
            widgetContent.style.display = '';
        }
    }
    
    // Ajouter ici: gestion améliorée du mode compact
    if (isCompact) {
        // S'assurer que le contenu est masqué immédiatement
        const widgetContent = widget.querySelector('.widget-content');
        if (widgetContent) {
            widgetContent.style.display = 'none';
        }
        
        // Générer ou mettre à jour le résumé compact
        let summaryEl = widget.querySelector('.compact-summary');
        if (!summaryEl) {
            summaryEl = document.createElement('div');
            summaryEl.className = 'compact-summary';
            widget.appendChild(summaryEl);
            
            // Générer le contenu du résumé
            generateCompactSummary(widget);
        }
        
        // Forcer une hauteur automatique basée uniquement sur le contenu
        setTimeout(() => {
            widget.style.height = 'auto';
            // Déclencher un reflow pour s'assurer que la grille se réorganise
            document.getElementById('widgets-grid').style.display = 'grid';
        }, 50);
    } else {
        // Retour au mode normal: supprimer les contraintes de hauteur
        widget.style.height = '';
        widget.style.minHeight = '';
        widget.style.maxHeight = '';
        
        // Réafficher le contenu
        const widgetContent = widget.querySelector('.widget-content');
        if (widgetContent) {
            widgetContent.style.display = '';
        }
        
        // Masquer le résumé
        const summary = widget.querySelector('.compact-summary');
        if (summary) {
            summary.style.display = 'none';
        }
    }
    
    // Sauvegarder l'état
    saveWidgetState(widget);
    
    // Réorganiser les widgets après le changement
    setTimeout(reorganizeWidgetsAfterResize, 100);
}

/**
 * Générer un résumé compact pour un widget
 * Generate a compact summary for a widget
 */
function generateCompactSummary(widget) {
    console.log("Génération du résumé compact pour", widget.getAttribute('data-widget-id'));
    
    // Vérifier si un résumé existe déjà
    let summaryEl = widget.querySelector('.compact-summary');
    
    // Créer l'élément de résumé s'il n'existe pas
    if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.className = 'compact-summary';
        widget.appendChild(summaryEl);
    }
    
    // Générer le contenu du résumé selon le type de widget
    const widgetId = widget.getAttribute('data-widget-id');
    let summaryContent = '';
    
    // Contenu spécifique pour chaque type de widget
    switch (widgetId) {
        case 'stats-users':
            const usersValue = widget.querySelector('.stat-value')?.textContent || '2,845';
            const usersChange = widget.querySelector('.stat-change')?.textContent || '+5.27%';
            const usersTrend = widget.querySelector('.stat-change')?.classList.contains('positive') ? '📈' : '📉';
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-users"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Utilisateurs actifs</div>
                    <div class="summary-value">${usersValue} ${usersTrend} <span class="summary-change">${usersChange}</span></div>
                </div>
            `;
            break;
            
        case 'stats-sales':
            const salesValue = widget.querySelector('.stat-value')?.textContent || '1,253';
            const salesChange = widget.querySelector('.stat-change')?.textContent || '+12.8%';
            const salesTrend = widget.querySelector('.stat-change')?.classList.contains('positive') ? '📈' : '📉';
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-shopping-cart"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Ventes</div>
                    <div class="summary-value">${salesValue} ${salesTrend} <span class="summary-change">${salesChange}</span></div>
                </div>
            `;
            break;
            
        case 'stats-visits':
            const visitsValue = widget.querySelector('.stat-value')?.textContent || '9,721';
            const visitsChange = widget.querySelector('.stat-change')?.textContent || '+8.3%';
            const visitsTrend = widget.querySelector('.stat-change')?.classList.contains('positive') ? '📈' : '📉';
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-eye"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Visites</div>
                    <div class="summary-value">${visitsValue} ${visitsTrend} <span class="summary-change">${visitsChange}</span></div>
                </div>
            `;
            break;
            
        case 'stats-revenue':
            const revenueValue = widget.querySelector('.stat-value')?.textContent || '75,245€';
            const revenueChange = widget.querySelector('.stat-change')?.textContent || '+15.1%';
            const revenueTrend = widget.querySelector('.stat-change')?.classList.contains('positive') ? '📈' : '📉';
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-euro-sign"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Revenus</div>
                    <div class="summary-value">${revenueValue} ${revenueTrend} <span class="summary-change">${revenueChange}</span></div>
                </div>
            `;
            break;
            
        case 'sales-chart':
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-chart-line"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Ventes mensuelles</div>
                    <div class="summary-value">Croissance <strong>+12%</strong> depuis le mois dernier<br>Total: <strong>25,000€</strong> pour le mois en cours</div>
                </div>
            `;
            break;
            
        case 'recent-orders':
            const orderCount = widget.querySelectorAll('tbody tr').length || 5;
            const lastOrderDate = widget.querySelector('tbody tr:first-child td:nth-child(3)')?.textContent || 'aujourd\'hui';
            const lastOrderAmount = widget.querySelector('tbody tr:first-child td:nth-child(4)')?.textContent || '125.99€';
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Commandes récentes</div>
                    <div class="summary-value">
                        <strong>${orderCount}</strong> commandes au total<br>
                        Dernière commande: <strong>${lastOrderAmount}</strong> (${lastOrderDate})
                    </div>
                </div>
            `;
            break;
            
        case 'quick-contact':
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-envelope"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Contact rapide</div>
                    <div class="summary-value">Formulaire disponible | 5 clients</div>
                </div>
            `;
            break;
            
        default:
            summaryContent = `
                <div class="summary-icon"><i class="fas fa-info-circle"></i></div>
                <div class="summary-content">
                    <div class="summary-title">Informations</div>
                    <div class="summary-value">Résumé non disponible pour ce widget</div>
                </div>
            `;
    }
    
    // Appliquer le contenu
    summaryEl.innerHTML = summaryContent;
    
    // S'assurer que le résumé est visible
    summaryEl.style.display = 'flex';
}

/**
 * Marquer les zones potentielles de drop
 */
function markPotentialDropZone(e, draggedWidget) {
    // Nettoyer les indicateurs existants
    clearDropIndicators();
    
    // Trouver le widget sous le curseur
    const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
    let targetWidget = null;
    for (const element of elementsAtPoint) {
        if (element.classList && element.classList.contains('widget') && element !== draggedWidget) {
            targetWidget = element;
            break;
        }
    }
    if (!targetWidget) {
        // Si on n'est pas sur un widget, vérifier si on est sur le conteneur
        const container = document.getElementById('widgets-grid');
        if (elementsAtPoint.includes(container)) {
            markContainerDropZone(container);
        }
        return;
    }
    
    // Marquer le widget cible
    targetWidget.classList.add('drop-target');
    
    // Déterminer la position (avant, après, dessus, dessous)
    const rect = targetWidget.getBoundingClientRect();
    const horizontalCenter = rect.left + rect.width / 2;
    const verticalCenter = rect.top + rect.height / 2;
    
    // Créer l'indicateur visuel
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    if (Math.abs(e.clientX - horizontalCenter) > Math.abs(e.clientY - verticalCenter)) {
        // Plus proche horizontalement
        if (e.clientX < horizontalCenter) {
            indicator.classList.add('drop-left');
            indicator.style.left = (rect.left - 2) + 'px';
            indicator.style.top = rect.top + 'px';
            indicator.style.width = '4px';
            indicator.style.height = rect.height + 'px';
        } else {
            indicator.classList.add('drop-right');
            indicator.style.left = (rect.right - 2) + 'px';
            indicator.style.top = rect.top + 'px';
            indicator.style.width = '4px';
            indicator.style.height = rect.height + 'px';
        }
    } else {
        // Plus proche verticalement
        if (e.clientY < verticalCenter) {
            indicator.classList.add('drop-top');
            indicator.style.top = (rect.top - 2) + 'px';
            indicator.style.left = rect.left + 'px';
            indicator.style.width = rect.width + 'px';
            indicator.style.height = '4px';
        } else {
            indicator.classList.add('drop-bottom');
            indicator.style.top = (rect.bottom - 2) + 'px';
            indicator.style.left = rect.left + 'px';
            indicator.style.width = rect.width + 'px';
            indicator.style.height = '4px';
        }
    }
    document.body.appendChild(indicator);
}

/**
 * Marquer le conteneur comme zone de drop
 */
function markContainerDropZone(container) {
    container.classList.add('container-drop-target');
}

/**
 * Nettoyer tous les indicateurs de drop
 * Clean all drop indicators
 */
function clearDropIndicators() {
    // Supprimer les indicateurs visuels de drop / Remove visual drop indicators
    const indicators = document.querySelectorAll('.drop-indicator');
    indicators.forEach(el => el.remove());
    
    // Supprimer toutes les classes d'état de drop / Remove all drop state classes
    const targets = document.querySelectorAll('.drop-target, .container-drop-target');
    targets.forEach(el => {
        el.classList.remove('drop-target', 'container-drop-target');
        
        // S'assurer que les styles spécifiques sont également réinitialisés
        // Ensure specific styles are also reset
        el.style.outline = '';
        el.style.boxShadow = '';
    });
    
    // S'assurer que le conteneur des widgets est également nettoyé
    // Make sure the widget container is also cleaned
    const container = document.getElementById('widgets-grid');
    if (container) {
        container.classList.remove('container-drop-target', 'drag-active');
        container.style.outline = '';
    }
}

/**
 * Déplacer un widget vers sa zone de drop
 */
function moveWidgetToDropZone(e, draggedWidget) {
    // Trouver où on dépose le widget
    const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
    let targetWidget = null;
    const container = document.getElementById('widgets-grid');
    for (const element of elementsAtPoint) {
        if (element.classList && element.classList.contains('widget') && element !== draggedWidget) {
            targetWidget = element;
            break;
        }
    }
    if (!targetWidget) {
        // Si on n'est pas sur un widget, vérifier si on est sur le conteneur
        const container = document.getElementById('widgets-grid');
        if (elementsAtPoint.includes(container)) {
            // Déposer à la fin du conteneur
            container.appendChild(draggedWidget);
        }
        return;
    }
    
    // Déterminer où insérer par rapport au widget cible
    const rect = targetWidget.getBoundingClientRect();
    const horizontalCenter = rect.left + rect.width / 2;
    const verticalCenter = rect.top + rect.height / 2;
    
    // Insérer le widget avant ou après la cible selon la position
    if (Math.abs(e.clientX - horizontalCenter) > Math.abs(e.clientY - verticalCenter)) {
        // Plus proche horizontalement
        if (e.clientX < horizontalCenter) {
            targetWidget.parentNode.insertBefore(draggedWidget, targetWidget);
        } else {
            targetWidget.parentNode.insertBefore(draggedWidget, targetWidget.nextSibling);
        }
    } else {
        // Plus proche verticalement
        if (e.clientY < verticalCenter) {
            targetWidget.parentNode.insertBefore(draggedWidget, targetWidget);
        } else {
            targetWidget.parentNode.insertBefore(draggedWidget, targetWidget.nextSibling);
        }
    }
}

/**
 * Réorganiser les widgets après un drag & drop
 */
function reorganizeWidgetsAfterDrop() {
    // Optimiser la disposition pour éviter les espaces vides
    const container = document.getElementById('widgets-grid');
    const widgets = Array.from(container.querySelectorAll('.widget'));
    
    // Mettre à jour l'ordre des widgets dans le stockage
    widgets.forEach((widget, index) => {
        widget.style.order = index;
    });
    
    // Sauvegarder l'état de tous les widgets
    widgets.forEach(widget => saveWidgetState(widget));
}

/**
 * Réorganiser les widgets après un redimensionnement
 */
function reorganizeWidgetsAfterResize() {
    // Votre logique de réorganisation ici
    // Par exemple, on peut appeler la même fonction que pour le drop
    reorganizeWidgetsAfterDrop();
}

/**
 * Supprimer un widget avec confirmation
 * Remove widget with confirmation
 */
function removeWidget(widget) {
    console.log('Fonction removeWidget appelée');
    
    // Obtenir le nom du widget
    const widgetTitle = widget.querySelector('.widget-header h3')?.textContent || 'ce widget';
    
    // Demander confirmation
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${widgetTitle} ?`)) {
        // Sauvegarder les informations du widget pour pouvoir le restaurer
        const widgetId = widget.getAttribute('data-widget-id');
        const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
        
        removedWidgets[widgetId] = {
            title: widgetTitle,
            size: widget.getAttribute('data-size') || 'small'
        };
        
        localStorage.setItem('removedWidgets', JSON.stringify(removedWidgets));
        
        // Animer la suppression
        widget.classList.add('removing');
        
        // Supprimer après la fin de l'animation
        setTimeout(() => {
            widget.remove();
            
            // Déclencher un événement pour informer d'autres composants
            document.dispatchEvent(new CustomEvent('widgetRemoved', { 
                detail: { widgetId, title: widgetTitle } 
            }));
            
            // Log pour vérifier que l'événement est déclenché
            console.log(`Widget ${widgetId} supprimé et événement déclenché`);
        }, 300);
    }
}

/**
 * Sauvegarder l'état d'un widget
 */
function saveWidgetState(widget) {
    try {
        const widgetId = widget.getAttribute('data-widget-id');
        if (!widgetId) return;
        
        // Récupérer les états existants
        const states = JSON.parse(localStorage.getItem('dashboardWidgetStates') || '{}');
        
        // Mettre à jour l'état du widget
        states[widgetId] = {
            size: widget.getAttribute('data-size') || 'small',
            isCompact: widget.classList.contains('compact'),
            position: widget.style.order || '0'
        };
        
        // Sauvegarder les états
        localStorage.setItem('dashboardWidgetStates', JSON.stringify(states));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'état du widget:', error);
    }
}

/**
 * Restaurer les états des widgets depuis le stockage
 */
function restoreWidgetStates() {
    try {
        const states = JSON.parse(localStorage.getItem('dashboardWidgetStates') || '{}');
        
        // Appliquer les états sauvegardés
        document.querySelectorAll('.widget').forEach(widget => {
            const widgetId = widget.getAttribute('data-widget-id');
            if (!widgetId || !states[widgetId]) return;
            
            // Appliquer la taille
            if (states[widgetId].size) {
                const size = states[widgetId].size;
                widget.setAttribute('data-size', size);
                widget.classList.remove('small', 'medium', 'large', 'full');
                widget.classList.add(size);
                
                // Appliquer les dimensions de grille
                const sizes = {
                    'small': { cols: 1, rows: 1 },
                    'medium': { cols: 2, rows: 1 },
                    'large': { cols: 3, rows: 2 },
                    'full': { cols: 4, rows: 2 }
                };
                
                if (sizes[size]) {
                    widget.style.gridColumn = `span ${sizes[size].cols}`;
                    widget.style.gridRow = `span ${sizes[size].rows}`;
                }
            }
            
            // Appliquer le mode compact
            if (states[widgetId].isCompact) {
                widget.classList.add('compact');
                
                // Mettre à jour le bouton
                const viewBtn = widget.querySelector('.toggle-view');
                if (viewBtn) {
                    viewBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    viewBtn.title = 'Vue étendue';
                }
                
                // Générer le résumé
                generateCompactSummary(widget);
            }
            
            // Appliquer la position
            if (states[widgetId].position) {
                widget.style.order = states[widgetId].position;
            }
        });
    } catch (error) {
        console.error('Erreur lors de la restauration des états des widgets:', error);
    }
}

/**
 * Rafraîchir les données d'un widget avec animation de chargement
 */
function refreshWidgetData(widget) {
    const widgetId = widget.getAttribute('data-widget-id');
    const widgetContent = widget.querySelector('.widget-content');
    if (!widgetContent) return;
    
    // Créer l'overlay de chargement s'il n'existe pas
    let loadingOverlay = widget.querySelector('.loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Mise à jour...</p>
        `;
        widgetContent.appendChild(loadingOverlay);
    } else {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.classList.remove('fade-out');
    }
    
    // Animer le bouton de rafraîchissement
    const refreshBtn = widget.querySelector('.refresh-widget');
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
        refreshBtn.disabled = true;
    }
    
    // Simuler un chargement de données
    setTimeout(() => {
        // Mettre à jour les données selon le type de widget
        updateWidgetWithFreshData(widget, widgetId);
        
        // Masquer l'overlay de chargement avec une animation
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
        
        // Arrêter l'animation du bouton
        if (refreshBtn) {
            refreshBtn.classList.remove('spinning');
            refreshBtn.disabled = false;
        }
    }, Math.random() * 1000 + 500); // Durée aléatoire entre 500ms et 1500ms
}

/**
 * Mettre à jour les données d'un widget selon son type
 */
function updateWidgetWithFreshData(widget, widgetId) {
    // Selon le type de widget, mettre à jour différemment
    if (widgetId.startsWith('stats-')) {
        // Mise à jour des widgets de statistiques
        const statType = widgetId.replace('stats-', '');
        const statValue = widget.querySelector('.stat-value');
        const statChange = widget.querySelector('.stat-change');
        
        // Générer de nouvelles valeurs aléatoires
        let newValue, newChange;
        
        switch (statType) {
            case 'users':
                newValue = Math.floor(Math.random() * 500) + 2500;
                newChange = (Math.random() * 10 - 2).toFixed(2);
                if (statValue) statValue.textContent = newValue.toLocaleString();
                break;
            case 'sales':
                newValue = Math.floor(Math.random() * 300) + 1100;
                newChange = (Math.random() * 20 - 5).toFixed(1);
                if (statValue) statValue.textContent = newValue.toLocaleString();
                break;
            case 'visits':
                newValue = Math.floor(Math.random() * 1000) + 9000;
                newChange = (Math.random() * 15 - 3).toFixed(1);
                if (statValue) statValue.textContent = newValue.toLocaleString();
                break;
            case 'revenue':
                newValue = Math.floor(Math.random() * 10000) + 70000;
                newChange = (Math.random() * 25 - 5).toFixed(1);
                if (statValue) statValue.textContent = newValue.toLocaleString() + '€';
                break;
        }
        
        // Mettre à jour le pourcentage de changement
        if (statChange && newChange) {
            const isPositive = parseFloat(newChange) >= 0;
            statChange.textContent = (isPositive ? '+' : '') + newChange + '%';
            statChange.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
        }
        
        // Mettre à jour le résumé si en mode compact
        if (widget.classList.contains('compact')) {
            generateCompactSummary(widget);
        }
    }
    else if (widgetId === 'sales-chart') {
        // Mise à jour du graphique si l'API Chart.js est disponible
        if (window.Chart && window.chartInstances) {
            const chartInstance = window.chartInstances['sales-chart'];
            if (chartInstance) {
                // Générer de nouvelles données aléatoires
                const newData = chartInstance.data.datasets[0].data.map(() => 
                    Math.floor(Math.random() * 10000) + 10000
                );
                
                // Mettre à jour le graphique
                chartInstance.data.datasets[0].data = newData;
                chartInstance.update();
                
                // Mettre à jour le résumé si en mode compact
                if (widget.classList.contains('compact')) {
                    const growth = Math.floor(Math.random() * 20) - 5;
                    const lastValue = newData[newData.length - 1].toLocaleString() + '€';
                    
                    const summaryEl = widget.querySelector('.compact-summary');
                    if (summaryEl) {
                        summaryEl.querySelector('.summary-value').innerHTML = 
                            `Croissance <strong>${growth > 0 ? '+' : ''}${growth}%</strong> | Total: <strong>${lastValue}</strong>`;
                    }
                }
            }
        }
    }
    else if (widgetId === 'recent-orders') {
        // Mise à jour des données du tableau de commandes
        const tableBody = widget.querySelector('.orders-table tbody');
        if (tableBody) {
            // Mettre à jour les dates et statuts
            const rows = tableBody.querySelectorAll('tr');
            const statuses = ['completed', 'in-progress', 'pending', 'cancelled'];
            const statusLabels = ['Livré', 'En cours', 'En attente', 'Annulé'];
            
            rows.forEach((row, index) => {
                // Mettre à jour la date (aujourd'hui - index jours)
                const dateCell = row.querySelector('td:nth-child(3)');
                const today = new Date();
                const date = new Date(today);
                date.setDate(date.getDate() - index);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                
                if (dateCell) dateCell.textContent = formattedDate;
                
                // Mettre à jour le statut aléatoirement
                const statusIndex = Math.floor(Math.random() * statuses.length);
                const statusCell = row.querySelector('td:nth-child(5) .status-badge');
                
                if (statusCell) {
                    statusCell.className = `status-badge ${statuses[statusIndex]}`;
                    statusCell.textContent = statusLabels[statusIndex];
                }
            });
            
            // Mettre à jour le résumé si en mode compact
            if (widget.classList.contains('compact')) {
                generateCompactSummary(widget);
            }
        }
    }
}

/**
 * Ajouter une fonction pour optimiser le layout après les changements de mode
 * Add a function to optimize layout after mode changes
 */
function optimizeWidgetLayout() {
    // Délai court pour permettre au DOM de se mettre à jour
    setTimeout(() => {
        // Forcer un recalcul de la disposition de la grille
        const grid = document.getElementById('widgets-grid');
        if (grid) {
            // Technique pour forcer un reflow sans animation visible
            const display = grid.style.display;
            grid.style.display = 'none';
            // Forcer le reflow
            void grid.offsetHeight;
            grid.style.display = display;
        }
        
        // Optimiser la hauteur des widgets compacts individuellement
        document.querySelectorAll('.widget.compact').forEach(widget => {
            // S'assurer qu'ils n'ont pas de hauteur minimale
            widget.style.minHeight = '0';
            // Ajuster la hauteur en fonction du contenu réel
            const header = widget.querySelector('.widget-header');
            const summary = widget.querySelector('.compact-summary');
            if (header && summary) {
                // Ajouter un peu de marge pour éviter les problèmes d'affichage
                const totalHeight = header.offsetHeight + summary.offsetHeight;
                widget.style.height = `${totalHeight}px`;
            }
        });
    }, 100);
}

// Appeler cette fonction après chaque basculement de widget
// Call this function after each widget toggle
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter l'appel à la fonction d'optimisation après chaque basculement
    document.querySelectorAll('.toggle-view').forEach(button => {
        button.addEventListener('click', function() {
            // Laisser le temps au widget de basculer
            setTimeout(optimizeWidgetLayout, 150);
        });
    });
    
    // Optimiser également au chargement initial
    optimizeWidgetLayout();
});

/**
 * Fonction pour égaliser la hauteur des widgets sur une même ligne
 */
function equalizeWidgetHeights() {
    // Obtenir tous les widgets non-compacts
    const nonCompactWidgets = Array.from(document.querySelectorAll('.widget:not(.compact)'));
    
    // Si peu de widgets, pas besoin d'égalisation
    if (nonCompactWidgets.length <= 1) return;
    
    // Réinitialiser les hauteurs
    nonCompactWidgets.forEach(widget => {
        widget.style.height = '';
    });
    
    // Structure pour stocker les widgets par ligne
    let widgetRows = [];
    const grid = document.getElementById('widgets-grid');
    const gridStyle = window.getComputedStyle(grid);
    const gridColumnCount = parseInt(gridStyle.gridTemplateColumns.split(' ').length);
    
    // Regrouper les widgets par ligne (approximation)
    for (let i = 0; i < nonCompactWidgets.length; i += gridColumnCount) {
        widgetRows.push(nonCompactWidgets.slice(i, i + gridColumnCount));
    }
    
    // Pour chaque ligne, égaliser les hauteurs
    widgetRows.forEach(row => {
        // Trouver la hauteur maximale dans cette ligne
        const maxHeight = Math.max(...row.map(widget => widget.scrollHeight));
        
        // Appliquer la hauteur maximale à tous les widgets de la ligne
        row.forEach(widget => {
            widget.style.height = maxHeight + 'px';
        });
    });
}

// Appeler la fonction lorsque la page est chargée, après un redimensionnement ou
// quand les widgets sont modifiés
document.addEventListener('DOMContentLoaded', function() {
    // Exécution initiale
    setTimeout(equalizeWidgetHeights, 500);
    
    // Lors du redimensionnement de la fenêtre
    window.addEventListener('resize', debounce(equalizeWidgetHeights, 250));
    
    // Lorsque les widgets changent de taille ou de mode
    const sizeButtons = document.querySelectorAll('.toggle-size');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(equalizeWidgetHeights, 300);
        });
    });
    
    const viewButtons = document.querySelectorAll('.toggle-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(equalizeWidgetHeights, 300);
        });
    });
    
    // Après un glisser-déposer
    document.addEventListener('widgetMoved', () => {
        setTimeout(equalizeWidgetHeights, 300);
    });
});

/**
 * Fonction debounce pour limiter les appels fréquents
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Exportation des fonctions pour une utilisation externe
window.WidgetManager = {
    toggleWidgetSize,
    toggleWidgetView,
    removeWidget,
    generateCompactSummary,
    saveWidgetState,
    restoreWidgetStates,
    refreshWidgetData
};
