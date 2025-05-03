let idRegiao = 0;

function showAside(id) {
    idRegiao = id;
  const aside = document.getElementsByTagName("aside")[0];
  aside.classList.remove("hidden");
}

function showBtniniciarQuiz() {
  const iniciarQuiz = document.getElementById("iniciarQuiz");
  iniciarQuiz.classList.remove("hidden");
}

async function buscarQuiz() {
    idRegiao = 1;
    const url = `https://api-regioes-meioambiente.onrender.com/${idRegiao}/questao`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`)
        }
        const json = await response.json();

        return json;
    } catch(error) {
        console.error(error.message);
    }
}

function getIdPerguntaAtual() {
    const questoes = document.querySelector('li.questao.selected').id;
    return questoes;
}

function montarPergunta(pergunta) {
  const id = pergunta.id;
  const enunciado = pergunta.pergunta;
  const alternativas = pergunta.alternativas;

  return `
        <li class="questao" id="questao-${id}">
            <p>${enunciado}</p>
            <ol id="questao" type="a">
                <li>
                    <input  type="radio" name="alternativa" id="a" value="${alternativas.a}"/>
                    <label for="a">${alternativas.a}</label>
                </li>
                <li>
                    <input  type="radio" name="alternativa" id="b" value="${alternativas.b}"/>
                    <label for="b">${alternativas.b}</label>
                </li>
                <li>
                    <input  type="radio" name="alternativa" id="c" value="${alternativas.c}"/>
                    <label for="c">${alternativas.c}</label>
                </li>
                <li>
                    <input  type="radio" name="alternativa" id="d" value="${alternativas.d}"/>
                    <label for="d">${alternativas.d}</label>
                </li>
            </ol>
         </li>
  `
}
function montarQuiz(quiz) {
  const questoes = quiz;

  let idQuestaoAtual = questoes[0].id;

  let perguntas = questoes.map(questao => montarPergunta(questao));
  document.getElementById("perguntas").innerHTML = perguntas.join('');
  idPerguntaAtual = "questao-" + idQuestaoAtual;
}

function mostrarPerguntaById(id) {
    let pergunta = document.getElementById(`${id}`);
    pergunta.classList.add("selected");
}

function esconderPerguntaById(id) {
    let pergunta = document.getElementById(`${id}`);
    pergunta.classList.remove("selected");
}

function mostrarElementoById(id) {
    const elemento = document.getElementById(id);
    elemento.classList.remove("hidden");
}

function esconderElementoById(id) {
    const elemento = document.getElementById(id);
    elemento.classList.add("hidden");
}

function desativarBotaoPorId(id) {
    const botao= document.getElementById(id);
    botao.disabled = true;
}

function ativarBotaoPorId(id) {
    const botao= document.getElementById(id);
    botao.disabled = false;
}

iniciarQuiz.addEventListener('click', async () => {
  let quizBuscado = await buscarQuiz();
  let idQuestaoAtual = quizBuscado[0].id;

  montarQuiz(quizBuscado);

  esconderElementoById("iniciarQuiz");
  mostrarElementoById("quiz");

  document.querySelectorAll('input[name="alternativa"]').forEach(radio => {
    radio.addEventListener('change',() => {
        ativarBotaoPorId('proxBtn');
    });
  });

  mostrarPerguntaById("questao-" + idQuestaoAtual);
});

function proxPergunta(event) {
    let perguntaAtual = document.getElementById(`${getIdPerguntaAtual()}`);
    let proxPergunta = perguntaAtual.nextElementSibling;

    if(proxPergunta) {
        if(!proxPergunta.nextElementSibling){
            esconderElementoById("proxBtn");
            ativarBotaoPorId('finalizar-quiz')
            mostrarElementoById("finalizar-quiz");
        }
        mostrarPerguntaById(proxPergunta.id);
    } 

    esconderPerguntaById(perguntaAtual.id);
    desativarBotaoPorId('proxBtn');

    event.preventDefault()
}

proxBtn.addEventListener('click', proxPergunta);

async function enviarQuiz(event) {
    desativarBotaoPorId('finalizar-quiz');

    const url = "https://api-regioes-meioambiente.onrender.com/1/questao";
    try {
        const response = await fetch(url, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`)
        }
        const json = await response.json();

        return json;
    } catch(error) {
        console.error(error.message);
    }

    esconderElementoById('quiz');
    mostrarElementoById('pontuacao')

    event.preventDefault();
}

document.getElementById("finalizar-quiz").addEventListener('click', enviarQuiz)

document.addEventListener("DOMContentLoaded", () => {
  const mapa = document.getElementsByTagName("svg")[0];
  // Acessa o conteúdo do SVG
  mapa.addEventListener("load", () => {

    // Seleciona todos os estados pelo ID ou classe
    const estados = mapa.querySelectorAll('[id^="estado-"]');

    estados.forEach((estado) => {
      // Salva a cor original do estado
      const corOriginal = estado.style.fill;

      // Adiciona evento de clique
      estado.addEventListener("click", () => {
        showAside(estado.id);
        showBtniniciarQuiz();
        // alert(`Você clicou no estado: ${estado.id}`);
      }),

      // Adiciona efeito de hover

      estado.addEventListener("mouseover", () => {
        estado.style.fill = "#77777780";
      }),

      // Retorna à cor original no mouseout
      estado.addEventListener("mouseout", () => {
            estado.style.fill = corOriginal;
      })
    }
    )
  })
});