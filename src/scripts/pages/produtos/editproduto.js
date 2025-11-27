window.addEventListener('load', async () => {
  await includeHTML("header", "../../include/header.html");
  await includeHTML("footer", "../../include/footer.html");

  const id = localStorage.getItem("idProduto");
  if (id) carregarProduto(id);
});

document.getElementById("formProduto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const dados = {};

  formData.forEach((valor, chave) => {
    if (
      chave === "ValorVenda" ||
      chave === "ValorCusto" ||
      chave === "QuantidadeEstoque" ||
      chave === "QuantidadeEstoqueMinimo"
    ) {
      dados[chave] = valor.trim() === "" ? 0 : parseFloat(valor);
    } else {
      dados[chave] = valor.trim() === "" ? "" : valor;
    }
  });

  try {
    dados.id = produto.id;
    dados.situacao = produto.situacao;
    const resposta = await fetch(`http://localhost:5164/BlueMoon/produtos/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Produto Atualizado com sucesso!");
      window.location.href = "../produtos/index.html";
    } else {
      const texto = await resposta.text();
      let mensagem;
      try {
        const erroJSON = JSON.parse(texto);
        const campo = Object.keys(erroJSON.errors)[0];
        mensagem = erroJSON.errors[campo][0];
      } catch {
        mensagem = texto;
      }
      alert("Erro ao atualizar produto: " + mensagem);
      return;
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
    return;
  }
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


  document.getElementById('inputcodBarras').value = codBarras || "";
  document.getElementById('Nome').value = nome || "";
  document.getElementById('inputDescricao').value = descricao || "";
  document.getElementById('inputNCM').value = NCM || "";
  document.getElementById('inputMarca').value = marca || "";
  document.getElementById('inputValorVenda').value = produto.valorVenda.toFixed(2) || "" || "";
  document.getElementById('inputprecoCusto').value = produto.valorCusto.toFixed(2) || "";
  document.getElementById('inputEstoque').value = produto.quantidadeEstoque || 0;
  document.getElementById('inputEstoqueMin').value = produto.quantidadeEstoqueMinimo || 0;
  //document.getElementById('inputSituacao').value = produto.situacao;
}
