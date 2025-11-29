document.addEventListener("DOMContentLoaded", async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

     const sidebar = document.querySelector(".sidebar")
  const content = document.querySelector("#content");
  const telaPequena = window.matchMedia("(max-width: 1366px)");

  if (sidebar) {

    const aplicarMargens = (expandida) => {
      if (telaPequena.matches) {
        content.style.marginLeft = expandida ? "200px" : "150px";
        content.style.marginRight = expandida ? "90px" : "120px";

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
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Produto cadastrado com sucesso!");
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
            alert("Erro ao cadastrar produto: " + mensagem);
            return;
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
});
