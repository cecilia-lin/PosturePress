let pages = [
    { url: '', title: 'Dashboard' },
    { url: 'https://physionet.org/content/pmd/1.0.0/', title: 'Dataset' },
    { url: 'about/', title: 'About' }
];

// let nav = document.createElement('nav');
// document.body.prepend(nav);


// fix the nav bar in css


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
