// Windows 95 Portfolio - JavaScript

// Variables globales
let zIndexCounter = 100;
let activeWindows = new Set();

// Positions initiales des fenêtres
const windowPositions = {
    about: { x: 100, y: 50 },
    projects: { x: 150, y: 80 },
    gallery: { x: 170, y: 100 },
    skills: { x: 200, y: 110 },
    experience: { x: 120, y: 140 },
    contact: { x: 180, y: 60 }
};

// --- INITIALISATION GLOBALE ---
document.addEventListener('DOMContentLoaded', function () {
    // Horloge
    updateClock();
    setInterval(updateClock, 1000);

    // Rendre les fenêtres déplaçables
    makeWindowsDraggable();

    // Fermer le menu démarrer si on clique ailleurs
    document.addEventListener('click', function (e) {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.querySelector('.start-button');

        if (
            startMenu &&
            !startMenu.contains(e.target) &&
            (!startButton || !startButton.contains(e.target))
        ) {
            startMenu.classList.remove('active');
        }
    });

    // Afficher la fenêtre "À propos" au démarrage
    setTimeout(() => {
        openWindow('about');
    }, 500);

    // Initialiser l'âge
    initAgeDisplay();

    // Initialiser l'easter egg sur le bureau
    initDesktopEasterEgg();
});

// --- HORLOGE ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clock = document.getElementById('clock');
    if (clock) {
        clock.textContent = `${hours}:${minutes}`;
    }
}

// --- GESTION DES FENÊTRES ---
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    // Si la fenêtre est déjà ouverte, la mettre au premier plan
    if (win.style.display !== 'none' && win.style.display !== '') {
        bringToFront(win);
        return;
    }

    // Afficher la fenêtre
    win.style.display = 'block';

    // Positionner la fenêtre
    const pos = windowPositions[windowId] || { x: 100, y: 100 };
    win.style.left = pos.x + 'px';
    win.style.top = pos.y + 'px';

    // Mettre au premier plan
    bringToFront(win);

    // Ajouter à la barre des tâches
    addToTaskbar(windowId);

    // Ajouter aux fenêtres actives
    activeWindows.add(windowId);

    // Fermer le menu démarrer
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
        startMenu.classList.remove('active');
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = 'none';
    removeFromTaskbar(windowId);
    activeWindows.delete(windowId);
}

function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = 'none';
    const taskbarButton = document.querySelector(
        `.taskbar-button[data-window="${windowId}"]`
    );
    if (taskbarButton) {
        taskbarButton.classList.remove('active');
    }
}

function bringToFront(win) {
    // Retirer la classe active de toutes les fenêtres
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });

    // Retirer la classe active de tous les boutons de la barre des tâches
    document.querySelectorAll('.taskbar-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ajouter la classe active à la fenêtre
    win.classList.add('active');
    win.style.zIndex = ++zIndexCounter;

    // Activer le bouton correspondant dans la barre des tâches
    const windowId = win.id;
    const button = document.querySelector(
        `.taskbar-button[data-window="${windowId}"]`
    );
    if (button) {
        button.classList.add('active');
    }
}

// --- BARRE DES TÂCHES ---
function addToTaskbar(windowId) {
    // Vérifier si le bouton existe déjà
    if (document.querySelector(`.taskbar-button[data-window="${windowId}"]`)) {
        return;
    }

    const win = document.getElementById(windowId);
    if (!win) return;

    const titleElement = win.querySelector('.title-bar-text');
    const title = titleElement ? titleElement.textContent : windowId;

    const button = document.createElement('button');
    button.className = 'taskbar-button active';
    button.setAttribute('data-window', windowId);
    button.textContent = title;
    button.onclick = function () {
        toggleWindowFromTaskbar(windowId);
    };

    const taskbarWindows = document.getElementById('taskbar-windows');
    if (taskbarWindows) {
        taskbarWindows.appendChild(button);
    }
}

function removeFromTaskbar(windowId) {
    const button = document.querySelector(
        `.taskbar-button[data-window="${windowId}"]`
    );
    if (button) {
        button.remove();
    }
}

function toggleWindowFromTaskbar(windowId) {
    const win = document.getElementById(windowId);
    const button = document.querySelector(
        `.taskbar-button[data-window="${windowId}"]`
    );
    if (!win || !button) return;

    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'block';
        bringToFront(win);
        button.classList.add('active');
    } else if (win.classList.contains('active')) {
        minimizeWindow(windowId);
    } else {
        bringToFront(win);
    }
}

// --- DRAG & DROP DES FENÊTRES ---
function makeWindowsDraggable() {
    const windows = document.querySelectorAll('.window');

    windows.forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        if (!titleBar) return;

        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        let xOffset = parseInt(win.style.left || 0, 10);
        let yOffset = parseInt(win.style.top || 0, 10);

        function dragStart(e) {
            // Mettre la fenêtre au premier plan
            bringToFront(win);

            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === titleBar || titleBar.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, win);
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.left = xPos + 'px';
            el.style.top = yPos + 'px';
        }

        // Souris
        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Tactile
        titleBar.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);
    });
}

// --- MENU DÉMARRER ---
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
        startMenu.classList.toggle('active');
    }
}

// --- ONGLET DANS LES FENÊTRES ---
function switchTab(event, tabId) {
    const windowBody = event.target.closest('.window-body');
    if (!windowBody) return;

    // Désactiver tous les onglets et contenus
    windowBody.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    windowBody.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activer l'onglet et le contenu sélectionnés
    event.target.classList.add('active');
    const content = document.getElementById(tabId);
    if (content) {
        content.classList.add('active');
    }
}

// --- CALCUL ET AFFICHAGE DE L'ÂGE ---
function calculerAge(dateNaissance) {
    const aujourdHui = new Date();
    const naissance = new Date(dateNaissance);
    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const moisDiff = aujourdHui.getMonth() - naissance.getMonth();

    if (
        moisDiff < 0 ||
        (moisDiff === 0 && aujourdHui.getDate() < naissance.getDate())
    ) {
        age--;
    }

    return age;
}

function initAgeDisplay() {
    const ageElement = document.getElementById('age');
    if (ageElement) {
        ageElement.textContent = calculerAge('1984-06-20');
    }
}

// --- EASTER EGG DOUBLE-CLIC SUR LE BUREAU ---
function initDesktopEasterEgg() {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    let clickCount = 0;
    let clickTimer = null;

    desktop.addEventListener('click', function (e) {
        // On déclenche uniquement si on clique "sur le bureau"
        if (e.target !== desktop) return;

        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;

            const currentYear = new Date().getFullYear(); // ➜ année automatique

            alert(
                'Bienvenue dans le portfolio de Jonathan Lacoste !\n\n' +
                'Version Windows 95 - ' + currentYear + '\n\n🎮 Rétro-style! 💻'
            );
        }
    });
}
// --- LIGHTBOX POUR LA GALERIE ---
function openLightbox(imageSrc, title, description) {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    // Créer une fenêtre Windows 95 pour l'image
    const windowEl = document.createElement('div');
    windowEl.style.cssText = `
        background: var(--win95-gray);
        border: 2px solid;
        border-color: var(--win95-highlight) var(--win95-shadow) var(--win95-shadow) var(--win95-highlight);
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
        max-width: 90vw;
        max-height: 90vh;
        cursor: default;
    `;
    
    // Barre de titre
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        background: linear-gradient(to right, var(--win95-blue), var(--win95-light-blue));
        color: white;
        padding: 2px 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 11px;
        height: 18px;
    `;
    titleBar.innerHTML = `
        <span>${title}</span>
        <button style="
            width: 16px;
            height: 14px;
            background: var(--win95-gray);
            border: 1px solid;
            border-color: var(--win95-highlight) var(--win95-shadow) var(--win95-shadow) var(--win95-highlight);
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            line-height: 1;
            padding: 0;
        " onclick="document.getElementById('lightbox-overlay').remove()">×</button>
    `;
    
    // Corps avec l'image
    const bodyEl = document.createElement('div');
    bodyEl.style.cssText = `
        padding: 8px;
        background: var(--win95-gray);
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    // L'image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 80vw;
        max-height: 70vh;
        border: 2px solid;
        border-color: var(--win95-shadow) var(--win95-highlight) var(--win95-highlight) var(--win95-shadow);
    `;
    
    // Description
    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = `
        margin-top: 10px;
        text-align: center;
        color: var(--win95-black);
        font-size: 11px;
    `;
    
    bodyEl.appendChild(img);
    bodyEl.appendChild(descEl);
    windowEl.appendChild(titleBar);
    windowEl.appendChild(bodyEl);
    overlay.appendChild(windowEl);
    document.body.appendChild(overlay);
    
    // Fermer au clic sur l'overlay (mais pas sur la fenêtre)
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
    
    // Empêcher la propagation du clic sur la fenêtre
    windowEl.onclick = (e) => {
        e.stopPropagation();
    };
}