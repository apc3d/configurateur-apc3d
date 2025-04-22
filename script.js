// script.js

// three.js et STLLoader chargés via <script> dans index.html

let scene, camera, renderer, mesh;

// Initialise un viewer pour un conteneur donné
function initViewer(container) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0x404040));
  animate();
}

// Boucle d’animation
function animate() {
  requestAnimationFrame(animate);
  if (mesh) mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Crée une nouvelle config en clonant le template et en y injectant le File STL
function createConfig(file) {
  const container = document.getElementById('configs-container');
  const tpl       = document.getElementById('config-template');
  const clone     = tpl.content.cloneNode(true);
  container.appendChild(clone);

  const wrapper    = container.lastElementChild;
  const viewerEl   = wrapper.querySelector('.viewer');
  const overlay    = wrapper.querySelector('.progress-overlay');
  const overlayTxt = overlay.querySelector('span');
  const qtyInput   = wrapper.querySelector('.quantity');
  const unitPrice  = wrapper.querySelector('.unit-price');
  const totalPrice = wrapper.querySelector('.total-price');
  const slider     = wrapper.querySelector('.inserts-range');
  const sliderCnt  = wrapper.querySelector('.inserts-count');
  const opts       = wrapper.querySelectorAll('.opt');
  const import2D   = wrapper.querySelector('.file-import');

  // on initialise le viewer
  initViewer(viewerEl);

  // on lit directement le File reçu (pas de 2ᵉ input 3D dans la config !)
  const reader = new FileReader();
  overlay.classList.remove('hidden');
  reader.onprogress = e => {
    if (e.lengthComputable) {
      overlayTxt.textContent = Math.floor((e.loaded / e.total) * 100) + '%';
    }
  };
  reader.onload = ev => {
    const geom = new THREE.STLLoader().parse(ev.target.result);
    if (mesh) scene.remove(mesh);
    mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 0x606060 }));
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);
    const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    mesh.position.sub(center);
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
    overlay.classList.add('hidden');
  };
  reader.readAsArrayBuffer(file);

  // slider inserts
  slider.addEventListener('input', e => (sliderCnt.textContent = e.target.value));

  // délai
  opts.forEach(opt =>
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    })
  );

  // quantité / prix
  qtyInput.addEventListener('change', () => {
    const q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
  });

  // import 2D/IMG (le navigateur gère l’affichage du nom)
  import2D.addEventListener('change', () => {});
}

// setup d’une dropzone (click + drag/drop)
function setupDropZone(zone, input, onFile) {
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (!e.dataTransfer.files.length) return;
    const f = e.dataTransfer.files[0];
    onFile(f);
  });
  input.addEventListener('change', () => {
    if (!input.files.length) return;
    onFile(input.files[0]);
    input.value = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const initZone = document.getElementById('initial-dropzone');
  const initIn   = document.getElementById('file3d-upload-init');
  const secZone  = document.getElementById('secondary-dropzone');
  const secIn    = document.getElementById('file3d-upload2');

  // initiale
  setupDropZone(initZone, initIn, file => {
    createConfig(file);
    initZone.style.display = 'none';
    secZone.classList.remove('hidden');
  });

  // secondaire
  setupDropZone(secZone, secIn, file => {
    createConfig(file);
  });
});
