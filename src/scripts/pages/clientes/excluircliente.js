async function excluirCliente(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/pessoas/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        cliente = await resposta.json();

        const reqdelete = await fetch(`http://localhost:5164/BlueMoon/pessoas/${id}`, {
            method: "DELETE"
        });

        if (reqdelete.ok) {
            alert(`${cliente.nome ?? $cliente.codigo} excluído com sucesso!`);
            window.location.reload();
        } else {
            const erro = await reqdelete.text();
            alert("Erro ao deletar cliente: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

