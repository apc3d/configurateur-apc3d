const fileInput = document.getElementById('file-input');
const previewArea = document.getElementById('preview-area');
const configurations = document.getElementById('configurations');
const addConfigButton = document.getElementById('add-config');

// Upload de fichier et aperçu 3D (simple pour l'instant)
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  Array.from(files).forEach(file => {
    createConfigCard(file);
  });
});

function createConfigCard(file) {
  const configCard = document.createElement('div');
  configCard.className = 'config-card';
  
  configCard.innerHTML = `
    <h3>${file.name}</h3>
    <label>Technologie</label>
    <select>
      <option>FDM</option>
      <option>SLS</option>
      <option>SLA</option>
    </select><br><br>
    <label>Matériau</label>
    <select>
      <option>PLA</option>
      <option>ABS</option>
      <option>Nylon</option>
    </select><br><br>
    <label>Finition</label>
    <select>
      <option>Brut</option>
      <option>Lissé</option>
    </select><br><br>
    <label>Délai</label>
    <select>
      <option>Standard</option>
      <option>Express</option>
    </select><br><br>
    <label>Quantité</label>
    <input type="number" value="1" min="1" style="margin-bottom:10px;"><br><br>
    <input type="checkbox" checked> Inclure
  `;

  configurations.appendChild(configCard);
}

// Bouton ajouter une config supplémentaire
addConfigButton.addEventListener('click', () => {
  const dummyFile = new File([""], "Nouvelle_Pièce.stl");
  createConfigCard(dummyFile);
});

// Popup négociation
const popup = document.getElementById('popup');
const openPopup = document.getElementById('negotiate-prices');
const closePopup = document.getElementById('close-popup');

openPopup.addEventListener('click', () => {
  popup.style.display = 'block';
});
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});
