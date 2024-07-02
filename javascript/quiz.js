const nome = localStorage.getItem('nome');

var mensagemOla = document.getElementById('titulo');
mensagemOla.innerText = 'Olá ' + nome + ", escolha um quiz para começar!";