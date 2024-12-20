const { Plugin } = require("obsidian");

module.exports = class MyPlugin extends Plugin {
  async onload() {
    // Inscription d'un processeur de post-traitement de markdown
    this.registerMarkdownPostProcessor((element, context) => {
      this.processNotes(element);
    });

    // Charger les styles CSS depuis styles.css
    this.registerDomEvent(document, "DOMContentLoaded", () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this.getAssetPath("styles.css");
      document.head.appendChild(link);
    });
  }

  // Fonction pour détecter et transformer les blocs de type ":::type[Titre]" dans le markdown
  processNotes(element) {
    if (!element) return;

    const types = [
      "note",
      "tip",
      "info",
      "warning",
      "danger",
      "success",
      "error",
      "critical",
      "debug",
      "update",
      "question",
      "announcement",
      "progress",
      "highlight",
    ];

    types.forEach((type) => {
      // Parcourir les enfants de l'élément pour trouver les blocs correspondants
      const regex = new RegExp(`:::${type}\\[([^\\]]+)\\]([\\s\\S]*?):::`, "g");

      Array.from(element.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const matches = [...child.textContent.matchAll(regex)];
          if (matches.length > 0) {
            const fragment = document.createDocumentFragment();

            matches.forEach((match) => {
              const [fullMatch, title, content] = match;

              // Créer un élément DOM pour la boîte
              const boxElement = this.createBoxElement(type, title, content);

              // Ajouter la boîte au fragment
              fragment.appendChild(boxElement);

              // Supprimer le texte correspondant au match
              child.textContent = child.textContent.replace(fullMatch, "");
            });

            // Insérer les nouvelles boîtes avant le nœud textuel actuel
            element.insertBefore(fragment, child);
          }
        }
      });
    });
  }

  // Fonction pour créer dynamiquement un élément DOM pour la boîte stylisée
  createBoxElement(type, title, content) {
    const section = document.createElement("section");
    section.classList.add("custom-box", type);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("box-title");
    titleDiv.textContent = title;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("box-content");
    content.split("\n").forEach((line) => {
      const lineElement = document.createElement("p");
      lineElement.textContent = line;
      contentDiv.appendChild(lineElement);
    });

    section.appendChild(titleDiv);
    section.appendChild(contentDiv);

    return section;
  }
};
