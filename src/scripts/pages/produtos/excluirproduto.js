async function excluirProduto(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`);

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
            alert(mensagem);
        }

        produto = await resposta.json();

        const reqdelete = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`, {
            method: "DELETE"
        });

        if (reqdelete.ok) {
            alert(`${produto.nome ?? $produto.codigo} excluído com sucesso!`);
            window.location.reload();
        } else {
            const erro = await resposta.text();
            alert(erro);
            return;
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
}

