/**
 * GESTIONNAIRE GLOBAL
 * Centralise l'accordéon, le chargement de modules et le ScrollSpy.
 */

let sectionsToWatch = [];

// 1. CHARGEMENT INITIAL DU MENU
fetch("./menu.html")
  .then(r => r.text())
  .then(html => {
    const sidebar = document.getElementById("sideBarMenu");
    if (sidebar) {
      sidebar.innerHTML = html;
      
      initSidebarLogic(); // Gère les clics (Accordéon + Modules)
      initMobileMenu();
      initLinkHighlight();
      
      setupScrollSpyListener(); // Écouteur de scroll unique
      refreshScrollSpySections(); // Scan initial des ancres

      initScrollToTop(); //bouton Top Retour 
    }
  })
  .catch(err => console.error("Erreur menu:", err));

/**
 * LOGIQUE SIDEBAR (Accordéon + Chargement)
 */
function initSidebarLogic() {
  const buttons = document.querySelectorAll(".accordionBtn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // ... (Logique de fermeture d'accordéon ici) ...

      // Basculer l'actuel
      const allContents = btn.closest('.menuGroup').querySelectorAll(".accordionContent");
      allContents.forEach(content => content.classList.toggle("open"));
      btn.classList.toggle("active");

      // Chargement du module
      const moduleName = btn.dataset.module;
      const moduleTitle = btn.querySelector('span').innerText; // Récupère le texte "HTML 5", "CSS 3", etc.

      if (moduleName) {   //Changer data-module="" dans la balise <button class="accordBtn" du fichier HTML à charger
        const fileMap = { 
          'PrepaNum' : './module_IntroMetiersDuNumerique.html',
          'introLang': './module_IntroductionLangages.html',
          'HTML': './module_HTML.html',
          'CSS': './module_CSS.html',
          'JS': './module_JS.html',
          'UX': './module_UX.html'
        };
        if (fileMap[moduleName]) chargerModule(fileMap[moduleName], moduleTitle);
      }
    });
  });
}

/**
 * CHARGEMENT DYNAMIQUE DU CONTENU AVEC FIL D'ARIANE
 */
function chargerModule(fichier, titreModule) {
  fetch(fichier)
    .then(r => r.text())
    .then(html => {
      const main = document.getElementById("mainWindow");
      if (main) {
        // Création du fil d'Ariane
        const breadcrumbHTML = `
          <nav class="breadcrumb" aria-label="Chemin de navigation">
            <span><a href="./index.html" style="text-decoration: none; color: inherit;">Accueil</a></span>
            <span class="current">${titreModule}</span>
          </nav>
        `;
        
        // On injecte le fil d'Ariane + le contenu HTML du module
        main.innerHTML = breadcrumbHTML + html;
        window.scrollTo(0, 0);
        
        setTimeout(refreshScrollSpySections, 100);
      }
    });
}
/**
 * SCROLL SPY (Surbrillance automatique au défilement)
 */
function setupScrollSpyListener() {
  window.addEventListener("scroll", () => {
    let activeSection = null;
    const scrollPos = window.scrollY + 150;

    sectionsToWatch.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        activeSection = section;
      }
    });

    const links = document.querySelectorAll("#sidebarNav a[href^='#']");
    links.forEach(l => l.classList.remove("scroll-active"));

    if (activeSection) {
      const targetLink = document.querySelector(`#sidebarNav a[href="#${activeSection.id}"]`);
      if (targetLink) targetLink.classList.add("scroll-active");
    }
  });
}

function refreshScrollSpySections() {
  const links = document.querySelectorAll("#sidebarNav a[href^='#']");
  sectionsToWatch = Array.from(links)
    .map(link => document.getElementById(link.getAttribute("href").substring(1)))
    .filter(Boolean);
}

/**
 * UTILITAIRES (Mobile & Clics manuels)
 */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sideBarMenu");
  if (toggle) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("active"));
  }
}

function initLinkHighlight() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("#sidebarNav a")) {
      document.querySelectorAll("#sidebarNav a").forEach(l => l.classList.remove("active"));
      e.target.classList.add("active");
      
      // Fermer le menu mobile sur clic
      document.getElementById("sideBarMenu").classList.remove("active");
    }
  });
}

/**
 * BOUTON RETOUR EN HAUT
 */
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  // Apparition du bouton après 300px de scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  // Action au clic
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
