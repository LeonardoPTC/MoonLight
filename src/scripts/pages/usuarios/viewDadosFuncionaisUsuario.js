function converterDataParaBack(data) {
    if (!data) return "";

    const partes = data.split("-");
    return partes[2] + partes[1] + partes[0];
}

document.addEventListener("DOMContentLoaded", async () => {

    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const usuarioId = localStorage.getItem("usuarioId");
    const pessoaId = localStorage.getItem("pessoaId");


    if (!usuarioId) {
        alert("Nenhum usuário selecionado para edição.");
        return;
    }

    await buscarDadosUsuario(usuarioId);

    const btnVoltar = document.getElementById("btnVoltar");

    btnVoltar.addEventListener("click", () => {
        window.location.href = `http://localhost:5500/src/pages/usuarios/viewDadosCadastraisUsuario.html?idPessoa=${pessoaId}&idUsuario=${usuarioId}`;
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

function desativarInputs() {
    const inputs = document.querySelectorAll("input, select, textarea");

    inputs.forEach(input => {
        input.setAttribute("disabled", true);
    });
}

function preencherFormulario(usuario) {

    document.getElementById("cargo").value = usuario.cargo;
    document.getElementById("inputSalario").value = usuario.salario;

    let dataAdmissao = usuario.admissao;
    let formatada = "";

    if (dataAdmissao) {
        if (dataAdmissao.includes("/")) {
            const partes = dataAdmissao.split("/");
            formatada = `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
        } else if (dataAdmissao.includes("T")) {
            formatada = dataAdmissao.split("T")[0];
        } else if (dataAdmissao.includes("-")) {
            formatada = dataAdmissao;
        }
    }

    document.getElementById("inputAdmissao").value = formatada;

    document.getElementById("HorarioInicioCargaHoraria").value = usuario.horarioInicioCargaHoraria;
    document.getElementById("HorarioFimCargaHoraria").value = usuario.horarioFimCargaHoraria;
}
