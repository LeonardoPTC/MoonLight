document.addEventListener("DOMContentLoaded", () => {
  IMask(document.getElementById("inputcodBarras"), {
    mask: "0000000000000",
  });

  IMask(document.getElementById("inputNCM"), {
    mask: "0000.00.00",
  });

  IMask(document.getElementById("inputValorVenda"), {
    mask: Number,
    scale: 2,
    signed: false,
    thousandsSeparator: ".",
    radix: ",",
    mapToRadix: ["."],
  });

  IMask(document.getElementById("inputprecoCusto"), {
    mask: Number,
    scale: 2,
    signed: false,
    thousandsSeparator: ".",
    radix: ",",
    mapToRadix: ["."],
  });
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

  const camposObrigatorios = document.querySelectorAll("[data-required]");

  for (let campo of camposObrigatorios) {
    let nomeCampo = campo.name;

    if (campo.name === "ValorVenda") {
      nomeCampo = "Preço de Venda";
    }

    if (!campo.value.trim()) {
      alert(`Erro ao cadastrar produto: O campo ${nomeCampo} é obrigatório!`);
      return;
    }
  }

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      alert("Produto cadastrado com sucesso!");
      window.location.href = "../produtos/index.html";
    } else {
      const erro = await resposta.text();
      alert("Erro ao cadastrar produto: " + erro);
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
});
