
// ==========================================
// 1. CAPTURA DOS ELEMENTOS DO DOM
// ==========================================

const form = document.getElementById('formulario-endereco');

const campoCep = document.getElementById('campo-cep');

const mensagemStatus = document.getElementById('mensagem-status');

const campoLogradouro = document.getElementById('campo-logradouro');
const campoBairro = document.getElementById('campo-bairro');
const campoCidade = document.getElementById('campo-cidade');
const campoEstado = document.getElementById('campo-estado');

const campoNumero = document.getElementById('campo-numero');
const campoComplemento = document.getElementById('campo-complemento');

const campoPlaneta = document.getElementById('campo-planeta');
const campoDescricao = document.getElementById('campo-descricao');

const imagemPersonagem = document.getElementById('imagem-personagem');

const botaoConcluir = document.getElementById('botao-concluir');


// ==========================================
// 2. ENDEREÇO BASE DA API
// ==========================================

// Todas as consultas serão feitas a partir deste endereço.

const API = 'https://dragonball-api.com/api';


// ==========================================
// 3. EVENTO DE BUSCA DO PERSONAGEM
// ==========================================

form.addEventListener('submit', async (evento) => {

    // Impede que a página recarregue ao enviar o formulário.
    evento.preventDefault();

    // Limpa a mensagem anterior.
    mensagemStatus.textContent = '';
    mensagemStatus.className = 'mensagem';

    // Pega o nome digitado pelo usuário.
    const nome = campoCep.value.trim();

    // Verifica se o campo está vazio.
    if (nome === '') {

        exibirMensagem('Digite o nome de um personagem.', 'erro');

        limparCampos();

        return;
    }

    try {

        // Mostra que a API está sendo consultada.
        exibirMensagem('Buscando personagem...', 'carregando');

        // ==========================================
        // 4. PRIMEIRA REQUISIÇÃO: BUSCAR PERSONAGEM
        // ==========================================

        // encodeURIComponent protege o nome na URL.
        const url = `${API}/characters?name=${encodeURIComponent(nome)}`;

        // fetch faz a conexão com a API.
        const resposta = await fetch(url);

        // Verifica se a resposta HTTP foi bem-sucedida.
        if (!resposta.ok) {
            throw new Error('Erro ao consultar a API.');
        }

        // Converte a resposta JSON em objeto JavaScript.
        const dados = await resposta.json();

        // A busca por filtros retorna uma lista de personagens.
        const personagemEncontrado = Array.isArray(dados)
            ? dados[0]
            : dados.items?.[0];

        // Verifica se encontrou algum personagem.
        if (!personagemEncontrado) {

            exibirMensagem('Personagem não encontrado!', 'erro');

            limparCampos();

            return;
        }


        // ==========================================
        // 5. SEGUNDA REQUISIÇÃO: DETALHES
        // ==========================================

        // Utiliza o ID encontrado para buscar informações completas.
        const respostaDetalhes = await fetch(
            `${API}/characters/${personagemEncontrado.id}`
        );

        if (!respostaDetalhes.ok) {
            throw new Error('Não foi possível carregar os detalhes.');
        }

        // Converte os detalhes recebidos em objeto JavaScript.
        const personagem = await respostaDetalhes.json();


        // ==========================================
        // 6. PREENCHIMENTO DOS CAMPOS
        // ==========================================

        // Nome do personagem.
        campoLogradouro.value = personagem.name || 'Não informado';

        // Raça.
        campoBairro.value = personagem.race || 'Não informado';

        // Gênero.
        campoCidade.value = personagem.gender || 'Não informado';

        // Grupo ou equipe.
        campoEstado.value = personagem.affiliation || 'Não informado';

        // Poder de luta atual.
        campoNumero.value = personagem.ki || 'Não informado';

        // Poder máximo.
        campoComplemento.value = personagem.maxKi || 'Não informado';

        // Planeta de origem.
        campoPlaneta.value = personagem.originPlanet?.name || 'Não informado';

        // Descrição do personagem.
        campoDescricao.value = personagem.description || 'Sem descrição disponível.';

        // Imagem do personagem.
        imagemPersonagem.src = personagem.image || '';
        imagemPersonagem.alt = personagem.name;


        // ==========================================
        // 7. FINALIZAÇÃO DA BUSCA
        // ==========================================

        mensagemStatus.textContent = '';

        // Informa no console os dados recebidos.
        console.log('Personagem encontrado:', personagem);

    } catch (erro) {

        // Exibe o erro no console para facilitar a identificação.
        console.error('Erro na consulta da API:', erro);

        exibirMensagem(
            'Falha ao conectar com a API. Tente novamente.',
            'erro'
        );

        limparCampos();

    }

});


// ==========================================
// 8. FUNÇÃO PARA LIMPAR OS CAMPOS
// ==========================================

function limparCampos() {

    campoLogradouro.value = '';
    campoBairro.value = '';
    campoCidade.value = '';
    campoEstado.value = '';

    campoNumero.value = '';
    campoComplemento.value = '';

    campoPlaneta.value = '';
    campoDescricao.value = '';

    imagemPersonagem.src = '';
    imagemPersonagem.alt = 'Imagem do personagem';

}


// ==========================================
// 9. FUNÇÃO PARA MOSTRAR MENSAGENS
// ==========================================

function exibirMensagem(texto, tipo) {

    mensagemStatus.textContent = texto;

    mensagemStatus.className = `mensagem ${tipo}`;

}


// ==========================================
// 10. BOTÃO DE CONCLUIR
// ==========================================

botaoConcluir.addEventListener('click', () => {

    if (campoLogradouro.value === '') {

        alert('Primeiro pesquise um personagem!');

        return;

    }

    alert('Consulta do personagem concluída!');

});
