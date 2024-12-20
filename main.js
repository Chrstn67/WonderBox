const { Plugin } = require("obsidian");

module.exports = class MyPlugin extends Plugin {
  async onload() {
    // Charger les styles CSS depuis un fichier local
    await this.loadStyles();

    // Inscription d'un processeur de post-traitement de markdown
    this.registerMarkdownPostProcessor((element) => {
      this.processNotes(element);
    });
  }

  // Fonction pour charger les styles CSS dynamiquement
  async loadStyles() {
    const stylePath = this.app.vault.adapter.getResourcePath(
      `${this.manifest.dir}/styles.css`
    ); // Obtenir un chemin valide
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;
    link.type = "text/css";
    document.head.appendChild(link);
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
      const regex = new RegExp(`:::${type}\\[([^\\]]+)\\]([\\s\\S]*?):::`, "g");

      Array.from(element.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          let updatedContent = child.textContent;

          // Appliquer le regex pour transformer les blocs Markdown
          const matches = [...updatedContent.matchAll(regex)];
          if (matches.length > 0) {
            matches.forEach((match) => {
              const [fullMatch, title, content] = match;

              // Créer un élément DOM pour la boîte
              const boxElement = this.createBoxElement(type, title, content);

              // Insérer la boîte avant l'enfant actuel
              element.insertBefore(boxElement, child);

              // Supprimer le texte correspondant au match
              updatedContent = updatedContent.replace(fullMatch, "");
            });

            // Mettre à jour le contenu du nœud texte après traitement
            child.textContent = updatedContent;
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
      if (line.trim()) {
        const lineElement = document.createElement("p");
        lineElement.textContent = line;
        contentDiv.appendChild(lineElement);
      }
    });

    section.appendChild(titleDiv);
    section.appendChild(contentDiv);

    return section;
  }
};
