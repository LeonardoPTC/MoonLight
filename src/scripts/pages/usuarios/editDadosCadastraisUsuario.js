window.addEventListener('load', async () => {
    await includeHTML("header", "../../include/header.html");
    await includeHTML("footer", "../../include/footer.html");

    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.setAttribute('disabled', 'true'));

    const idPessoa = localStorage.getItem("idPessoa");
    const idUsuario = localStorage.getItem("idUsuario");

    if (idPessoa) {
        carregarUsuario(idPessoa);
        localStorage.setItem("pessoaId", idPessoa);
    }

    if (idUsuario) {
        localStorage.setItem("usuarioId", idUsuario);
    }
});

function converterDataParaBack(data) {
    if (!data) return "";

    const partes = data.split("-");
    return partes[2] + partes[1] + partes[0];
}

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
        return;
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

    const camposObrigatorios = containerAtivo.querySelectorAll('[data-required]');
    for (let campo of camposObrigatorios) {
        if (!campo.value || !campo.value.trim()) {
            alert(`Erro ao atualizar usuário: O campo ${campo.name} é obrigatório!`);
            campo.focus();
            return;
        }
    }

    if (isPessoaFisica) {
        if (dados.Documento && !validarCPF(dados.Documento)) {
            alert("Erro ao atualizar usuário: CPF inválido!");
            form.appendChild(removido);
            return;
        }
    } else {
        if (dados.Documento && !validarCNPJ(dados.Documento)) {
            alert("Erro ao atualizar usuário: CNPJ inválido!");
            form.appendChild(removido);
            return;
        }

        if (dados.InscricaoEstadual && !validarInscricaoEstadual(dados.InscricaoEstadual)) {
            alert("Erro ao atualizar usuário: Inscrição Estadual inválida!");
            form.appendChild(removido);
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
            alert("Usuário atualizado com sucesso!");
            window.location.href = "../usuarios/editDadosFuncionais.html";
        } else {
            const texto = await resposta.text();
            let mensagem;
            try {
                const erroJSON = JSON.parse(texto);
                const campo = Object.keys(erroJSON.errors)[0];
                mensagem = erroJSON.errors[campo][0];
            } catch {
                mensagem = texto;
            }
            alert("Erro ao atualizar usuário: " + mensagem);
            return;
        }
    } catch (err) {
        alert("Erro na conexão: " + err.message);
        return;
    }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let dig1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    let dig2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (dig2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

function validarInscricaoEstadual(inscricao) {
    if (!inscricao) return true;

    inscricao = inscricao.trim().replace(/[^\d]/g, '');

    if (inscricao.length < 8 || inscricao.length > 13) return false;
    if (/^(\d)\1+$/.test(inscricao)) return false;

    return true;
}

