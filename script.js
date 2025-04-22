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
  const panelWrapper     = document.querySelector('.panel-wrapper');
  const dropzone         = document.getElementById('initial-dropzone');
  const file3dUpload     = document.getElementById('file3d-upload');
  const secondaryUpload  = document.getElementById('secondary-upload');
  const file3dUpload2    = document.getElementById('file3d-upload2');
  const loadProgress     = document.getElementById('load-progress');

  // 1️⃣ initial : on cache le panel, on laisse la dropzone et les boutons bas
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

    // Affiche la barre de progression
    loadProgress.classList.remove('hidden');
    loadProgress.value = 0;

    const reader = new FileReader();

    reader.onprogress = ev => {
      if (ev.lengthComputable) {
        loadProgress.value = (ev.loaded / ev.total) * 100;
      }
    };

    reader.onload = ev => {
      // Parse STL
      const geometry = new THREE.STLLoader().parse(ev.target.result);
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0x606060 })
      );
      mesh.scale.set(0.5, 0.5, 0.5);
      scene.add(mesh);
      // Recentre
      const center = new THREE.Box3()
        .setFromObject(mesh)
        .getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);

      // Affiche le panel, cache dropzone et barre de progression
      panelWrapper.style.display = 'block';
      dropzone.style.display     = 'none';
      loadProgress.classList.add('hidden');

      // Affiche le champ pour un autre upload 3D
      secondaryUpload.classList.remove('hidden');
    };

    reader.readAsArrayBuffer(file);
  });

  // Upload secondaire
  secondaryUpload.addEventListener('click', () => file3dUpload2.click());
  file3dUpload2.addEventListener('change', () => {
    // ici tu peux déclencher une nouvelle config / ajouter au panier
    alert('Nouveau 3D chargé : ' + file3dUpload2.files[0].name);
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
