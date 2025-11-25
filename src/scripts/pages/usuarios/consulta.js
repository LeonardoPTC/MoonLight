window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const sidebar = document.querySelector(".sidebar")

  if (sidebar) {

    if (sidebar.matches(':hover')) {
      document.querySelector('#content').style.marginLeft = '270px';
    }

    sidebar.addEventListener('mouseenter', function () {
      document.querySelector('#content').style.marginLeft = '270px';
    });

    sidebar.addEventListener('mouseleave', function () {
      document.querySelector('#content').style.marginLeft = '200px';
    });
  }

  carregarClientes();
});

async function carregarClientes() {
  const codigo = document.getElementById('filterCodigo').value.trim();
  const nome = document.getElementById('filterNome').value;
  const telefone = document.getElementById('filterTelefone').value;
  const documento = document.getElementById('filterDocumento').value;

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome.trim(),
    telefone: telefone,
    documento: documento
  };

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas/Search-No-Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Cliente não Encontrado!");
      return;
    }

    const clientes = await resposta.json();

    const tbody = document.querySelector("#tabela-clientes tbody");
    tbody.innerHTML = "";
    clientes.forEach(c => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.cidade}</td>
      <td>${c.endereco}</td>
      <td class="text-center">
          <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Selecionar Cliente" onclick="selecionarCliente('${c.id}')"><img src="../../assets/Selecionar.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    })

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
}

document.getElementById('formPesquisa').addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigo = document.getElementById('filterCodigo').value.trim();
  const nome = document.getElementById('filterNome').value;
  const telefone = document.getElementById('filterTelefone').value;
  const documento = document.getElementById('filterDocumento').value;

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome.trim(),
    telefone: telefone,
    documento: documento
  };

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas/Search-No-Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Cliente não Encontrado!");
      return;
    }

    const clientes = await resposta.json();

    const tbody = document.querySelector("#tabela-clientes tbody");
    tbody.innerHTML = "";
    clientes.forEach(c => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.cidade}</td>
      <td>${c.endereco}</td>
      <td class="text-center">
          <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Selecionar Cliente" onclick="selecionarCliente('${c.id}')"><img src="../../assets/Selecionar.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    })

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterTelefone').value = "";
  document.getElementById('filterDocumento').value = "";
  carregarClientes();
});

document.getElementById('Voltar').addEventListener('click', function () {
  window.location.href = "../usuarios/index.html";
});

function selecionarCliente(id) {
  window.location.href = `../usuarios/atualizarCadastroExistente.html?id=${id}`;
}