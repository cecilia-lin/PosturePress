let pages = [
    { url: '', title: 'Dashboard' },
    { url: 'https://physionet.org/content/pmd/1.0.0/', title: 'Dataset' },
    { url: 'about/', title: 'About' }
];



// this right now is aggressively in alpha the other tabs are showing direct file structures
let nav = document.createElement('nav');
document.body.prepend(nav);

const basePath = location.pathname.includes('/web/') ? location.pathname.split('/web/')[0] + '/web/' : '/web/';

for (let p of pages) {
    let url = p.url.startsWith('http') ? p.url : new URL(p.url, location.origin + basePath).pathname;
    let title = p.title;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (p.url.startsWith('http')) {
        a.target = '_blank';
    }

    let currentPath = location.pathname.replace(/\/$/, '');
    let linkPath = new URL(a.href, location.origin).pathname.replace(/\/$/, '');

    a.classList.toggle('current', currentPath === linkPath);

    nav.append(a);
}
document.addEventListener("scroll", function () {
    let titleScreen = document.querySelector(".title-screen");
    let scrollPosition = window.scrollY;
  
    // When the user scrolls past 100px, hide the title screen
    if (scrollPosition > 10) {
        titleScreen.classList.add("hide-title");
    } else {
        titleScreen.classList.remove("hide-title");
    }});