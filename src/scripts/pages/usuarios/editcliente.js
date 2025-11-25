window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.setAttribute('disabled', 'true'));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        carregarCliente(id);
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

async function carregarCliente(id) {

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        cliente = await resposta.json();
        preencherCampos(cliente);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

function preencherCampos(cliente) {

    for (let campo in cliente) {
        if (cliente[campo] === "N/D") cliente[campo] = "";
    }

    let CPF = cliente.documento || "";
    let CNPJ = cliente.documento || "";
    let Nome = cliente.nome || "";
    let Telefone = cliente.telefone || "";
    let Email = cliente.email || "";
    let CEP = cliente.cep || "";
    let Logradouro = cliente.logradouro || "";
    let Bairro = cliente.bairro || "";
    let Numero = cliente.numero || "";
    let Complemento = cliente.complemento || "";
    let Cidade = cliente.cidade || "";
    let Estado = cliente.estado || 0;
    let InscricaoMunicipal = cliente.inscricaoMunicipal || "";
    let InscricaoEstadual = cliente.inscricaoEstadual || "";
    let Tipo = cliente.tipo || 1;

    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (Tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("ClienteFisico").checked = true;

        habilitarDivFisica();

        document.getElementById("inputCPF").value = CPF;

        document.getElementById("inputCPF").setAttribute("disabled", "true");
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
        selectEstadoFisico.value = Estado && Estado !== 0 ? Estado : 0;

    } else {

        pessoaFisica.classList.add("hidden");
        pessoaJuridica.classList.remove("hidden");
        document.getElementById("ClienteJuridico").checked = true;

        habilitarDivJuridica();

        document.getElementById("inputCNPJ").value = CNPJ;


        document.getElementById("inputCNPJ").setAttribute("disabled", "true");
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

        const selectEstadoJuridico = document.getElementById("estadoJuridico");
        selectEstadoJuridico.value = Estado && Estado !== 0 ? Estado : 0;
    }
}

document.getElementById('formCliente').addEventListener('submit', async (e) => {
    e.preventDefault();

    const isPessoaFisica = document.getElementById('ClienteFisico').checked;
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

    dados.id = cliente.id;
    dados.situacao = cliente.situacao;

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
            alert("Cliente atualizado com sucesso!");
            window.location.href = "../usuarios/addfuncionario.html";
        } else {
            const erro = await resposta.text();
            alert("Erro ao atualizar cliente: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
});
