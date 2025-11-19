window.addEventListener('load', async () => {
    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    await carregarClientes();
    await carregarUsuarios();
    await carregarProdutos();

    document.getElementById("btnIniciarVenda").addEventListener("click", iniciarVenda);
    document.getElementById("btnAddProduto").addEventListener("click", adicionarProduto);
});

let vendaAtual = null;
let itens = [];

document.getElementById("selectCliente").addEventListener("change", atualizarSelects);
document.getElementById("selectUsuario").addEventListener("change", atualizarSelects);


async function carregarClientes() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");
        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes");
        }
        clientes = await resposta.json();
        console.log(clientes);
        preencherSelect("selectCliente", clientes, "id");
    } catch (err) {
        alert("Erro ao carregar clientes: " + err.message);
    }
}

async function carregarUsuarios() {
    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios");
        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuários");
        }
        usuarios = await resposta.json();
        preencherSelect("selectUsuario", usuarios, "idUsuario");
    } catch (err) {
        alert("Erro ao carregar usuários: " + err.message);
    }
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


function preencherSelect(idSelect, lista, keyId) {
    const select = document.getElementById(idSelect);
    if (!select) {
        return console.error(`Select com id "${idSelect}" não encontrado.`);
    }
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = `Selecione uma opção...`;
    select.appendChild(placeholder);
    lista.forEach(item => {
        const op = document.createElement("option");
        op.value = item[keyId];
        op.textContent = item.nome;
        select.appendChild(op);
    });
}


async function iniciarVenda() {
    const idPessoa = document.getElementById("selectCliente").value;
    const idUsuario = document.getElementById("selectUsuario").value;

    if (!idPessoa || !idUsuario) {
        alert("Selecione cliente e usuário.");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPessoa, idUsuario })
        });

        if (!resposta.ok) throw new Error(await resposta.text());

        vendaAtual = await resposta.json();
        alert("Venda iniciada!");
        document.getElementById("etapa2").style.display = "block";
        itens = [];
        atualizarTabela();
    } catch (err) {
        alert("Erro ao iniciar venda: " + err.message);
    }
}

async function adicionarProduto() {
    if (!vendaAtual) {
        alert("Inicie a venda antes de adicionar produtos.");
        return;
    }

    const idProduto = document.getElementById("selectProduto").value;
    const qtd = parseInt(document.getElementById("inputQtd").value);

    if (!idProduto || qtd <= 0) {
        alert("Selecione um produto e a quantidade.");
        return;
    }

    const dto = { idProduto, quantidade };
    itens.push(dto);
    atualizarTabela(itens);
}

async function fecharVenda(dto) {
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

    } catch (err) {
        alert("Erro ao adicionar produto: " + err.message);
    }
}

async function atualizarTabela(itens) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Produtos`);
        const produtos = await resposta.json();

        const tabela = document.getElementById("tabelaItens");
        tabela.innerHTML = "";
        let subtotal = 0;

        itens.forEach(item => {
            const produtoEncontrado = produtos.find(p => p.id === item.idProduto);
            const nomeProduto = produtoEncontrado ? produtoEncontrado.nome : "Produto não encontrado";
            const preco = produtoEncontrado ? produtoEncontrado.valorVenda : 0;

            const soma = calcularSubTotal(preco, item.quantidade);
            subtotal += soma;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nomeProduto}</td>
                <td>${item.quantidade}</td>
            `;
            tabela.appendChild(tr);
        });

        console.log("Subtotal:", subtotal);
    } catch (erro) {
        console.error("Erro ao atualizar tabela:", erro);
    }
}

async function calcularSubTotal(preco, quantidade) {
    let soma = 0;
    soma = preco * quantidade;
    return soma;
}