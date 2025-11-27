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
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${idVenda}`);
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
        vendaAtual = await resposta.json();

        document.getElementById("selectCliente").innerHTML = `<option selected>${vendaAtual.nomeCliente}</option>`;
        document.getElementById("selectUsuario").innerHTML = `<option selected>${vendaAtual.nomeVendedor}</option>`;

        window.onbeforeunload = function () {
            return true;
        };

    } catch (err) {
        alert("Erro: " + err.message);
        return;
    }

}

async function carregarClientes() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
        clientes = await resposta.json();
        preencherSelect("selectCliente", clientes, "id");
    } catch (err) {
        alert("Erro: " + err.message);
        return;
    }
}

async function carregarUsuarios() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios");
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
        usuarios = await resposta.json();
        preencherSelect("selectUsuario", usuarios, "idUsuario");
    } catch (err) {
        alert("Erro: " + err.message);
        return;
    }
}

async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Produtos");
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
        const produtos = await resposta.json();
        preencherSelect("selectProduto", produtos, "id");
    } catch (err) {
        alert("Erro ao carregar produtos: " + err.message);
        return;
    }
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

    const produtoSelecionado = { idProduto, quantidade };
    const qtdDisponivel = await verificaQuantidade(produtoSelecionado.idProduto, produtoSelecionado.quantidade);
    if (qtdDisponivel < 0) {
        alert("Quantidade de Estoque indisponível!");
        return;
    }

    const itemExistente = itens.find(item => item.idProduto == produtoSelecionado.idProduto);

    if (itemExistente) {
        let quantidadeAtualizada = itemExistente.quantidade + produtoSelecionado.quantidade;
        const qtdDisponivel = await verificaQuantidade(produtoSelecionado.idProduto, quantidadeAtualizada);

        if (qtdDisponivel < 0) {
            alert("Quantidade de Estoque indisponível!");
            return;
        }

        itemExistente.quantidade += produtoSelecionado.quantidade;

    } else {
        itens.push(produtoSelecionado);
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

    const produtoSelecionado = { idProduto, quantidade };
    const itemExistente = itens.find(item => item.idProduto == produtoSelecionado.idProduto);

    if (itemExistente) {
        let quantidadeAtualizada = itemExistente.quantidade - produtoSelecionado.quantidade;

        if (quantidadeAtualizada < 0) {
            alert("Quantidade para remoção inválida!");
            return;
        }

        itemExistente.quantidade -= produtoSelecionado.quantidade;

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
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Produtos`);
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
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
    } catch (err) {
        alert("Erro: " + err.message);
        return;
    }
}

function calcularSubTotal(preco, quantidade) {
    return preco * quantidade;
}

async function verificaQuantidade(idProduto, quantidade) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Produtos`);
        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        const produtos = await resposta.json();
        const produto = produtos.find(p => p.id === idProduto);
        return produto.estoque - quantidade;
    } catch (err) {
        alert("Erro " + err.message)
        return;
    }
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
            alert(erro);
            return;
        }

        alert("Venda finalizada com sucesso!");

        const dados = await resposta.json();
        const idVenda = dados.id ?? vendaAtual.id;

        localStorage.setItem("idVenda", idVenda);

        window.onbeforeunload = null;
        window.location.href = "../vendas/finalizacaoVenda.html";
    } catch (err) {
        alert("Erro ao adicionar produto: " + err.message);
        return;
    }
}

async function cancelarVenda() {
    if (!vendaAtual) return alert("Nenhuma venda.");

    try {
        await fetch(`http://localhost:5164/BlueMoon/Vendas/${vendaAtual.id}/Cancelar`, {
            method: "PATCH"
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        alert("Venda cancelada com sucesso!");

        window.onbeforeunload = null;
        window.location.href = "../vendas/index.html";
    } catch (err) {
        alert("Erro ao adicionar produto: " + err.message);
        return;
    }
}
