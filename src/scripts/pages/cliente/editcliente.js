window.addEventListener('load', async () => {
  await includeHTML("header", "/src/include/header.html");
  await includeHTML("footer", "/src/include/footer.html");
  
  const radios = document.querySelectorAll('input[type="radio"]');
  const inputCNPJ = document.getElementById('inputCNPJ');

  radios.forEach(radio => radio.setAttribute('disabled', 'true'));

  if (inputCNPJ) inputCNPJ.setAttribute('disabled', 'true');

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id) carregarCliente(id);
});

async function carregarCliente(id) {

  try {
    const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

    if (!resposta.ok) {
      const erro = await resposta.text();
      alert(erro);
    }

    cliente = await resposta.json();
    preencherCampos(cliente);
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
}


function preencherCampos(cliente) {

  for (let campo in cliente) {
    if (cliente[campo] === "N/D") cliente[campo] = "";
  }

  let cpf = cliente.documento || "";
  let cnpj = cliente.documento || "";
  let nome = cliente.nome || "";
  let telefone = cliente.telefone || "";
  let email = cliente.email || "";
  let cep = cliente.cep || "";
  let logradouro = cliente.logradouro || "";
  let bairro = cliente.bairro || "";
  let numero = cliente.numero || "";
  let complemento = cliente.complemento || "";
  let cidade = cliente.cidade || "";
  let estado = cliente.estado || 0;
  let inscricaoMunicipal = cliente.inscricaoMunicipal || "";
  let inscricaoEstadual = cliente.inscricaoEstadual || "";
  let tipo = cliente.tipo || 1;

  const pessoaFisica = document.getElementById("pessoaFisica");
  const pessoaJuridica = document.getElementById("pessoaJuridica");

  if (tipo === 1) {
    pessoaFisica.classList.remove("hidden");
    pessoaJuridica.classList.add("hidden");
    document.getElementById("ClienteFisico").checked = (tipo === 1);

    document.getElementById("inputCPF").value = cpf;
    document.getElementById("inputNomeFisico").value = nome;
    document.getElementById("inputTelefoneFisico").value = telefone;
    document.getElementById("inputEmailFisico").value = email;
    document.getElementById("inputCEPFisico").value = cep;
    document.getElementById("inputLogradouroFisico").value = logradouro;
    document.getElementById("inputBairroFisico").value = bairro;
    document.getElementById("inputNumeroFisico").value = numero;
    document.getElementById("inputComplementoFisico").value = complemento;
    document.getElementById("inputCidadeFisico").value = cidade;
    const selectEstadoFisico = document.getElementById("estadoFisico");
    if (estado && estado !== 0) {
      selectEstadoFisico.value = estado;
    } else {
      selectEstadoFisico.value = 0;
      selectEstadoFisico.options[0].text = "Estado não definido";
    }
  } else {
    pessoaFisica.classList.add("hidden");
    pessoaJuridica.classList.remove("hidden");
    document.getElementById("ClienteJuridico").checked = (tipo === 2);
    document.getElementById("inputCNPJ").value = cnpj;
    document.getElementById("inputInscricaoMunicipal").value = inscricaoMunicipal;
    document.getElementById("inputInscricaoEstadual").value = inscricaoEstadual;
    document.getElementById("inputNomeJuridico").value = nome;
    document.getElementById("inputTelefoneJuridico").value = telefone;
    document.getElementById("inputEmailJuridico").value = email;
    document.getElementById("inputCEPJuridico").value = cep;
    document.getElementById("inputLogradouroJuridico").value = logradouro;
    document.getElementById("inputBairroJuridico").value = bairro;
    document.getElementById("inputNumeroJuridico").value = numero;
    document.getElementById("inputComplementoJuridico").value = complemento;
    document.getElementById("inputCidadeJuridico").value = cidade;
    const selectEstadoJuridico = document.getElementById("estadoJuridico");
    if (estado && estado !== 0) {
      selectEstadoJuridico.value = estado;
    } else {
      selectEstadoJuridico.value = 0;
      selectEstadoJuridico.options[0].text = "Estado não definido";
    }
  }
  console.log(cliente);
}

document.getElementById('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();

  const isPessoaFisica = document.getElementById('ClienteFisico').checked;
  const containerAtivo = isPessoaFisica
    ? document.getElementById('pessoaFisica')
    : document.getElementById('pessoaJuridica');
    

  containerAtivo.querySelectorAll('[disabled]').forEach(el => el.removeAttribute('disabled'));
  const form = e.target;
  const formData = new FormData(form);
  const dados = {};
  formData.forEach((valor, chave) => {
    if (chave === "Estado") {
      dados[chave] = valor === "0" ? 0 : parseInt(valor);
    } else {
      dados[chave] = valor.trim();
    }
  });

  dados.tipo = document.querySelector('input[name="tipo"]:checked')?.value || 1;
  dados.id = cliente.id;

    console.log(dados);


  const camposObrigatorios = containerAtivo.querySelectorAll('[data-required]');
  for (let campo of camposObrigatorios) {
    if (campo.disabled) continue;
    if (!campo.value || !campo.value.trim()) {
      alert(`O campo ${campo.name} é obrigatório!`);
      campo.focus();
      return;
    }
  }

  containerAtivo.querySelectorAll('input, select').forEach(el => {
    if (el.name !== "tipo") el.setAttribute('disabled', 'true');
  });

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Cliente cadastrado com sucesso!");
      window.location.href = "/src/pages/clientes/index.html";
    } else {
      const erro = await resposta.text();
      alert("Erro ao cadastrar cliente: " + erro);
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
});
