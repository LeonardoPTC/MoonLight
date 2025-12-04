document.addEventListener("DOMContentLoaded", async () => {

    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "200px" : "150px";
                content.style.marginRight = expandida ? "80px" : "120px";

            } else {
                content.style.marginLeft = expandida ? "300px" : "300px";
            }
        };

         setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

        sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
        sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
    }

    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("Nenhum usuário selecionado para edição.");
        return;
    }

    await buscarDadosUsuario(usuarioId);

    const form = document.getElementById("formUsuario");

    if (!form) {
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
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        const usuario = await resposta.json();

        preencherFormulario(usuario);

        localStorage.setItem("idPessoa", usuario.idPessoa);

    } catch (err) {
        alert("Não foi possível carregar os dados do usuário." + err.message);
        return;
    }
}

function preencherFormulario(usuario) {

    document.getElementById("cargo").value = usuario.cargo;
    document.getElementById("inputSalario").value = usuario.salario;

    let dataAdmissao = usuario.admissao;
    const inputDataAdmissao = document.getElementById("inputAdmissao");
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

    if (dataAdmissao === "01/01/0001") { 
        formatada = "";
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

    const camposObrigatorios = document.querySelectorAll("[data-required]");

    for (let campo of camposObrigatorios) {
        if (!campo.value.trim()) {
            alert(`Erro ao atualizar dados do usuário: O campo ${campo.name} é obrigatório!`);
            return;
        }
    }

    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
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
            alert("Erro ao atualizar dados do usuário: " + mensagem);
            return;
        }

        alert("Usuário atualizado com sucesso!");
        window.location.href = "../usuarios/index.html";

    } catch (erro) {
        alert("Erro: " + erro.message);
    }
}
