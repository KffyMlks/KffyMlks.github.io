const FADE_DURATION = 300;
const skinItems = [...document.querySelectorAll('.item[data-skin]')];

let activeSkin = null;

const closeActiveSkin = () => {
    if (!activeSkin) return;

    const { item, viewer, canvas, btn, timer } = activeSkin;
    activeSkin = null;

    clearTimeout(timer);
    item.classList.remove('is-3d');

    btn.hidden = false;
    void btn.offsetWidth;
    btn.classList.remove('fade-out');

    canvas.classList.remove('loaded');

    setTimeout(() => {
        viewer.dispose();
        canvas.remove();
    }, FADE_DURATION);
};

const openSkin = (item) => {
    if (activeSkin?.item === item) return;

    closeActiveSkin();

    const thumb = item.querySelector('.thumb');
    const btn = item.querySelector('.render-btn');
    if (!thumb || !btn) return;

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
    }, FADE_DURATION);

    activeSkin = { item, viewer, canvas, btn, timer };
};

skinItems.forEach((item) => {
    const btn = item.querySelector('.render-btn');
    btn?.addEventListener('click', () => openSkin(item));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeActiveSkin();
});

window.addEventListener('resize', () => {
    if (!activeSkin) return;

    const thumb = activeSkin.item.querySelector('.thumb');
    if (thumb) {
        activeSkin.viewer.setSize(thumb.clientWidth, thumb.clientHeight);
    }
});



const navLinks = [...document.querySelectorAll('.nav-link')];
const mainContent = document.querySelector('.main-content');
const sections = [...document.querySelectorAll('.section[id]')];

const setActiveNav = (targetLink) => {
    navLinks.forEach((link) => link.classList.remove('active'));
    targetLink?.classList.add('active');
};

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href?.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target || !mainContent) return;

        e.preventDefault();
        setActiveNav(link);
        mainContent.focus({ preventScroll: true });

        const top = Math.max(0, target.offsetTop - 24);
        mainContent.scrollTo({ top, behavior: 'smooth' });

        history.pushState(null, '', href);
    });
});

if (mainContent && sections.length > 0) {
    let isTicking = false;

    const updateScrollSpy = () => {
        let currentId = '';

        for (const section of sections) {
            if (mainContent.scrollTop >= section.offsetTop - 120) {
                currentId = section.id;
            }
        }

        if (currentId) {
            const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${currentId}`);
            if (activeLink) setActiveNav(activeLink);
        }

        isTicking = false;
    };

    mainContent.addEventListener('scroll', () => {
        if (!isTicking) {
            requestAnimationFrame(updateScrollSpy);
            isTicking = true;
        }
    }, { passive: true });
}

mainContent?.focus({ preventScroll: true });
