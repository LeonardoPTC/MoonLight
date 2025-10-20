async function includeHTML(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    el.innerHTML = await response.text();
  } catch (error) {
    el.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}