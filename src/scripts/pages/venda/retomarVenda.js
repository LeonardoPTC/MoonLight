let vendaAtual = null;
let itens = [];

window.addEventListener("load", async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const idVenda = localStorage.getItem("idVenda");

    await carregarClientes();
    await carregarUsuarios();
    await carregarProdutos();


    document.getElementById("btnFechar").addEventListener("click", fecharVenda);
    document.getElementById("btnCancelar").addEventListener("click", cancelarVenda);
    document.getElementById("btnAddProduto").addEventListener("click", adicionarProduto);
    document.getElementById("btnRemoveProduto").addEventListener("click", removerProduto);
    document.getElementById("btnDeleteProduto").addEventListener("click", excluirProduto);

    if (idVenda) {
        await carregarVenda(idVenda);
        document.getElementById("etapa2").style.display = "block";
        bloquearSomenteClienteEVendedor();
    } else {
        document.getElementById("etapa2").style.display = "none";
    }
});

async function carregarVenda(idVenda) {
    const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}`);
    vendaAtual = await resposta.json();

    document.getElementById("selectCliente").innerHTML = `<option selected>${vendaAtual.nomeCliente}</option>`;
    document.getElementById("selectUsuario").innerHTML = `<option selected>${vendaAtual.nomeVendedor}</option>`;
}

async function carregarClientes() {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");
    clientes = await resposta.json();
    preencherSelect("selectCliente", clientes, "id");
}

async function carregarUsuarios() {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios");
    usuarios = await resposta.json();
    preencherSelect("selectUsuario", usuarios, "idUsuario");
}

async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }
        const produtos = await resposta.json();
        preencherSelect("selectProduto", produtos, "id");
    } catch (err) {
        alert("Erro ao carregar produtos: " + err.message);
    }
}

async function atualizarSelects() {
    const selectCliente = document.getElementById("selectCliente");
    const selectUsuario = document.getElementById("selectUsuario");

    const nomeClienteSelecionado = selectCliente.options[selectCliente.selectedIndex].text;
    const nomeUsuarioSelecionado = selectUsuario.options[selectUsuario.selectedIndex].text;

    const clientesFiltrados = clientes.filter(c => c.nome !== nomeUsuarioSelecionado);
    const usuariosFiltrados = usuarios.filter(u => u.nome !== nomeClienteSelecionado);

    preencherSelect("selectCliente", clientesFiltrados, "id");
    preencherSelect("selectUsuario", usuariosFiltrados, "idUsuario");

    selectCliente.value = clientesFiltrados.find(c => c.nome === nomeClienteSelecionado)?.id || "";
    selectUsuario.value = usuariosFiltrados.find(u => u.nome === nomeUsuarioSelecionado)?.idUsuario || "";
}

function preencherSelect(id, lista, keyId) {
    const select = document.getElementById(id);
    select.innerHTML = `<option value="">Selecione uma opção...</option>`;
    lista.forEach(item => {
        const op = document.createElement("option");
        op.value = item[keyId];
        op.textContent = item.nome;
        select.appendChild(op);
    });
}

function bloquearSomenteClienteEVendedor() {
    document.getElementById("selectCliente").disabled = true;
    document.getElementById("selectUsuario").disabled = true;
}

bloquearSomenteClienteEVendedor();


async function adicionarProduto() {
    if (!vendaAtual) {
        alert("Inicie a venda antes de adicionar produtos.");
        return;
    }

    const idProduto = document.getElementById("selectProduto").value;
    const quantidade = parseInt(document.getElementById("inputQtd").value);

    if (!idProduto || quantidade <= 0) {
        alert("Selecione um produto e a quantidade.");
        return;
    }

    const dto = { idProduto, quantidade };
    const qtdDisponivel = await verificaQuantidade(dto.idProduto, dto.quantidade);
    if (qtdDisponivel < 0) {
        alert("Qauntidade de Estoque indisponível!");
        return;
    }

    const itemExistente = itens.find(item => item.idProduto == dto.idProduto);

    if (itemExistente) {
        let quantidadeAtualizada = itemExistente.quantidade + dto.quantidade;
        const qtdDisponivel = await verificaQuantidade(dto.idProduto, quantidadeAtualizada);

        if (qtdDisponivel < 0) {
            alert("Quantidade de Estoque indisponível!");
            return;
        }

        itemExistente.quantidade += dto.quantidade;

    } else {
        itens.push(dto);
    }
    await atualizarTabela(itens);
}
async function removerProduto() {
    if (!vendaAtual) {
        alert("Inicie a venda antes de remover produtos.");
        return;
    }

    const idProduto = document.getElementById("selectProduto").value;
    const quantidade = parseInt(document.getElementById("inputQtd").value);

    if (!idProduto || quantidade <= 0) {
        alert("Selecione um produto e a quantidade.");
        return;
    }

    const dto = { idProduto, quantidade };
    const itemExistente = itens.find(item => item.idProduto == dto.idProduto);

    if (itemExistente) {
        let quantidadeAtualizada = itemExistente.quantidade - dto.quantidade;

        if (quantidadeAtualizada < 0) {
            alert("Quantidade para remoção inválida!");
            return;
        }

        itemExistente.quantidade -= dto.quantidade;

    }

    await atualizarTabela(itens);
}

async function excluirProduto() {
    if (!vendaAtual) {
        alert("Inicie a venda antes de excluir produtos.");
        return;
    }

    const idProduto = document.getElementById("selectProduto").value;

    const index = itens.findIndex(item => item.idProduto === idProduto);

    if (index !== -1) {
        itens.splice(index, 1);
        atualizarTabela(itens)
    } else {
        alert("Lista Vazia!")
    }

}

async function atualizarTabela(itensVenda) {
    const resposta = await fetch(`http://localhost:5164/BlueMoon/Produtos`);
    const produtos = await resposta.json();

    const tabela = document.getElementById("tabelaItens");
    tabela.innerHTML = "";

    let subtotal = 0;

    itensVenda.forEach(item => {
        if (item.quantidade <= 0) return;

        const produto = produtos.find(p => p.id == item.idProduto);
        const preco = produto.valorVenda;
        const soma = preco * item.quantidade;

        subtotal += soma;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align:center">${produto.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td>R$ ${soma.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        `;
        tabela.appendChild(tr);
    });

    const trTotal = document.createElement("tr");
    trTotal.innerHTML = `
        <td colspan="3"><strong>Total</strong></td>
        <td><strong>R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></td>
    `;
    tabela.appendChild(trTotal);
}

async function fecharVenda() {
    if (!vendaAtual || itens.length === 0) {
        alert("Não há venda em andamento ou produtos adicionados.");
        return;
    }

    const dto = itens
        .filter(item => item.quantidade > 0)
        .map(item => ({
            IdProduto: item.idProduto,
            Quantidade: item.quantidade
        }));
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${vendaAtual.id}/Itens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro);
        }

        alert("Venda finalizada com sucesso!");

        const dados = await resposta.json();
        const idVenda = dados.id ?? vendaAtual.id;

        localStorage.setItem("idVenda", idVenda);

        window.onbeforeunload = null;
        window.location.href = "../vendas/finalizacaoVenda.html";
    } catch (err) {
        alert("Erro ao adicionar produto: " + err.message);
    }
}

async function faturarVenda(idVenda) {
    await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}/Faturar`, {
        method: "PATCH"
    });

    alert("Venda faturada!");
    window.location.href = "../vendas/index.html";
}

async function cancelarVenda() {
    if (!vendaAtual) return alert("Nenhuma venda.");

    await fetch(`http://localhost:5164/BlueMoon/Vendas/${vendaAtual.id}/Cancelar`, {
        method: "PATCH"
    });

    alert("Venda cancelada com sucesso!");
    window.location.href = "../vendas/index.html";
}


function calcularSubTotal(preco, quantidade) {
    return preco * quantidade;
}

async function verificaQuantidade(idProduto, quantidade) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Produtos`);
        const produtos = await resposta.json();

        const produto = produtos.find(p => p.id === idProduto);
        return produto.estoque - quantidade;
    } catch {
        alert("Erro")
    }
}
