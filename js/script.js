
fetch("./menu.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("sideBarMenu").innerHTML = html;

    initAccordion();
    initMobileMenu();
    initModuleLoader();
    initLinkHighlight();
    initScrollSpy();
  });


function initAccordion() {
  const buttons = document.querySelectorAll(".accordionBtn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;

      // Fermer les autres
      document.querySelectorAll(".accordionContent").forEach(c => {
        if (c !== content) c.classList.remove("open");
      });

      document.querySelectorAll(".accordionBtn").forEach(b => {
        if (b !== btn) b.classList.remove("active");
      });

      // Ouvrir celui-ci
      content.classList.toggle("open");
      btn.classList.toggle("active");
    });
  });
}


/*        MENU MOBILE        */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sideBarMenu");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}


/*   CHARGEMENT DES MODULES  */
function initModuleLoader() {
  document.querySelectorAll(".accordionBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const module = btn.dataset.module;

      if (module === "HTML") chargerModule("./module_HTML.html");
      if (module === "CSS") chargerModule("./module_CSS.html");
      if (module === "JS") chargerModule("./module_JS.html");
    });
  });
}

function chargerModule(fichier) {
  fetch(fichier)
    .then(r => r.text())
    .then(html => {
      document.getElementById("mainWindow").innerHTML = html;

      // Réactiver le scroll spy pour les ancres internes
      initScrollSpy();
    });
}
/*   SURBRILLANCE AU CLIC    */
function initLinkHighlight() {
  const links = document.querySelectorAll("#sidebarNav a");

  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

/*   SURBRILLANCE AU SCROLL  */
function initScrollSpy() {
  const links = document.querySelectorAll("#sidebarNav a[href^='#']");
  if (!links.length) return;

  const sections = Array.from(links)
    .map(link => {
      const id = link.getAttribute("href").substring(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    let activeSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeSection = section;
      }
    });

    links.forEach(link => link.classList.remove("scroll-active"));

    if (activeSection) {
      const activeLink = document.querySelector(
        `#sidebarNav a[href="#${activeSection.id}"]`
      );
      if (activeLink) activeLink.classList.add("scroll-active");
    }
  });
}

