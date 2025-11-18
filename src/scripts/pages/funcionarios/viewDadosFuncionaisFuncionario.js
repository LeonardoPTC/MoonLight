function converterDataParaBack(data) {
    if (!data) return "";

    const partes = data.split("-");
    return partes[2] + partes[1] + partes[0];
}

document.addEventListener("DOMContentLoaded", async () => {

    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const funcionarioId = localStorage.getItem("funcionarioId");
    const pessoaId = localStorage.getItem("pessoaId");


    if (!funcionarioId) {
        alert("Nenhum usuário selecionado para edição.");
        return;
    }

    await buscarDadosUsuario(funcionarioId);

    const btnVoltar = document.getElementById("btnVoltar");

    btnVoltar.addEventListener("click", () => {
        window.location.href = `http://localhost:5500/src/pages/funcionarios/viewDadosCadastraisFuncionario.html?idPessoa=${pessoaId}&idUsuario=${funcionarioId}`;
    });

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

    const form = document.getElementById("formFuncionario");

    if (!form) {
        console.error("Formulário de funcionário não encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await atualizarFuncionario();
    });
});

async function buscarDadosUsuario(id) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar dados do funcionário.");
        }

        const usuario = await resposta.json();

        preencherFormulario(usuario);

        localStorage.setItem("idPessoa", usuario.idPessoa);

        desativarInputs();

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar os dados do funcionário.");
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

    document.getElementById("inputEmail").value = usuario.email;

    document.getElementById("senha").value = "";
}

async function atualizarFuncionario() {

    const funcionarioId = localStorage.getItem("funcionarioId");
    const idPessoa = localStorage.getItem("idPessoa");

    if (!funcionarioId || !idPessoa) {
        alert("Erro interno: ID do funcionário ou pessoa não encontrado.");
        return;
    }

    const Login = document.getElementById("inputEmail").value;
    const Senha = document.getElementById("senha").value;
    const Cargo = document.getElementById("cargo").value;
    const Salario = document.getElementById("inputSalario").value;
    const Admissao = document.getElementById("inputAdmissao").value;
    const AdmissaoConvertida = converterDataParaBack(Admissao);

    const HorarioInicio = document.querySelector("input[name='HorarioInicioCargaHoraria']").value;
    const HorarioFim = document.querySelector("input[name='HorarioFimCargaHoraria']").value;

    const dto = {
        id: funcionarioId,
        idPessoa: idPessoa,
        login: Login,
        senha: Senha,
        cargo: Number(Cargo),
        salario: Number(Salario),
        admissao: AdmissaoConvertida,
        horarioInicioCargaHoraria: HorarioInicio.toString(),
        horarioFimCargaHoraria: HorarioFim.toString(),
        situacao: 1
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
            alert("Erro ao atualizar funcionário: " + body);
            return;
        }

        alert("Funcionário atualizado com sucesso!");
        window.location.href = "/src/pages/funcionarios/index.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com servidor.");
    }
}
