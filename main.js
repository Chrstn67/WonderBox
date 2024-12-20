const { Plugin } = require("obsidian");

module.exports = class MyPlugin extends Plugin {
  async onload() {
    // Charger les styles CSS en ligne
    this.injectStyles();

    // Inscription d'un processeur de post-traitement de markdown
    this.registerMarkdownPostProcessor((element) => {
      this.processNotes(element);
    });
  }

  // Fonction pour injecter les styles CSS directement dans la page
  injectStyles() {
    const css = `
      .custom-box {
        border-radius: 5px;
        padding: 15px;
        margin: 15px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .custom-box.note {
        color: #000;
        background-color: #fff;
        border-left: 4px solid #d1d3c0;
        border-top: 4px solid #d1d3c0;
      }

      .custom-box.tip {
        color: #000;
        background-color: #e8f5e9;
        border-left: 4px solid #66bb6a;
        border-top: 4px solid #66bb6a;
      }

      .custom-box.info {
        color: #000;
        background-color: #e3f2fd;
        border-left: 4px solid #29b6f6;
        border-top: 4px solid #29b6f6;
      }

      .custom-box.warning {
        color: #000;
        background-color: #fff8e1;
        border-left: 4px solid #ffa726;
        border-top: 4px solid #ffa726;
      }

      .custom-box.danger {
        color: #000;
        background-color: #ffebee;
        border-left: 4px solid #ef5350;
        border-top: 4px solid #ef5350;
      }

      .custom-box.success {
        color: #000;
        background-color: #36ff00;
        border-left: 4px solid #28a745;
        border-top: 4px solid #28a745;
      }

      .custom-box.error {
        color: #fff;
        background-color: #911a24;
        border-left: 4px solid #e74c3c;
        border-top: 4px solid #e74c3c;
      }

      .custom-box.critical {
        color: #fff;
        background-color: #ff2300;
        border-left: 4px solid #7b0f1c;
        border-top: 4px solid #7b0f1c;
      }

      .custom-box.debug {
        color: #fff;
        background-color: #486bbb;
        border-left: 4px solid #b0bec5;
        border-top: 4px solid #b0bec5;
      }

      .custom-box.update {
        color: #000;
        background-color: #6eec66;
        border-left: 4px solid #5ebf58;
        border-top: 4px solid #5ebf58;
      }

      .custom-box.question {
        color: #000;
        background-color: #f3ff00;
        border-left: 4px solid #ffdc00;
        border-top: 4px solid #ffdc00;
      }

      .custom-box.announcement {
        color: #000;
        background-color: #ec00ff;
        border-left: 4px solid #ec407a;
        border-top: 4px solid #ec407a;
      }

      .custom-box.progress {
        color: #000;
        background-color: #ede7f6;
        border-left: 4px solid #7e57c2;
        border-top: 4px solid #7e57c2;
      }

      .custom-box.highlight {
        color: #000;
        background: linear-gradient(0deg, #f6ef5c 0%, #98ceff 100%);
        border-left: 4px solid #ff9800;
        border-top: 4px solid #ff9800;
      }

      .box-title {
        font-weight: bold;
        margin-bottom: 10px;
        position: relative;
        padding-bottom: 5px;
      }

      .box-title::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #676860, transparent);
      }

      .box-content {
        margin-top: -30px;
        line-height: 1.5;
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
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
