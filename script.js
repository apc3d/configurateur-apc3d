let scene, camera, renderer, mesh;

function initViewer(container) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
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
  const container = document.getElementById('configs-container');
  const template  = document.getElementById('config-template');
  const initDrop  = document.getElementById('initial-dropzone');
  const initInput = document.getElementById('file3d-upload-init');

  function setupConfig(file) {
    // Cloner
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);

    // Récupérer les éléments du clone
    const wrapper     = container.lastElementChild;
    const viewerEl    = wrapper.querySelector('.viewer');
    const progressEl  = wrapper.querySelector('.progress-overlay');
    const progressTxt = progressEl.querySelector('span');
    const fileInput   = wrapper.querySelector('.file3d-upload');
    const qtyInput    = wrapper.querySelector('.quantity');
    const unitPrice   = wrapper.querySelector('.unit-price');
    const totalPrice  = wrapper.querySelector('.total-price');
    const slider      = wrapper.querySelector('.inserts-range');
    const sliderCount = wrapper.querySelector('.inserts-count');
    const opts        = wrapper.querySelectorAll('.opt');
    const fileImport  = wrapper.querySelector('.file-import');
    const importInput = fileImport.nextElementSibling;

    // Initialiser le viewer
    initViewer(viewerEl);

    // Écouteur upload 3D
    fileInput.addEventListener('change', function() {
      const f = this.files[0];
      if (!f) return;
      progressEl.classList.remove('hidden');
      progressTxt.textContent = '0%';
      const reader = new FileReader();
      reader.onprogress = e => {
        if (e.lengthComputable) {
          progressTxt.textContent = Math.floor((e.loaded/e.total)*100)+'%';
        }
      };
      reader.onload = ev => {
        const geom = new THREE.STLLoader().parse(ev.target.result);
        if (mesh) scene.remove(mesh);
        mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({ color:0x606060 }));
        mesh.scale.set(0.5,0.5,0.5);
        scene.add(mesh);
        // recentre
        const cen = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
        mesh.position.sub(cen);
        camera.position.set(0,0,100);
        camera.lookAt(scene.position);

        progressEl.classList.add('hidden');
      };
      reader.readAsArrayBuffer(f);
    });

    // Slider inserts
    slider.addEventListener('input', e => {
      sliderCount.textContent = e.target.value;
    });

    // Délai
    opts.forEach(opt => opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    }));

    // Quantité / prix
    qtyInput.addEventListener('change', () => {
      const q = parseInt(qtyInput.value)||1;
      qtyInput.value = q;
      totalPrice.textContent = (q * parseFloat(unitPrice.textContent)).toFixed(2);
    });

    // Import PDF
    importInput.addEventListener('change', () => {
      const status = wrapper.querySelector('#file-status');
      status.textContent = importInput.files.length ? `${importInput.files[0].name} chargé` : '';
    });
  }

  // Setup dropzone
  function setupDropzone(dropzone, input) {
    dropzone.addEventListener('click', () => input.click());
    ['dragover','drop'].forEach(evt => dropzone.addEventListener(evt, e=>{
      e.preventDefault();
      if(evt==='dragover') dropzone.classList.add('dragover');
      else dropzone.classList.remove('dragover');
    }));
    dropzone.addEventListener('drop', e => {
      if(!e.dataTransfer.files.length) return;
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    });
  }

  setupDropzone(initDrop, initInput);

  initInput.addEventListener('change', () => {
    // Premier fichier → crée la première config
    setupConfig(initInput.files[0]);
    initDrop.style.display = 'none';
    // Afficher la dropzone secondaire pour la suite
    document.querySelector('.secondary-dropzone').classList.remove('hidden');
  });

  // Seconde dropzone (hors cadre)
  const secDrop = document.querySelector('.secondary-dropzone');
  const secInp  = document.getElementById('file3d-upload2');
  setupDropzone(secDrop, secInp);

  secInp.addEventListener('change', () => {
    // Chaque nouveau fichier crée une nouvelle config
    setupConfig(secInp.files[0]);
    // clean the input for next
    secInp.value = '';
  });

});
