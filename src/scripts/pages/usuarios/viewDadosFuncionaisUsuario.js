document.addEventListener("DOMContentLoaded", async () => {

    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("Nenhum usuário selecionado para edição.");
        return;
    }

    await buscarDadosUsuario(usuarioId);

    const btnVoltar = document.getElementById("btnVoltar");

    btnVoltar.addEventListener("click", () => {
        window.location.href = '../usuarios/viewDadosCadastraisUsuario.html';
    });

    const form = document.getElementById("formUsuario");

    if (!form) {
        console.error("Formulário de usuário não encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await atualizarUsuario();
    });
});

function converterDataParaBack(data) {
    if (!data) return "";

    const partes = data.split("-");
    return partes[2] + partes[1] + partes[0];
}


async function buscarDadosUsuario(id) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
        }

        const usuario = await resposta.json();
        console.log(usuario)

        preencherFormulario(usuario);

        localStorage.setItem("idPessoa", usuario.idPessoa);

        desativarInputs();

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar os dados do usuário.");
    }
}

function preencherFormulario(usuario) {

    document.getElementById("cargo").value = usuario.cargo;
    document.getElementById("inputSalario").value = "R$ " + Number(usuario.salario).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    let dataAdmissao = usuario.admissao;

    if (dataAdmissao == "01/01/0001") {
        dataAdmissao = "Não Cadastrada"
    }

    document.getElementById("inputAdmissao").value = dataAdmissao;

    document.getElementById("HorarioInicioCargaHoraria").value = usuario.horarioInicioCargaHoraria;
    document.getElementById("HorarioFimCargaHoraria").value = usuario.horarioFimCargaHoraria;
}

function desativarInputs() {
    const inputs = document.querySelectorAll("input, select, textarea");

    inputs.forEach(input => {
        input.setAttribute("disabled", true);
    });
}