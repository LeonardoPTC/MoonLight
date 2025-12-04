window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "190px" : "160px";
                content.style.marginRight = expandida ? "30px" : "60px";

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

  } catch (err) {
    alert("Erro ao aplicar filtro: " + err.message);
    return;
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

  } catch (err) {
    alert("Erro ao aplicar filtro: " + err.message);
    return;
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
  localStorage.setItem("idClienteExistente", id);
  window.location.href = '../usuarios/atualizarCadastroExistente.html';
}