var segundos;
var target_time = new Date().getTime() + 17000;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const quiz = urlParams.get('quiz');
const perguntaIndex = parseInt(urlParams.get('pergunta'), 10);

var tempoAcabando = new Audio('sounds/tempo_acabando.mp3');
var audioRight = new Audio('sounds/right_sound.mp3');
var audioWrong = new Audio('sounds/wrong_sound.mp3');

var jaTocou = false;

var timerInterval = setInterval(function () {

    
    var current_date = new Date().getTime();
    var segundos_f = (target_time - current_date) / 1000;
    
    if (segundos_f < 0) {
        segundos_f = 0;
    }
  
    segundos = parseInt(segundos_f % 60);
    
    document.getElementById('segundo').innerHTML = segundos;

    var proximaPerguntaIndex = (perguntaIndex + 1);

    if (segundos == 5) {
        tempoAcabando.play();
    }

    if (segundos == 0) {
        setTimeout(function () {
            if (proximaPerguntaIndex < 6) {
                window.location.href  = "pergunta.html?quiz=" + quiz + "&pergunta=" + proximaPerguntaIndex;
            } else {
                window.location.href  = "parabens.html";
            }
        }, 5000);
        if (!jaTocou) {
            audioWrong.play();
            jaTocou = true;
        }
    }

}, 1000);

const jsonURL = 'data_json/perguntas.json';

var imagemPerguntaHTML = document.getElementById('imagem-pergunta');
var numPerguntaHTML = document.getElementById('numero-pergunta');
var perguntaHTML = document.getElementById('pergunta');

var resposta1HTML = document.getElementById('resposta1');
var resposta2HTML = document.getElementById('resposta2');
var resposta3HTML = document.getElementById('resposta3');
var resposta4HTML = document.getElementById('resposta4');

imagemPerguntaHTML.src = "imagens/perguntas/" + quiz + "-pergunta.png";

async function carregarPerguntas() {

    try {

        const response = await fetch(jsonURL);

        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON.');
        }

        const jsonPerguntas = await response.json();

        if (!jsonPerguntas || !jsonPerguntas.perguntas || !Array.isArray(jsonPerguntas.perguntas)) {
            throw new Error('Estrutura do JSON inválida.');
        }

        if (urlParams.has('quiz') && urlParams.has('pergunta')) {

            const perguntasDoTema = jsonPerguntas.perguntas.find(item => item.tema === quiz)?.perguntas;

            if (perguntasDoTema && perguntaIndex >= 1 && perguntaIndex <= perguntasDoTema.length) {
                const pergunta = perguntasDoTema[perguntaIndex - 1];

                numPerguntaHTML.innerText = "Pergunta N° " + perguntaIndex;
                perguntaHTML.innerText = pergunta.pergunta;

                for (var i = 0; i <= perguntasDoTema.length; i++) {
                    switch (i) {
                        case 0:
                            resposta1HTML.innerText = pergunta.respostas[0];
                            break;
                        case 1:
                            resposta2HTML.innerText = pergunta.respostas[1];
                            break;
                        case 2:
                            resposta3HTML.innerText = pergunta.respostas[2];
                            break;
                        case 3:
                            resposta4HTML.innerText = pergunta.respostas[3];
                            break;
                        default:
                    }
                }
                
            } else {
                console.error('Pergunta não encontrada.');
            }
        } else {
            console.error('Parâmetros "quiz" e/ou "pergunta" não encontrados na URL.');
        }
    } catch (error) {
        console.error('Erro ao carregar e processar o JSON:', error);
    }
}

carregarPerguntas();

async function verificaResposta(resposta)  {
    
    const response = await fetch(jsonURL);

    var repostaEscolhida = document.getElementById(resposta);

    if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo JSON.');
    }

    const jsonPerguntas = await response.json();

    if (!jsonPerguntas || !jsonPerguntas.perguntas || !Array.isArray(jsonPerguntas.perguntas)) {
        throw new Error('Estrutura do JSON inválida.');
    }

    const perguntasDoTema = jsonPerguntas.perguntas.find(item => item.tema === quiz)?.perguntas;

    if (repostaEscolhida.innerText == perguntasDoTema[perguntaIndex - 1].resposta_correta) {
        audioRight.play();
        repostaEscolhida.style.backgroundColor = "green";

        let acertos = localStorage.getItem('acertos');
        acertos = Number(acertos); 
        acertos += 1;
        localStorage.setItem('acertos', acertos);
        
        console.log(localStorage.getItem('acertos'));
    } else {
        audioWrong.play();
        repostaEscolhida.style.backgroundColor = "red";
    }

    var proximaPerguntaIndex = (perguntaIndex + 1);

    clearInterval(timerInterval);
    setTimeout(function () {
        if (proximaPerguntaIndex < 6) {
            window.location.href  = "pergunta.html?quiz=" + quiz + "&pergunta=" + proximaPerguntaIndex;            
        } else {
            window.location.href = "parabens.html?quiz="+ quiz;
        }
    }, 5000);
}
