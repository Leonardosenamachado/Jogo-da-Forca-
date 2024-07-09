// Array de palavras predefinidas
const predefinedWords = [
  "forca",
  "leão",
  "capitão",
  "gato",
  "salvar",
  "configurações",
  "cachorro",
  "entrar",
  "faculdade",
  "console",
  "idade",
  "maça",
  "coração",
  "excluir",
  "despertador",
  "casa",
  "compartilhar",
  "cidade",
  "garrafa",
  "água",
  "celular",
  "caderno",
  "monitor",
  "software",
  "caixa",
  "mamadeira",
  "melancia",
  "internet",
  "sapato",
  "liquidificador",
  "amor",
  "branco",
  "copo",
  "noite",
  "ovo",
  "parque",
  "peixe",
  "rato",
  "pai",
  "coelho",
  "otorrinolaringologista",
  "sino",
  "campeonato",
  "moeda",
  "pedreiro",
  "serenata",
  "formiga",
  "pneumonia",
  "menta",
  "caatinga",
];

// Recupera palavras armazenadas localmente ou inicializa um array vazio
let customWords = JSON.parse(localStorage.getItem("palavras")) || [];

let gameResult = 0; // Resultado do jogo: 0 = em andamento, 1 = vitória, 2 = derrota
let chosenWord = ""; // Palavra escolhida para o jogo
let guesses = ""; // Letras acertadas
let wrongLetters = ""; // Letras erradas
const wordElement = document.querySelector("#palavra"); // Elemento para exibir a palavra
const guessInput = document.querySelector("#palpite"); // Campo de entrada do palpite
const errorsElement = document.querySelector("#erros"); // Elemento para exibir os erros
const hangmanParts = document.querySelectorAll(".homem div"); // Partes do boneco do enforcado

// Seleciona elementos do modal
const modal = document.getElementById("dialogo");
const openModalButton = document.getElementById("abrir-dialogo");
const startGameButton = document.getElementById("iniciar-jogo");
const closeModalSpan = document.getElementsByClassName("fechar")[0];

// Abre o modal
openModalButton.onclick = () => {
  modal.style.display = "block";
};

// Fecha o modal
closeModalSpan.onclick = () => {
  modal.style.display = "none";
};

// Fecha o modal ao clicar fora dele
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Gera uma palavra aleatória da lista fornecida
const generateRandomWord = (wordList) => {
  chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
};

// Gera a palavra com base nos palpites do usuário
const generateWordWithGuesses = () => {
  let displayWord = "";
  let isGameFinished = true;

  for (const letter of chosenWord) {
    if (letter !== " ") {
      if (guesses.toUpperCase().includes(letter.toUpperCase())) {
        displayWord += `${letter.toUpperCase()}&nbsp;`;
      } else {
        displayWord += "_&nbsp;";
        isGameFinished = false;
      }
    } else {
      displayWord += "&nbsp;&nbsp;";
    }
  }

  wordElement.innerHTML = `PALAVRA: ${displayWord}`;

  if (isGameFinished) {
    gameResult = 1;
  }
};

// Exibe os erros do usuário
const displayErrors = () => {
  let wrongLettersDisplay = "";

  hangmanParts.forEach((part) => (part.style.display = "none")); // Oculta todas as partes do boneco

  wrongLetters.split("").forEach((letter, index) => {
    if (index < hangmanParts.length) {
      document.querySelector(`.homem-${index + 1}`).style.display = "block"; // Exibe a parte correspondente do boneco
    }
    wrongLettersDisplay += `${letter}, `;
  });

  errorsElement.innerHTML = `ERROS: ${wrongLettersDisplay.slice(0, -2)}`;

  if (wrongLetters.length >= 6) {
    // Se o usuário cometer 6 erros, ele perde o jogo
    setTimeout(() => {
      gameResult = 2;
      guessInput.disabled = true; // Desabilita o campo de palpite
      if (confirm(`Você perdeu :(. A resposta era "${chosenWord}".`)) {
        startGame(customWords); // Reinicia o jogo
      }
    }, 100);
  }
};

// Inicia o jogo com a lista de palavras fornecida
const startGame = (wordList) => {
  gameResult = 0;
  chosenWord = "";
  guesses = "";
  wrongLetters = "";

  wordElement.innerText = "";
  guessInput.value = "";
  errorsElement.innerText = "";

  generateRandomWord(wordList);
  generateWordWithGuesses();
  displayErrors();

  guessInput.disabled = false;
};

// Salva novas palavras fornecidas pelo usuário
const saveNewWords = (event) => {
  event.preventDefault();
  const newWordsText = document.getElementById("novas-palavras").value.trim();
  if (newWordsText) {
    const newWords = newWordsText.split(/[\s,]+/); // Divide o texto por espaços ou vírgulas
    customWords = customWords.concat(newWords); // Adiciona as novas palavras à lista existente
    localStorage.setItem("palavras", JSON.stringify(customWords)); // Salva as palavras no localStorage
    document.getElementById("novas-palavras").value = "";
    modal.style.display = "none"; // Fecha o modal
    alert("Palavras salvas!");
    startGame(newWords); // Inicia o jogo com as novas palavras
  } else {
    alert("Insira pelo menos uma palavra válida.");
  }
};

// Adiciona evento de submissão ao formulário de cadastro de novas palavras
document
  .getElementById("form-cadastro")
  .addEventListener("submit", saveNewWords);

// Inicia o jogo com as palavras predefinidas ao clicar no botão
startGameButton.onclick = () => {
  startGame(predefinedWords);
};

// Verifica o palpite do usuário ao pressionar a tecla Enter
guessInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 && gameResult === 0) {
    // Se a tecla Enter for pressionada e o jogo estiver em andamento
    const guess = guessInput.value.toUpperCase();
    if (chosenWord.toUpperCase().includes(guess)) {
      // Se o palpite estiver correto
      guesses += guess;
    } else if (!wrongLetters.includes(guess)) {
      // Se o palpite estiver errado e não foi dado anteriormente
      wrongLetters += guess;
    }

    guessInput.value = ""; // Limpa o campo de entrada

    generateWordWithGuesses(); // Atualiza a palavra exibida com base nos palpites
    displayErrors(); // Atualiza a exibição dos erros

    if (gameResult === 1) {
      // Se o jogo foi vencido
      guessInput.disabled = true; // Desabilita o campo de palpite
      if (confirm(`Você ganhou :D. Você teve ${wrongLetters.length} erros.`)) {
        startGame(customWords); // Reinicia o jogo
      }
    }
  }
});
