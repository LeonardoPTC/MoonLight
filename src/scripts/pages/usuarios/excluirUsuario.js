async function excluirUsuario(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este Usuário?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        usuario = await resposta.json();

        const reqdelete = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${id}`, {
            method: "DELETE"
        });

        if (reqdelete.ok) {
            alert(`${usuario.nome ?? $usuario.codigo} excluído com sucesso!`);
            window.location.reload();
        } else {
            const erro = await reqdelete.text();
            alert("Erro ao deletar usuario: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

