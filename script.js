// Onglets
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Stepper quantité
const dec = document.getElementById('dec'),
      inc = document.getElementById('inc'),
      qty = document.getElementById('quantity'),
      sumQty     = document.getElementById('sum-qty'),
      unitPrice  = document.getElementById('unit-price'),
      totalPrice = document.getElementById('total-price');

function updatePrices() {
  let q = parseInt(qty.value)||1;
  qty.value = q;
  sumQty.textContent     = q;
  let up = parseFloat(unitPrice.textContent);
  totalPrice.textContent = (q * up).toFixed(2);
}

dec.addEventListener('click', () => { qty.value = Math.max(1, +qty.value - 1); updatePrices(); });
inc.addEventListener('click', () => { qty.value = +qty.value + 1; updatePrices(); });
qty.addEventListener('change', updatePrices);

// Choix délai
document.querySelectorAll('.opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// Dropzone – empêcher l’ouverture de fichier
const dz = document.querySelector('.dropzone');
['dragover','drop'].forEach(e => dz.addEventListener(e, e=>{ e.preventDefault(); }));
