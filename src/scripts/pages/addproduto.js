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