// script.js

let scene, camera, renderer, mesh;

// Initialise un viewer Three.js pour un conteneur donné
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

// Boucle d’animation
function animate() {
  requestAnimationFrame(animate);
  if (mesh) mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Crée un bloc de config, injecte le STL et affiche la ref
function createConfig(file) {
  const container = document.getElementById('configs-container');
  const tpl       = document.getElementById('config-template');
  const clone     = tpl.content.cloneNode(true);
  container.appendChild(clone);

  const wrapper    = container.lastElementChild;
  const viewerEl   = wrapper.querySelector('.viewer');
  const overlay    = wrapper.querySelector('.progress-overlay');
  const overlayTxt = overlay.querySelector('span');
  const fileNameEl = wrapper.querySelector('.file-name');
  const qtyInput   = wrapper.querySelector('.quantity');
  const unitPrice  = wrapper.querySelector('.unit-price');
  const totalPrice = wrapper.querySelector('.total-price');
  const slider     = wrapper.querySelector('.inserts-range');
  const sliderCnt  = wrapper.querySelector('.inserts-count');
  const opts       = wrapper.querySelectorAll('.opt');

  // Affiche le nom du fichier
  fileNameEl.textContent = file.name;

  initViewer(viewerEl);

  // Lecture du STL
  overlay.classList.remove('hidden');
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

    // Recentre
    const center = new THREE.Box3()
      .setFromObject(mesh)
      .getCenter(new THREE.Vector3());
    mesh.position.sub(center);
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);

    overlay.classList.add('hidden');
  };
  reader.readAsArrayBuffer(file);

  // Slider inserts
  slider.addEventListener('input', e => {
    sliderCnt.textContent = e.target.value;
  });

  // Sélection délai
  opts.forEach(opt =>
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    })
  );

  // Quantité → total
  qtyInput.addEventListener('change', () => {
    const q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
  });
}

// Configure dropzone (click + drag'n'drop)
function setupDropZone(zone, input, onFile) {
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (!e.dataTransfer.files.length) return;
    onFile(e.dataTransfer.files[0]);
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

  // Dropzone initiale
  setupDropZone(initZone, initIn, file => {
    createConfig(file);
    initZone.style.display = 'none';
    secZone.classList.remove('hidden');
  });

  // Dropzone secondaire
  setupDropZone(secZone, secIn, file => {
    createConfig(file);
  });
});
