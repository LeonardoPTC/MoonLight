let vendaAtual = null;

window.addEventListener("load", async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const sidebar = document.querySelector(".sidebar")
  const content = document.querySelector("#content");
  const telaPequena = window.matchMedia("(max-width: 1366px)");
  const filterBar = document.querySelector(".filter-bar");

  if (sidebar) {

    const aplicarMargens = (expandida) => {
      if (telaPequena.matches) {
        content.style.marginLeft = expandida ? "200px" : "150px";
        content.style.marginRight = expandida ? "0px" : "100px";
        content.style.width = expandida ? "1100px" : "1100px";
        filterBar.style.marginLeft = expandida ? "-20px" : "-20px";
      } else {
        content.style.marginLeft = expandida ? "300px" : "300px";
      }
    };

     setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

    sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
    sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
  }

    const idVenda = localStorage.getItem("idVenda");
    if (!idVenda) {
        alert("Nenhuma venda selecionada.");
        return;
    }

    await carregarVenda(idVenda);

    document.getElementById("etapa2").style.display = "block";
    document.getElementById("btnFaturar").addEventListener("click", () => faturarVenda(idVenda));
    document.getElementById("btnCancelar").addEventListener("click", () => cancelarVenda(idVenda));

    bloquearEdicao();
});

async function carregarVenda(idVenda) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        vendaAtual = await resposta.json();
        preencherCampos(vendaAtual);

    } catch (err) {
        alert("Erro ao carregar venda: " + err.message);
        return;
    }
}

function preencherCampos(venda) {

    document.getElementById("selectCliente").innerHTML = `
        <option selected>${venda.nomeCliente}</option>
    `;

    document.getElementById("selectUsuario").innerHTML = `
        <option selected>${venda.nomeVendedor}</option>
    `;

    preencherTabela(venda.itens);
}

function preencherTabela(itens) {
    const tabela = document.getElementById("tabelaItens");
    tabela.innerHTML = "";

    let subtotal = 0;

    itens.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td style="text-align: center;">${item.produtoNome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.produtoValorVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td>R$ ${item.subTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        `;

        tabela.appendChild(tr);

        subtotal += item.subTotal;
    });

    const trTotal = document.createElement("tr");
    trTotal.innerHTML = `
        <td colspan="3"><strong>Total</strong></td>
        <td><strong>R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></td>
    `;
    tabela.appendChild(trTotal);
}

function bloquearEdicao() {

    document.getElementById("selectCliente").disabled = true;
    document.getElementById("selectUsuario").disabled = true;

    [
        "btnIniciarVenda",
        "btnAddProduto",
        "btnRemoveProduto",
        "btnDeleteProduto",
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

async function faturarVenda(idVenda) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}/Faturar`, {
            method: "PATCH"
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        alert("Venda faturada com sucesso!");
        window.location.href = "../vendas/index.html";

    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
}

async function cancelarVenda(idVenda) {
    if (!vendaAtual) {
        alert("Não há venda em andamento.");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}/Cancelar`, {
            method: "PATCH"
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        alert("Venda cancelada com sucesso!");
        window.location.href = "../vendas/index.html";


    } catch (err) {
        alert("Erro ao cancelar venda: " + err.message);
        return;
    }
}
