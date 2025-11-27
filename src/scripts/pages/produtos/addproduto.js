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
