function obterAlunos() {
  return JSON.parse(localStorage.getItem("alunos")) || [];
}

function salvarAlunos(alunos) {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function formatarData(data) {
  if (!data) return "";

  const partes = data.split("-");
  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterUsuariosPadrao() {
  return [
    { usuario: "master", senha: "1234", tipo: "master", bloqueado: false },
    { usuario: "admin", senha: "admin123", tipo: "admin", bloqueado: false },
    {
      usuario: "funcionario",
      senha: "123",
      tipo: "funcionario",
      bloqueado: false,
    },
  ];
}

function obterUsuariosSistema() {
  let usuarios = JSON.parse(localStorage.getItem("usuariosSistema"));

  if (!usuarios || !Array.isArray(usuarios) || usuarios.length === 0) {
    usuarios = obterUsuariosPadrao();
    localStorage.setItem("usuariosSistema", JSON.stringify(usuarios));
  }

  return usuarios;
}

function salvarUsuariosSistema(usuarios) {
  localStorage.setItem("usuariosSistema", JSON.stringify(usuarios));
}

function obterCodigoSegurancaAtual() {
  let codigo = localStorage.getItem("codigoSegurancaSistema");

  if (!codigo) {
    codigo = "1234";
    localStorage.setItem("codigoSegurancaSistema", codigo);
  }

  return codigo;
}

function obterHistoricoAlunos() {
  return JSON.parse(localStorage.getItem("historicoAlunos")) || [];
}

function salvarHistoricoAlunos(historico) {
  localStorage.setItem("historicoAlunos", JSON.stringify(historico));
}

function registrarHistorico(acao, aluno, detalhes = "") {
  const historico = obterHistoricoAlunos();

  historico.unshift({
    data: new Date().toLocaleString("pt-BR"),
    acao: acao,
    aluno: aluno,
    detalhes: detalhes,
  });

  salvarHistoricoAlunos(historico);
}

let ultimoMomentoMensagem = 0;

function obterCaixaMensagem() {
  let caixa =
    document.getElementById("mensagem-cadastro") ||
    document.getElementById("mensagem-edicao") ||
    document.getElementById("mensagem-lista") ||
    document.getElementById("mensagem-perfil") ||
    document.getElementById("mensagem-senha") ||
    document.getElementById("erro-login") ||
    document.getElementById("mensagem-sistema");

  if (!caixa) {
    const container =
      document.querySelector(".login-box") ||
      document.querySelector(".container") ||
      document.querySelector(".perfil-card") ||
      document.querySelector("main");

    if (container) {
      caixa = document.createElement("p");
      caixa.id = "mensagem-sistema";
      caixa.className = "mensagem";

      const acoes = container.querySelector(
        ".acoes, .acoes-lista, .acoes-alterar-senha, .login-acoes",
      );

      if (acoes) {
        acoes.insertAdjacentElement("beforebegin", caixa);
      } else {
        container.appendChild(caixa);
      }
    }
  }

  return caixa;
}

function posicionarMensagemPerfil() {
  const mensagemPerfil = document.getElementById("mensagem-perfil");
  const perfilCard = document.querySelector(".perfil-card");

  if (!mensagemPerfil || !perfilCard) return;

  if (perfilCard.previousElementSibling !== mensagemPerfil) {
    perfilCard.insertAdjacentElement("beforebegin", mensagemPerfil);
  }
}

function mostrarMensagem(texto, tipo = "erro") {
  const caixa = obterCaixaMensagem();
  if (!caixa) return;

  if (caixa.id === "mensagem-perfil") {
    posicionarMensagemPerfil();
  }

  caixa.classList.remove("erro", "sucesso");
  caixa.classList.add("visivel", tipo === "sucesso" ? "sucesso" : "erro");
  caixa.innerText = texto;

  ultimoMomentoMensagem = Date.now();
}

function esconderMensagem() {
  const caixa =
    document.getElementById("mensagem-cadastro") ||
    document.getElementById("mensagem-edicao") ||
    document.getElementById("mensagem-lista") ||
    document.getElementById("mensagem-perfil") ||
    document.getElementById("mensagem-senha") ||
    document.getElementById("erro-login") ||
    document.getElementById("mensagem-sistema");

  if (caixa) {
    caixa.classList.remove("visivel", "erro", "sucesso");
  }
}

function exibirMensagemElemento(elemento, texto, tipo = "erro") {
  if (!elemento) return;

  elemento.classList.remove("erro", "sucesso");
  elemento.classList.add("visivel", tipo === "sucesso" ? "sucesso" : "erro");
  elemento.innerText = texto;
  ultimoMomentoMensagem = Date.now();
}

function ocultarMensagemElemento(elemento) {
  if (!elemento) return;

  elemento.classList.remove("visivel", "erro", "sucesso");
}

function atualizarStatusElemento(elemento, tipo) {
  if (!elemento) return;

  elemento.classList.remove("ativo", "bloqueado");
  elemento.classList.add("status-admin", tipo);
}

function fecharSelectsCustomizados(selectAtual = null) {
  document.querySelectorAll(".select-personalizado.aberto").forEach((select) => {
    if (select === selectAtual) return;

    select.classList.remove("aberto");
    const botao = select.querySelector(".select-personalizado-botao");
    if (botao) botao.setAttribute("aria-expanded", "false");
  });
}

function atualizarSelectCustomizado(select) {
  if (!select) return;

  const input = select.querySelector("input[type='hidden']");
  const texto = select.querySelector("[data-select-text]");
  const opcoes = select.querySelectorAll("[data-action='selecionar-opcao-custom']");
  const valor = input ? input.value : "";
  const opcaoSelecionada = Array.from(opcoes).find(
    (opcao) => opcao.dataset.value === valor,
  );

  opcoes.forEach((opcao) => {
    const selecionada = opcao === opcaoSelecionada;
    opcao.classList.toggle("selecionado", selecionada);
    opcao.setAttribute("aria-selected", String(selecionada));
  });

  if (texto && opcaoSelecionada) {
    texto.innerText = opcaoSelecionada.innerText;
  } else if (texto) {
    texto.innerText = select.dataset.placeholder || "";
  }
}

function atualizarSelectsCustomizados() {
  document.querySelectorAll("[data-select-custom]").forEach((select) => {
    atualizarSelectCustomizado(select);
  });
}

function alternarSelectCustomizado(botao) {
  const select = botao.closest("[data-select-custom]");
  if (!select) return;

  const vaiAbrir = !select.classList.contains("aberto");
  fecharSelectsCustomizados(select);
  select.classList.toggle("aberto", vaiAbrir);
  botao.setAttribute("aria-expanded", String(vaiAbrir));
}

function selecionarOpcaoCustomizada(opcao) {
  const select = opcao.closest("[data-select-custom]");
  if (!select) return;

  const input = select.querySelector("input[type='hidden']");
  const texto = select.querySelector("[data-select-text]");
  const botao = select.querySelector(".select-personalizado-botao");

  if (input) input.value = opcao.dataset.value || "";
  if (texto) texto.innerText = opcao.innerText;

  select.querySelectorAll("[data-action='selecionar-opcao-custom']").forEach((item) => {
    const selecionado = item === opcao;
    item.classList.toggle("selecionado", selecionado);
    item.setAttribute("aria-selected", String(selecionado));
  });

  select.classList.remove("aberto");
  if (botao) {
    botao.setAttribute("aria-expanded", "false");
    botao.focus();
  }
}

function tratarTeclaSelectCustomizado(event) {
  if (event.key === "Escape") {
    fecharMenusRapidos();
  }

  const select = event.target.closest("[data-select-custom]");
  if (!select) return;

  const botao = select.querySelector(".select-personalizado-botao");
  const opcoes = Array.from(
    select.querySelectorAll("[data-action='selecionar-opcao-custom']"),
  );
  const indiceAtual = opcoes.indexOf(event.target);

  if (event.key === "Escape") {
    fecharSelectsCustomizados();
    if (botao) botao.focus();
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (botao && event.target === botao) {
      alternarSelectCustomizado(botao);
      if (opcoes[0]) opcoes[0].focus();
    } else if (indiceAtual >= 0 && opcoes[indiceAtual + 1]) {
      opcoes[indiceAtual + 1].focus();
    }
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (indiceAtual > 0) {
      opcoes[indiceAtual - 1].focus();
    } else if (botao) {
      botao.focus();
    }
  }
}

function cadastrar() {
  const nomeInput = document.getElementById("nome");
  const dataInput = document.getElementById("dataNascimento");
  const telefoneInput = document.getElementById("telefone");
  const cpfInput = document.getElementById("cpf");
  const planoInput = document.getElementById("plano");
  const pagamentoInput = document.getElementById("pagamento");

  if (
    !nomeInput ||
    !dataInput ||
    !telefoneInput ||
    !cpfInput ||
    !planoInput ||
    !pagamentoInput
  ) {
    mostrarMensagem("Os campos do cadastro não foram encontrados na tela.");
    return;
  }

  const nome = nomeInput.value.trim();
  const dataNascimento = dataInput.value;
  const telefone = telefoneInput.value.trim();
  const cpf = cpfInput.value.trim();
  const plano = planoInput.value;
  const pagamento = pagamentoInput.value;

  if (
    nome === "" ||
    dataNascimento === "" ||
    telefone === "" ||
    cpf === "" ||
    plano === "" ||
    pagamento === ""
  ) {
    mostrarMensagem("Preencha todos os campos.");
    return;
  }

  if (!validarCPF(cpf)) {
    mostrarMensagem("CPF inválido.");
    return;
  }

  const alunos = obterAlunos();

  const aluno = {
    nome: nome,
    dataNascimento: dataNascimento,
    telefone: telefone,
    cpf: cpf,
    plano: plano,
    pagamento: pagamento,
    foto: "",
  };

  alunos.push(aluno);
  salvarAlunos(alunos);

  registrarHistorico("Cadastro", nome, "Aluno cadastrado no sistema.");

  mostrarMensagem("Aluno cadastrado com sucesso!", "sucesso");

  nomeInput.value = "";
  dataInput.value = "";
  telefoneInput.value = "";
  cpfInput.value = "";
  planoInput.value = "";
  pagamentoInput.value = "";
  atualizarSelectsCustomizados();
}

function carregarLista() {
  const tabela = document.getElementById("listaAlunos");
  if (!tabela) return;

  const alunos = obterAlunos();
  tabela.innerHTML = "";

  alunos.forEach((aluno, index) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
    <td data-label="N.">${index + 1}</td>
    <td data-label="Nome">${aluno.nome}</td>
    <td data-label="Data de nascimento">${formatarData(aluno.dataNascimento)}</td>
    <td data-label="Telefone">${aluno.telefone || ""}</td>
    <td data-label="CPF">${aluno.cpf}</td>
    <td data-label="Plano">${aluno.plano}</td>
    <td data-label="Pagamento">${aluno.pagamento}</td>
            <td data-label="Ações">
                    <div class="acoes-menu">
                    <button type="button" class="btn-tres-pontos" data-action="toggle-menu-acao">...</button>

                    <div class="menu-acoes-dropdown">
                        <button type="button" class="btn-perfil" data-action="ver-perfil" data-index="${index}">Visualizar perfil</button>
                        <button type="button" class="btn-editar" data-action="editar-aluno" data-index="${index}">Editar</button>
                        <button type="button" class="btn-excluir" data-action="excluir-aluno" data-index="${index}">Excluir</button>
                    </div>
                </div>
            </td>
        `;

    tabela.appendChild(linha);
  });
}

function executarInicializacaoPagina() {
  const pagina = document.body.dataset.page;

  if (!pagina) return;

  const paginasProtegidas = [
    "cadastro",
    "lista",
    "editar",
    "menu",
    "master",
    "historico",
    "relatorio-documento",
    "codigo-seguranca",
    "perfil",
  ];

  if (paginasProtegidas.includes(pagina)) {
    if (!verificarLogin()) return;
  }

  if (pagina === "lista") carregarLista();
  if (pagina === "editar") carregarAlunoParaEdicao();
  if (pagina === "menu") configurarMenuMaster();
  if (pagina === "master") {
    verificarMaster();
    carregarStatusAdmin();
  }
  if (pagina === "historico") {
    verificarMaster();
    carregarHistoricoAlunos();
    carregarGraficosRelatorio();
  }
  if (pagina === "relatorio-documento") {
    verificarMaster();
    carregarDocumentoRelatorio();
  }
  if (pagina === "codigo-seguranca") {
    verificarMaster();
    preencherCodigoAtual();
  }
  if (pagina === "perfil") carregarPerfil();

  configurarNavegacaoRapida(pagina);
}

function inicializarVLibras() {
  if (window.VLibras && window.VLibras.Widget) {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  }
}

function atualizarControlesFotoPerfil() {
  const foto = document.getElementById("fotoAluno");
  const icone = document.getElementById("iconePadrao");
  const botaoExcluir = document.querySelector(".btn-excluir-foto");

  if (!foto || !icone) return;

  const temFoto = foto.getAttribute("src") && foto.classList.contains("foto-visivel");

  if (temFoto) {
    icone.hidden = true;
    if (botaoExcluir) botaoExcluir.hidden = false;
  } else {
    icone.hidden = false;
    if (botaoExcluir) botaoExcluir.hidden = true;
  }
}

function controlarIconePerfil() {
  const foto = document.getElementById("fotoAluno");

  if (!foto) return;

  atualizarControlesFotoPerfil();

  foto.addEventListener("load", function () {
    atualizarControlesFotoPerfil();
  });

  foto.addEventListener("error", function () {
    atualizarControlesFotoPerfil();
  });
}

function tratarCliqueAcao(event) {
  const elemento = event.target.closest("[data-action], [data-href]");
  if (!elemento) return;

  const destino = elemento.dataset.href;
  if (destino) {
    window.location.href = destino;
    return;
  }

  const index = Number(elemento.dataset.index);

  switch (elemento.dataset.action) {
    case "logout":
      abrirConfirmacaoSaida();
      break;
    case "fechar-confirmacao-saida":
      fecharConfirmacaoSaida();
      break;
    case "confirmar-logout":
      logout();
      break;
    case "cadastrar":
      cadastrar();
      break;
    case "salvar-edicao":
      salvarEdicao();
      break;
    case "toggle-senha":
      toggleSenha(elemento.dataset.target, elemento);
      break;
    case "toggle-ajuda-senha":
      toggleAjudaSenha(event, elemento);
      break;
    case "esqueci-senha":
      esqueciSenha();
      break;
    case "remover-foto":
      removerFoto();
      break;
    case "toggle-bloqueio-admin":
      toggleBloqueioAdmin();
      break;
    case "gerar-documento-relatorio":
      gerarDocumentoRelatorio();
      break;
    case "imprimir-relatorio":
      window.print();
      break;
    case "alternar-menu-rapido":
      alternarMenuRapido(elemento);
      break;
    case "toggle-menu-acao":
      toggleMenuAcao(elemento);
      break;
    case "alternar-select-custom":
      alternarSelectCustomizado(elemento);
      break;
    case "selecionar-opcao-custom":
      selecionarOpcaoCustomizada(elemento);
      break;
    case "ver-perfil":
      verPerfil(index);
      break;
    case "editar-aluno":
      editarAluno(index);
      break;
    case "excluir-aluno":
      excluirAluno(index);
      break;
  }
}

function alternarMenuRapido(botao) {
  const navegacao = botao.closest(".navegacao-rapida");
  if (!navegacao) return;

  document.querySelectorAll(".navegacao-rapida.aberto").forEach((menuAberto) => {
    if (menuAberto !== navegacao) {
      menuAberto.classList.remove("aberto");
      const botaoAberto = menuAberto.querySelector(".btn-menu-hamburguer");
      const opcoesAbertas = menuAberto.querySelector(".menu-rapido-opcoes");
      if (botaoAberto) botaoAberto.setAttribute("aria-expanded", "false");
      if (opcoesAbertas) opcoesAbertas.setAttribute("aria-hidden", "true");
      if (botaoAberto === document.activeElement) botaoAberto.blur();
    }
  });

  const aberto = navegacao.classList.toggle("aberto");
  const opcoes = navegacao.querySelector(".menu-rapido-opcoes");

  botao.setAttribute("aria-expanded", String(aberto));
  if (opcoes) opcoes.setAttribute("aria-hidden", String(!aberto));
  if (!aberto) botao.blur();
}

function fecharMenusRapidos() {
  document.querySelectorAll(".navegacao-rapida.aberto").forEach((navegacao) => {
    navegacao.classList.remove("aberto");
    const botao = navegacao.querySelector(".btn-menu-hamburguer");
    const opcoes = navegacao.querySelector(".menu-rapido-opcoes");
    if (botao) botao.setAttribute("aria-expanded", "false");
    if (opcoes) opcoes.setAttribute("aria-hidden", "true");
    if (botao === document.activeElement) botao.blur();
  });
}

function abrirConfirmacaoSaida() {
  const modal = document.getElementById("confirmacao-saida");

  if (!modal) {
    logout();
    return;
  }

  modal.showModal();
}

function fecharConfirmacaoSaida() {
  const modal = document.getElementById("confirmacao-saida");

  if (modal && modal.open) {
    modal.close();
  }
}

function toggleMenuAcao(botao) {
  const menuAtual = botao.nextElementSibling;

  document.querySelectorAll(".menu-acoes-dropdown.aberto").forEach((menu) => {
    if (menu !== menuAtual) {
      menu.classList.remove("aberto");
    }
  });

  menuAtual.classList.toggle("aberto");
}

document.addEventListener("click", function (e) {
  const navegacaoRapida = e.target.closest(".navegacao-rapida");

  if (!navegacaoRapida) {
    fecharMenusRapidos();
  }

  if (!e.target.closest("[data-select-custom]")) {
    fecharSelectsCustomizados();
  }

  if (e.target.classList.contains("modal-saida")) {
    fecharConfirmacaoSaida();
  }

  if (!e.target.closest(".linha-senha")) {
    document.querySelectorAll(".ajuda-criterios").forEach((b) => {
      b.classList.remove("ativo");
    });
  }

  if (!e.target.closest(".acoes-menu")) {
    document.querySelectorAll(".menu-acoes-dropdown.aberto").forEach((menu) => {
      menu.classList.remove("aberto");
    });
  }

  const caixa =
    document.getElementById("mensagem-cadastro") ||
    document.getElementById("mensagem-edicao") ||
    document.getElementById("mensagem-lista") ||
    document.getElementById("mensagem-perfil") ||
    document.getElementById("mensagem-senha") ||
    document.getElementById("erro-login") ||
    document.getElementById("mensagem-sistema");

  if (!caixa) return;

  if (
    caixa.classList.contains("visivel") &&
    Date.now() - ultimoMomentoMensagem > 150
  ) {
    esconderMensagem();
  }
});

function verPerfil(index) {
  localStorage.setItem("alunoPerfil", index);
  window.location.href = "perfil.html";
}

function carregarPerfil() {
  const alunos = obterAlunos();
  const index = localStorage.getItem("alunoPerfil");

  if (index === null || !alunos[index]) return;

  const aluno = alunos[index];

  document.getElementById("perfilNome").innerText = aluno.nome;
  document.getElementById("perfilData").innerText = formatarData(
    aluno.dataNascimento,
  );
  document.getElementById("perfilTelefone").innerText = aluno.telefone || "-";
  document.getElementById("perfilCpf").innerText = aluno.cpf;
  document.getElementById("perfilPlano").innerText = aluno.plano;
  document.getElementById("perfilPagamento").innerText = aluno.pagamento;

  const foto = document.getElementById("fotoAluno");
  const botaoExcluir = document.querySelector(".btn-excluir-foto");

  if (foto) {
    if (aluno.foto && aluno.foto.trim() !== "") {
      foto.src = aluno.foto;
      foto.classList.add("foto-visivel");
      if (botaoExcluir) botaoExcluir.hidden = false;
    } else {
      foto.src = "";
      foto.classList.remove("foto-visivel");
      if (botaoExcluir) botaoExcluir.hidden = true;
    }
  }

  posicionarMensagemPerfil();
}

function salvarFoto() {
  const alunos = obterAlunos();
  const index = localStorage.getItem("alunoPerfil");
  const input = document.getElementById("inputFoto");
  const foto = document.getElementById("fotoAluno");

  if (index === null || !alunos[index] || !input.files[0] || !foto) {
    mostrarMensagem("Selecione uma foto para continuar.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    alunos[index].foto = reader.result;
    salvarAlunos(alunos);

    foto.src = reader.result;
    foto.classList.add("foto-visivel");
    input.value = "";
    atualizarControlesFotoPerfil();

    registrarHistorico(
      "Foto adicionada",
      alunos[index].nome,
      "Foto do perfil adicionada.",
    );

    mostrarMensagem("Foto adicionada com sucesso!", "sucesso");
  };

  reader.readAsDataURL(input.files[0]);
}

function editarAluno(index) {
  localStorage.setItem("alunoEditando", index);
  window.location.href = "editar.html";
}

function carregarAlunoParaEdicao() {
  const alunos = obterAlunos();
  const index = localStorage.getItem("alunoEditando");

  if (index === null || !alunos[index]) return;

  const aluno = alunos[index];

  document.getElementById("nome").value = aluno.nome;
  document.getElementById("dataNascimento").value = formatarData(aluno.dataNascimento);
  document.getElementById("telefone").value = aluno.telefone || "";
  document.getElementById("cpf").value = aluno.cpf;
  document.getElementById("plano").value = aluno.plano;
  document.getElementById("pagamento").value = aluno.pagamento;
  atualizarSelectsCustomizados();
}

function salvarEdicao() {
  const alunos = obterAlunos();
  const index = localStorage.getItem("alunoEditando");

  if (index === null || !alunos[index]) return;

  const nome = document.getElementById("nome").value.trim();
  const dataNascimento = document.getElementById("dataNascimento").value;
  const telefone = document.getElementById("telefone").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const plano = document.getElementById("plano").value;
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !dataNascimento || !telefone || !cpf || !plano || !pagamento) {
    mostrarMensagem("Preencha todos os campos.");
    return;
  }

  if (!validarCPF(cpf)) {
    mostrarMensagem("CPF inválido.");
    return;
  }

  alunos[index] = {
    ...alunos[index],
    nome,
    dataNascimento,
    telefone,
    cpf,
    plano,
    pagamento,
  };

  salvarAlunos(alunos);
  registrarHistorico("Edição", nome, "Dados do aluno atualizados.");

  mostrarMensagem("Aluno atualizado com sucesso!", "sucesso");
}

function excluirAluno(index) {
  const alunos = obterAlunos();

  if (!alunos[index]) {
    mostrarMensagem("Aluno não encontrado.");
    return;
  }

  const nomeAluno = alunos[index].nome;

  alunos.splice(index, 1);
  salvarAlunos(alunos);

  registrarHistorico("Exclusão", nomeAluno, "Aluno removido do sistema.");

  carregarLista();
  mostrarMensagem("Aluno excluído com sucesso!", "sucesso");
}

function buscar() {
  const campoBusca = document.getElementById("busca");
  const linhas = document.querySelectorAll("#listaAlunos tr");

  const filtro = campoBusca.value.toLowerCase();

  linhas.forEach((linha) => {
    const texto = linha.innerText.toLowerCase();
    linha.hidden = !texto.includes(filtro);
  });
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11) return false;
  if (/^(.)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro-login");

  if (usuario.trim() === "" || senha.trim() === "") {
    exibirMensagemElemento(erro, "Preencha todos os campos.");
    return;
  }

  const usuarios = obterUsuariosSistema();

  const usuarioEncontrado = usuarios.find(
    (u) => u.usuario === usuario && u.senha === senha,
  );

  if (!usuarioEncontrado) {
    if (erro) {
      erro.classList.remove("sucesso");
      erro.classList.add("visivel", "erro");
      erro.innerText =
        "Usuário ou senha incorretos. Verifique as informações e tente novamente.";
      ultimoMomentoMensagem = Date.now();
    }
    return;
  }

  if (usuarioEncontrado.bloqueado) {
    if (erro) {
      erro.classList.remove("sucesso");
      erro.classList.add("visivel", "erro");
      erro.innerText =
        "Este usuário está bloqueado. Entre em contato com o suporte para mais informações.";
      ultimoMomentoMensagem = Date.now();
    }
    return;
  }

  ocultarMensagemElemento(erro);

  localStorage.setItem("usuarioLogado", usuarioEncontrado.tipo);
  localStorage.setItem("usuarioNomeLogado", usuarioEncontrado.usuario);

  window.location.href = "menu.html";
}

function esqueciSenha() {
  window.location.href = "alterar-senha.html";
}

function validarCredencialForte(valor) {
  if (valor.length < 8) {
    return "A nova senha ou o código deve ter no mínimo 8 caracteres.";
  }

  const numeros = valor.match(/\d/g) || [];
  if (numeros.length < 2) {
    return "A nova senha ou o código deve ter no mínimo 2 números.";
  }

  const especiais = valor.match(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'~`]/g) || [];
  if (especiais.length < 1) {
    return "A nova senha ou o código deve ter no mínimo 1 caractere especial.";
  }

  if (!/[A-Z]/.test(valor)) {
    return "A nova senha ou o código deve ter no mínimo 1 letra maiúscula.";
  }

  if (!/[a-z]/.test(valor)) {
    return "A nova senha ou o código deve ter no mínimo 1 letra minúscula.";
  }

  return "";
}

function alterarSenha() {
  const usuarioInput = document.getElementById("usuario-recuperacao");
  const codigoInput = document.getElementById("codigo-seguranca");
  const novaSenhaInput = document.getElementById("nova-senha");
  const confirmarSenhaInput = document.getElementById("confirmar-senha");
  const mensagem = document.getElementById("mensagem-senha");

  if (
    !usuarioInput ||
    !codigoInput ||
    !novaSenhaInput ||
    !confirmarSenhaInput ||
    !mensagem
  ) {
    mostrarMensagem(
      "Os campos da tela de alteração de senha não foram encontrados.",
    );
    return;
  }

  const usuario = usuarioInput.value.trim();
  const codigo = codigoInput.value.trim();
  const novaSenha = novaSenhaInput.value;
  const confirmarSenha = confirmarSenhaInput.value;

  const usuarios = obterUsuariosSistema();
  const codigoSistema = obterCodigoSegurancaAtual();

  mensagem.classList.add("visivel");
  ultimoMomentoMensagem = Date.now();

  if (
    usuario === "" ||
    codigo === "" ||
    novaSenha === "" ||
    confirmarSenha === ""
  ) {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "Preencha todos os campos.";
    return;
  }

  if (codigo !== codigoSistema) {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "Código de segurança inválido.";
    return;
  }

  const usuarioIndex = usuarios.findIndex((u) => u.usuario === usuario);

  if (usuarioIndex === -1) {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "Usuário não encontrado.";
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "As senhas não coincidem.";
    return;
  }

  const erroForcaSenha = validarCredencialForte(novaSenha);

  if (erroForcaSenha !== "") {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = erroForcaSenha;
    return;
  }

  usuarios[usuarioIndex].senha = novaSenha;
  salvarUsuariosSistema(usuarios);

  mensagem.classList.remove("erro");
  mensagem.classList.add("sucesso");
  mensagem.innerText = "Senha alterada com sucesso!";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
}

function esconderErro() {
  const erro = document.getElementById("erro-login");
  ocultarMensagemElemento(erro);
}

function toggleAjudaSenha(event, icone) {
  event.stopPropagation();

  const linha = icone.closest(".linha-senha");
  const balao = linha.querySelector(".ajuda-criterios");

  document.querySelectorAll(".ajuda-criterios").forEach((b) => {
    if (b !== balao) b.classList.remove("ativo");
  });

  balao.classList.toggle("ativo");
}

function toggleSenha(id, elemento) {
  const input = document.getElementById(id);

  if (!input || !elemento) return;

  if (input.type === "password") {
    input.type = "text";
    elemento.classList.remove("bi-eye-slash");
    elemento.classList.add("bi-eye");
  } else {
    input.type = "password";
    elemento.classList.remove("bi-eye");
    elemento.classList.add("bi-eye-slash");
  }
}

function verificarLogin() {
  const usuario = localStorage.getItem("usuarioLogado");

  if (!usuario) {
    window.location.href = "login.html";
    return false;
  }

  document.body.dataset.autorizado = "true";
  return true;
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  executarInicializacaoPagina();
  atualizarSelectsCustomizados();
  document.addEventListener("click", tratarCliqueAcao);
  document.addEventListener("keydown", tratarTeclaSelectCustomizado);

  const formLogin = document.getElementById("form-login");
  const formAlterarSenha = document.getElementById("form-alterar-senha");
  const formCodigoSeguranca = document.getElementById("form-codigo-seguranca");
  const buscaInput = document.getElementById("busca");
  const inputFoto = document.getElementById("inputFoto");

  if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
      event.preventDefault();
      login();
    });
  }

  if (formAlterarSenha) {
    formAlterarSenha.addEventListener("submit", function (event) {
      event.preventDefault();
      alterarSenha();
    });
  }

  if (formCodigoSeguranca) {
    formCodigoSeguranca.addEventListener("submit", function (event) {
      event.preventDefault();
      salvarNovoCodigoSeguranca();
    });
  }

  if (buscaInput) {
    buscaInput.addEventListener("keyup", buscar);
  }

  if (inputFoto) {
    inputFoto.addEventListener("change", salvarFoto);
  }

  controlarIconePerfil();
  inicializarVLibras();

  const dataNascimentoInput = document.getElementById("dataNascimento");

  if (dataNascimentoInput) {
    dataNascimentoInput.addEventListener("input", function (e) {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length > 8) {
        valor = valor.slice(0, 8);
      }

      if (valor.length > 4) {
        valor = valor.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
      } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }

      e.target.value = valor;
    });
  }

  obterUsuariosSistema();
  obterCodigoSegurancaAtual();

  document.querySelectorAll(".menu-rapido-opcoes").forEach((menu) => {
    menu.setAttribute("aria-hidden", "true");
  });

  const cpfInput = document.getElementById("cpf");
  const campoUsuario = document.getElementById("usuario");
  const campoSenha = document.getElementById("senha");
  const telefoneInput = document.getElementById("telefone");

  posicionarMensagemPerfil();

  if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      e.target.value = valor;
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", function (e) {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length === 0) {
        e.target.value = "";
        return;
      }

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      if (valor.length > 6) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
      } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{1,5})/, "($1) $2");
      } else {
        valor = valor.replace(/(\d{1,2})/, "($1");
      }

      e.target.value = valor;
    });
  }

  if (campoUsuario) {
    campoUsuario.addEventListener("input", esconderErro);
  }

  if (campoSenha) {
    campoSenha.addEventListener("input", esconderErro);
  }
});

function removerFoto() {
  const alunos = obterAlunos();
  const index = localStorage.getItem("alunoPerfil");
  const foto = document.getElementById("fotoAluno");
  const input = document.getElementById("inputFoto");

  if (index === null || !alunos[index] || !foto) return;

  const nomeAluno = alunos[index].nome;

  alunos[index].foto = "";
  salvarAlunos(alunos);

  foto.src = "";
  foto.classList.remove("foto-visivel");
  if (input) input.value = "";
  atualizarControlesFotoPerfil();

  registrarHistorico("Foto removida", nomeAluno, "Foto do perfil removida.");

  mostrarMensagem("Foto removida com sucesso!", "sucesso");
}
function configurarMenuMaster() {
  const usuario = localStorage.getItem("usuarioLogado");
  const opcaoMaster = document.getElementById("opcao-master");

  if (!opcaoMaster) return;

  if (usuario === "master") {
    opcaoMaster.classList.remove("opcao-oculta");
  } else {
    opcaoMaster.classList.add("opcao-oculta");
  }
}

function configurarNavegacaoRapida(paginaAtual) {
  const usuario = localStorage.getItem("usuarioLogado");
  const paginaNavegacao = paginaAtual === "relatorio-documento" ? "historico" : paginaAtual;

  document.querySelectorAll(".navegacao-rapida [data-nav-page]").forEach((botao) => {
    if (botao.dataset.navPage === paginaNavegacao) {
      botao.hidden = true;
    } else {
      botao.hidden = false;
    }
  });

  document.querySelectorAll(".navegacao-rapida .nav-master").forEach((item) => {
    item.hidden = usuario !== "master";
  });
}

function verificarMaster() {
  const usuario = localStorage.getItem("usuarioLogado");

  if (usuario !== "master") {
    window.location.href = "menu.html";
  }
}

function carregarStatusAdmin() {
  const usuarios = obterUsuariosSistema();
  const admin = usuarios.find((u) => u.usuario === "admin");
  const status = document.getElementById("status-admin");

  if (!status || !admin) return;

  status.innerText = admin.bloqueado ? "Status: BLOQUEADO" : "Status: ATIVO";
  atualizarStatusElemento(status, admin.bloqueado ? "bloqueado" : "ativo");
}

function toggleBloqueioAdmin() {
  const usuarios = obterUsuariosSistema();
  const adminIndex = usuarios.findIndex((u) => u.usuario === "admin");
  const mensagem = document.getElementById("mensagem-master");

  if (adminIndex === -1) return;

  usuarios[adminIndex].bloqueado = !usuarios[adminIndex].bloqueado;
  salvarUsuariosSistema(usuarios);

  carregarStatusAdmin();

  if (mensagem) {
    mensagem.classList.add("visivel");
    mensagem.classList.remove("erro", "sucesso");
    mensagem.classList.add(usuarios[adminIndex].bloqueado ? "erro" : "sucesso");
    mensagem.innerText = usuarios[adminIndex].bloqueado
      ? "O usuário admin foi bloqueado com sucesso!"
      : "O usuário admin foi desbloqueado com sucesso!";
  }
}

function carregarHistoricoAlunos() {
  const tabela = document.getElementById("tabelaHistorico");
  if (!tabela) return;

  const historico = obterHistoricoAlunos();
  tabela.innerHTML = "";

  if (historico.length === 0) {
    tabela.innerHTML = `<tr><td colspan="5">Nenhum histórico encontrado.</td></tr>`;
    return;
  }

  historico.forEach((item, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td data-label="Nº">${index + 1}</td>
            <td data-label="Data">${item.data}</td>
            <td data-label="Ação">${item.acao}</td>
            <td data-label="Aluno">${item.aluno}</td>
            <td data-label="Detalhes">${item.detalhes}</td>
        `;
    tabela.appendChild(linha);
  });
}

function preencherCodigoAtual() {
  const campo = document.getElementById("codigo-atual-master");
  if (!campo) return;

  campo.value = obterCodigoSegurancaAtual();
}

function salvarNovoCodigoSeguranca() {
  const novoCodigo = document.getElementById("novo-codigo-master");
  const confirmarCodigo = document.getElementById("confirmar-codigo-master");
  const mensagem = document.getElementById("mensagem-codigo");

  if (!novoCodigo || !confirmarCodigo || !mensagem) return;

  const codigo1 = novoCodigo.value.trim();
  const codigo2 = confirmarCodigo.value.trim();

  mensagem.classList.add("visivel");

  if (codigo1 === "" || codigo2 === "") {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "Preencha todos os campos.";
    return;
  }

  if (codigo1 !== codigo2) {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = "Os códigos não coincidem.";
    return;
  }

  const erroForcaCodigo = validarCredencialForte(codigo1);

  if (erroForcaCodigo !== "") {
    mensagem.classList.remove("sucesso");
    mensagem.classList.add("erro");
    mensagem.innerText = erroForcaCodigo;
    return;
  }

  localStorage.setItem("codigoSegurancaSistema", codigo1);

  mensagem.classList.remove("erro");
  mensagem.classList.add("sucesso");
  mensagem.innerText = "Código de segurança alterado com sucesso!";

  preencherCodigoAtual();
  novoCodigo.value = "";
  confirmarCodigo.value = "";
}
function contarPorCampo(alunos, campo) {
  const contagem = {};

  alunos.forEach((aluno) => {
    const valor = aluno[campo] || "Não informado";

    if (!contagem[valor]) {
      contagem[valor] = 0;
    }

    contagem[valor]++;
  });

  return contagem;
}

function gerarGraficoBarras(idElemento, dados, total) {
  const area = document.getElementById(idElemento);
  if (!area) return;

  area.innerHTML = "";

  if (total === 0) {
    area.innerHTML =
      "<p class='texto-centro'>Nenhum aluno cadastrado.</p>";
    return;
  }

  Object.keys(dados).forEach((nome) => {
    const quantidade = dados[nome];
    const porcentagem = ((quantidade / total) * 100).toFixed(1);

    const item = document.createElement("div");
    item.className = "barra-item";

    item.innerHTML = `
            <div class="barra-info">
                <span>${nome}</span>
                <span>${porcentagem}%</span>
            </div>

            <div class="barra-fundo">
                <progress class="barra-preenchida" value="${porcentagem}" max="100"></progress>
            </div>
        `;

    area.appendChild(item);
  });
}

function obterMaiorCategoria(dados) {
  let maiorNome = "-";
  let maiorValor = 0;

  Object.keys(dados).forEach((nome) => {
    if (dados[nome] > maiorValor) {
      maiorValor = dados[nome];
      maiorNome = nome;
    }
  });

  return {
    nome: maiorNome,
    quantidade: maiorValor,
  };
}

function formatarQuantidadeAlunos(quantidade) {
  return quantidade === 1 ? "1 aluno" : `${quantidade} alunos`;
}

function carregarGraficosRelatorio() {
  const alunos = obterAlunos();

  const total = alunos.length;

  const relatorioTotal = document.getElementById("relatorioTotal");

  if (relatorioTotal) {
    relatorioTotal.innerText = `Total de alunos cadastrados: ${total}`;
  }
  const pagamentos = contarPorCampo(alunos, "pagamento");
  const planos = contarPorCampo(alunos, "plano");

  gerarGraficoBarras("graficoPagamentos", pagamentos, total);
  gerarGraficoBarras("graficoPlanos", planos, total);

  const maiorPagamento = obterMaiorCategoria(pagamentos);
  const maiorPlano = obterMaiorCategoria(planos);

  const relatorioPagamento = document.getElementById("relatorioPagamento");
  const relatorioPlano = document.getElementById("relatorioPlano");

  if (total === 0) {
    if (relatorioPagamento)
      relatorioPagamento.innerText =
        "Nenhum aluno cadastrado para análise de pagamento.";
    if (relatorioPlano)
      relatorioPlano.innerText =
        "Nenhum aluno cadastrado para análise de plano.";
    if (relatorioTotal) {
      relatorioTotal.innerText = "Total de alunos cadastrados: 0";
    }
    return;
  }

  if (relatorioPagamento) {
    relatorioPagamento.innerText = `Forma de pagamento mais utilizada: ${maiorPagamento.nome} (${formatarQuantidadeAlunos(maiorPagamento.quantidade)}).`;
  }

  if (relatorioPlano) {
    relatorioPlano.innerText = `Plano com mais alunos: ${maiorPlano.nome} (${formatarQuantidadeAlunos(maiorPlano.quantidade)}).`;
  }
}
function adicionarCelulaTabela(linha, texto, label = "") {
  const celula = document.createElement("td");
  if (label) celula.dataset.label = label;
  celula.innerText = texto;
  linha.appendChild(celula);
}

function carregarDocumentoRelatorio() {
  const alunos = obterAlunos();
  const historico = obterHistoricoAlunos();
  const total = alunos.length;
  const pagamentos = contarPorCampo(alunos, "pagamento");
  const planos = contarPorCampo(alunos, "plano");
  const maiorPagamento = obterMaiorCategoria(pagamentos);
  const maiorPlano = obterMaiorCategoria(planos);
  const dataGeracao = document.getElementById("documentoDataGeracao");
  const totalAlunos = document.getElementById("documentoTotal");
  const pagamento = document.getElementById("documentoPagamento");
  const plano = document.getElementById("documentoPlano");
  const tabela = document.getElementById("documentoHistorico");

  if (dataGeracao) {
    dataGeracao.innerText = new Date().toLocaleString("pt-BR");
  }

  if (totalAlunos) {
    totalAlunos.innerText = `Total de alunos cadastrados: ${total}`;
  }

  if (total === 0) {
    if (pagamento) {
      pagamento.innerText = "Nenhum aluno cadastrado para análise de pagamento.";
    }

    if (plano) {
      plano.innerText = "Nenhum aluno cadastrado para análise de plano.";
    }
  } else if (pagamento) {
    pagamento.innerText = `Forma de pagamento mais utilizada: ${maiorPagamento.nome} (${formatarQuantidadeAlunos(maiorPagamento.quantidade)}).`;
  }

  if (total > 0 && plano) {
    plano.innerText = `Plano com mais alunos: ${maiorPlano.nome} (${formatarQuantidadeAlunos(maiorPlano.quantidade)}).`;
  }

  if (tabela) {
    tabela.innerHTML = "";

    if (historico.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 5;
      celula.innerText = "Nenhum histórico encontrado.";
      linha.appendChild(celula);
      tabela.appendChild(linha);
    } else {
      historico.forEach((item, index) => {
        const linha = document.createElement("tr");
        adicionarCelulaTabela(linha, index + 1, "Nº");
        adicionarCelulaTabela(linha, item.data, "Data");
        adicionarCelulaTabela(linha, item.acao, "Ação");
        adicionarCelulaTabela(linha, item.aluno, "Aluno");
        adicionarCelulaTabela(linha, item.detalhes, "Detalhes");
        tabela.appendChild(linha);
      });
    }
  }

}

function gerarDocumentoRelatorio() {
  window.open("relatorio.html", "_blank");
}
