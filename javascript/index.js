var nome = "";
localStorage.setItem('acertos', 0);

function onClickNomeButton() {
    nome = document.getElementById('form-nome').value;
    localStorage.setItem('nome', nome);
}