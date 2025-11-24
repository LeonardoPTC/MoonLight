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
});

async function carregarUsuario() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios");
  const usuarios = await resposta.json();


  const tbody = document.querySelector("#tabela-usuarios tbody");
  tbody.innerHTML = "";
  const cargosEnum = {
    0: "INDEFINIDO",
    1: "VENDEDOR",
    2: "GERENTE",
    3: "FINANCEIRO",
    4: "ADMIN"
  };
  usuarios.forEach(f => {
    const linha = document.createElement("tr");
    let situacao = f.situacao;

    linha.innerHTML = `
      <td style="text-align: center">${f.codigo}</td>
      <td style="text-align: center">${f.nome}</td>
      <td style="text-align: center">${cargosEnum[f.cargo] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Usuario" onclick="visualizarUsuario('${f.idPessoa}', '${f.idUsuario}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Usuario" onclick="editarUsuario('${f.idPessoa}', '${f.idUsuario}')"><img src="../../assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Usuario" onclick="excluirUsuario('${f.idUsuario}')"><img src="../../assets/Delete.png"></button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

carregarUsuario();

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
    const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios/Search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Usuário não Encontrado!");
      return;
    }

    const usuarios = await resposta.json();

    const tbody = document.querySelector("#tabela-usuarios tbody");
    tbody.innerHTML = "";
    const cargosEnum = {
      0: "INDEFINIDO",
      1: "VENDEDOR",
      2: "GERENTE",
      3: "FINANCEIRO",
      4: "ADMIN"
    };
    usuarios.forEach(f => {
      const linha = document.createElement("tr");
      let situacao = f.situacao;

      linha.innerHTML = `
      <td style="text-align: center">${f.codigo}</td>
      <td style="text-align: center">${f.nome}</td>
      <td style="text-align: center">${cargosEnum[f.cargo] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Usuario" onclick="visualizarUsuario('${f.idPessoa}', '${f.idUsuario}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Usuario" onclick="editarUsuario('${f.idPessoa}', '${f.idUsuario}')"><img src="../../assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Usuario" onclick="excluirUsuario('${f.idUsuario}')"><img src="../../assets/Delete.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    });

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  carregarUsuario();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterTelefone').value = "";
  document.getElementById('filterDocumento').value = "";
});

document.getElementById('btnBaixarRelatorio').addEventListener('click', () => {
  window.location.href = `../usuarios/relatorioVendedoresQueMaisVenderam.html`;
});

function editarUsuario(idPessoa, idUsuario) {
  window.location.href = `../usuarios/editDadosCadastrais.html?idPessoa=${idPessoa}&idUsuario=${idUsuario}`;
}

function visualizarUsuario(idPessoa, idUsuario) {
  window.location.href = `../usuarios/viewDadosCadastraisUsuario.html?idPessoa=${idPessoa}&idUsuario=${idUsuario}`;
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});