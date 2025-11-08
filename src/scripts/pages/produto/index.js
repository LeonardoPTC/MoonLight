async function carregarProdutos() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
  const produtos = await resposta.json();

  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = ""; // limpa a tabela

  produtos.forEach(p => {
    const linha = document.createElement("tr");
    let situacao = p.situacao;

    if (situacao == "0") {
      situacao = "INDEFINIDO";
    } else if(situacao == "1") {
      situacao = "ATIVO";
    } else if(situacao == "2") {
      situacao = "INATIVO";
    } else if(situacao == "3") {
      situacao = "EM FALTA";
    } else if(situacao == "4") {
      situacao = "AGUARDANDO ENTREGA";
    } 
    linha.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.marca}</td>
      <td>${p.quantidadeEstoque}</td>
      <td>R$ ${p.valorVenda.toFixed(2)}</td>
      <td>R$ ${p.valorCusto.toFixed(2)}</td>
      <td>${situacao}</td>
      <td class="text-center">
          <button class="btn btn-primary" onclick="visualizarProduto('${p.id}')">Visualizar</button>
          <button class="btn btn-warning" onclick="editarProduto('${p.id}')">Editar</button>
          <button class="btn btn-danger" onclick="excluirProduto(${p.id})">Excluir</button>
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

function editarProduto(id) {
  window.location.href = `http://localhost:5500/src/pages/produtos/editproduto.html?id=${id}`;
}

function visualizarProduto(id) {
  window.location.href = `http://localhost:5500/src/pages/produtos/viewproduto.html?id=${id}`;
}