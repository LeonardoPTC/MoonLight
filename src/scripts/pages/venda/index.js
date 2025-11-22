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

  vendas.sort((a, b) => {
    const ordem = ordemSituacao[a.situacao] - ordemSituacao[b.situacao];
    if (ordem !== 0) return ordem;

    const dataA = new Date(a.dataAbertura.split('/').reverse().join('-'));
    const dataB = new Date(b.dataAbertura.split('/').reverse().join('-'));

    return dataB - dataA;
  });

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


    if (situacao[v.situacao] === "ABERTA") {

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
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Retomar Venda" onclick="retomarVenda('${v.id}')"><img src="../../assets/Edit.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    } else if (situacao[v.situacao] === "FECHADA") {

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

document.getElementById("formPesquisa").addEventListener("submit", async function (event) {
  event.preventDefault();

  const codigo = document.getElementById('filterCodigo').value.trim();
  const dataAbertura = document.getElementById('filterDataAbertura').value;
  const dataConvertida = dataAbertura ? converterDataParaBack(dataAbertura) : "";
  const nome = document.getElementById('filterNomeCliente').value;
  const situacao = document.getElementById('selectSituacao').value;

  if (!codigo && !dataAbertura && !nome.trim() && situacao == 0) {
    return;
  }

  let dto = null;

  if (!codigo) {
    dto = {
      dataAbertura: dataConvertida ? dataConvertida : "",
      nomeCliente: nome.trim() ? nome.trim() : "",
      situacao: (situacao !== "" && !isNaN(parseInt(situacao))) ? parseInt(situacao) : ""
    };
  } else {
    dto = {
      codigo: codigo ? parseInt(codigo) : "",
      dataAbertura: dataConvertida ? dataConvertida : "",
      nomeCliente: nome.trim() ? nome.trim() : "",
      situacao: (situacao !== "" && !isNaN(parseInt(situacao))) ? parseInt(situacao) : ""
    };
  }

  console.log(dto);

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

    if (Array.isArray(vendas) && vendas.length === 0) {
      alert("Venda não Encontrada!");
      return;
    }
    const ordemSituacao = {
      1: 1,
      2: 2,
      5: 3,
      4: 4,
      3: 5,
      0: 6
    };

    vendas.sort((a, b) => {
      const ordem = ordemSituacao[a.situacao] - ordemSituacao[b.situacao];
      if (ordem !== 0) return ordem;

      const dataA = new Date(a.dataAbertura.split('/').reverse().join('-'));
      const dataB = new Date(b.dataAbertura.split('/').reverse().join('-'));

      return dataB - dataA;
    });

    const tbody = document.querySelector("#tabela-vendas tbody");
    tbody.innerHTML = "";
    const situacaoDescricao = {
      0: "INDEFINIDO",
      1: "ABERTA",
      2: "FECHADA",
      3: "CANCELADA",
      4: "ESTORNADA",
      5: "FATURADA"
    };
    vendas.forEach(v => {
      const linha = document.createElement("tr");

      if (v.dataFaturamento === "01/01/0001 00:00:00" && situacaoDescricao[v.situacao] === "FECHADA" || situacao[v.situacao] === "ABERTA") {
        v.dataFaturamento = "Não Faturada!";
      } else if (v.dataFaturamento === "01/01/0001 00:00:00" && situacaoDescricao[v.situacao] === "CANCELADA") {
        v.dataFaturamento = "Venda Cancelada!";
      } else if (v.dataFaturamento === "01/01/0001 00:00:00" && situacaoDescricao[v.situacao] === "ESTORNADA") {
        v.dataFaturamento = "Venda Estornada!";
      }


      if (situacaoDescricao[v.situacao] === "ABERTA") {

        linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacaoDescricao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Retomar Venda" onclick="retomarVenda('${v.id}')"><img src="../../assets/Edit.png"></button>
      </td>
    `;
        tbody.appendChild(linha);
      } else if (situacaoDescricao[v.situacao] === "FECHADA") {

        linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacaoDescricao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
          <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Finalizar Venda" onclick="finalizarVenda('${v.id}')"><img src="../../assets/finalizarVenda.png"></button>
      </td>
    `;
        tbody.appendChild(linha);
      } else if (situacaoDescricao[v.situacao] === "FATURADA") {
        linha.innerHTML = `
      <td style="text-align: center">${v.codigo}</td>
      <td style="text-align: center">${v.dataAbertura}</td>
      <td style="text-align: center">${v.dataFaturamento}</td>
      <td style="text-align: center">${v.nomeVendedor}</td>
      <td style="text-align: center">${v.nomeCliente}</td>
      <td style="text-align: right">R$ ${v.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style="text-align: center">${situacaoDescricao[v.situacao] || "INDEFINIDO"}</td>
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
      <td style="text-align: center">${situacaoDescricao[v.situacao] || "INDEFINIDO"}</td>
      <td class="text-center">
          <button class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Visualizar Venda" onclick="visualizarVenda('${v.id}')"><img src="../../assets/View.png"></button>
      </td>
    `;
        tbody.appendChild(linha);
      }
    });

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  carregarVenda();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterDataAbertura').value = "";
  document.getElementById('filterNomeCliente').value = "";
  document.getElementById('selectSituacao').value = "0";
});

function converterDataParaBack(data) {
  if (!data) return "";

  const partes = data.split("-");
  return partes[2] + partes[1] + partes[0];
}


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

function retomarVenda(idVenda) {
  localStorage.setItem("idVenda", idVenda);
  window.location.href = `../vendas/retomarVenda.html`;
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