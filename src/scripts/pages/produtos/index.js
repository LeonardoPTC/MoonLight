window.addEventListener("load", async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    if (sidebar.matches(":hover")) {
      document.querySelector("#content").style.marginLeft = "270px";
    }

    sidebar.addEventListener("mouseenter", function () {
      document.querySelector("#content").style.marginLeft = "210px";
    });

    sidebar.addEventListener("mouseleave", function () {
      document.querySelector("#content").style.marginLeft = "100px";
    });
  }
});

async function carregarProdutos() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
  const produtos = await resposta.json();

  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = "";

  produtos.forEach((p) => {
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
      <td style="text-align: center">${p.estoque}</td>
      <td style="text-align: center">R$ ${p.valorVenda.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
      <td style="text-align: center">R$ ${p.valorCusto.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
      <td class="text-center">
          <button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${
            p.id
          }')"><img src="../../assets/View.png"></button>
          <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${
            p.id
          }')"><img src="../../assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${
            p.id
          }')"><img src="../../assets/Delete.png"></button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

carregarProdutos();

document.addEventListener("submit", async function (event) {
  event.preventDefault();

  const codigo = document.getElementById("filterCodigo").value.trim();
  const nome = document.getElementById("filterNome").value;
  const marca = document.getElementById("filterMarca").value;

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome,
    marca: marca,
  };

  try {
    const resposta = await fetch(
      "http://localhost:5164/BlueMoon/Produtos/Search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      }
    );

    if (!resposta.ok) {
      alert("Produto não Encontrado!");
    }

    const produtos = await resposta.json();

    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";
    produtos.forEach((p) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td style="text-align: center">${p.codigo}</td>
      <td style="text-align: center">${p.nome}</td>
      <td style="text-align: center">${p.marca}</td>
      <td style="text-align: center;">${p.estoque}</td>
      <td style="text-align: center;">R$ ${Number(p.valorVenda).toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}</td>
      <td style="text-align: center;">R$ ${Number(p.valorCusto).toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}</td>
      <td class="text-center">
         <button type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Produto" onclick="visualizarProduto('${
           p.id
         }')"><img src="../../assets/View.png"></button>
          <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editar Produto" onclick="editarProduto('${
            p.id
          }')"><img src="../../assets/Edit.png"></button>
          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Excluir Produto" onclick="excluirProduto('${
            p.id
          }')"><img src="../../assets/Delete.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    });
  } catch (erro) {
    alert("Erro ao aplicar filtro", erro);
  }
});

document.getElementById("limparFiltros").addEventListener("click", function () {
  carregarProdutos();
  document.getElementById("filterCodigo").value = "";
  document.getElementById("filterNome").value = "";
  document.getElementById("filterMarca").value = "";
});

document.getElementById("btnBaixarRelatorio").addEventListener("click", () => {
  window.location.href = `../produtos/relatorioProdutosMaisVendidos.html`;
});

function editarProduto(id) {
  localStorage.setItem("idProduto", id);
  window.location.href = "../produtos/editproduto.html";
}

function visualizarProduto(id) {
  localStorage.setItem("idProduto", id);
  window.location.href = "../produtos/viewproduto.html";
}

document.getElementById("toggleSearch").addEventListener("click", function () {
  const filterBar = document.getElementById("filterBar");
  filterBar.classList.toggle("expanded");
});

document.getElementById("fecharFiltros").addEventListener("click", function () {
  const filterBar = document.getElementById("filterBar");
  filterBar.classList.remove("expanded");
});
