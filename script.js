// Initialisation du viewer 3D
let scene, camera, renderer, mesh;
function initViewer() {
  const container = document.getElementById('viewer');
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

document.addEventListener('DOMContentLoaded', () => {
  const panelWrapper = document.querySelector('.panel-wrapper');
  const dropzone     = document.querySelector('.dropzone');
  const file3dUpload = document.getElementById('file3d-upload');

  // 1️⃣ initial : on cache le panel, on laisse le dropzone et les boutons bas
  panelWrapper.style.display = 'none';

  initViewer();

  // ✋ clic sur la dropzone → ouvre le file picker
  dropzone.addEventListener('click', () => file3dUpload.click());

  // drag & drop
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (!e.dataTransfer.files.length) return;
    file3dUpload.files = e.dataTransfer.files;
    file3dUpload.dispatchEvent(new Event('change'));
  });

  // 2️⃣ Après premier fichier 3D chargé
  file3dUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // lecture
    const reader = new FileReader();
    reader.onload = ev => {
      // parse STL
      const geometry = new THREE.STLLoader().parse(ev.target.result);
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0x606060 })
      );
      mesh.scale.set(0.5, 0.5, 0.5);
      scene.add(mesh);
      // recentrage
      const center = new THREE.Box3()
        .setFromObject(mesh)
        .getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);

      // affiche le panel et cache la dropzone
      panelWrapper.style.display = 'block';
      dropzone.style.display     = 'none';
    };
    reader.readAsArrayBuffer(file);
  });

  // Quantité / prix
  const qtyInput  = document.getElementById('quantity'),
        unitPrice = document.getElementById('unit-price'),
        totalPrice= document.getElementById('total-price');
  function updatePrices() {
    let q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent =
      (q * parseFloat(unitPrice.textContent)).toFixed(2);
  }
  qtyInput.addEventListener('change', updatePrices);

  // Slider Inserts
  document.getElementById('insertsRange')
    .addEventListener('input', e => {
      document.getElementById('insertsCount').textContent = e.target.value;
    });

  // Choix délai
  document.querySelectorAll('.opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.opt')
        .forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Import PDF/IMG → afficher nom
  const fileUpload = document.getElementById('file-upload'),
        fileStatus = document.getElementById('file-status');
  fileUpload.addEventListener('change', () => {
    fileStatus.textContent = fileUpload.files.length
      ? `${fileUpload.files[0].name} chargé`
      : '';
  });
});
