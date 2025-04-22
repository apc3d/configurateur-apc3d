// Initialisation du viewer 3D
let scene, camera, renderer, mesh;
function initViewer() {
  const container = document.getElementById('viewer');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1, 1000
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

document.addEventListener('DOMContentLoaded', () => {
  const panelWrapper      = document.querySelector('.panel-wrapper');
  const initialDropzone   = document.getElementById('initial-dropzone');
  const secondaryDropzone = document.getElementById('secondary-dropzone');
  const file3dUpload      = document.getElementById('file3d-upload');
  const file3dUpload2     = document.getElementById('file3d-upload2');
  const overlay           = document.getElementById('progress-overlay');
  const overlayText       = document.getElementById('progress-text');

  // 1️⃣ initial : on cache la config
  panelWrapper.style.display = 'none';

  initViewer();

  // Handler dropzone (click + drag&drop)
  function setupDropzone(zone, input) {
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => {
      e.preventDefault(); zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      if (!e.dataTransfer.files.length) return;
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    });
  }
  setupDropzone(initialDropzone, file3dUpload);
  setupDropzone(secondaryDropzone, file3dUpload2);

  // 2️⃣ Premier fichier 3D
  file3dUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    overlay.classList.remove('hidden');
    overlayText.textContent = '0%';

    const reader = new FileReader();
    reader.onprogress = ev => {
      if (ev.lengthComputable) {
        const pct = Math.floor((ev.loaded / ev.total) * 100);
        overlayText.textContent = pct + '%';
      }
    };
    reader.onload = ev => {
      // Parse et afficher le STL
      const geom = new THREE.STLLoader().parse(ev.target.result);
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      mesh.scale.set(0.5, 0.5, 0.5);
      scene.add(mesh);
      const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0,0,100);
      camera.lookAt(scene.position);

      // Affiche la config et la seconde dropzone
      panelWrapper.style.display        = 'block';
      initialDropzone.style.display     = 'none';
      secondaryDropzone.classList.remove('hidden');
      overlay.classList.add('hidden');
    };

    reader.readAsArrayBuffer(file);
  });

  // 2ᵉ fichier 3D
  file3dUpload2.addEventListener('change', function () {
    alert('Deuxième fichier chargé : ' + this.files[0].name);
  });

  // Quantité / prix
  const qtyInput  = document.getElementById('quantity'),
        unitPrice = document.getElementById('unit-price'),
        totalPrice= document.getElementById('total-price');
  qtyInput.addEventListener('change', () => {
    let q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
  });

  // Slider inserts
  document.getElementById('insertsRange').addEventListener('input', e => {
    document.getElementById('insertsCount').textContent = e.target.value;
  });

  // Choix délai
  document.querySelectorAll('.opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Import PDF/IMG → nom
  const fileUpload = document.getElementById('file-upload'),
        fileStatus = document.getElementById('file-status');
  fileUpload.addEventListener('change', () => {
    fileStatus.textContent = fileUpload.files.length
      ? `${fileUpload.files[0].name} chargé`
      : '';
  });
});
