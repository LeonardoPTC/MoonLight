window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const urlParams = new URLSearchParams(window.location.search);
    const idPessoa = urlParams.get('idPessoa');
    const idUsuario = urlParams.get('idUsuario');

    if (idPessoa) {
        carregarpessoa(idPessoa, idUsuario);
        localStorage.setItem("pessoaId", idPessoa);
    }

    if (idUsuario) {
        localStorage.setItem("usuarioId", idUsuario);
    }
});

async function carregarpessoa(id, idUsuario) {
    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);
        const respostaUsuario = await fetch(`http://localhost:5164/BlueMoon/Usuarios/${idUsuario}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
        }

        pessoa = await resposta.json();
        usuario = await respostaUsuario.json();

        preencherCampos(pessoa, usuario);

    } catch (err) {
        alert("Erro na conexão: " + err.message);
    }
}

function preencherCampos(pessoa, usuario) {

    let codigo = usuario.codigoUsuario || "";
    let documento = pessoa.documento || "";
    let nome = pessoa.nome || "";
    let telefone = pessoa.telefone || "";
    let email = pessoa.email || "";
    let cep = pessoa.cep || "";
    let logradouro = pessoa.logradouro || "";
    let bairro = pessoa.bairro || "";
    let numero = pessoa.numero || "";
    let complemento = pessoa.complemento || "";
    let cidade = pessoa.cidade || "";
    let estado = pessoa.estado || 0;
    let inscricaoMunicipal = pessoa.inscricaoMunicipal || "";
    let inscricaoEstadual = pessoa.inscricaoEstadual || "";
    let tipo = pessoa.tipo || 1;

    for (let campo in pessoa) {
        if (pessoa[campo] === "N/D") pessoa[campo] = "";
    }

    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("UsuarioFisico").checked = true;

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
        document.getElementById("UsuarioJuridico").checked = true;
        document.getElementById("content").style.height = "830px";
        document.getElementById("content").style.marginTop = "72px";
        document.getElementById("buttons").className = "row mt-3";

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
            if (document.getElementById("pessoaFisico").checked) {
                formularioFisico.classList.remove('hidden');
                formularioJuridico.classList.add('hidden');
            } else {
                formularioJuridico.classList.remove('hidden');
                formularioFisico.classList.add('hidden');
            }
        });
    });

    const inputs = document.querySelectorAll('#formUsuario input, #formUsuario select');
    inputs.forEach(input => input.setAttribute('disabled', true));

    const selects = document.querySelectorAll('#formUsuario select');
    selects.forEach(select => {
        select.addEventListener('mousedown', e => e.preventDefault());
        select.addEventListener('keydown', e => e.preventDefault());
    });
}
