window.addEventListener('load', async () => {
    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const radios = document.querySelectorAll('input[type="radio"]');
    const inputCNPJ = document.getElementById('inputCNPJ');

    radios.forEach(radio => radio.setAttribute('disabled', 'true'));
    if (inputCNPJ) inputCNPJ.setAttribute('disabled', 'true');

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        carregarFuncionario(id);
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

async function carregarFuncionario(id) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        funcionario = await resposta.json();
        preencherCampos(funcionario);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

function preencherCampos(funcionario) {

    for (let campo in funcionario) {
        if (funcionario[campo] === "N/D") funcionario[campo] = "";
    }

    let CPF = funcionario.documento || "";
    let CNPJ = funcionario.documento || "";
    let Nome = funcionario.nome || "";
    let Telefone = funcionario.telefone || "";
    let Email = funcionario.email || "";
    let CEP = funcionario.cep || "";
    let Logradouro = funcionario.logradouro || "";
    let Bairro = funcionario.bairro || "";
    let Numero = funcionario.numero || "";
    let Complemento = funcionario.complemento || "";
    let Cidade = funcionario.cidade || "";
    let Estado = funcionario.estado || 0;
    let InscricaoMunicipal = funcionario.inscricaoMunicipal || "";
    let InscricaoEstadual = funcionario.inscricaoEstadual || "";
    let Tipo = funcionario.tipo || 1;

    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (Tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("FuncionarioFisico").checked = true;

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
        document.getElementById("FuncionarioJuridico").checked = true;

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

document.getElementById('formFuncionario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const isPessoaFisica = document.getElementById('FuncionarioFisico').checked;
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

    dados.id = funcionario.id;
    dados.situacao = funcionario.situacao;

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
            alert("Funcionário atualizado com sucesso!");
            window.location.href = "/src/pages/funcionarios/addDadosFuncionaisFuncionario.html";
        } else {
            const erro = await resposta.text();
            alert("Erro ao atualizar funcionário: " + erro);
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
});
