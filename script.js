// Viewer 3D + initialisation
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
  const panelWrapper = document.querySelector('.panel-wrapper');
  const actionsBar   = document.querySelector('.actions');
  const dropzone     = document.querySelector('.dropzone');
  const spinner      = document.getElementById('spinner');

  // Au départ : seule la dropzone est visible
  panelWrapper.style.display = 'none';
  actionsBar.style.display   = 'none';

  initViewer();

  // Lorsque l'utilisateur glisse/sélectionne un modèle 3D initial
  document.getElementById('file3d-upload')
    .addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      // Affiche le spinner
      spinner.classList.remove('hidden');

      const reader = new FileReader();
      reader.onload = function (ev) {
        // Parse et affiche le modèle
        const geometry = new THREE.STLLoader().parse(ev.target.result);
        if (mesh) scene.remove(mesh);
        mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: 0x606060 })
        );
        mesh.scale.set(0.5, 0.5, 0.5);
        scene.add(mesh);
        // Recentre la vue
        const center = new THREE.Box3()
          .setFromObject(mesh)
          .getCenter(new THREE.Vector3());
        mesh.position.sub(center);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);

        // Cache le spinner, et affiche panel+actions
        spinner.classList.add('hidden');
        panelWrapper.style.display = 'block';
        actionsBar.style.display   = 'flex';

        // Cache la dropzone initiale
        dropzone.style.display = 'none';
      };
      reader.readAsArrayBuffer(file);
    });

  // Quantité / prix
  const qtyInput  = document.getElementById('quantity'),
        unitPrice = document.getElementById('unit-price'),
        totalPrice = document.getElementById('total-price');
  function updatePrices() {
    let q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent =
      (q * parseFloat(unitPrice.textContent)).toFixed(2);
  }
  qtyInput.addEventListener('change', updatePrices);

  // Slider Inserts
  document.getElementById('insertsRange')
    .addEventListener('input', (e) => {
      document.getElementById('insertsCount').textContent = e.target.value;
    });

  // Choix délai
  document.querySelectorAll('.opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.opt').forEach((o) =>
        o.classList.remove('active')
      );
      opt.classList.add('active');
    });
  });

  // Import fichier (PDF/IMG) → afficher nom chargé
  const fileUpload = document.getElementById('file-upload'),
        fileStatus = document.getElementById('file-status');
  fileUpload.addEventListener('change', () => {
    fileStatus.textContent = fileUpload.files.length
      ? `${fileUpload.files[0].name} chargé`
      : '';
  });
});
