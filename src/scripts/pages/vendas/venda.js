let vendaAtual = null;
let itens = [];

window.addEventListener('load', async () => {
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
        content.style.marginLeft = expandida ? "270px" : "200px";
      }
    };

     setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

    sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
    sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
  }

    await carregarClientes();
    await carregarUsuarios();
    await carregarProdutos();

    document.getElementById("etapa2").style.display = "none";

    document.getElementById("btnIniciarVenda").addEventListener("click", iniciarVenda);
    document.getElementById("btnFechar").addEventListener("click", fecharVenda);
    document.getElementById("btnCancelar").addEventListener("click", cancelarVenda);
    document.getElementById("btnAddProduto").addEventListener("click", adicionarProduto);
    document.getElementById("btnRemoveProduto").addEventListener("click", removerProduto);
    document.getElementById("btnDeleteProduto").addEventListener("click", excluirProduto);
    document.getElementById('btnCadastrarCliente').addEventListener('click', () => {
        window.location.href = `../clientes/addcliente.html`;
    });

});

document.getElementById("selectCliente").addEventListener("change", atualizarSelects);
document.getElementById("selectUsuario").addEventListener("change", atualizarSelects);


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
        alert("Erro ao carregar clientes: " + err.message);
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
        alert("Erro ao carregar usuários: " + err.message);
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
        return;
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
        alert("Selecione cliente e usuário!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPessoa, idUsuario })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        vendaAtual = await resposta.json();

        window.onbeforeunload = function () {
            return true;
        };

        alert("Venda iniciada!");
        document.getElementById("btnIniciarVenda").style.display = 'none';
        document.getElementById('btnCadastrarCliente').style.display = 'none';

        const inputs = document.querySelectorAll('#selectCliente, #selectUsuario');
        inputs.forEach(input => input.setAttribute('disabled', true));

        document.getElementById("etapa2").style.display = "block";
        itens = [];
        atualizarTabela(itens);
    } catch (err) {
        alert("Erro ao iniciar venda: " + err.message);
        return;
    }
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

    const dto = { idProduto, quantidade };
    const qtdDisponivel = await verificaQuantidade(dto.idProduto, dto.quantidade);
    if (qtdDisponivel < 0) {
        alert("Quantidade de Estoque indisponível!");
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

async function atualizarTabela(itens) {
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

        if (!itens || itens.length === 0) {
            const trTotalVazio = document.createElement("tr");
            trTotalVazio.innerHTML = `
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>R$ 0,00</strong></td>
            `;
            tabela.appendChild(trTotalVazio);
            return;
        }


        itens.forEach(item => {
            if (item.quantidade > 0) {
                const produtoEncontrado = produtos.find(p => p.id === item.idProduto);
                const nomeProduto = produtoEncontrado ? produtoEncontrado.nome : "Produto não encontrado";
                const preco = produtoEncontrado ? produtoEncontrado.valorVenda : 0;

                const somaItem = calcularSubTotal(preco, item.quantidade);
                subtotal += somaItem;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td style="text-align: center;">${nomeProduto}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>R$ ${somaItem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            `;
                tabela.appendChild(tr);
            }
        });
        const trTotal = document.createElement("tr");
        trTotal.innerHTML = `
    <td colspan="3"><strong>Total</strong></td>
    <td><strong>R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></strong></td>
`;
        tabela.appendChild(trTotal);

    } catch (err) {
        alert("Erro ao atualizar tabela: " + err.message);
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
        alert("Erro: " + err.message);
        return;
    }
}

async function fecharVenda() {
    if (!vendaAtual || itens.length === 0) {
        alert("Não foi possível fechar a venda: Não há venda em andamento ou produtos adicionados.");
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
        alert("Erro ao fechar venda: " + err.message);
        return;
    }
}

async function cancelarVenda() {
    if (!vendaAtual) {
        alert("Não foi possível cancelar a venda: Não há venda em andamento.");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Vendas/${vendaAtual.id}/Cancelar`, {
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
        alert("Erro ao cancelar venda: " + err.message);
        return;
    }
}
