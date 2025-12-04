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
                content.style.marginRight = expandida ? "40px" : "90px";

            } else {
                content.style.marginLeft = expandida ? "270px" : "200px";
            }
        };

         setTimeout(() => {
    aplicarMargens(sidebar.matches(':hover'));
  }, 0);

        sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
        sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
    }


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

        const camposObrigatorios = document.querySelectorAll("[data-required]");

        for (let campo of camposObrigatorios) {
            if (!campo.value.trim()) {
                alert(`Erro ao cadastrar dados do usuário: O campo ${campo.name} é obrigatório!`);
                return;
            }
        }

        try {
            const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios", {
                method: "POST",
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

                alert("Erro ao cadastrar dados do usuário: " + mensagem);
                return;
            }

            alert("Usuário cadastrado com sucesso!");
            window.location.href = "../usuarios/index.html";

        } catch (err) {
            alert("Erro: " + err.message);
            return;
        }
    });

});
