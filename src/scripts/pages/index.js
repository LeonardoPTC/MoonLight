document.addEventListener('DOMContentLoaded', function () {
    const checkSidebarLoaded = setInterval(function () {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            clearInterval(checkSidebarLoaded);


            if (sidebar.matches(':hover')) {
                document.querySelector('#content').style.marginLeft = '320px';
            }

            sidebar.addEventListener('mouseenter', function () {
                document.querySelector('#content').style.marginLeft = '320px';
            });

            sidebar.addEventListener('mouseleave', function () {
                document.querySelector('#content').style.marginLeft = '200px';
            });
        }
    }, 100);
});