let vendaAtual = null;

window.addEventListener("load", async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

     const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "200px" : "150px";
                content.style.marginRight = expandida ? "120px" : "120px";

            } else {
                content.style.marginLeft = expandida ? "270px" : "200px";
            }
        };

        if (sidebar.matches(':hover')) {
            aplicarMargens(true);
        }

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
    document.getElementById("btnVoltar").onclick = () => {
        window.location.href = "../vendas/index.html";
    };

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

    const situacao = {
        0: "INDEFINIDO",
        1: "ABERTA",
        2: "FECHADA",
        3: "CANCELADA",
        4: "ESTORNADA",
        5: "FATURADA"
    };

    if (venda.dataFaturamento === "01/01/0001 00:00:00" && situacao[venda.situacao] === "FECHADA" || situacao[venda.situacao] === "ABERTA") {
        venda.dataFaturamento = "Não Faturada!";
    } else if (venda.dataFaturamento === "01/01/0001 00:00:00" && situacao[venda.situacao] === "CANCELADA") {
        venda.dataFaturamento = "Venda Cancelada!";
    } else if (venda.dataFaturamento === "01/01/0001 00:00:00" && situacao[venda.situacao] === "ESTORNADA") {
        venda.dataFaturamento = "Venda Estornada!";
    }

    document.getElementById("selectCliente").innerHTML = `
        <option selected>${venda.nomeCliente}</option>
    `;

    document.getElementById("selectUsuario").innerHTML = `
        <option selected>${venda.nomeVendedor}</option>
    `;

    document.getElementById("inputCodigo").value = venda.codigo;
    document.getElementById("inputDataAbertura").value = venda.dataAbertura || "";
    document.getElementById("inputDataFaturamento").value = venda.dataFaturamento || "";

    document.getElementById("inputSituacao").value = situacao[venda.situacao] || "INDEFINIDO";

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
        "btnCancelar"
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}
