document.addEventListener("DOMContentLoaded", () => {

    const inputSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");
    const iconeSenha = document.getElementById("iconeSenha");



    if (inputSenha && toggleSenha && iconeSenha) {
        iconeSenha.style = "width: 22px";
        toggleSenha.addEventListener("click", () => {
            if (inputSenha.type === "password") {
                inputSenha.type = "text";
                iconeSenha.src = "src/assets/olhoFechado.png";
                iconeSenha.style = "width: 22px";
                iconeSenha.alt = "Ocultar senha";
            } else {
                inputSenha.type = "password";
                iconeSenha.src = "src/assets/olhoAberto.png";
                iconeSenha.style = "width: 22px";
                iconeSenha.alt = "Mostrar Senha"
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
            window.location.href = "src/dashboard/index.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com servidor.");
        }
    });
});