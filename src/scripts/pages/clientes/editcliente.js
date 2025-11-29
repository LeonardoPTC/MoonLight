window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

     const sidebar = document.querySelector(".sidebar")
  const content = document.querySelector("#content");
  const telaPequena = window.matchMedia("(max-width: 1366px)");

  if (sidebar) {

    const aplicarMargens = (expandida) => {
      if (telaPequena.matches) {
        content.style.marginLeft = expandida ? "200px" : "150px";
        content.style.marginRight = expandida ? "90px" : "120px";

      } else {
        content.style.marginLeft = expandida ? "270px" : "200px";
      }
    };

    if (sidebar.matches(':hover')) {
      aplicarMargens(true);
    }

    sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
    sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
  }

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.setAttribute('disabled', 'true'));

  const id = localStorage.getItem("idCliente");
  if (id) carregarCliente(id);
});

function habilitarDivFisica() {
  document.querySelectorAll('#pessoaFisica input, #pessoaFisica select')
    .forEach(el => el.disabled = false);
  document.querySelectorAll('#pessoaJuridica input, #pessoaJuridica select')
    .forEach(el => el.disabled = true);
}

function habilitarDivJuridica() {
  document.querySelectorAll('#pessoaJuridica input, #pessoaJuridica select')
    .forEach(el => el.disabled = false);
  document.querySelectorAll('#pessoaFisica input, #pessoaFisica select')
    .forEach(el => el.disabled = true);
}

async function carregarCliente(id) {

  try {
    const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

    if (!resposta.ok) {
      const texto = await resposta.text();
      let mensagem;
      try {
        const erroJSON = JSON.parse(texto);
        const campo = Object.keys(erroJSON.errors)[0];
        mensagem = erroJSON.errors[campo][0];
      } catch {
        mensagem = texto;
      }
      alert(mensagem);
      return;
    }

    cliente = await resposta.json();
    preencherCampos(cliente);
  } catch (err) {
    alert("Erro na conexão: " + err.message);
    return;
  }
}

function preencherCampos(cliente) {

  for (let campo in cliente) {
    if (cliente[campo] === "N/D") cliente[campo] = "";
  }

  let CPF = cliente.documento || "";
  let CNPJ = cliente.documento || "";
  let Nome = cliente.nome || "";
  let Telefone = cliente.telefone || "";
  let Email = cliente.email || "";
  let CEP = cliente.cep || "";
  let Logradouro = cliente.logradouro || "";
  let Bairro = cliente.bairro || "";
  let Numero = cliente.numero || "";
  let Complemento = cliente.complemento || "";
  let Cidade = cliente.cidade || "";
  let Estado = cliente.estado || 0;
  let InscricaoMunicipal = cliente.inscricaoMunicipal || "";
  let InscricaoEstadual = cliente.inscricaoEstadual || "";
  let Tipo = cliente.tipo || 1;

  const pessoaFisica = document.getElementById("pessoaFisica");
  const pessoaJuridica = document.getElementById("pessoaJuridica");

  if (Tipo === 1) {
    pessoaFisica.classList.remove("hidden");
    pessoaJuridica.classList.add("hidden");
    document.getElementById("ClienteFisico").checked = true;

    habilitarDivFisica();

    document.getElementById("inputCPF").value = CPF;
    document.getElementById("inputNomeFisico").value = Nome;
    document.getElementById("inputTelefoneFisico").value = Telefone;
    document.getElementById("inputEmailFisico").value = Email;
    document.getElementById("inputCEPFisico").value = CEP;
    document.getElementById("inputLogradouroFisico").value = Logradouro;
    document.getElementById("inputBairroFisico").value = Bairro;
    document.getElementById("inputNumeroFisico").value = Numero;
    document.getElementById("inputComplementoFisico").value = Complemento;
    document.getElementById("inputCidadeFisico").value = Cidade;

    const selectEstadoFisico = document.getElementById("estadoFisico");
    selectEstadoFisico.value = Estado && Estado !== 0 ? Estado : 0;

  } else {

    pessoaFisica.classList.add("hidden");
    pessoaJuridica.classList.remove("hidden");
    document.getElementById("ClienteJuridico").checked = true;

    habilitarDivJuridica();

    document.getElementById("inputCNPJ").value = CNPJ;
    document.getElementById("inputInscricaoMunicipal").value = InscricaoMunicipal;
    document.getElementById("inputInscricaoEstadual").value = InscricaoEstadual;
    document.getElementById("inputNomeJuridico").value = Nome;
    document.getElementById("inputTelefoneJuridico").value = Telefone;
    document.getElementById("inputEmailJuridico").value = Email;
    document.getElementById("inputCEPJuridico").value = CEP;
    document.getElementById("inputLogradouroJuridico").value = Logradouro;
    document.getElementById("inputBairroJuridico").value = Bairro;
    document.getElementById("inputNumeroJuridico").value = Numero;
    document.getElementById("inputComplementoJuridico").value = Complemento;
    document.getElementById("inputCidadeJuridico").value = Cidade;

    const selectEstadoJuridico = document.getElementById("estadoJuridico");
    selectEstadoJuridico.value = Estado && Estado !== 0 ? Estado : 0;
  }
}

document.getElementById('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();

  const isPessoaFisica = document.getElementById('ClienteFisico').checked;
  const containerAtivo = isPessoaFisica
    ? document.getElementById('pessoaFisica')
    : document.getElementById('pessoaJuridica');

  const dados = {};
  containerAtivo.querySelectorAll('input, select').forEach(el => {
    if (el.name) {
      if (el.name === "Estado") {
        dados[el.name] = el.value === "0" ? 0 : parseInt(el.value);
      } else {
        dados[el.name] = el.value.trim();
      }
    }
  });

  dados.id = cliente.id;
  dados.situacao = cliente.situacao;

  const camposObrigatorios = containerAtivo.querySelectorAll('[data-required]');
  for (let campo of camposObrigatorios) {
    if (!campo.value || !campo.value.trim()) {
      alert(`Erro ao atualizar cliente: O campo ${campo.name} é obrigatório!`);
      return;
    }
  }

  if (isPessoaFisica) {
    if (dados.Documento && !validarCPF(dados.Documento)) {
      alert("Erro ao atualizar cliente: CPF inválido!");
      form.appendChild(removido);
      return;
    }
  } else {
    if (dados.Documento && !validarCNPJ(dados.Documento)) {
      alert("Erro ao atualizar cliente: CNPJ inválido!");
      form.appendChild(removido);
      return;
    }

    if (dados.InscricaoEstadual && !validarInscricaoEstadual(dados.InscricaoEstadual)) {
      alert("Erro ao atualizar cliente: Inscrição Estadual inválida!");
      form.appendChild(removido);
      return;
    }
  }

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Cliente atualizado com sucesso!");
      window.location.href = "../clientes/index.html";
    } else {
      const texto = await resposta.text();
      let mensagem;
      try {
        const erroJSON = JSON.parse(texto);
        const campo = Object.keys(erroJSON.errors)[0];
        mensagem = erroJSON.errors[campo][0];
      } catch {
        mensagem = texto;
      }
      alert("Erro ao atualizar cliente: " + mensagem);
      return;
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
    return;
  }
});


function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let dig1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (dig1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  let dig2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (dig2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

function validarInscricaoEstadual(inscricao) {
  if (!inscricao) return true;

  inscricao = inscricao.trim().replace(/[^\d]/g, '');

  if (inscricao.length < 8 || inscricao.length > 13) return false;
  if (/^(\d)\1+$/.test(inscricao)) return false;

  return true;
}

