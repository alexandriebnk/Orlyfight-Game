// Importer GSAP et jquery
import gsap from "gsap";
import $ from "jquery";

class Animation {
  constructor() {
    // Eléments du DOM pour événements
    this.startBtn = $(".button__start");
    this.restartBtn = $(".button__restart");
    this.btnStartLabel = $(".button__start-label");
    this.btnRestartLabel = $(".button__restart-label");
    this.svgStartChildren = $(".button__start-svg").children();
    this.svgRestartChildren = $(".button__restart-svg").children();
    this.redBlinker = $(".top__left-redBlinker");
    this.layerPopIn = $(".layer-howtodo");
    this.popIn = $(".howtodo");
    this.closeBtn = $(".close");
    this.musicBarsSvg = $(".sound__player").children();
    this.boobaHead = $(".booba-head");
    this.kaarisHead = $(".kaaris-head");
    // Page d'accueil animation OPENING
    this.boobaFade = $(".faces__booba-layer");
    this.kaarisFade = $(".faces__kaaris-layer");
    this.openingOrlyTitle = $(".opening__title-orly");
    this.openingFightTitle = $(".opening__title-fight");
    this.cornerFade = $(".corner__fade");
    this.recording = $(".top__left");
    this.soundParagraph = $(".sound");
    this.advisory = $(".advisory");
    // Apparition FIGHT
    this.layerFight = $(".layer-fight");
    this.fightTopTitle = $(".fight__title-top");
    this.fightBottomTitle = $(".fight__title-bottom");
    // Apparition WINNER
    this.layerWinner = $(".layer-winner");
    this.boobaLayer = $(".booba-layer");
    this.kaarisLayer = $(".kaaris-layer");
    this.winnerTopTitle = $(".winner__title-top");
    this.winnerBottomTitle = $(".winner__title-bottom");
    // Element en attente d'instanciation
    this.blinker = null;
    this.boobaHeadMoving = null;
    this.kaarisHeadMoving = null;
    this.musicIconOn = null;
    this.musicIconOff = null;
    // Timeline en attente d'instantiation
    this.tlStart = null;
    this.tlRestart = null;
    this.tlPopIn = null;
    this.tlOpening = null;
    this.tlFight = null;
    this.tlWinner = null;
    // Assigner le 'this' pour méthodes qui ne le reconnaissent pas
    this.createTimelineStart = this.createTimelineStart.bind(this);
    this.createTimelineRestart = this.createTimelineRestart.bind(this);

    // Lancer les timelines en pause au début du jeu
    this.createTimelineStart();
    this.createTimelineRestart();
    this.createTimelineOpening();

    // Lancer le blinker de recording
    this.startBlinker();

    // Evenements sur boutons au passage de la souris //

    // Mettre en play l'animation au passage de la souris
    this.startBtn.on("mouseenter", () => this.tlStart.play());
    // Revenir à l'état d'origine de l'élément si on ne le survole plus
    this.startBtn.on("mouseleave", () => this.tlStart.reverse());

    this.restartBtn.on("mouseenter", () => this.tlRestart.play());
    this.restartBtn.on("mouseleave", () => this.tlRestart.reverse());
  }

  // Méthodes GSAP //

  // Animation sur bouton START
  createTimelineStart() {
    // Instancier l'élement du constructor à une timeline en pause
    this.tlStart = new gsap.timeline({ paused: true });
    // Ajouter item à la timeline pour gérer démarrage de chaque ligne
    this.tlStart
      .add("startTimeline")
      // Attribuer de nouvelles propriétés/valeurs à un élément du DOM
      .to(this.svgStartChildren[1], {
        duration: ".5",
        y: ".4rem",
        x: ".4rem",
        fill: "#A78650",
        stroke: "#A78650",
        ease: "power4.out",
      })
      .to(
        this.svgStartChildren[0],
        { duration: ".5", stroke: "#A78650", ease: "power4.out" },
        "startTimeline"
      )
      .to(
        this.btnStartLabel,
        { duration: ".5", y: ".4rem", x: ".4rem", ease: "power4.out" },
        "startTimeline"
      );
  }

  // Animation sur bouton RESTART
  createTimelineRestart() {
    this.tlRestart = new gsap.timeline({ paused: true });
    this.tlRestart
      .add("startTimeline")
      .to(this.svgRestartChildren[1], {
        duration: "1",
        y: ".4rem",
        x: ".4rem",
        fill: "#A78650",
        stroke: "#A78650",
        ease: "power4.out",
      })
      .to(
        this.svgRestartChildren[0],
        { duration: "1", stroke: "#A78650", ease: "power4.out" },
        "startTimeline"
      )
      .to(
        this.btnRestartLabel,
        { duration: "1", y: ".4rem", x: ".4rem", ease: "power4.out" },
        "startTimeline"
      );
  }

  // Animation sur bouton rouge recording
  startBlinker() {
    this.blinker = gsap.fromTo(
      this.redBlinker,
      { opacity: "0" },
      { opacity: "1", repeat: "-1", delay: "0.8" }
    );
  }

  // Stopper l'animation bouton rouge recording
  stopBlinker() {
    this.blinker.kill();
    gsap.set(this.redBlinker, { color: "red", opacity: "1" });
  }

  // Faire bouger la tête du player actif
  shakeHead(player1, player2, activePlayer) {
    // Si player1, donc Booba, est actif
    if (player1 == activePlayer) {
      // Stopper l'animation de la tête de Kaaris (si elle a déjà été lancée)
      if (this.kaarisHeadMoving) {
        this.kaarisHeadMoving.kill();
      }
      // Lancer l'animation sur la tête de Booba
      this.boobaHeadMoving = gsap.fromTo(
        this.boobaHead,
        { rotationZ: "-11deg" },
        {
          duration: ".45",
          rotationZ: "22deg",
          repeat: "-1",
          ease: "linear",
          yoyo: "true",
        }
      );
    } else if (player2 == activePlayer) {
      // Si Kaaris est actif
      if (this.boobaHeadMoving) {
        // Stopper animation sur la tête de Booba
        this.boobaHeadMoving.kill();
      }
      // Lancer l'animation sur la tête de Kaaris
      this.kaarisHeadMoving = gsap.fromTo(
        this.kaarisHead,
        { rotationZ: "-11deg" },
        {
          duration: ".45",
          rotationZ: "22deg",
          repeat: "-1",
          ease: "linear",
          yoyo: "true",
        }
      );
    }
  }

  // Stopper l'animation des têtes au déclenchement du fight
  stopShakingHead() {
    this.boobaHeadMoving.kill();
    this.kaarisHeadMoving.kill();
  }

  // Animer apparition éléments sur page d'accueil
  createTimelineOpening() {
    this.tlOpening = new gsap.timeline();
    this.tlOpening
      .add("faces")
      .from(this.boobaFade, {
        duration: "1",
        left: "-25%",
        top: "100%",
        opacity: "0",
        ease: "power4.in",
      })
      .from(
        this.kaarisFade,
        {
          duration: "1",
          right: "-25%",
          top: "0",
          opacity: "0",
          ease: "power4.in",
        },
        "faces"
      )
      .add("title")
      .from(this.openingOrlyTitle, {
        duration: "1.8",
        left: "5%",
        opacity: "0",
        ease: "power4.out",
      })
      .from(
        this.openingFightTitle,
        { duration: "1.8", bottom: "-25%", opacity: "0", ease: "power4.out" },
        "title"
      )
      .from(
        this.cornerFade,
        { duration: ".5", opacity: "0", ease: "power4.in" },
        "title+=.5"
      )
      .from(
        this.recording,
        { duration: "1", opacity: "0", top: "0" },
        "title+=.8"
      )
      .from(
        this.soundParagraph,
        { duration: "1", opacity: "0", top: "0" },
        "title+=.8"
      )
      .from(
        this.advisory,
        { duration: "1", opacity: "0", bottom: "0" },
        "title+=.8"
      )
      .from(
        this.startBtn,
        { duration: "1", opacity: "0", bottom: "0" },
        "title+=.8"
      );
  }

  // Animation apparition des rappeurs pour le moment FIGHT
  createTimelineFight(callbackStartKey) {
    this.tlFight = new gsap.timeline({
      onComplete: () => {
        this.tlFight.timeScale(1.5);
        this.tlFight.reverse();
      },
      onReverseComplete: () => {
        callbackStartKey();
      },
    });
    this.tlFight
      .add("faces")
      .fromTo(
        this.layerFight,
        { display: "none" },
        { duration: ".5", display: "block", ease: "power4.in" }
      )
      .fromTo(
        this.boobaFade,
        { left: "-25%", top: "100%", opacity: "0" },
        {
          duration: "1",
          top: "50%",
          left: "0%",
          opacity: "1",
          ease: "power4.in",
        },
        "faces"
      )
      .fromTo(
        this.kaarisFade,
        { right: "-25%", top: "0", opacity: "0" },
        {
          duration: "1",
          top: "50%",
          right: "0%",
          opacity: "1",
          ease: "power4.in",
        },
        "faces"
      )
      .fromTo(
        this.fightTopTitle,
        { top: "-25%", opacity: "0" },
        {
          duration: "1",
          top: "0%",
          left: "4%",
          opacity: "1",
          ease: "power4.out",
        },
        "faces+=.9"
      )
      .fromTo(
        this.fightBottomTitle,
        { bottom: "-25%", opacity: "0" },
        {
          duration: "1",
          bottom: "1%",
          right: "5%",
          opacity: "1",
          ease: "power4.out",
        },
        "faces+=.9"
      );
  }

  // Animation apparition des rappeurs pour le moment WINNER
  createTimelineWinner() {
    this.tlWinner = new gsap.timeline();
    this.tlWinner
      .add("faces")
      .fromTo(
        this.layerWinner,
        { display: "none" },
        { duration: ".5", display: "block", ease: "power4.in" }
      )
      .fromTo(
        this.boobaFade,
        { left: "-25%", top: "100%", opacity: "0" },
        {
          duration: "1",
          left: "0",
          top: "50%",
          opacity: "1",
          ease: "power4.in",
        },
        "faces"
      )
      .fromTo(
        this.kaarisFade,
        { right: "-25%", top: "0", opacity: "0" },
        {
          duration: "1",
          right: "0",
          top: "50%",
          opacity: "1",
          ease: "power4.in",
        },
        "faces"
      )
      .fromTo(
        this.winnerTopTitle,
        { top: "-25%", opacity: "0" },
        {
          duration: "1",
          right: "4%",
          top: "0%",
          opacity: "1",
          ease: "power4.out",
        },
        "faces+=.9"
      )
      .fromTo(
        this.winnerBottomTitle,
        { bottom: "-25%", opacity: "0" },
        { duration: "1", bottom: "1%", opacity: "1", ease: "power4.out" },
        "faces+=.9"
      )
      .from(
        this.restartBtn,
        { duration: "1.5", opacity: "0", bottom: "0", ease: "power4.out" },
        "faces+=1.5"
      );
  }

  // Ouvrir Popin INSTRUCTION
  openPopIn() {
    this.tlPopIn = new gsap.timeline();
    this.tlPopIn
      .add("open")
      .to(this.layerPopIn, {
        duration: ".5",
        display: "block",
        ease: "power4.in",
      })
      .fromTo(
        this.popIn,
        { top: "70%", opacity: "0" },
        { duration: "1", top: "50%", opacity: "1", ease: "power4.out" },
        "open"
      );
  }

  // Animation sur la croix popIn au survol
  animateCloseBtnOver() {
    gsap.to(this.closeBtn, {
      duration: ".5",
      rotationZ: "180",
      ease: "power4.inOut",
    });
  }

  // Animation sur la croix popIn quand la souris ne survole plus
  animateCloseBtnOut() {
    gsap.to(this.closeBtn, {
      duration: ".5",
      rotationZ: "0",
      ease: "power4.inOut",
    });
  }

  // Fermer Popin INSTRUCTION
  closePopIn() {
    this.tlPopIn = new gsap.timeline();
    this.tlPopIn
      .add("close")
      .fromTo(
        this.layerPopIn,
        { display: "block" },
        { duration: ".5", display: "none", ease: "power4.in" }
      )
      .fromTo(
        this.popIn,
        { top: "50%", opacity: "1" },
        { duration: ".5", top: "70%", opacity: "0", ease: "power4.out" },
        "close"
      );
  }

  // Lancer animation sur img SVG du son
  animateSvgSound() {
    if (this.musicIconOff) {
      this.musicIconOff.kill();
    }
    this.musicIconOn = gsap.fromTo(
      this.musicBarsSvg,
      { scale: ".65", transformOrigin: "center center" },
      {
        duration: ".3",
        scale: "1.2",
        stagger: ".1",
        repeat: "-1",
        yoyo: "true",
        ease: "linear",
      }
    );
  }

  // Stopper animation sur img SVG du son
  stopSvgSound() {
    if (this.musicIconOn) {
      this.musicIconOn.kill();
    }
    this.musicIconOff = gsap.fromTo(
      this.musicBarsSvg,
      { scale: "1.2" },
      { duration: ".1", scale: ".65", transformOrigin: "center center" }
    );
  }
}

export default Animation;
