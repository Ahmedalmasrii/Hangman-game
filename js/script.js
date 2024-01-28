// Globala variabler

const wordList = [
  "VOLVO",
  "BMW",
  "MERCEDES",
  "AUDI",
  "KIA",
  "TOYOTA",
  "VOLKSWAGEN",
  "SUZUKI",
  "FORD",
  "FERRARI",
  "LAMBO",
]; // Array: med spelets alla ord
let selectedWord; // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan
let guesses = 0; // Number: håller antalet gissningar som gjorts
let hangmanImg; // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl; // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl; // DOM-nod: knappen som du startar spelet med
let letterButtonEls; // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls; // Array av DOM-noder: Rutorna där bokstäverna ska stå

let winPopupEl;
let losePopupEl;
let closeWinPopupBtnEl;
let closeLosePopupBtnEl;

//Detta är en funktion som sopm genererar ett slumpmässigt val av ord från ordlistan//
function selectedRandomWord(wordList) {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const selectedWord = wordList[randomIndex];
  return selectedWord;
}

//Funktion för att skapa inputfält för de varje bokstav från de valda ordet//
function createLetterBoxes() {
  const letterBoxesContainer = document.getElementById("letterBoxes");
  letterBoxesContainer.innerHTML = "";

  for (const letter of selectedWord) {
    const letterBox = document.createElement("li");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", "");
    input.setAttribute("readonly", "readonly"); //  readonly-attributet här för att man inte ska kunna skriva i input rutorna
    letterBox.appendChild(input);
    letterBoxesContainer.appendChild(letterBox);
  }
}

//Denna funktion gör att den fyller i rätt bokstav i rutorn om gissningen är korrekt, och om gissade ordet är fel så ska funktionen handleWrongguess anropas, vid gissade av rätt ord så anropas handlewin//
function guessLetter(clickedLetter) {
  const letterBoxes = document.querySelectorAll("#letterBoxes input");
  let letterFound = false;

  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === clickedLetter) {
      letterBoxes[i].value = clickedLetter;
      letterFound = true;
    }
  }
  if (!letterFound) {
    handleWrongGuess();
  } else if (checkWin()) {
    handleWin();
  }
}
//Denna funktionen är till för att hantera felaktig gissning av bokstäver,och uppdaterar hänga gubbe bilden vid flera gissninar av fel bokstäver.
function handleWrongGuess() {
  guesses++;
  updateHangmanImage();

  if (guesses === 6) {
    handleGameOver(false);
  }
}
// Funktion för att uppdatera bilden av hänga gubbe baserat på antalet fel gissningar man gör.//

function updateHangmanImage() {
  document.getElementById("hangman").src = `images/h${guesses}.png`;
}


//Detta är en funktoin som ska hantera spelet vid antingen förlust eller vins//

function handleGameOver(isWin) {
  const messageElement = document.getElementById("message");
  //här så uppdateras meddelanden baserat på om det är vinst eller förlust.//
  messageElement.textContent = isWin
    ? "Grattis, du vann!"
    : `Tyvärr, du förlorade. Rätt ord var ${selectedWord}`;
  //Och denna del gör att när spelet är slut så bokstäverna inaktiveras//
  disableLetterButtons();
  //pop up meddelande ska dyka upp baserat om det är vinst eller förlust
  if (isWin) {
    showPopup(winPopupEl);
  }
  //Och här så ska de korrekta ordet dyka upp i pop up meddelandet//
  else {
    document.getElementById("correctWord").textContent = selectedWord;
    showPopup(losePopupEl);
  }
}

//Dett är en funktion som ska anropa handlegameover med värdet true för att indikera på en vinst

function handleWin() {
  handleGameOver(true);
}

// Funktion för att aktivera alla bokstavsknappar.
function enableLetterButtons() {
  // Loopa igenom varje knapp i arrayen letterButtonEls och se till att dom aktiveras
  for (const button of letterButtonEls) {
    button.disabled = false;
  }
}

// Och denna funktion är då motsatsen till den ovan, den inaktiverar nokstavsknapparna.
function disableLetterButtons() {
  // Loopa igenom varje knapp i arrayen letterButtonEls och se till att dom inaktiveras
  for (const button of letterButtonEls) {
    button.disabled = true;
  }
}

//Detta är en funktion som kontrollerar ifall spelaren har vunnit genom att gissa alla bokstäver
function checkWin() {
  //hämtar alla input elementen som  finns i #letterBoxes
  const letterBoxes = document.querySelectorAll("#letterBoxes input");
  //en loop som går igenom alla  input elementen
  for (const input of letterBoxes) {
    //här kontrolleras värdet av input element ifall det är en tom sträng, dvs bokstaven är inte gissad än
    if (input.value === "") {
      //ger  false värde få spelet inte är vunnet ännu
      return false;
    }
  }

  // retunerar true värde om inte loopen hittar en tom sträng dvs spelet är vunnet.
  return true;
}

function init() {
  // Hämtar in dom-element för knappen `starta  spelet ` som  ska starta spelet
  startGameBtnEl = document.getElementById("startGameBtn");

  // Denna hämtar dom-element för bokstavsknapparna och rutor
  letterButtonEls = document.querySelectorAll("#letterButtons button");
  letterBoxEls = document.querySelectorAll("#letterBoxes input");

  //Denna hämtar dom-element för vinst- och förlust-popup
  winPopupEl = document.querySelector(".win-popup");
  losePopupEl = document.querySelector(".lose-popup");

  // Denna hämtar dom-element för att stänga vinst- och förlust-popup meddelandet
  closeWinPopupBtnEl = document.getElementById("closeWinPopupBtn");
  closeLosePopupBtnEl = document.getElementById("closeLosePopupBtn");

  // Lägg till en händelselyssnare för att starta spelet när knappen klickas
  startGameBtnEl.addEventListener("click", () => {
    // Tilldela selectedWord det slumpmässigt valda ordet
    selectedWord = selectedRandomWord(wordList);

    // Skapa och visa tomma rutor för varje bokstav i det valda ordet från wordlist
    createLetterBoxes();

    // Aktiverar bokstavsknapparna vid spelets start
    enableLetterButtons();

    // Återställer spelet
    resetGame();

    // Döljer vinst- och förlust-popup meddelandet
    hidePopup(winPopupEl);
    hidePopup(losePopupEl);
  });
  // lagt till en addeventlistiner för varje bokstavsknapp
  for (const button of letterButtonEls) {
    button.addEventListener("click", () => {
      guessLetter(button.value);

      // ser till att knappen inaktiveras efter att man har valt den.
      button.disabled = true;
    });
  }
  // Lagt till addEventListener för att stänga vinst-popup efter att den har dykt upp
  closeWinPopupBtnEl.addEventListener("click", () => {
    hidePopup(winPopupEl);
  });

  // lagt till addEventListener för att stänga förlust-popup efter att den har dykt upp
  closeLosePopupBtnEl.addEventListener("click", () => {
    hidePopup(losePopupEl);
  });
}

// Gjort en händelselyssnare för att köra init-funktionen när sidan har laddas
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// Denna funktion är till för att återställa spelet
function resetGame() {
  guesses = 0;
  updateHangmanImage();
  const messageElement = document.getElementById("message");
  messageElement.textContent = "";
  enableLetterButtons();
}

// Funktion för att visa en popup och dölja pop up meddelandet som dyker upp vid vinst/förlust
function showPopup(popupEl) {
  popupEl.style.display = "block";
}
function hidePopup(popupEl) {
  popupEl.style.display = "none";
}
