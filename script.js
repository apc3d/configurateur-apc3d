// (Les onglets sont purement indicatifs, pas de clic)

// Quantité / prix
const dec        = document.getElementById('dec'),
      inc        = document.getElementById('inc'),
      qty        = document.getElementById('quantity'),
      unitPrice  = document.getElementById('unit-price'),
      totalPrice = document.getElementById('total-price');

function updatePrices() {
  let q = parseInt(qty.value) || 1;
  qty.value = q;
  let up = parseFloat(unitPrice.textContent);
  totalPrice.textContent = (q * up).toFixed(2);
}

dec.addEventListener('click', () => { qty.value = Math.max(1, +qty.value - 1); updatePrices(); });
inc.addEventListener('click', () => { qty.value = +qty.value + 1; updatePrices(); });
qty.addEventListener('change', updatePrices);

// Slider Inserts
const insertsRange  = document.getElementById('insertsRange'),
      insertsCount  = document.getElementById('insertsCount');

insertsRange.addEventListener('input', () => {
  insertsCount.textContent = insertsRange.value;
});

// Choix délai
document.querySelectorAll('.opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// Import fichier → afficher nom chargé
const fileUpload = document.getElementById('file-upload'),
      fileStatus = document.getElementById('file-status');

fileUpload.addEventListener('change', () => {
  if (fileUpload.files.length) {
    fileStatus.textContent = `${fileUpload.files[0].name} chargé`;
  } else {
    fileStatus.textContent = '';
  }
});

// Dropzone : éviter l'ouverture de fichier sur drag/drop
const dz = document.querySelector('.dropzone');
['dragover','drop'].forEach(evt =>
  dz.addEventListener(evt, e => e.preventDefault())
);


