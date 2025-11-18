window.addEventListener('load', async () => {
    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("ID recebido:", id);
    if (id) carregarProduto(id);
});

async function carregarProduto(id) {

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        produto = await resposta.json();
        preencherCampos(produto);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
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


    document.getElementById('inputCodigo').value = codigo || "";
    document.getElementById('inputcodBarras').value = codBarras || "";
    document.getElementById('Nome').value = nome || "";
    document.getElementById('inputDescricao').value = descricao || "";
    document.getElementById('inputNCM').value = NCM || "";
    document.getElementById('inputMarca').value = marca || "";
    document.getElementById('inputValorVenda').value = produto.valorVenda.toFixed(2) || "" || "";
    document.getElementById('inputprecoCusto').value = produto.valorCusto.toFixed(2) || "";
    document.getElementById('inputEstoque').value = produto.quantidadeEstoque || "";
    document.getElementById('inputEstoqueMin').value = produto.quantidadeEstoqueMinimo || "";
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