const buttons = document.querySelectorAll('.delivery-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});
