const skinItems = [...document.querySelectorAll('.item[data-skin]')];
let active = null;
const FADE = 300;

const closeActive = () => {
    if (!active) return;
    const { item, viewer, canvas, btn, timer } = active;
    active = null;
    clearTimeout(timer);
    item.classList.remove('is-3d');

    btn.hidden = false;
    void btn.offsetWidth;
    btn.classList.remove('fade-out');

    canvas.classList.remove('loaded');
    setTimeout(() => {
        viewer.dispose();
        canvas.remove();
    }, FADE);
};

const openSkin = item => {
    if (active && active.item === item) return;
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

    viewer.animation = new skinview3d.IdleAnimation();
    viewer.controls.enableZoom = false;
    viewer.autoRotate = false;
    viewer.autoRotateSpeed = 1;

    item.classList.add('is-3d');

    void canvas.offsetWidth;
    canvas.classList.add('loaded');
    btn.classList.add('fade-out');

    const timer = setTimeout(() => {
        btn.hidden = true;
    }, FADE);

    active = { item, viewer, canvas, btn, timer };
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

const navLinks = [...document.querySelectorAll('.nav-link')];
const mainContent = document.querySelector('.main-content');
const sections = [...document.querySelectorAll('.section[id]')];

const setActiveNav = targetLink => {
    navLinks.forEach(link => link.classList.remove('active'));
    if (targetLink) targetLink.classList.add('active');
};

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target && mainContent) {
                e.preventDefault();
                setActiveNav(link);

                const top = target.offsetTop - 24;
                mainContent.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'smooth'
                });

                history.pushState(null, '', href);
            }
        }
    });
});

if (mainContent && sections.length > 0) {
    mainContent.addEventListener('scroll', () => {
        let currentId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (mainContent.scrollTop >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        if (currentId) {
            const activeLink = navLinks.find(link => link.getAttribute('href') === `#${currentId}`);
            if (activeLink) setActiveNav(activeLink);
        }
    }, { passive: true });
}
