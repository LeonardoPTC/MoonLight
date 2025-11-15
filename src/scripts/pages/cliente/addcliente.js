document.addEventListener("DOMContentLoaded", () => {

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

}); 
