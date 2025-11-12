async function carregarClientes() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");
  const clientes = await resposta.json();

  const tbody = document.querySelector("#tabela-clientes tbody");
  tbody.innerHTML = ""; // limpa a tabela

  clientes.forEach(c => {
    const linha = document.createElement("tr");
    let situacao = c.situacao;

    linha.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.cidade}</td>
      <td>${c.logradouro}, ${c.numero}</td>
      <td class="text-center">
          <button class="btn btn-primary" onclick="visualizarCliente('${c.id}')">Visualizar</button>
          <button class="btn btn-warning" onclick="editarCliente('${c.id}')">Editar</button>
          <button class="btn btn-danger" onclick="excluirCliente('${c.id}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

carregarClientes();

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
          <button class="btn btn-primary" onclick="visualizarProduto('${p.id}')">Visualizar</button>
          <button class="btn btn-warning" onclick="editarProduto('${p.id}')">Editar</button>
          <button class="btn btn-danger" onclick="excluirProduto('${p.id}')">Excluir</button>
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
function editarCliente(id) {
  window.location.href = `http://localhost:5500/src/pages/clientes/editcliente.html?id=${id}`;
}

function visualizarCliente(id) {
  window.location.href = `http://localhost:5500/src/pages/clientes/viewcliente.html?id=${id}`;
}

document.getElementById('toggleSearch').addEventListener('click', function() {
    const filterBar = document.getElementById('filterBar');
    filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function() {
    const filterBar = document.getElementById('filterBar');
    filterBar.classList.remove('expanded'); 
});