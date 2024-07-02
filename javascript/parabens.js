const nome = localStorage.getItem('nome');

var audioWin = new Audio('sounds/win.mp3');
audioWin.play();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let acertos = localStorage.getItem('acertos');

const quiz = urlParams.get('quiz');

var mensagemParabensHTML = document.getElementById('mensagemParabens');
var acertosHTML = document.getElementById('acertos');

mensagemParabensHTML.innerText = "Parabéns! " + nome;
acertosHTML.innerText = + acertos + "/5";