function converterDataParaBack(data) {
    if (!data) return "";

    const partes = data.split("-");
    return partes[2] + partes[1] + partes[0];
}

document.addEventListener("DOMContentLoaded", async () => {

    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const usuarioId = localStorage.getItem("usuarioId");
    console.log("ID carregado:", usuarioId);

    if (!usuarioId) {
        alert("Nenhum usuário selecionado para edição.");
        return;
    }

    await buscarDadosUsuario(usuarioId);

    /*const btnVoltar = document.getElementById("btnVoltar");

    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            localStorage.setItem("usuarioId", usuarioId);
            window.location.href = "../usuarios/index.html";
        });
    }
        */

    const inputSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");

    if (inputSenha && toggleSenha) {
        toggleSenha.addEventListener("click", function () {
            if (inputSenha.type === "password") {
                inputSenha.type = "text";
                this.textContent = "🙈";
            } else {
                inputSenha.type = "password";
                this.textContent = "👁️";
            }
        });
    }

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

        preencherFormulario(usuario);

        localStorage.setItem("idPessoa", usuario.idPessoa);

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar os dados do usuário.");
    }
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

async function atualizarUsuario() {

    const usuarioId = localStorage.getItem("usuarioId");
    const idPessoa = localStorage.getItem("idPessoa");

    if (!usuarioId || !idPessoa) {
        alert("Erro interno: ID do usuário ou pessoa não encontrado.");
        return;
    }

    const Cargo = document.getElementById("cargo").value;
    const Salario = document.getElementById("inputSalario").value;
    const Admissao = document.getElementById("inputAdmissao").value;
    const AdmissaoConvertida = converterDataParaBack(Admissao);

    const HorarioInicio = document.querySelector("input[name='HorarioInicioCargaHoraria']").value;
    const HorarioFim = document.querySelector("input[name='HorarioFimCargaHoraria']").value;

    const dto = {
        Id: usuarioId,
        IdPessoa: idPessoa,
        Cargo: Number(Cargo),
        Salario: Number(Salario),
        Admissao: AdmissaoConvertida,
        HorarioInicioCargaHoraria: HorarioInicio.toString(),
        HorarioFimCargaHoraria: HorarioFim.toString(),
        Situacao: 1
    };

    console.log("DTO enviado:", dto);

    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        const body = await resposta.text();

        if (!resposta.ok) {
            alert("Erro ao atualizar usuário: " + body);
            return;
        }

        alert("Usuário atualizado com sucesso!");
        window.location.href = "../usuarios/index.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com servidor.");
    }
}
