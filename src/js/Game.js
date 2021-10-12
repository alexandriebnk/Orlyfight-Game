// Importer fichiers à prendre en compte
import $ from "jquery";

// Class
import Player from "./Player";
import Animation from "./Animation";
// Son en background
import rapSong from "url:../sounds/featuring.mp3";
// Sons armes
import newWeapon from "url:../sounds/new-weapon.mp3";
import fightBell from "url:../sounds/fight-bell.mp3";
import bottlePerfume from "url:../sounds/bottle-perfume.mp3";
import ak47 from "url:../sounds/ak47.mp3";
import bottleChampagne from "url:../sounds/bottle-champagne.mp3";
import highHeels from "url:../sounds/high-heels.mp3";
import endSound from "url:../sounds/end-sound.mp3";
// Images armes
import ak47Img from "url:../img/kalash.svg";
import champagneImg from "url:../img/champagne.svg";
import heelsImg from "url:../img/heels.svg";
import perfumeImg from "url:../img/perfume.svg";

// Créer les objets Armes
const kalash = {
  name: "kalash",
  damages: 10,
};

const heels = {
  name: "heels",
  damages: 20,
};

const perfume = {
  name: "perfume",
  damages: 30,
};

const champagne = {
  name: "champagne",
  damages: 40,
};

// En faire un tableau
const allWeapons = [kalash, heels, perfume, champagne];

class Game {
  constructor() {
    // Eléments du DOM
    this.grid = $(".grid");
    this.opening = $(".opening");
    this.advisory = $(".advisory");
    this.instructionsBtn = $(".top__left-instructions");
    this.soundBtn = $(".sound__player");
    this.popIn = $(".layer-howtodo");
    this.closePopinBtn = $(".close");
    this.playGame = $(".game");
    this.container = $(".game__board");
    this.boobaName = $(".booba__name");
    this.kaarisName = $(".kaaris__name");
    this.fightMoment = $(".layer-fight");
    this.boobaLayer = $(".booba-layer");
    this.kaarisLayer = $(".kaaris-layer");
    this.winnerTitleTop = $(".winner__title-top");
    this.winnerTitleBottom = $(".winner__title-bottom");
    // Eléments du DOM pour événements
    this.startBtn = $(".button__start");
    this.restartBtn = $(".button__restart");
    // Datas
    this.box = 100;
    this.arrayDiv = [];
    this.weapons = allWeapons;
    this.arrayPositionWeapons = [];
    this.arrayEachWeapon = [];
    // Instanciation des 2 joueurs
    this.playerOne = new Player(
      1,
      $(".game__booba-life-result-1"),
      $(".game__booba-weapon-result-1"),
      $(".game__booba-damages-result-1")
    );
    this.playerTwo = new Player(
      2,
      $(".game__kaaris-life-result-2"),
      $(".game__kaaris-weapon-result-2"),
      $(".game__kaaris-damages-result-2")
    );
    // Booléen
    this.activePlayer = null;
    this.musicOn = false;
    this.markerPauseMusic = true;
    this.previousPositionPlayer = null;
    this.currentPositionPlayer = null;
    // Création d'un fichier audio
    this.song = new Audio();
    // Instancier la class ANIMATION
    this.animation = new Animation();
    // Assigner le 'this' pour méthodes qui ne le reconnaissent pas
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.keyEvent = this.keyEvent.bind(this);
    this.controlSounds = this.controlSounds.bind(this);
    this.stopKeyEvent = this.stopKeyEvent.bind(this);
    this.startKeyEvent = this.startKeyEvent.bind(this);

    // Evenements //

    // Evenement au clic sur btn son
    this.soundBtn.on("click", this.controlSounds);

    // Evenement au clic sur le bouton play
    this.startBtn.on("click", this.startGame);

    // Evenement au clic sur le bouton Instructions
    this.instructionsBtn.on("click", () => {
      this.animation.openPopIn();
    });

    // Evenement quand la souris survole le bouton close
    this.closePopinBtn.on("mouseover", () => {
      this.animation.animateCloseBtnOver();
    });

    // Evenement quand la souris ne survole plus le bouton blose
    this.closePopinBtn.on("mouseout", () => {
      this.animation.animateCloseBtnOut();
    });

    // Evenement au clic sur le bouton pour fermer la popIn
    this.closePopinBtn.on("click", () => {
      this.animation.closePopIn();
    });

    // Evenement au clic sur le bouton restart
    this.restartBtn.on("click", this.restartGame);
  }

  // Méthodes //

  // Initialiser le GAME
  initGame() {
    // Déclencher le détecteur des touches du clavier
    this.startKeyEvent();
    // Générer les éléments (jeu, cases, joueurs, armes)
    this.addGameBox();
    this.addPlayers();
    this.addWeapons();
    // Changer élements du DOM
    this.instructionsBtn.html("INSTRUCTIONS");
    this.instructionsBtn.css("cursor", "pointer");
    this.playGame.css("display", "flex");
    this.container.css("display", "flex");
    this.boobaName.css("display", "block");
    this.kaarisName.css("display", "block");
    // Mettre icône gestion son + enlever paragraphe
    this.soundBtn.css("display", "block");
    // Désigner un joueur (booba) pour commencer
    this.activePlayer = this.playerOne;
    // Animer sa tête dans le jeu
    this.animation.shakeHead(this.playerOne, this.playerTwo, this.activePlayer);
  }

  // Commencer le jeu
  startGame() {
    this.initGame();
    // Déclencher le son
    this.musicOn == false;
    this.controlSounds();
    $(".sound__paragraph").css("display", "none");
    // Faire disparaitre / apparaitre élements du DOM
    this.grid.css("display", "none");
    this.opening.css("display", "none");
    this.startBtn.css("display", "none");
    this.advisory.css("display", "none");
    // Changer élément du DOM qui vient de ANIMATION
    this.animation.stopBlinker();
  }

  // Restart game
  restartGame() {
    this.initGame();
    // Faire disparaitre bouton pour rejouer
    this.restartBtn.css("display", "none");
    // Changer élément du DOM qui viennent de ANIMATION
    this.animation.layerWinner.css("display", "none");
    this.animation.boobaFade.css("opacity", "0");
    this.animation.kaarisFade.css("opacity", "0");
    this.animation.winnerTopTitle.css("opacity", "0");
    this.animation.winnerBottomTitle.css("opacity", "0");
    // Mettre la couleur sur le nom du premier joueur (booba)
    this.resetColorName();
    // Controler le son
    // Si user a fait pause
    if (this.markerPauseMusic) {
      // Je mets true pour que méthode ControlSounds le prenne en compte
      // et reste sur pause au restart
      this.musicOn = true;
    }
    this.controlSounds();
  }

  // Activation clavier
  startKeyEvent() {
    $(document).on("keydown", this.keyEvent);
  }

  // Désactivation clavier
  stopKeyEvent() {
    $(document).off("keydown", this.keyEvent);
  }

  // Controler les sons
  controlSounds() {
    // Si la musique n'est pas lancée
    if (this.musicOn == false) {
      // Et si elle n'a pas de son attribué
      if (this.song.src != rapSong) {
        // Sinon je lui attribue un son
        this.song.src = rapSong;
      }
      // Je lance la musique
      this.playMusic();
      // Je lance l'animation sur l'image SVG du son
      this.animation.animateSvgSound();
      // Je mets un repère si restart
      this.markerPauseMusic = false;
    } else {
      // Je mets pause sur la musique
      this.pauseMusic();
      // Je stoppe l'animation sur l'image SVG du son
      this.animation.stopSvgSound();
      this.markerPauseMusic = true;
    }
  }

  // Mettre play sur la musique
  playMusic() {
    // Je la fais tourner à l'infini
    this.song.loop = true;
    // Attribuer un volume défini
    this.song.volume = 0.2;
    // Je lance le son
    this.song.play();
    // Changer booleen pour qu'au clic il y ai une réaction différente
    this.musicOn = true;
  }

  // Mettre pause sur la musique
  pauseMusic() {
    this.song.pause();
    // Changer booleen pour qu'au clic il y ai une réaction différente
    this.musicOn = false;
  }

  // Activer le son pour le changement d'arme
  activateNewWeaponSound() {
    const sound = new Audio();
    if (this.musicOn == true) {
      sound.src = newWeapon;
      sound.play();
    } else {
      sound.pause();
    }
  }

  // Activer le son pour le fight
  activateFightSound() {
    const sound = new Audio();
    if (this.musicOn == true) {
      sound.src = fightBell;
      sound.play();
    } else {
      sound.pause();
    }
  }

  // Activer le son de l'arme utilisée
  activateAttackWeaponSound() {
    const sound = new Audio();
    // Si le son est en ON côté user
    if (this.musicOn == true) {
      this.selectWeaponSound(sound);
      sound.play();
    } else {
      sound.pause();
    }
  }

  // Sélectionner le bon son pour chaque arme utilisée
  selectWeaponSound(sound) {
    if (this.activePlayer.currentWeapon.name == "perfume") {
      sound.src = bottlePerfume;
    } else if (this.activePlayer.currentWeapon.name == "champagne") {
      sound.src = bottleChampagne;
    } else if (this.activePlayer.currentWeapon.name == "kalash") {
      sound.src = ak47;
    } else if (this.activePlayer.currentWeapon.name == "heels") {
      sound.src = highHeels;
    }
  }

  // Ajouter son de fin
  activateEndSound() {
    const sound = new Audio();
    if (this.musicOn == true) {
      sound.src = endSound;
      sound.play();
    } else {
      sound.pause();
    }
  }

  // Math.random pour générer cases inaccessibles
  mathRandomBox() {
    return Math.ceil((Math.random() + 1) * 6);
  }

  // Math.random pour placements personnages et armes
  mathRandomGame() {
    return Math.ceil((Math.random() + 1) * 24);
  }

  // Math.random pour générer type d'arme
  mathRandomWeapon() {
    return Math.ceil(Math.random() * 4);
  }

  // Ajouter le plateau de jeu fait de boxes
  addGameBox() {
    // Reset les enfants du container
    this.container.empty();
    // Générer toutes les cases du jeu
    // En bouclant sur toutes les cases
    for (let i = 0; i < this.box; i++) {
      // Créer des div qui ont une classe 'box'
      const empty = document.createElement("div");
      $(empty).addClass("box");
      // Remplir le container
      this.container.append(empty);
      // Les mettre dans un tableau
      this.arrayDiv.push(empty);
    }
    // Générer des cases inaccessibles
    const generate = this.mathRandomBox();
    for (let i = 0; i < generate; i++) {
      // Remplacer le CSS des cases
      $(this.arrayDiv[Math.ceil(Math.random() * 99)])
        .removeClass("box")
        .addClass("jail-box");
    }
  }

  // Créer les joueurs avec leurs informations
  generatePlayer(player) {
    $(this.arrayDiv[player.position]).removeClass("box jail-box");
    $(this.arrayDiv[player.position]).addClass("player-" + player.number);
    player.points = 100;
    player.inputLife.text("100");
    // Leur assigner une arme + infos de l'arme
    const infoWeaponOne = this.mathRandomWeapon() - 1;
    // Créer variable pour arme
    let weaponSource = null;
    // Créer switch pour attribuer l'arme à chaque joueur
    switch (this.weapons[infoWeaponOne].name) {
      case "kalash":
        weaponSource = ak47Img;
        break;
      case "heels":
        weaponSource = heelsImg;
        break;
      case "champagne":
        weaponSource = champagneImg;
        break;
      case "perfume":
        weaponSource = perfumeImg;
        break;
      default:
        break;
    }
    // Attribuer infos
    player.inputWeapon.attr("src", weaponSource);
    player.inputDamages.text(this.weapons[infoWeaponOne].damages);
    player.currentWeapon = this.weapons[infoWeaponOne];
  }

  // Générer les joueurs dans le jeu
  addPlayers() {
    this.playerOne.position = Math.ceil(this.mathRandomGame() / 2);
    this.generatePlayer(this.playerOne);

    this.playerTwo.position = Math.ceil(this.mathRandomGame() * 2);
    this.generatePlayer(this.playerTwo);
  }

  // Générer armes dans le jeu (entre 1 et 4)
  addWeapons() {
    const generateWeapon = this.mathRandomWeapon();
    // Boucler pour attribuer une place à chaque arme générée
    for (let i = 0; i < generateWeapon; i++) {
      const positionWeapons = this.mathRandomGame() * 2;
      // Ne pas placer d'arme sur un joueur
      if (
        positionWeapons == this.playerOne.position ||
        positionWeapons == this.playerOne.position
      ) {
        positionWeapons = this.mathRandomGame() * 2;
      } else {
        // Placer les armes + changer CSS sur cases
        const weapon = $(this.arrayDiv[positionWeapons]);
        if (weapon.hasClass("box") || weapon.hasClass("jail-box")) {
          let eachWeapon = this.weapons[this.mathRandomWeapon() - 1];
          weapon.removeClass("box jail-box").addClass(eachWeapon.name);
          // Stocker position et type d'arme dans 2 tableaux
          this.arrayPositionWeapons.push(positionWeapons);
          this.arrayEachWeapon.push(eachWeapon);
        }
      }
    }
  }

  // Jouer / déplacer les joueurs
  keyEvent(e) {
    // Le joueur ne peut avancer que de 3 cases
    if (this.activePlayer.moveLimit < 3) {
      // Conditions de déplacement
      switch (e.keyCode) {
        // Faire bouger le joueur
        case 39:
          this.activePlayer.moveRight(this.arrayDiv);
          break;
        case 37:
          this.activePlayer.moveLeft(this.arrayDiv);
          break;
        case 38:
          this.activePlayer.moveUp(this.arrayDiv);
          // Eviter le scrolling dans la page
          e.preventDefault();
          break;
        case 40:
          this.activePlayer.moveDown(this.arrayDiv);
          e.preventDefault();
          break;
      }
      // Effectuer les changements nécessaires
      this.update(e.keyCode);
    }
    // Activer les attaques sur la touche A du clavier
    if (this.playerOne.moveLimit === 3 && this.playerTwo.moveLimit === 3) {
      if (e.keyCode == 65) {
        if (this.activePlayer == this.playerOne) {
          this.startFight(this.playerOne, this.playerTwo);
        } else {
          this.startFight(this.playerTwo, this.playerOne);
        }
      }
      // Activer la défense du la touche D du clavier
      if (e.keyCode == 68) {
        if (this.activePlayer == this.playerOne) {
          this.defense(
            this.playerOne,
            this.playerTwo,
            this.boobaName,
            this.kaarisName
          );
        } else {
          this.defense(
            this.playerTwo,
            this.playerOne,
            this.kaarisName,
            this.boobaName
          );
        }
      }
    }
  }

  // Actualisation d'arme et de joueur
  update(keyCode) {
    // Si le user n'est pas déjà sur la case d'arme
    if (this.activePlayer.position !== this.previousPositionPlayer) {
      // Changer d'arme
      this.updateWeapon(keyCode);
    }
    // Changer de joueur
    if (this.activePlayer.moveLimit === 3) {
      this.switchPlayer();
    }
    // Faire commencer le bon joueur au moment du combat
    this.confrontation();
  }

  // Changement d'arme
  updateWeapon() {
    // Boucler sur toutes les armes affichées dans jeu
    for (let i = 0; i < this.arrayPositionWeapons.length; i++) {
      // Enregistrer la position du joueur avant qu'il ne se déplace
      this.previousPositionPlayer = this.activePlayer.position;
      if (this.activePlayer.position == this.arrayPositionWeapons[i]) {
        // Reprendre les infos de l'arme et laisser la sienne sur jeu
        this.activePlayer.previousWeapon = this.activePlayer.currentWeapon;
        this.activePlayer.inputWeapon.attr(
          "src",
          "img/" + this.arrayEachWeapon[i].name + ".svg"
        );
        this.activePlayer.inputDamages.text(this.arrayEachWeapon[i].damages);
        $(this.arrayDiv[this.arrayPositionWeapons[i]])
          .removeClass(this.arrayEachWeapon[i].name)
          .addClass("player-" + this.activePlayer.number);
        this.activePlayer.currentWeapon = this.arrayEachWeapon[i];
        // Mettre l'ancienne arme dans le tableau des armes dans le jeu
        this.arrayEachWeapon[i] = this.activePlayer.previousWeapon;
        // Activer le son pour le changement d'arme
        this.activateNewWeaponSound();
      }
      if (
        this.arrayDiv[this.arrayPositionWeapons[i]].classList.contains("box")
      ) {
        $(this.arrayDiv[this.arrayPositionWeapons[i]])
          .removeClass("box")
          .addClass(this.arrayEachWeapon[i].name);
      }
    }
  }

  // Changer le style du nom du joueur
  changeStyleNamePlayer(player1, player2) {
    player2.css("color", "#A78650");
    player1.css("color", "transparent");
    player1.css("-webkit-text-stroke", ".1rem #A78650");
  }

  // Changer de joueur actif quand 3 cases avancées
  switchPlayer() {
    if (this.activePlayer == this.playerOne) {
      this.activePlayer = this.playerTwo;
      // Réinitialiser à 0 les déplacements pour qu'il puisse rejouer
      this.activePlayer.moveLimit = 0;
      // Changer le style du nom du joueur
      this.changeStyleNamePlayer(this.boobaName, this.kaarisName);
    } else {
      this.activePlayer = this.playerOne;
      this.activePlayer.moveLimit = 0;
      this.changeStyleNamePlayer(this.kaarisName, this.boobaName);
    }
    // Animer la tête du player actif
    this.animation.shakeHead(this.playerOne, this.playerTwo, this.activePlayer);
  }

  // Rencontre des 2 joueurs
  meeting(player1, player2) {
    // Calculer si les 2 sont côte à côte
    if (
      player1.position == player2.position + 1 ||
      player1.position == player2.position - 1 ||
      player1.position == player2.position + 10 ||
      player1.position == player2.position - 10
    ) {
      // Activer le son pour le fight
      this.activateFightSound();
      // Arrêt de l'animation sur les tetes des rappeurs
      this.animation.stopShakingHead();
      // Stopper l'événement sur les touches du clavier
      this.stopKeyEvent();
      // Faire apparaître les 2 rappeurs pendant 2secondes
      // -> Quand l'animation est terminée, appeler la callback
      // Pour relancer l'activation clavier
      this.animation.createTimelineFight(this.startKeyEvent);
      // Empecher les joueurs de bouger
      player1.moveLimit = 3;
      player2.moveLimit = 3;
    }
  }

  // Quand les joueurs sont prêts à combattre
  confrontation() {
    // Vérifier qui est celui qui donne le premier coup selon la rencontre
    if (this.activePlayer == this.playerOne) {
      this.meeting(this.playerOne, this.playerTwo);
    } else {
      this.meeting(this.playerTwo, this.playerOne);
    }
  }

  // Commencer le combat
  startFight(player1, player2) {
    this.activateAttackWeaponSound();
    // Assigner une bordure à celui qui joue
    if (this.activePlayer == this.playerOne) {
      this.changeStyleNamePlayer(this.boobaName, this.kaarisName);
    } else {
      this.changeStyleNamePlayer(this.kaarisName, this.boobaName);
    }
    // Vérifier si un joueur est en mode 'défense'
    if (player2.defendedPlayer == true) {
      // Diviser le nbr de pts qu'il perd par 2
      player2.points -= player1.currentWeapon.damages / 2;
      player2.inputLife.text(player2.points);
      // Reset le mode 'défense'
      player2.defendedPlayer = false;
    } else {
      // Si le joueur subit une attaque sans être en mode 'défense'
      player2.points -= player1.currentWeapon.damages;
      player2.inputLife.text(player2.points);
    }
    // Quand les pts arrivent à 0
    if (player2.points < 1) {
      player2.inputLife.text("0");
      // Arrêt du jeu
      this.stopGame(player2);
      // Ajouter son de fin
      this.activateEndSound();
      // Arreter musique
      this.pauseMusic();
    }
    // Après chaque attaque, le joueur change
    this.activePlayer = player2;
  }

  // Activer le mode DEFENSE d'un joueur
  defense(player1, player2, name1, name2) {
    // Attribuer un mode 'défense' au joueur qui appuie sur la touche D
    player1.defendedPlayer = true;
    // Changer de joueur sans changement de pts
    this.activePlayer = player2;
    name2.css("color", "#A78650");
    name1.css("color", "transparent");
    name1.css("-webkit-text-stroke", ".1rem #A78650");
  }

  // Changer les layers selon le winner
  changeLayerWinner(player1, player2) {
    player1.css("display", "none");
    player2.css("display", "block");
  }

  // Arret du jeu
  stopGame(player2) {
    // Reset l'événement sur les touches du clavier
    this.stopKeyEvent();
    // Changer le CSS
    this.animation.createTimelineWinner();
    if (player2 == this.playerOne) {
      this.changeLayerWinner(this.kaarisLayer, this.boobaLayer);
      this.winnerTitleTop.css({ right: "4%", left: "0" }).text("KAARIS");
      this.winnerTitleBottom.css({ left: "40%", right: "0" }).text("WINS");
    } else if (player2 == this.playerTwo) {
      this.changeLayerWinner(this.boobaLayer, this.kaarisLayer);
      this.winnerTitleTop.text("BOOBA");
      this.winnerTitleBottom.text("WINS");
    }
    // Remove les players en cours du jeu
    this.resetGame();
    // Faire apparaitre bouton pour rejouer
    this.restartBtn.css("display", "block");
  }

  // Reset le jeu
  resetGame() {
    // Créer array pour les 2 joueurs
    const arrayPlayers = [this.playerOne, this.playerTwo];
    // Boucler sur ce tableau pour reset toutes les données des 2 joueurs
    arrayPlayers.forEach((player) => {
      player.position = null;
      player.currentWeapon = "";
      player.previousWeapon = "";
      player.moveLimit = 0;
      player.points = 0;
    });
    this.arrayDiv = [];
    this.arrayEachWeapon = [];
    this.arrayPositionWeapons = [];
    this.activePlayer = null;
    this.previousPositionPlayer = null;
    this.currentPositionPlayer = null;
    // Reset animation sur l'image SVG du son
    this.animation.stopSvgSound();
  }

  // Reset la couleur des noms pour nouvelle partie
  resetColorName() {
    this.boobaName.css("color", "#A78650");
    this.kaarisName.css("color", "transparent");
    this.kaarisName.css("-webkit-text-stroke", ".1rem #A78650");
  }
}

export default Game;
