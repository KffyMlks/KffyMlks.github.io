const skinItems = [...document.querySelectorAll('.item[data-skin]')];
let active = null;
const FADE = 300; // ms, que coincide con las transiciones del CSS

const closeActive = () => {
    if (!active) return;
    const { item, viewer, canvas, btn, timer } = active;
    active = null;
    clearTimeout(timer);
    item.classList.remove('is-3d');
    
    // El render vuelve con fade in
    btn.hidden = false;
    void btn.offsetWidth; // Fuerza reflow para que la transición se ejecute
    btn.classList.remove('fade-out');
    
    // El modelo hace fade out y luego se destruye
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

    // Crossfade: el render sale mientras el modelo entra
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
