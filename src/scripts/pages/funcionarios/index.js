async function carregarFuncionario() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios");
  const funcionarios = await resposta.json();


  const tbody = document.querySelector("#tabela-funcionarios tbody");
  tbody.innerHTML = ""; 
  const cargosEnum = {
    0: "INDEFINIDO",
    1: "VENDEDOR",
    2: "GERENTE",
    3: "FINANCEIRO",
    4: "ADMIN"
  };
  funcionarios.forEach(f => {
    const linha = document.createElement("tr");
    let situacao = f.situacao;

    linha.innerHTML = `
      <td>${f.codigoUsuario}</td>
      <td>${f.nome}</td>
      <td>${cargosEnum[f.cargo] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Funcionario" onclick="visualizarFuncionario('${f.idPessoa}', '${f.id}')"><img src="/src/assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Funcionario" onclick="editarFuncionario('${f.idPessoa}', '${f.id}')"><img src="/src/assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Funcionario" onclick="excluirFuncionario('${f.id}')"><img src="/src/assets/Delete.png"></button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

carregarFuncionario();

document.addEventListener('DOMContentLoaded', function () {
  const checkSidebarLoaded = setInterval(function () {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      clearInterval(checkSidebarLoaded);

      sidebar.addEventListener('mouseenter', function () {
        document.querySelector('#content').style.marginLeft = '310px';
      });

      sidebar.addEventListener('mouseleave', function () {
        document.querySelector('#content').style.marginLeft = '187px';
      });
    }
  }, 100);
});



/*document.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigo = document.getElementById('filterCodigo').value.trim();
  const nome = document.getElementById('filterNome').value;
  const marca = document.getElementById('filterMarca').value; //Alterar

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome,
    marca: marca //Alterar
  };

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos/Search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Produto não Encontrado!")
    }

    const produtos = await resposta.json();

    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";
    produtos.forEach(p => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.telefone}</td>
      <td>${p.cidade}</td>
      <td>${p.bairro + p.complemento}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Cliente" onclick="visualizarCliente('${c.id}')"><img src="/src/assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Cliente" onclick="editarCliente('${c.id}')"><img src="/src/assets/Edit.png"></button>
          <button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Cliente" onclick="excluirCliente('${c.id}')"><img src="/src/assets/Delete.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    })

  } catch (erro) {
    alert("Erro ao aplicar filtro", erro);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  carregarProdutos();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterMarca').value = "";
});
*/
function editarFuncionario(idPessoa, idUsuario) {
  window.location.href = `http://localhost:5500/src/pages/funcionarios/editDadosCadastrais.html?idPessoa=${idPessoa}&idUsuario=${idUsuario}`;
}

function visualizarFuncionario(idPessoa, idUsuario) {
  window.location.href = `http://localhost:5500/src/pages/funcionarios/viewDadosCadastraisFuncionario.html?idPessoa=${idPessoa}&idUsuario=${idUsuario}`;
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});