// script.js

// on part du principe que three.min.js et STLLoader.js sont déjà inclus via <script> dans index.html

let scene, camera, renderer, mesh;

// Initialise et lance l’anim du viewer 3D dans le conteneur passé
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
function animate() {
  requestAnimationFrame(animate);
  if (mesh) mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Crée un nouveau bloc de config en clonant le template
function createConfig(file) {
  const container = document.getElementById('configs-container');
  const tpl       = document.getElementById('config-template');
  const clone     = tpl.content.cloneNode(true);
  container.appendChild(clone);

  const wrapper    = container.lastElementChild;
  const viewerEl   = wrapper.querySelector('.viewer');
  const overlay    = wrapper.querySelector('.progress-overlay');
  const overlayTxt = overlay.querySelector('span');
  const fileInput  = wrapper.querySelector('.file3d-upload');
  const qtyInput   = wrapper.querySelector('.quantity');
  const unitPrice  = wrapper.querySelector('.unit-price');
  const totalPrice = wrapper.querySelector('.total-price');
  const slider     = wrapper.querySelector('.inserts-range');
  const sliderCnt  = wrapper.querySelector('.inserts-count');
  const opts       = wrapper.querySelectorAll('.opt');
  const import2D   = wrapper.querySelector('.file-import');

  // init du viewer dans ce bloc
  initViewer(viewerEl);

  // chargement 3D
  fileInput.addEventListener('change', function () {
    const f = this.files[0];
    if (!f) return;
    overlay.classList.remove('hidden');
    overlayTxt.textContent = '0%';

    const reader = new FileReader();
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

      // recentrage
      const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);

      overlay.classList.add('hidden');
    };
    reader.readAsArrayBuffer(f);
  });

  // slider inserts
  slider.addEventListener('input', e => sliderCnt.textContent = e.target.value);

  // choix délai
  opts.forEach(opt => opt.addEventListener('click', () => {
    opts.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  }));

  // quantité / prix
  qtyInput.addEventListener('change', () => {
    const q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
  });

  // import PDF/IMG (le champ natif affiche déjà le nom du fichier)
  import2D.addEventListener('change', () => {});
}

// met en place click + drag-n-drop sur une dropzone
function setupDropZone(zone, input) {
  // clic ouvre le file picker
  zone.addEventListener('click', () => input.click());
  // dragenter/dragover => style
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  // drop => on alimente l’input et on déclenche le change
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (!e.dataTransfer.files.length) return;
    input.files = e.dataTransfer.files;
    input.dispatchEvent(new Event('change'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // dropzone initiale
  const initialZone = document.getElementById('initial-dropzone');
  const initialIn   = document.getElementById('file3d-upload-init');
  setupDropZone(initialZone, initialIn);

  initialIn.addEventListener('change', () => {
    createConfig(initialIn.files[0]);
    initialZone.style.display = 'none';
    // on affiche la dropzone secondaire
    document.getElementById('secondary-dropzone').classList.remove('hidden');
  });

  // dropzone secondaire (pour 2ᵉ, 3ᵉ… config)
  const secZone = document.getElementById('secondary-dropzone');
  const secIn   = document.getElementById('file3d-upload2');
  setupDropZone(secZone, secIn);

  secIn.addEventListener('change', () => {
    createConfig(secIn.files[0]);
    secIn.value = '';
  });
});
