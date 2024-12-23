const { Plugin } = require("obsidian");

module.exports = class MyPlugin extends Plugin {
  async onload() {
    // Inscription d'un processeur de post-traitement de markdown
    this.registerMarkdownPostProcessor((element, context) => {
      this.processNotes(element);
    });
  }

  // Fonction pour détecter et transformer les blocs de type ":::type[Titre]" dans le markdown
  processNotes(element) {
    if (!element || !element.innerHTML) return;

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
      // Recherche des blocs personnalisés :::type[Titre]
      const regex = new RegExp(`:::${type}\\[([^\\]]+)\\]([\\s\\S]*?):::`, "g");
      element.innerHTML = element.innerHTML.replace(
        regex,
        (match, title, content) => {
          return this.createBox(type, title, content);
        }
      );
    });
  }

  // Fonction pour générer le HTML des boîtes stylisées
  createBox(type, title, content) {
    // Remplacer les sauts de ligne par des balises <br> pour préserver le formatage
    const formattedContent = content.trim().replace(/\n/g, "<br>");
    return `
      <section class="custom-box ${type}">
        <div class="box-header">
          <div class="box-title">${title}</div>
          <div class="box-actions">
            <!-- Icône de copie -->
            <div class="icon copy-icon" onclick="navigator.clipboard.writeText('${formattedContent.replace(
              /'/g,
              "\\'"
            )}')" title="Copy content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-copy">
                <rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </div>
            <!-- Icône de suppression -->
            <div class="icon remove-icon" onclick="this.closest('.custom-box').remove()" title="Remove box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-trash">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-2 14H7L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="box-content">${formattedContent}</div>
      </section>
    `;
  }
};

// CSS à ajouter pour styliser les boîtes et leurs icônes
const customBoxCSS = `
  .custom-box {
    border-radius: 5px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
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

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .box-title {
    font-weight: bold;
    position: relative;
    padding-bottom: 5px;
  }

  .box-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #676860, transparent);
  }

  .box-actions {
    display: flex;
    gap: 10px;
  }

  .icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
    color : #000
  }

  .icon:hover {
    opacity: 0.5;
  }

  .box-content {
  margin-top: -30px;
    line-height: 1.5;
  }
`;

// Insérer le style dans le document
document.head.insertAdjacentHTML("beforeend", `<style>${customBoxCSS}</style>`);
