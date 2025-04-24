// Variables pour three.js
let scene, camera, renderer, mesh;

// Initialise le viewer dans un container donné
function initViewer(container) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xFFFFFF, 1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0x404040));
  animate();
}

// Animation boucle
function animate() {
  requestAnimationFrame(animate);
  if (mesh) mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Met à jour les prix
function updatePrices() {
  const qtyInput = document.getElementById('quantity');
  const unitPrice = parseFloat(document.getElementById('unit-price').textContent);
  const totalPrice = document.getElementById('total-price');
  let q = parseInt(qtyInput.value) || 1;
  qtyInput.value = q;
  totalPrice.textContent = (q * unitPrice).toFixed(2);
}

// Initialise tout à l'ouverture du document
document.addEventListener('DOMContentLoaded', () => {

  // Onglets (affichage d'état)
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Range Inserts
  const slider = document.getElementById('insertsRange'),
        sliderCnt = document.getElementById('insertsCount');
  slider.addEventListener('input', e => {
    sliderCnt.textContent = e.target.value;
  });

  // Délai de livraison
  document.querySelectorAll('.opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Mise à jour prix
  document.getElementById('quantity').addEventListener('change', updatePrices);

  // Fichier PDF/Image
  const fileUpload2D = document.getElementById('file-upload'),
        fileStatus = document.getElementById('file-status');
  fileUpload2D.addEventListener('change', () => {
    fileStatus.textContent = fileUpload2D.files.length
      ? `${fileUpload2D.files[0].name} chargé`
      : '';
  });

  // Setup dropzone initiale
  const dzInit = document.getElementById('initial-dropzone');
  const input3D = document.getElementById('file3d-upload-init');
  setupDropZone(dzInit, input3D, file => {
    // Affiche REF
    document.querySelector('.file-name').textContent = file.name;
    // Initialise le 3D et charge
    const reader = new FileReader();
    const overlay = document.querySelector('.progress-overlay');
    const overlayTxt = overlay.querySelector('span');
    overlay.classList.remove('hidden');
    reader.onprogress = e => {
      if (e.lengthComputable) {
        overlayTxt.textContent = Math.floor((e.loaded / e.total) * 100) + '%';
      }
    };
    reader.onload = ev => {
      const geom = new THREE.STLLoader().parse(ev.target.result);
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(
        geom,
        new THREE.MeshPhongMaterial({ color: 0x606060 })
      );
      mesh.scale.set(0.5,0.5,0.5);
      scene.add(mesh);
      // recentrage
      const center = new THREE.Box3()
        .setFromObject(mesh)
        .getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0,0,100);
      camera.lookAt(scene.position);
      overlay.classList.add('hidden');
    };
    reader.readAsArrayBuffer(file);
  });

});

// Configure une dropzone (click + drag&drop)
function setupDropZone(zone, input, onFile) {
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => {
    e.preventDefault(); zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) onFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => {
    if (input.files.length) onFile(input.files[0]);
    input.value = '';
  });
}
