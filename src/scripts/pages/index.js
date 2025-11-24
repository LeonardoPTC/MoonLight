window.addEventListener('load', async () => {
    await includeHTML("header", "../include/header.html");
    await includeHTML("footer", "../include/footer.html");

    const sidebar = document.querySelector(".sidebar")

    if (sidebar) {

        if (sidebar.matches(':hover')) {
            document.querySelector('#content').style.marginLeft = '290px';
        }

        sidebar.addEventListener('mouseenter', function () {
            document.querySelector('#content').style.marginLeft = '290px';
        });

        sidebar.addEventListener('mouseleave', function () {
            document.querySelector('#content').style.marginLeft = '200px';
        });
    }
});