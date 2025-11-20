document.addEventListener("DOMContentLoaded", () => {

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

    const form = document.getElementById("formLogin");

    if (!form) {
        console.error("Formulário de Login não encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();


        const Login = document.getElementById("inputEmail").value;
        const Senha = document.getElementById("senha").value;


        const dto = {
            login: Login,
            senha: Senha,
        };


        try {
            const resposta = await fetch("http://localhost:5164/BlueMoon/Usuarios/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dto)
            });

            if (!resposta.ok) {
                alert("Login ou Senha Inválidos! ");
                return;
            }

            alert("Login realizado com sucesso!");
            window.location.href = "../dashboard/index.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com servidor.");
        }
    });
});