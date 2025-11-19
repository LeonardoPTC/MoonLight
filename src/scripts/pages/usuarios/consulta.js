async function carregarClientes() {
  const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas");
  const clientes = await resposta.json();

  const tbody = document.querySelector("#tabela-clientes tbody");
  tbody.innerHTML = ""; 
}

document.addEventListener('DOMContentLoaded', function () {
    const checkSidebarLoaded = setInterval(function () {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            clearInterval(checkSidebarLoaded);

            sidebar.addEventListener('mouseenter', function () {
                document.querySelector('#content').style.marginLeft = '310px';
            });

            sidebar.addEventListener('mouseleave', function () {
                document.querySelector('#content').style.marginLeft = '187px';
            });
        }
    }, 100);
});



document.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigo = document.getElementById('filterCodigo').value.trim();
  const nome = document.getElementById('filterNome').value;
  const telefone = document.getElementById('filterTelefone').value;
  const documento = document.getElementById('filterDocumento').value;

  const dto = {
    codigo: codigo ? parseInt(codigo) : 0,
    nome: nome.trim(),
    telefone: telefone,
    documento: documento
  };

  try {
    const resposta = await fetch("http://localhost:5164/BlueMoon/Pessoas/Search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (!resposta.ok) {
      alert("Cliente não Encontrado!");
      return;
    }

    const clientes = await resposta.json();

    const tbody = document.querySelector("#tabela-clientes tbody");
    tbody.innerHTML = "";
    clientes.forEach(c => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.cidade}</td>
      <td>${c.endereco}</td>
      <td class="text-center">
          <button class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Selecionar Cliente" onclick="selecionarCliente('${c.id}')"><img src="/src/assets/Selecionar.png"></button>
      </td>
    `;
      tbody.appendChild(linha);
    })

  } catch (erro) {
    alert("Erro ao aplicar filtro: " + erro.message);
  }
});

document.getElementById('limparFiltros').addEventListener('click', function () {
  carregarClientes();
  document.getElementById('filterCodigo').value = "";
  document.getElementById('filterNome').value = "";
  document.getElementById('filterTelefone').value = "";
  document.getElementById('filterDocumento').value = "";
});

function selecionarCliente(id) {
  window.location.href = `http://localhost:5500/src/pages/usuarios/atualizarCadastroExistente.html?id=${id}`;
}