window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const sidebar = document.querySelector(".sidebar")
  const content = document.querySelector("#content");
  const tabelaProdutos = document.querySelector("#tabela-produtos");
  const telaPequena = window.matchMedia("(max-width: 1366px)");
  const filterBar = document.querySelector(".filter-bar");

  if (sidebar) {

    const aplicarMargens = (expandida) => {
      if (telaPequena.matches) {
        content.style.marginLeft = expandida ? "190px" : "150px";
        content.style.marginRight = expandida ? "10px" : "30px";
        content.style.width = expandida ? "1120px" : "1120px";
        tabelaProdutos.style.width = expandida ? "1050px" : "1050px";
        tabelaProdutos.style.marginRight = expandida ? "90px" : "90px";
        tabelaProdutos.style.marginLeft = expandida ? "90px" : "90px";
        filterBar.style.marginLeft = expandida ? "-15px" : "-15px";
      } else {
        content.style.marginLeft = expandida ? "270px" : "200px";
        content.style.marginRight = expandida ? "120px" : "200px";
      }
    }

     setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

    sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
    sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
  }
});

async function carregarProdutos() {
  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
    if (!resposta.ok) {
      const erro = await resposta.text();
      alert(erro);
      return;
    }

    const produtos = await resposta.json();

    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";

    produtos.forEach(p => {
      const linha = document.createElement("tr");
      //let situacao = p.situacao;

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
      <td style="text-align: center">${p.codigo}</td>
      <td style="text-align: center">${p.nome}</td>
      <td style="text-align: center">${p.marca}</td>
      <td style="text-align: right">${p.estoque}</td>
      <td style="text-align: right">R$ ${p.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: right">R$ ${p.valorCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="text-center">
          <button type="button" class="btn btn-primary" id="padraoBtnProduto" data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/View.png"></button>
          <button type="button" class="btn btn-warning" id="padraoBtnProduto" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" id="padraoBtnProduto" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/Delete.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    });
  } catch (err) {
    alert("Erro: " + err.message);
    return;
  }
}

carregarProdutos();

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
      return;
    }

    const produtos = await resposta.json();

    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";
    produtos.forEach(p => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td style="text-align: center">${p.codigo}</td>
      <td style="text-align: center">${p.nome}</td>
      <td style="text-align: center">${p.marca}</td>
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
         <button type="button" class="btn btn-primary" id="padraoBtnProduto"  data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/View.png"></button>
          <button type="button" class="btn btn-warning" id="padraoBtnProduto" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" id="padraoBtnProduto" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${p.id}')"><img id="padraoImgBtnProduto" src="../../assets/Delete.png"></button>
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
  carregarProdutos();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterMarca').value = "";
});

document.getElementById('btnBaixarRelatorio').addEventListener('click', () => {
  window.location.href = `../produtos/relatorioProdutosMaisVendidos.html`;
});

function editarProduto(id) {
  localStorage.setItem("idProduto", id);
  window.location.href = '../produtos/editproduto.html';
}

function visualizarProduto(id) {
  localStorage.setItem("idProduto", id);
  window.location.href = '../produtos/viewproduto.html';
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});

