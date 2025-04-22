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
  const panelWrapper       = document.querySelector('.panel-wrapper');
  const initialDropzone    = document.getElementById('initial-dropzone');
  const secondaryDropzone  = document.querySelector('.secondary-dropzone');
  const file3dUpload       = document.getElementById('file3d-upload');
  const file3dUpload2      = document.getElementById('file3d-upload2') || (() => {
    // création lazy de l'input pour second upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.stl,.step,.stp';
    input.id = 'file3d-upload2';
    secondaryDropzone.appendChild(input);
    return input;
  })();
  const loadProgress       = document.getElementById('load-progress');

  // 1️⃣ initial : on cache le panel
  panelWrapper.style.display = 'none';

  initViewer();

  // utilisation identique pour initial et secondaire
  function setupDropzone(dropzone, fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', e => {
      e.preventDefault(); dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault(); dropzone.classList.remove('dragover');
      if (!e.dataTransfer.files.length) return;
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    });
  }
  setupDropzone(initialDropzone, file3dUpload);
  setupDropzone(secondaryDropzone, file3dUpload2);

  // 2️⃣ Premier upload 3D
  file3dUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // barre indéterminée
    loadProgress.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = ev => {
      // parse STL
      const geometry = new THREE.STLLoader().parse(ev.target.result);
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      mesh.scale.set(0.5, 0.5, 0.5);
      scene.add(mesh);
      // recentre
      const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
      mesh.position.sub(center);
      camera.position.set(0,0,100);
      camera.lookAt(scene.position);

      // affiche panel + toolbar + secondary dropzone
      panelWrapper.style.display      = 'block';
      initialDropzone.style.display  = 'none';
      loadProgress.classList.add('hidden');
      secondaryDropzone.classList.remove('hidden');
    };
    reader.readAsArrayBuffer(file);
  });

  // 2ᵉ upload 3D
  file3dUpload2.addEventListener('change', function () {
    // ici ajout d'une nouvelle config (panier)
    // simple alert temporaire :
    alert('Deuxième fichier chargé : ' + this.files[0].name);
  });

  // Quantité / prix
  const qtyInput  = document.getElementById('quantity'),
        unitPrice = document.getElementById('unit-price'),
        totalPrice= document.getElementById('total-price');
  function updatePrices() {
    let q = parseInt(qtyInput.value) || 1;
    qtyInput.value = q;
    totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
  }
  qtyInput.addEventListener('change', updatePrices);

  // Slider Inserts
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
