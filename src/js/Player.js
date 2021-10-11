// Importer jquery
import $ from "jquery";
// Importer son
import soundJail from "url:../sounds/jail.mp3";

class Player {
  constructor(number, inputLife, inputWeapon, inputDamages) {
    this.number = number;
    this.points = 100;
    this.position = null;
    this.currentWeapon = "";
    this.previousWeapon = "";
    this.moveLimit = 0;
    // Définir booléen pour joueur qui se défend
    this.defendedPlayer = null;
    // Définir booléen pour son jail
    this.musicOn = true;
    // Eléments du DOM
    this.inputLife = inputLife;
    this.inputWeapon = inputWeapon;
    this.inputDamages = inputDamages;
  }

  // Méthodes //

  // Ajouter audio pour son jail
  activeJailSound() {
    // Créer la variable
    const sound = new Audio();
    // Active le son
    if (this.musicOn == true) {
      sound.src = soundJail;
      sound.play();
      // Mettre en pause le son
    } else {
      sound.pause();
    }
  }

  // Bouger à droite
  moveRight(arrDiv) {
    // Ne pas aller + loin que cases de droite
    const positionString = this.position.toString();
    if (!positionString.endsWith("9")) {
      // Ne pas aller sur cases inaccessibles
      if (!$(arrDiv[this.position + 1]).hasClass("jail-box")) {
        // Changer CSS, incrémenter position + propriété de mouvement
        $(arrDiv[this.position])
          .removeClass("player-" + this.number)
          .addClass("box");
        this.position += 1;
        $(arrDiv[this.position])
          .removeClass("box")
          .addClass("player-" + this.number);
        this.moveLimit += 1;
      } else if ($(arrDiv[this.position + 1]).hasClass("jail-box")) {
        this.activeJailSound();
      }
    }
  }

  // Bouger à gauche
  moveLeft(arrDiv) {
    // Ne pas aller + loin que cases de gauche
    const positionString = this.position.toString();
    if (this.position >= 1) {
      if (!positionString.endsWith("0")) {
        if (!$(arrDiv[this.position - 1]).hasClass("jail-box")) {
          // Changer CSS, décrémenter position et ajouter propriété de mouvement
          $(arrDiv[this.position])
            .removeClass("player-" + this.number)
            .addClass("box");
          this.position -= 1;
          $(arrDiv[this.position])
            .removeClass("box")
            .addClass("player-" + this.number);
          this.moveLimit += 1;
        } else if ($(arrDiv[this.position - 1]).hasClass("jail-box")) {
          this.activeJailSound();
        }
      }
    }
  }

  // Bouger en haut
  moveUp(arrDiv) {
    if (this.position >= 10) {
      if (!$(arrDiv[this.position - 10]).hasClass("jail-box")) {
        $(arrDiv[this.position])
          .removeClass("player-" + this.number)
          .addClass("box");
        this.position -= 10;
        $(arrDiv[this.position])
          .removeClass("box")
          .addClass("player-" + this.number);
        this.moveLimit += 1;
      } else if ($(arrDiv[this.position - 10]).hasClass("jail-box")) {
        this.activeJailSound();
      }
    }
  }

  // Bouger en bas
  moveDown(arrDiv) {
    if (this.position < 90) {
      if (!$(arrDiv[this.position + 10]).hasClass("jail-box")) {
        $(arrDiv[this.position])
          .removeClass("player-" + this.number)
          .addClass("box");
        this.position += 10;
        $(arrDiv[this.position])
          .removeClass("box")
          .addClass("player-" + this.number);
        this.moveLimit += 1;
      } else if ($(arrDiv[this.position + 10]).hasClass("jail-box")) {
        this.activeJailSound();
      }
    }
  }
}

export default Player;
