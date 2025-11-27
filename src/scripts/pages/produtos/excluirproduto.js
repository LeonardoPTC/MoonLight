async function excluirProduto(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        produto = await resposta.json();

        const reqdelete = await fetch(`http://localhost:5164/BlueMoon/produtos/${id}`, {
            method: "DELETE"
        });

        if (reqdelete.ok) {
            alert(`${produto.nome ?? $produto.codigo} excluído com sucesso!`);
            window.location.reload();
        } else {
            const erro = await reqdelete.text();
            alert("Erro ao deletar produto: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

