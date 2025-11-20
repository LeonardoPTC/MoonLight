async function carregarProdutos() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
  const produtos = await resposta.json();

  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = ""; // limpa a tabela

  produtos.forEach(p => {
    const linha = document.createElement("tr");
    let situacao = p.situacao;

    /*if (situacao == "0") {
      situacao = "INDEFINIDO";
    } else if(situacao == "1") {
      situacao = "ATIVO";
    } else if(situacao == "2") {
      situacao = "INATIVO";
    } else if(situacao == "3") {
      situacao = "EM FALTA";
    } else if(situacao == "4") {
      situacao = "AGUARDANDO ENTREGA";
    } Para o Segundo Estágio*/
    linha.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.marca}</td>
      <td style="text-align: right">${p.estoque}</td>
      <td style="text-align: right">R$ ${p.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: right">R$ ${p.valorCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="text-center">
          <button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${p.id}')"><img src="/src/assets/View.png"></button>
          <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${p.id}')"><img src="/src/assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${p.id}')"><img src="/src/assets/Delete.png"></button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

carregarProdutos();

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

document.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigo = document.getElementById('filterCodigo').value.trim();
  const nome = document.getElementById('filterNome').value;
  const marca = document.getElementById('filterMarca').value;

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome,
    marca: marca
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
      <td>${p.marca}</td>
      <td style="text-align: right;">${p.estoque}</td>
      <td style="text-align: right;">R$ ${Number(p.valorVenda).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}</td>
      <td style="text-align: right;">R$ ${Number(p.valorCusto).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}</td>
      <td class="text-center">
         <button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${p.id}')"><img src="/src/assets/View.png"></button>
          <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${p.id}')"><img src="/src/assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${p.id}')"><img src="/src/assets/Delete.png"></button>
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

function editarProduto(id) {
  window.location.href = `http://localhost:5500/src/pages/produtos/editproduto.html?id=${id}`;
}

function visualizarProduto(id) {
  window.location.href = `http://localhost:5500/src/pages/produtos/viewproduto.html?id=${id}`;
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});