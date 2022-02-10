
const player1Table = document.getElementById("player-1-table");
const player2Table = document.getElementById("player-2-table");
const player1Hand = document.getElementById("player-1-hand");
const player2Hand = document.getElementById("player-2-hand");
const timeDisplay = document.getElementById("time");
const clockHourHand = document.getElementById("clock-hour-hand");
const clockMinuteHand = document.getElementById("clock-minute-hand");
const shuffleEvery100 = document.getElementById("shuffle-every-100");
let interval = null;
let seconds = 0;
let step = 0;
const scope = new Scope(document.getElementById("scope"));
updateTime();

const PLAY_TIME = 2.7;
const PLAY_VARIANCE = 0.5;

document.getElementById("start").addEventListener("click", start);	

let cards = [];
for (let i = 1; i <= 13 ; i++)
  for (let j = 1; j <= 4; j++)
    cards.push(i);

function fisherYates(cards){
  let i = cards.length;
  while (i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
  return cards;
}
cards = fisherYates(cards);
while (cards.length > 0) {
  let player = cards.length%2;
  let value = cards.pop();
  let hand = player ? player2Hand : player1Hand;
  let card = document.createElement("SPAN");
  card.classList.add("card",`player-${player + 1}`);
  card.innerHTML = value;
  hand.appendChild(card);
}

function start(e){
  e.target.style.display = "none";
  document.getElementById("reset").style.display = "inline-block";
  interval = setInterval(playNextHand, 25);
}

function playNextHand(){
  // Shuffle every 100 moves
  if (step % 100 == 0 && shuffleEvery100.checked) {
    shufflePlayerHand(player1Hand);
    shufflePlayerHand(player2Hand);
  }

  if (tableEmpty()) moveCardsToTable();
  else {
    let compare = compareTableCards();
    if (compare == 0) {
      for (let i = 0; i < 2; i++) {
        moveCardsToTable();
        addTime();
      }
    } else {
      let winner = compare == 1 ? player1Hand : player2Hand;
      moveTableCardsToWinner(winner);
      addTime();
      moveCardsToTable(); // this is here to avoid white flashes on the table
    }
    scope.add(compare);
  }
  updateTime();
  step++;
  if (gameOver()) return;
}

function shufflePlayerHand(hand){;
  let cards = [];
  for (let i = 0; i < hand.childNodes.length; i++)
    cards.push(hand.childNodes[i]);
  cards = fisherYates(cards);
  while (cards.length > 0)
    hand.appendChild(detach(cards.pop()));
}

function moveTableCardsToWinner(winner){
  while (player1Table.childElementCount > 0)
    winner.prepend(detach(randomChild(player1Table)));
  while (player2Table.childElementCount > 0)
    winner.prepend(detach(randomChild(player2Table)));
}
function randomChild(parent){
  return parent.childNodes[Math.floor(Math.random() * parent.childNodes.length)];
}
function moveCardsToTable(){
  if (player1Hand.childNodes.length > 0)
    player1Table.append(detach(player1Hand.lastChild));

  if (player2Hand.childNodes.length > 0)
    player2Table.append(detach(player2Hand.lastChild));

}

function compareTableCards(){
  return compareCards(player1Table.lastChild, player2Table.lastChild);
}
function compareCards(card1,card2){
  let card1Val = !!card1 ? parseInt(card1.innerHTML) : 0;
  let card2Val = !!card2 ? parseInt(card2.innerHTML) : 0;
  return Math.sign(card1Val-card2Val);
}

function tableEmpty(){
  return player1Table.childElementCount == 0 && player2Table.childElementCount == 0;
}

function detach(element){
  return element.parentNode.removeChild(element);
}

function gameOver(){
  if (isGameOver()) {
    clearInterval(interval);
    let winner = player1Hand.childNodes.length > 0 ? "Player 1" : "Player 2";
    let winnerHand =  player1Hand.childNodes.length > 0 ? player1Hand : player2Hand;
    moveTableCardsToWinner(winnerHand);
    setTimeout(()=>{alert(`${winner} wins!`)}, 100);
    return true;
  }
  return false;
}

function isGameOver(){
  const emptyHand = player1Hand.childNodes.length <= 0 || player2Hand.childNodes.length <= 0;
  const war = compareCards(player1Table.firstChild, player2Table.firstChild) == 0;
  const emptyTable = player1Table.childNodes.length <= 0 || player2Table.childNodes.length <= 0;
  return emptyHand && (emptyTable || war);
}

function addTime(){
  seconds += Math.random() * PLAY_VARIANCE + PLAY_TIME;
  return seconds;
}

function updateTime(){
  let h = "0" + Math.floor(seconds / 3600);
  h = h.substring(h.length - 2);
  let m = "0" + Math.floor((seconds % 3600) / 60);
  m = m.substring(m.length - 2);
  let s = "0" + Math.floor(seconds % 60);
  s = s.substring(s.length - 2);

  timeDisplay.innerHTML = `<span>&nbsp;${h}</span><span>:${m}</span><span>:${s}</span>`;

  let hourAngle = (seconds / 3600 / 24) * 360 + 180;
  clockHourHand.style.transform = `rotate(${hourAngle}deg`;
  let minuteAngle = (seconds / 3600) * 360 + 180;
  clockMinuteHand.style.transform = `rotate(${minuteAngle}deg`;
}