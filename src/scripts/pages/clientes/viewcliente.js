window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const id = localStorage.getItem("idCliente");
    const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "180px" : "150px";
                content.style.marginRight = expandida ? "120px" : "120px";

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
    if (id) carregarCliente(id);
});

async function carregarCliente(id) {

    try {
        const resposta = await fetch(`http://localhost:5164/BlueMoon/Pessoas/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.text();
            alert(erro);
            return;
        }

        cliente = await resposta.json();
        preencherCampos(cliente);
    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
}


function preencherCampos(cliente) {

    let codigo = cliente.codigo || "";
    let cpf = cliente.documento || "";
    let cnpj = cliente.documento || "";
    let nome = cliente.nome || "";
    let telefone = cliente.telefone || "";
    let email = cliente.email || "";
    let cep = cliente.cep || "";
    let logradouro = cliente.logradouro || "";
    let bairro = cliente.bairro || "";
    let numero = cliente.numero || "";
    let complemento = cliente.complemento || "";
    let cidade = cliente.cidade || "";
    let estado = cliente.estado || 0;
    let inscricaoMunicipal = cliente.inscricaoMunicipal || "";
    let inscricaoEstadual = cliente.inscricaoEstadual || "";
    let tipo = cliente.tipo || 1;

    for (let campo in cliente) {
        if (cliente[campo] === "N/D") cliente[campo] = "";
    }


    const pessoaFisica = document.getElementById("pessoaFisica");
    const pessoaJuridica = document.getElementById("pessoaJuridica");

    if (tipo === 1) {
        pessoaFisica.classList.remove("hidden");
        pessoaJuridica.classList.add("hidden");
        document.getElementById("ClienteFisico").checked = true;
        document.getElementById("content").style.height = "740px";
        document.getElementById("content").style.marginTop = "115px";
        document.getElementById("buttons").className = "row mt-4";

        document.getElementById("inputCodigoFisico").value = codigo;
        document.getElementById("inputCPF").value = cpf;
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
        document.getElementById("ClienteJuridico").checked = true;
        document.getElementById("content").style.height = "830px";
        document.getElementById("content").style.marginTop = "72px";
        document.getElementById("buttons").className = "row mt-3";

        document.getElementById("inputCodigoJuridico").value = codigo;
        document.getElementById("inputCNPJ").value = cnpj;
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
    const formularioClienteFisico = document.getElementById('pessoaFisica')
    const formularioClienteJuridico = document.getElementById('pessoaJuridica')

    tipoPessoa.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.getElementById("ClienteFisico").checked) {
                formularioClienteFisico.classList.remove('hidden');
                formularioClienteJuridico.classList.add('hidden');
            } else if (document.getElementById("ClienteJuridico").checked) {
                formularioClienteJuridico.classList.remove('hidden');
                formularioClienteFisico.classList.add('hidden');
            }
        });
    });

    const inputs = document.querySelectorAll('#formCliente input, #formCliente select');
    inputs.forEach(input => input.setAttribute('disabled', true));

    const selects = document.querySelectorAll('#formCliente select');
    selects.forEach(select => {
        select.addEventListener('mousedown', e => e.preventDefault());
        select.addEventListener('keydown', e => e.preventDefault());
    });
}