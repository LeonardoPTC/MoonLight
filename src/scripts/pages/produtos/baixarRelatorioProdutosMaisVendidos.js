document.addEventListener("DOMContentLoaded", () => {
    function converterDataParaBack(data) {
        if (!data) return "";
        const partes = data.split("-");
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const form = document.getElementById("formProdutos");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inicio = document.getElementById("inicio").value;
        const fim = document.getElementById("fim").value;
        
        if (!inicio && !fim) {
            alert("Erro ao gerar relatório: Data início e fim de busca são obrigatórias");
            return;
        }

        const dataInicio = converterDataParaBack(inicio);
        const dataFim = converterDataParaBack(fim);

        const dto = { dataInicio, dataFim };

        try {
            const resposta = await fetch("http://localhost:5164/BlueMoon/Relatorios/ProdutosMaisVendidos_R", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (!resposta.ok) {
                const texto = await resposta.text();
                let mensagem;
                try {
                    const erroJSON = JSON.parse(texto);
                    const campo = Object.keys(erroJSON.errors)[0];
                    mensagem = erroJSON.errors[campo][0];
                } catch {
                    mensagem = texto;
                }
                alert("Erro ao gerar relatório: " + mensagem);
                return;
            }

            const blob = await resposta.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "RelatorioProdutosMaisVendidos.pdf";
            link.click();
            URL.revokeObjectURL(link.href);

        } catch (err) {
            alert("Erro ao conectar com servidor." + err.message);
            return;
        }
    });
});
