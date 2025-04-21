const uploadInput = document.getElementById('upload');
const viewer = document.getElementById('viewer');

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    viewer.innerHTML = `Fichier chargé : ${file.name}`;

    // (Plus tard ici, intégrer modèle 3D type model-viewer)
});

// Gestion sélection des délais
const delaiButtons = document.querySelectorAll('.delai-buttons button');

delaiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        delaiButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});
