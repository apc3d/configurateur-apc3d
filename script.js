// Pour changer de couleur sur sélection délai
const deliveryButtons = document.querySelectorAll('.delivery-btn');
deliveryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    deliveryButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
