document.getElementById("formCliente").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pessoaFisica = document.getElementById("pessoaFisica");
  const pessoaJuridica = document.getElementById("pessoaJuridica");
  const form = e.target;

  const isPessoaFisica = !pessoaFisica.classList.contains("hidden");

  const inputDocumento = isPessoaFisica
    ? document.getElementById("inputCPF")
    : document.getElementById("inputCNPJ");

  const inputInscricaoEstadual = document.getElementById("inputInscricaoEstadual");

  const valorDocumento = inputDocumento ? inputDocumento.value.trim() : "";
  const valorIE = inputInscricaoEstadual ? inputInscricaoEstadual.value.trim() : "";

  let removido = null;

  if (isPessoaFisica) {
    removido = pessoaJuridica;
    pessoaJuridica.remove();
  } else {
    removido = pessoaFisica;
    pessoaFisica.remove();
  }

  const formData = new FormData(form);
  const dados = {};

  formData.forEach((valor, chave) => {
    if (chave === "Estado") {
      dados[chave] = valor === "0" ? 0 : parseInt(valor);
    } else {
      dados[chave] = valor.trim();
    }
  });

  dados.Documento = valorDocumento;
  dados.InscricaoEstadual = valorIE;

  const camposObrigatorios = (isPessoaFisica ? pessoaFisica : pessoaJuridica)
    .querySelectorAll("[data-required]");

  for (let campo of camposObrigatorios) {
    if (!campo.value.trim()) {
      alert(`O campo ${campo.name} é obrigatório!`);
      form.appendChild(removido);
      return;
    }
  }

  if (isPessoaFisica) {
    if (dados.Documento && !validarCPF(dados.Documento)) {
      alert("CPF inválido!");
      form.appendChild(removido);
      return;
    }
  } else {
    if (dados.Documento && !validarCNPJ(dados.Documento)) {
      alert("CNPJ inválido!");
      form.appendChild(removido);
      return;
    }

    if (dados.InscricaoEstadual && !validarInscricaoEstadual(dados.InscricaoEstadual)) {
      alert("Inscrição Estadual inválida!");
      form.appendChild(removido);
      return;
    }
  }

  form.appendChild(removido);

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

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Cliente cadastrado com sucesso!");
      window.location.href = "../clientes/index.html";
    } else {
      const erro = await resposta.text();
      alert("Erro ao cadastrar cliente: " + erro);
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
});
