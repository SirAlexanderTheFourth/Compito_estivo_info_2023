console.log("ml5 Version:", ml5.version)

var Position = function (x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.toString = function () {
  return this.x + ":" + this.y;
};

var Mazing = function (id) {

  this.mazeContainer = document.getElementById(id);
  this.mazeMessage = document.createElement("div");
  this.mazeMessage.id = "maze_message";

  this.mazeTimer = document.createElement("div");
  this.mazeTimer.id = "maze_Timer";

  this.maze = [];
  this.heroPos = {};
  this.heroHasKey = false;
  this.childMode = false;
  this.res = ""
  this.timer = 0
  this.ferma = false

  this.utter = null;

  for (i = 0; i < this.mazeContainer.children.length; i++) {
    for (j = 0; j < this.mazeContainer.children[i].children.length; j++) {
      var el = this.mazeContainer.children[i].children[j];
      this.maze[new Position(i, j)] = el;
      if (el.classList.contains("entrance")) {
        /* place hero on entrance square */
        this.heroPos = new Position(i, j);
        this.maze[this.heroPos].classList.add("hero");
      }
    }
  }

  var mazeOutputDiv = document.createElement("div");
  mazeOutputDiv.id = "maze_output";

  mazeOutputDiv.appendChild(this.mazeMessage);

  mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
  this.setMessage("first find the key");

  this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);
  mazeOutputDiv.appendChild(this.mazeTimer);
  mazeOutputDiv.appendChild(this.mazeMessage);

    // activate timer
    this.Timer()

    /* activate control keys
    this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
    document.addEventListener("keydown", this.keyPressHandler, false);
    */

    /* activate voice control */
    this.soundClassifier;
    this.options = {probabilityThreshold: 0.95};
    this.soundClassifier = ml5.soundClassifier('SpeechCommands18w', this.options)
    this.soundClassifier.classify(this.gotResults.bind(this))
};

// Timer Function (upgrade and show on screen the timer)
Mazing.prototype.Timer = function () {
  setInterval(() => {
    if (this.ferma === false) {
      this.timer++;
      this.mazeTimer.innerHTML = this.timer;
    } else {
      clearInterval();
    }
  }, 1000);
};

// listen your voice
Mazing.prototype.gotResults = function (error, results) {
  if (error) {
    console.error("NUH UH:", error);
    return;
  }
  this.res = results[0].label;
  if (this.res == "right" || this.res == "up" || this.res == "down" || this.res == "left") {
    this.setMessage(this.res)
  }
  this.mazeVoice();
};

Mazing.prototype.enableSpeech = function () {
  this.utter = new SpeechSynthesisUtterance()
  this.setMessage(this.mazeMessage.innerText);
};

Mazing.prototype.setMessage = function (text) {

  /* display message on screen */
  this.mazeMessage.innerHTML = text;

  if (this.utter && text.match(/^\w/)) {
    /* speak message aloud */
    this.utter.text = text;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utter);
  }

};

Mazing.prototype.heroTakeKey = function () {
  this.maze[this.heroPos].classList.remove("key");
  this.heroHasKey = true;
  this.setMessage("you now have the key!");
};

Mazing.prototype.gameOver = function (text) {
  /* de-activate control keys */
  this.ferma = true
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.setMessage(text);
  this.mazeContainer.classList.add("finished");
};

Mazing.prototype.heroWins = function () {
  this.ferma = true
  this.maze[this.heroPos].classList.remove("door");
  this.gameOver("you finished !!!");
  this.setMessage("you finished !!!")
};

Mazing.prototype.tryMoveHero = function (pos) {

  if ("object" !== typeof this.maze[pos]) {
    return;
  }

  var nextStep = this.maze[pos].className;

  if (nextStep.match(/wall/)) {
    return;
  }

  if (nextStep.match(/exit/)) {
    if (this.heroHasKey) {
      this.heroWins();
    } else {
      this.setMessage("Zǎoshang hǎo zhōngguó xiànzài wǒ yǒu BING CHILLING 🥶🍦 wǒ hěn xǐhuān BING CHILLING 🥶🍦 dànshì sùdù yǔ jīqíng 9 bǐ BING CHILLING 🥶🍦 sùdù yǔ jīqíng sùdù yǔ jīqíng 9 wǒ zuì xǐhuān suǒyǐ…xiànzài shì yīnyuè shíjiān zhǔnbèi 1 2 3 liǎng gè lǐbài yǐhòu sùdù yǔ jīqíng 9 ×3 bùyào wàngjì bùyào cu òguò jìdé qù diànyǐngyuàn kàn sùdù yǔ jīqíng 9 yīn wéi fēicháng hǎo diànyǐng dòngzuò fēicháng hǎo chàbùduō yīyàng BING CHILLING 🥶🍦zàijiàn 🥶🍦");
      return;
    }
  }

  /* move hero one step */

  this.maze[this.heroPos].classList.remove("hero");
  this.maze[pos].classList.add("hero");
  this.heroPos = pos;

  /* check what was stepped on */

  if (nextStep.match(/key/)) {
    this.heroTakeKey();
    return;
  }

  if (nextStep.match(/exit/)) {
    return;
  }

};
/*
Mazing.prototype.mazeKeyPressHandler = function (e) {

  var tryPos = new Position(this.heroPos.x, this.heroPos.y);

  switch (e.key) {
    case "ArrowLeft":
      this.setMessage("left")
      this.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case "ArrowUp":
      this.setMessage("up")
      tryPos.x--;
      break;

    case "ArrowRight":
      this.setMessage("right")
      this.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case "ArrowDown":
      this.setMessage("down")
      tryPos.x++;
      break;

    default:
      return;

  }

  this.tryMoveHero(tryPos);

  e.preventDefault();
};*/

Mazing.prototype.mazeVoice = function () {
  var tryPos = new Position(this.heroPos.x, this.heroPos.y);

  switch (this.res) {

    case "left":
      this.mazeContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case "up":
      tryPos.x--;
      break;

    case "right":
      this.mazeContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case "down":
      tryPos.x++;
      break;

    default:
      return;

  }
  this.tryMoveHero(tryPos);
}
