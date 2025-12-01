window.addEventListener('load', async () => {
    await includeHTML("header", "../include/header.html");
    await includeHTML("footer", "../include/footer.html");

    const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector("#content");
    const telaPequena = window.matchMedia("(max-width: 1366px)");

    if (sidebar) {

        const aplicarMargens = (expandida) => {
            if (telaPequena.matches) {
                content.style.marginLeft = expandida ? "200px" : "160px";
                content.style.marginRight = expandida ? "40px" : "60px";

            } else {
                content.style.marginLeft = expandida ? "270px" : "200px";
            }
        };

        if (sidebar.matches(':hover')) {
            aplicarMargens(true);
        }

        sidebar.addEventListener('mouseenter', () => aplicarMargens(true));
        sidebar.addEventListener('mouseleave', () => aplicarMargens(false));
    }
});