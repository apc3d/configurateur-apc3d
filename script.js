import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

let scene, camera, renderer, mesh;

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

// Génère une nouvelle config à chaque upload
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

  // init 3D
  initViewer(viewerEl);

  // chargement 3D
  fileInput.addEventListener('change', function () {
    const f = this.files[0];
    if (!f) return;
    overlay.classList.remove('hidden');
    overlayTxt.textContent = '0%';
    const reader = new FileReader();
    reader.onprogress = ev => {
      if (ev.lengthComputable) {
        overlayTxt.textContent = Math.floor((ev.loaded / ev.total) * 100) + '%';
      }
    };
    reader.onload = ev => {
      const geom = new STLLoader().parse(ev.target.result);
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
    reader.readAsArrayBuffer(f);
  });

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

  // import 2D/IMG
  import2D.addEventListener('change', e => {
    // le navigateur affiche déjà le nom du fichier choisi
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const initDrop = document.getElementById('initial-dropzone');
  const initIn   = document.getElementById('file3d-upload-init');
  const secDrop  = document.querySelector('.secondary-dropzone');
  const secIn    = document.getElementById('file3d-upload2');

  function setupDrop(drop, input) {
    drop.addEventListener('click', () => input.click());
    drop.addEventListener('dragover', e => (e.preventDefault(), drop.classList.add('dragover')));
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('dragover');
      if (!e.dataTransfer.files.length) return;
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    });
  }

  setupDrop(initDrop, initIn);
  initIn.addEventListener('change', () => {
    createConfig(initIn.files[0]);
    initDrop.style.display   = 'none';
    secDrop.classList.remove('hidden');
  });

  setupDrop(secDrop, secIn);
  secIn.addEventListener('change', () => {
    createConfig(secIn.files[0]);
    secIn.value = '';
  });
});
