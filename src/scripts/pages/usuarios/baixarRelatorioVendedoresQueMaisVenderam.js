document.addEventListener("DOMContentLoaded", () => {
    function converterDataParaBack(data) {
        if (!data) return "";
        const partes = data.split("-");
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const form = document.getElementById("formVendedores");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inicio = document.getElementById("inicio").value;
        const fim = document.getElementById("fim").value;

        const dataInicio = converterDataParaBack(inicio);
        const dataFim = converterDataParaBack(fim);

        const dto = { dataInicio, dataFim};
        
        try {
            const resposta = await fetch("http://localhost:5164/BlueMoon/Relatorios/VendedoresQueMaisVenderam_R", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (!resposta.ok) {
                const texto = await resposta.text();
                alert("Erro ao gerar relatório: " + texto);
                return;
            }

            const blob = await resposta.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "RelatorioVendedoresQueMaisVenderam.pdf";
            link.click();
            URL.revokeObjectURL(link.href);

        } catch (erro) {
            alert("Erro ao conectar com servidor.");
        }
    });
});
