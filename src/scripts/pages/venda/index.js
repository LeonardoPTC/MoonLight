async function carregarVenda() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Vendas");
  const vendas = await resposta.json();

  const ordemSituacao = {
    1: 1,
    2: 2,
    5: 3,
    4: 4,
    3: 5,
    0: 6
  };

  vendas.sort((a, b) => ordemSituacao[a.situacao] - ordemSituacao[b.situacao]);

  const tbody = document.querySelector("#tabela-vendas tbody");
  tbody.innerHTML = "";
  const situacao = {
    0: "INDEFINIDO",
    1: "ABERTA",
    2: "FECHADA",
    3: "CANCELADA",
    4: "ESTORNADA",
    5: "FATURADA"
  };
  vendas.forEach(v => {
    const linha = document.createElement("tr");

    if (v.dataFaturamento === "01/01/0001 00:00:00" && situacao[v.situacao] === "FECHADA" || situacao[v.situacao] === "ABERTA") {
      v.dataFaturamento = "Não Faturada!";
    } else if (v.dataFaturamento === "01/01/0001 00:00:00" && situacao[v.situacao] === "CANCELADA") {
      v.dataFaturamento = "Venda Cancelada!";
    } else if (v.dataFaturamento === "01/01/0001 00:00:00" && situacao[v.situacao] === "ESTORNADA") {
      v.dataFaturamento = "Venda Estornada!";
    }


    if (situacao[v.situacao] === "ABERTA" || situacao[v.situacao] === "FECHADA") {

      linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Finalizar Venda" onclick="finalizarVenda('${v.id}')"><img src="../../assets/finalizarVenda.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    } else if (situacao[v.situacao] === "FATURADA") {
      linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Estornar Venda" onclick="estornarVenda('${v.id}')"><img src="../../assets/EstornoIcon.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    } else {
      linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const checkSidebarLoaded = setInterval(function () {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      clearInterval(checkSidebarLoaded);


      if (sidebar.matches(':hover')) {
        document.querySelector('#content').style.marginLeft = '310px';
      }

      sidebar.addEventListener('mouseenter', function () {
        document.querySelector('#content').style.marginLeft = '310px';
      });

      sidebar.addEventListener('mouseleave', function () {
        document.querySelector('#content').style.marginLeft = '200px';
      });
    }
  }, 100);
});


carregarVenda();

/*document.addEventListener('submit', async function (event) {
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
    const resposta = await fetch("http://localhost:5164/BlueMoon/Vendas/Search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Venda não Encontrada!");
      return;
    }

    const vendas = await resposta.json();

    const tbody = document.querySelector("#tabela-vendas tbody");
    tbody.innerHTML = "";
    const cargosEnum = {
      0: "INDEFINIDO",
      1: "VENDEDOR",
      2: "GERENTE",
      3: "FINANCEIRO",
      4: "ADMIN"
    };
    vendas.forEach(v => {
      const linha = document.createElement("tr");
      let situacao = f.situacao;

      linha.innerHTML = `
      <td>${v.codigo}</td>
      <td>${v.dataAbertura}</td>
      <td>${v.dataFaturamento}</td>
      <td>${v.nomeVendedor}</td>
      <td>${v.nomeCliente}</td>
      <td>${v.valorTotal}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${f.idPessoa}', '${f.idVenda}')"><img src="../../assets/View.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    });

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  carregarVenda();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterTelefone').value = "";
  document.getElementById('filterDocumento').value = "";
});
*/

async function estornarVenda(idVenda) {
  try {
    const confirmar = confirm("Tem certeza que deseja ESTORNAR esta venda?");

    if (!confirmar) {
      return;
    }

    const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}/Estornar`, {
      method: "PATCH"
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      alert(erro);
    } else {
      alert("Venda Estornada com Sucesso!");
      window.location.reload();
    }
  } catch (erro) {
    alert("Erro na conexão: " + erro.message);
  }
}

function visualizarVenda(idVenda) {
  localStorage.setItem("idVenda", idVenda);
  window.location.href = `../vendas/visualizarVenda.html`;
}

function finalizarVenda(idVenda) {
  localStorage.setItem("idVenda", idVenda);
  window.location.href = `../vendas/finalizacaoVenda.html`;
}

document.getElementById('toggleSearch').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.toggle('expanded');
});

document.getElementById('fecharFiltros').addEventListener('click', function () {
  const filterBar = document.getElementById('filterBar');
  filterBar.classList.remove('expanded');
});