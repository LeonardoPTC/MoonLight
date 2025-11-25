document.addEventListener("DOMContentLoaded", () => {

    function converterDataParaBack(data) {
        if (!data) return "";

        const partes = data.split("-");
        return partes[2] + partes[1] + partes[0];
    }

    const pessoaId = localStorage.getItem("pessoaId");

    const inputSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");
    const iconeSenha = document.getElementById("iconeSenha");



    if (inputSenha && toggleSenha && iconeSenha) {
        iconeSenha.style = "width: 22px";
        toggleSenha.addEventListener("click", () => {
            if (inputSenha.type === "password") {
                inputSenha.type = "text";
                iconeSenha.src = "../../assets/olhoFechado.png";
                iconeSenha.style = "width: 22px";
                iconeSenha.alt = "Ocultar senha";
            } else {
                inputSenha.type = "password";
                iconeSenha.src = "../../assets/olhoAberto.png";
                iconeSenha.style = "width: 22px";
                iconeSenha.alt = "Mostrar Senha"
            }
        });
    }


    const form = document.getElementById("formUsuario");

    if (!form) {
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
                alert("Erro ao cadastrar usuário: " + body);
                return;
            }

            alert("Usuário cadastrado com sucesso!");
            window.location.href = "../usuarios/index.html";

        } catch (erro) {
            alert("Erro ao conectar com servidor.");
        }
    });

});
