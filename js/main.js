const skinItems = [...document.querySelectorAll('.item[data-skin]')];
let active = null;

const closeActive = () => {
    if (!active) return;
    active.viewer.dispose();
    active.canvas.remove();
    active.btn.hidden = false;
    active.item.classList.remove('is-3d');
    active = null;
};

const openSkin = item => {
    closeActive();

    const thumb = item.querySelector('.thumb');
    const btn = item.querySelector('.render-btn');
    const canvas = document.createElement('canvas');
    canvas.className = 'skin-canvas';
    thumb.appendChild(canvas);

    const viewer = new skinview3d.SkinViewer({
        canvas,
        width: thumb.clientWidth,
        height: thumb.clientHeight,
        skin: item.dataset.skin,
        model: item.dataset.model || 'default'
    });
    viewer.animation = new skinview3d.RunningAnimation();
    viewer.controls.enableZoom = false;
    viewer.autoRotate = false;
    viewer.autoRotateSpeed = 1;
    viewer.globalLight.intensity = 3;
    viewer.cameraLight.intensity = 0.6;   

    btn.hidden = true;
    item.classList.add('is-3d');
    active = { item, viewer, canvas, btn };
};

skinItems.forEach(item => {
    const btn = item.querySelector('.render-btn');
    if (btn) {
        btn.addEventListener('click', () => openSkin(item));
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeActive();
});

window.addEventListener('resize', () => {
    if (!active) return;
    const thumb = active.item.querySelector('.thumb');
    active.viewer.setSize(thumb.clientWidth, thumb.clientHeight);
});

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
