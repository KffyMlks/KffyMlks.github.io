(() => {
    const main = document.querySelector('.main-content');
    const links = [...document.querySelectorAll('.nav-link')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActive = id => {
        links.forEach(link => {
            const on = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', on);
            if (on) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { root: main, rootMargin: '-35% 0px -55% 0px' });

    sections.forEach(section => observer.observe(section));
    setActive('about');
})();