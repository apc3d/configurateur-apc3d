// Simple gestion de sélection de délai
document.querySelectorAll('.delivery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});
