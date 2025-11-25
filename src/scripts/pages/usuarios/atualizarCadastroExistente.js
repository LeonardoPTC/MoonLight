window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.setAttribute('disabled', 'true'));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        carregarUsuario(id);
        localStorage.setItem("pessoaId", id);
    }
});

function habilitarDivFisica() {
    document.querySelectorAll('#pessoaFisica input, #pessoaFisica select')
        .forEach(el => el.disabled = false);
    document.querySelectorAll('#pessoaJuridica input, #pessoaJuridica select')
        .forEach(el => el.disabled = true);
}

function habilitarDivJuridica() {
    document.querySelectorAll('#pessoaJuridica input, #pessoaJuridica select')
        .forEach(el => el.disabled = false);
    document.querySelectorAll('#pessoaFisica input, #pessoaFisica select')
        .forEach(el => el.disabled = true);
}

async function carregarUsuario(id) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        usuario = await resposta.json();
        preencherCampos(usuario);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

function preencherCampos(usuario) {

    for (let campo in usuario) {
        if (usuario[campo] === "N/D") usuario[campo] = "";
    }

    let CPF = usuario.documento || "";
    let CNPJ = usuario.documento || "";
    let Nome = usuario.nome || "";
    let Telefone = usuario.telefone || "";
    let Email = usuario.email || "";
    let CEP = usuario.cep || "";
    let Logradouro = usuario.logradouro || "";
    let Bairro = usuario.bairro || "";
    let Numero = usuario.numero || "";
    let Complemento = usuario.complemento || "";
    let Cidade = usuario.cidade || "";
    let Estado = usuario.estado || 0;
    let InscricaoMunicipal = usuario.inscricaoMunicipal || "";
    let InscricaoEstadual = usuario.inscricaoEstadual || "";
    let Tipo = usuario.tipo || 1;

    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (Tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("UsuarioFisico").checked = true;

        habilitarDivFisica();

        document.getElementById("inputCPF").value = CPF;
        document.getElementById("inputNomeFisico").value = Nome;
        document.getElementById("inputTelefoneFisico").value = Telefone;
        document.getElementById("inputEmailFisico").value = Email;
        document.getElementById("inputCEPFisico").value = CEP;
        document.getElementById("inputLogradouroFisico").value = Logradouro;
        document.getElementById("inputBairroFisico").value = Bairro;
        document.getElementById("inputNumeroFisico").value = Numero;
        document.getElementById("inputComplementoFisico").value = Complemento;
        document.getElementById("inputCidadeFisico").value = Cidade;
        
        const selectEstadoFisico = document.getElementById("estadoFisico");
        if (Estado && Estado !== 0 && Estado <= 26) {
            selectEstadoFisico.value = Estado;
        } else {
            selectEstadoFisico.value = 0;
            selectEstadoFisico.options[0].text = "Estado não definido";
        }

    } else {

        pessoaFisica.classList.add("hidden");
        pessoaJuridica.classList.remove("hidden");
        document.getElementById("UsuarioJuridico").checked = true;

        habilitarDivJuridica();

        document.getElementById("inputCNPJ").value = CNPJ;
        document.getElementById("inputInscricaoMunicipal").value = InscricaoMunicipal;
        document.getElementById("inputInscricaoEstadual").value = InscricaoEstadual;
        document.getElementById("inputNomeJuridico").value = Nome;
        document.getElementById("inputTelefoneJuridico").value = Telefone;
        document.getElementById("inputEmailJuridico").value = Email;
        document.getElementById("inputCEPJuridico").value = CEP;
        document.getElementById("inputLogradouroJuridico").value = Logradouro;
        document.getElementById("inputBairroJuridico").value = Bairro;
        document.getElementById("inputNumeroJuridico").value = Numero;
        document.getElementById("inputComplementoJuridico").value = Complemento;
        document.getElementById("inputCidadeJuridico").value = Cidade;

        const selectEstadoFisico = document.getElementById("estadoJuridico");
        if (Estado && Estado !== 0 && Estado <= 26) {
            selectEstadoFisico.value = Estado;
        } else {
            selectEstadoFisico.value = 0;
            selectEstadoFisico.options[0].text = "Estado não definido";
        }

    }
}

document.getElementById('formUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const isPessoaFisica = document.getElementById('UsuarioFisico').checked;
    const containerAtivo = isPessoaFisica
        ? document.getElementById('pessoaFisica')
        : document.getElementById('pessoaJuridica');

    const dados = {};
    containerAtivo.querySelectorAll('input, select').forEach(el => {
        if (el.name) {
            if (el.name === "Estado") {
                dados[el.name] = el.value === "0" ? 0 : parseInt(el.value);
            } else {
                dados[el.name] = el.value.trim();
            }
        }
    });

    dados.id = usuario.id;
    dados.situacao = usuario.situacao;

    console.log(dados);

    const camposObrigatorios = containerAtivo.querySelectorAll('[data-required]');
    for (let campo of camposObrigatorios) {
        if (!campo.value || !campo.value.trim()) {
            alert(`O campo ${campo.name} é obrigatório!`);
            campo.focus();
            return;
        }
    }

    try {
        const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Cadastro do usuário atualizado com sucesso!");
            window.location.href = "../usuarios/addDadosFuncionaisUsuario.html";
        } else {
            const erro = await resposta.text();
            alert("Erro ao atualizar funcionário: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
});
