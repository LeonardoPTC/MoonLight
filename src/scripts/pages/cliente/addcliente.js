document.addEventListener('DOMContentLoaded', function () {
    const checkSidebarLoaded = setInterval(function () {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            clearInterval(checkSidebarLoaded);

            sidebar.addEventListener('mouseenter', function () {
                document.querySelector('#content').style.marginLeft = '330px';
            });

            sidebar.addEventListener('mouseleave', function () {
                document.querySelector('#content').style.marginLeft = '307px';
            });
        }
    }, 100);
});

const tipoPessoa = document.getElementsByName('tipo');
const formularioClienteFisico = document.getElementById('pessoaFisica')
const formularioClienteJuridico = document.getElementById('pessoaJuridica')

formularioClienteJuridico.classList.add('hidden');

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