// Importer fichiers à prendre en compte
import "./main.scss";
import $ from "jquery";

import Game from "./js/Game";

// Import pour media queries
import Bowser from "bowser";

// Créer variable pour savoir la device utilisée
const browser = Bowser.parse(window.navigator.userAgent);

// Attendre que le DOM soit chargé pour afficher site
window.addEventListener("load", () => {
  // Détecter la plateforme pour afficher qu'en version desktop
  if (browser.platform.type == "desktop") {
    // Instaurer un delai d'affichage
    setTimeout(() => {
      $(".desktop").css("display", "block");
      // Instancier la class qui permet de commencer la partie
      new Game();
      // Afficher le site après le delai
      $(".loader").hide();
    }, 1500);
  } else {
    // Instaurer un delai d'affichage
    setTimeout(() => {
      // Afficher la page pour mobile/tablette (conseil redirection vers desktop)
      $(".mobileTablet").css("display", "block");
      // Cacher le spinner de chargement après le delai
      $(".loader").hide();
    }, 500);
  }
});
