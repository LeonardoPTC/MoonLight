window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const sidebar = document.querySelector(".sidebar")
  const content = document.querySelector("#content");
  const telaPequena = window.matchMedia("(max-width: 1366px)");
  const tabelaClientes = document.querySelector("#tabela-clientes");
  const filterBar = document.querySelector(".filter-bar");

  if (sidebar) {

    const aplicarMargens = (expandida) => {
      if (telaPequena.matches) {
        content.style.marginLeft = expandida ? "190px" : "130px";
        content.style.marginRight = expandida ? "0px" : "40px";
        content.style.width = expandida ? "auto" : "auto";
        tabelaClientes.style.width = expandida ? "1150px" : "1150px";
        tabelaClientes.style.marginRight = expandida ? "0px" : "40px";
        tabelaClientes.style.marginLeft = expandida ? "40px" : "70px";
        filterBar.style.marginLeft = expandida ? "-20px" : "-20px";
      } else {
        content.style.marginLeft = expandida ? "270px" : "200px";
      }
    };

     setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

    sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
    sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
  }
});

async function carregarClientes() {
  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");

    if (!resposta.ok) {
      const erro = await resposta.text();
      alert(erro);
      return;
    }
    const clientes = await resposta.json();

    const tbody = document.querySelector("#tabela-clientes tbody");
    tbody.innerHTML = "";

    clientes.forEach(c => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
      <td style="text-align: center">${c.codigo}</td>
      <td style="text-align: center">${c.nome}</td>
      <td style="text-align: center">${c.telefone}</td>
      <td style="text-align: center">${c.cidade}</td>
      <td style="text-align: center">${c.endereco}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Cliente" onclick="visualizarCliente('${c.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Cliente" onclick="editarCliente('${c.id}')"><img src="../../assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Cliente" onclick="excluirCliente('${c.id}')"><img src="../../assets/Delete.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    });
  } catch (err) {
    alert("Erro: " + err.message);
    return;
  }
}

carregarClientes();


document.addEventListener('submit', async function (event) {
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
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas/Search", {
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
      <td style="text-align: center">${c.codigo}</td>
      <td style="text-align: center">${c.nome}</td>
      <td style="text-align: center">${c.telefone}</td>
      <td style="text-align: center">${c.cidade}</td>
      <td style="text-align: center">${c.endereco}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Cliente" onclick="visualizarCliente('${c.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Cliente" onclick="editarCliente('${c.id}')"><img src="../../assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Cliente" onclick="excluirCliente('${c.id}')"><img src="../../assets/Delete.png"></button>
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
  carregarClientes();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterTelefone').value = "";
  document.getElementById('filterDocumento').value = "";
});

document.getElementById('btnBaixarRelatorio').addEventListener('click', () => {
  window.location.href = `../clientes/relatorioClientesQueMaisCompraram.html`;
});

function editarCliente(id) {
  localStorage.setItem("idCliente", id);
  window.location.href = '../clientes/editcliente.html';
}

function visualizarCliente(id) {
  localStorage.setItem("idCliente", id);
  window.location.href = '../clientes/viewcliente.html';
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});