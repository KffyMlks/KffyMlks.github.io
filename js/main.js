const skinItems = [...document.querySelectorAll('.item[data-skin]')];
let active = null;

const closeActive = (callback) => {
    if (!active) {
        if (callback) callback();
        return;
    }

    const currentActive = active;
    active = null;

    currentActive.canvas.classList.remove('loaded');
    currentActive.btn.classList.remove('fade-out');

    setTimeout(() => {
        currentActive.viewer.dispose();
        currentActive.canvas.remove();
        currentActive.item.classList.remove('is-3d');
        if (callback) callback();
    }, 300);
};

const openSkin = item => {
    if (active && active.item === item) return; 

    const executeOpen = () => {
        const thumb = item.querySelector('.thumb');
        const btn = item.querySelector('.render-btn');
        
        btn.classList.add('fade-out');

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
        active = { item, viewer, canvas, btn };

        setTimeout(() => {
            canvas.classList.add('loaded');
        }, 50);
    };

    if (active) {
        closeActive(executeOpen);
    } else {
        executeOpen();
    }
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
