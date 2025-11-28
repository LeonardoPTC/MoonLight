window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const id = localStorage.getItem("idProduto");

    const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "180px" : "150px";
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

    if (id) carregarProduto(id);
});

async function carregarProduto(id) {

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        produto = await resposta.json();
        preencherCampos(produto);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
}


function preencherCampos(produto) {

    let codigo = produto.codigo || "";
    let codBarras = produto.codigoBarras;
    let nome = produto.nome;
    let descricao = produto.descricao;
    let NCM = produto.ncm;
    let marca = produto.marca;
    //let situacao = produto.situacao; Para o Segundo Estágio


    if (codBarras === "N/D") {
        codBarras = "";
    }

    if (nome === "N/D") {
        nome = "";
    }

    if (descricao === "N/D") {
        descricao = "";
    }

    if (NCM === "N/D") {
        NCM = "";
    }

    if (marca === "N/D") {
        marca = "";
    }


    document.getElementById('inputCodigo').value = codigo || 0;
    document.getElementById('inputcodBarras').value = codBarras || "";
    document.getElementById('Nome').value = nome || "";
    document.getElementById('inputDescricao').value = descricao || "";
    document.getElementById('inputNCM').value = NCM || "";
    document.getElementById('inputMarca').value = marca || "";
    const venda = Number(produto.valorVenda);

    document.getElementById('inputValorVenda').value = "R$ " + venda.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const custo = Number(produto.valorCusto);

    document.getElementById('inputprecoCusto').value = "R$ " + custo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    document.getElementById('inputEstoque').value = produto.quantidadeEstoque || 0;
    document.getElementById('inputEstoqueMin').value = produto.quantidadeEstoqueMinimo || 0;
    //document.getElementById('inputSituacao').value = situacao; Para o Segundo Estágio


    const inputs = document.querySelectorAll('#formProduto input, #formProduto textarea');
    inputs.forEach(input => {
        input.setAttribute('disabled', true);
    });

    const selects = document.querySelectorAll('#formProduto select');
    selects.forEach(select => {
        select.addEventListener('mousedown', e => e.preventDefault());
        select.addEventListener('keydown', e => e.preventDefault());
    });
}