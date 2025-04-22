document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    addConfiguration(file.name);
  }
});

function addConfiguration(fileName) {
  const configSection = document.createElement('div');
  configSection.classList.add('config-container');

  configSection.innerHTML = `
    <div class="column column-1">
      <div class="preview-3d">${fileName}</div>
    </div>

    <div class="column column-2">
      <h3>Technologie</h3>
      <select>
        <option>SLS</option>
        <option>MSLA</option>
        <option>FDM</option>
      </select>
      <h3>Matériau</h3>
      <select>
        <option>PA12</option>
        <option>ABS</option>
        <option>PLA</option>
      </select>
      <h3>Finition</h3>
      <select>
        <option>Standard</option>
        <option>Peinture</option>
      </select>
      <h3>Couleur</h3>
      <select>
        <option>Blanc</option>
        <option>Noir</option>
      </select>
    </div>

    <div class="column column-3">
      <h3>Inserts/Taraudages</h3>
      <input type="number" placeholder="0">
      <h3>Délai de livraison</h3>
      <div class="delivery-buttons">
        <button class="delivery-btn">48h</button>
        <button class="delivery-btn">5j</button>
        <button class="delivery-btn">8j</button>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="controle"><label for="controle">Contrôle fichier</label><br>
        <input type="checkbox" id="orientation"><label for="orientation">Conserver orientation</label>
      </div>
    </div>

    <div class="column column-4">
      <h3>Quantité</h3>
      <input type="number" placeholder="1">
      <table class="pricing-table">
        <thead>
          <tr>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>20€</td>
            <td>20€</td>
          </tr>
          <tr>
            <td>10</td>
            <td>18€</td>
            <td>180€</td>
          </tr>
          <tr>
            <td>50</td>
            <td>15€</td>
            <td>750€</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const bottomBar = document.createElement('div');
  bottomBar.classList.add('bottom-bar');
  bottomBar.innerHTML = `
    <div class="left-buttons">
      <button class="icon-btn" title="Supprimer">🗑️</button>
      <button class="icon-btn" title="Dupliquer">📄</button>
    </div>

    <div class="right-upload">
      <label class="upload-label">
        Charger un plan 2D
        <input type="file" hidden>
      </label>
    </div>
  `;

  document.getElementById('configurations').appendChild(configSection);
  document.getElementById('configurations').appendChild(bottomBar);
}
