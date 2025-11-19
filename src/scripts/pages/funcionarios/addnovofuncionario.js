document.addEventListener("DOMContentLoaded", () => {

    function converterDataParaBack(data) {
        if (!data) return "";

        const partes = data.split("-");
        return partes[2] + partes[1] + partes[0];
    }

    const pessoaId = localStorage.getItem("pessoaId");

    const btnVoltar = document.getElementById("btnVoltar");

    btnVoltar.addEventListener("click", () => {
        localStorage.setItem("pessoaId", pessoaId);
        window.location.href = `/src/pages/funcionarios/addDadosFuncionarioNovo.html?id=${pessoaId}`
    });

    if (!pessoaId) {
        console.warn("Nenhuma pessoa foi selecionada antes de entrar nesta tela.");
    }

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


        const Login = document.getElementById("inputEmail").value;
        const Senha = document.getElementById("senha").value;
        const Cargo = document.getElementById("cargo").value;
        const Salario = document.getElementById("inputSalario").value;
        const Admissao = document.getElementById("inputAdmissao").value;
        const AdmissaoConvertida = converterDataParaBack(Admissao);

        const HorarioInicioCargaHoraria =
            document.querySelector("input[name='HorarioInicioCargaHoraria']").value;

        const HorarioFimCargaHoraria =
            document.querySelector("input[name='HorarioFimCargaHoraria']").value;

        const dto = {
            login: Login,
            senha: Senha,
            cargo: Number(Cargo),
            salario: Number(Salario),
            admissao: AdmissaoConvertida,
            horarioInicioCargaHoraria: HorarioInicioCargaHoraria.toString(),
            horarioFimCargaHoraria: HorarioFimCargaHoraria.toString(),
            idPessoa: pessoaId
        };

        console.log("DTO enviado:", dto);

        try {
            const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dto)
            });

            const body = await resposta.text();

            if (!resposta.ok) {
                alert("Erro ao cadastrar funcionário: " + body);
                return;
            }

            alert("Funcionário cadastrado com sucesso!");
            window.location.href = "/src/pages/funcionarios/index.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com servidor.");
        }
    });

});
