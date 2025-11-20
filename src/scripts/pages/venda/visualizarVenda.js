let vendaAtual = null;

window.addEventListener("load", async () => {
    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const idVenda = localStorage.getItem("idVenda");
    if (!idVenda) {
        alert("Nenhuma venda selecionada.");
        return;
    }

    await carregarVenda(idVenda);

    document.getElementById("etapa2").style.display = "block";
    document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "/src/pages/vendas/index.html";
};

    bloquearEdicao();
});

async function carregarVenda(idVenda) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar venda");
        }

        vendaAtual = await resposta.json();
        preencherCampos(vendaAtual);

    } catch (err) {
        alert("Erro ao carregar venda: " + err.message);
    }
}

function preencherCampos(venda) {

    document.getElementById("selectCliente").innerHTML = `
        <option selected>${venda.nomeCliente}</option>
    `;

    document.getElementById("selectUsuario").innerHTML = `
        <option selected>${venda.nomeVendedor}</option>
    `;

    document.getElementById("inputCodigo").value = venda.codigo;
    document.getElementById("inputDataAbertura").value = venda.dataAbertura || "";
    document.getElementById("inputDataFaturamento").value = venda.dataFaturamento || "";

    const situacao = {
        0: "INDEFINIDO",
        1: "ABERTA",
        2: "FECHADA",
        3: "CANCELADA",
        4: "ESTORNADA",
        5: "FATURADA"
    };

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
            <td>${item.produtoNome}</td>
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
