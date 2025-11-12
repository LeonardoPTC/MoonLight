document.getElementById("formCliente").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pessoaFisica = document.getElementById("pessoaFisica");
  const pessoaJuridica = document.getElementById("pessoaJuridica");
  const form = e.target;


  let removido = null;

  if (pessoaFisica.classList.contains("hidden")) {
    removido = pessoaFisica;
    pessoaFisica.remove();
  } else {
    removido = pessoaJuridica;
    pessoaJuridica.remove();
  }

  const formData = new FormData(form);
  const dados = {};

  formData.forEach((valor, chave) => {
    if (chave === "Estado") {
      dados[chave] = valor === "0" ? 0 : parseInt(valor);
    } else {
      dados[chave] = valor.trim();
    }
  });

  form.appendChild(removido);

  console.log(dados);
  
  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      alert("Cliente cadastrado com sucesso!");
      window.location.href = "/src/pages/clientes/index.html";
    } else {
      const erro = await resposta.text();
      alert("Erro ao cadastrar cliente: " + erro);
    }
  } catch (err) {
    alert("Erro na conexão: " + err.message);
  }
});
