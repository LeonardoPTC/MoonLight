window.addEventListener('load', async () => {
    await includeHTML("header", "/src/include/header.html");
    await includeHTML("footer", "/src/include/footer.html");

    const urlParams = new URLSearchParams(window.location.search);
    const idPessoa = urlParams.get('idPessoa');
    const idUsuario = urlParams.get('idUsuario');

    if (idPessoa) {
        carregarFuncionario(idPessoa, idUsuario);
        localStorage.setItem("pessoaId", idPessoa);
    }

    if (idUsuario) {
        localStorage.setItem("funcionarioId", idUsuario);
    }
});

async function carregarFuncionario(id, idUsuario) {

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);
        const respostaUsuario = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${idUsuario}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        funcionario = await resposta.json();
        usuario = await respostaUsuario.json();

        preencherCampos(funcionario, usuario);

    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

function preencherCampos(funcionario, usuario) {

    let codigo = usuario.codigoUsuario || "";
    let documento = funcionario.documento || "";
    let nome = funcionario.nome || "";
    let telefone = funcionario.telefone || "";
    let email = funcionario.email || "";
    let cep = funcionario.cep || "";
    let logradouro = funcionario.logradouro || "";
    let bairro = funcionario.bairro || "";
    let numero = funcionario.numero || "";
    let complemento = funcionario.complemento || "";
    let cidade = funcionario.cidade || "";
    let estado = funcionario.estado || 0;
    let inscricaoMunicipal = funcionario.inscricaoMunicipal || "";
    let inscricaoEstadual = funcionario.inscricaoEstadual || "";
    let tipo = funcionario.tipo || 1;

    for (let campo in funcionario) {
        if (funcionario[campo] === "N/D") funcionario[campo] = "";
    }

    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("FuncionarioFisico").checked = true;

        document.getElementById("inputCodigoFisico").value = codigo;
        document.getElementById("inputCPF").value = documento;
        document.getElementById("inputNomeFisico").value = nome;
        document.getElementById("inputTelefoneFisico").value = telefone;
        document.getElementById("inputEmailFisico").value = email;
        document.getElementById("inputCEPFisico").value = cep;
        document.getElementById("inputLogradouroFisico").value = logradouro;
        document.getElementById("inputBairroFisico").value = bairro;
        document.getElementById("inputNumeroFisico").value = numero;
        document.getElementById("inputComplementoFisico").value = complemento;
        document.getElementById("inputCidadeFisico").value = cidade;

        const selectEstadoFisico = document.getElementById("estadoFisico");
        if (estado && estado !== 0) {
            selectEstadoFisico.value = estado;
        } else {
            selectEstadoFisico.value = 0;
            selectEstadoFisico.options[0].text = "Estado não definido";
        }

    } else {
        pessoaFisica.classList.add("hidden");
        pessoaJuridica.classList.remove("hidden");
        document.getElementById("FuncionarioJuridico").checked = true;

        document.getElementById("inputCodigoJuridico").value = codigo;
        document.getElementById("inputCNPJ").value = documento;
        document.getElementById("inputInscricaoMunicipal").value = inscricaoMunicipal;
        document.getElementById("inputInscricaoEstadual").value = inscricaoEstadual;
        document.getElementById("inputNomeJuridico").value = nome;
        document.getElementById("inputTelefoneJuridico").value = telefone;
        document.getElementById("inputEmailJuridico").value = email;
        document.getElementById("inputCEPJuridico").value = cep;
        document.getElementById("inputLogradouroJuridico").value = logradouro;
        document.getElementById("inputBairroJuridico").value = bairro;
        document.getElementById("inputNumeroJuridico").value = numero;
        document.getElementById("inputComplementoJuridico").value = complemento;
        document.getElementById("inputCidadeJuridico").value = cidade;

        const selectEstadoJuridico = document.getElementById("estadoJuridico");
        if (estado && estado !== 0) {
            selectEstadoJuridico.value = estado;
        } else {
            selectEstadoJuridico.value = 0;
            selectEstadoJuridico.options[0].text = "Estado não definido";
        }
    }

    const tipoPessoa = document.getElementsByName('tipo');
    const formularioFisico = document.getElementById('pessoaFisica');
    const formularioJuridico = document.getElementById('pessoaJuridica');

    tipoPessoa.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.getElementById("FuncionarioFisico").checked) {
                formularioFisico.classList.remove('hidden');
                formularioJuridico.classList.add('hidden');
            } else {
                formularioJuridico.classList.remove('hidden');
                formularioFisico.classList.add('hidden');
            }
        });
    });

    const inputs = document.querySelectorAll('#formFuncionario input, #formFuncionario select');
    inputs.forEach(input => input.setAttribute('disabled', true));

    const selects = document.querySelectorAll('#formFuncionario select');
    selects.forEach(select => {
        select.addEventListener('mousedown', e => e.preventDefault());
        select.addEventListener('keydown', e => e.preventDefault());
    });
}
