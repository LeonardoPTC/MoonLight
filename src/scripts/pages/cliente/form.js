document.getElementById("formCliente").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pessoaFisica = document.getElementById("pessoaFisica");
  const pessoaJuridica = document.getElementById("pessoaJuridica");

  if (pessoaFisica.classList.contains("hidden")) {
    pessoaFisica.querySelectorAll("[required]").forEach(el => el.removeAttribute("required"));
    pessoaJuridica.querySelectorAll("input[data-required], select[data-required], textarea[data-required]").forEach(el => el.setAttribute("required", ""));
  } else {
    pessoaJuridica.querySelectorAll("[required]").forEach(el => el.removeAttribute("required"));
    pessoaFisica.querySelectorAll("input[data-required], select[data-required], textarea[data-required]").forEach(el => el.setAttribute("required", ""));
  }

  const form = e.target;
  const formData = new FormData(form);
  const dados = {};

  formData.forEach((valor, chave) => {
    const camposEnum = ["Estado"];
    if (camposEnum.includes(chave)) {
      dados[chave] = valor === "0" ? 0 : parseInt(valor);
    } else {
      dados[chave] = valor.trim() === "" ? "" : valor.trim();
    }


  });

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
