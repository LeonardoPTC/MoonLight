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
    const resposta = await fetch("http://localhost:5164/BlueMoon/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados) 
    });

    if (resposta.ok) {
      alert("Produto cadastrado com sucesso!");
      form.reset();
    } else {
      const erro = await resposta.text();
      alert("Erro ao cadastrar produto: " + erro);
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
});
