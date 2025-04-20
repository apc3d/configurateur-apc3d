document.getElementById("fileUpload").addEventListener("change", function (e) {
  const files = e.target.files;
  const preview = document.getElementById("preview-area");
  preview.innerHTML = "";

  [...files].forEach((file) => {
    const block = document.createElement("div");
    block.className = "config-block";

    block.innerHTML = `
      <div class="col1">
        <strong>Aperçu 3D</strong><br/>
        <p>${file.name}</p>
        <p><strong>Dimensions :</strong><br>120x65x10 mm<br><strong>Volume :</strong> 45.22 cm³</p>
      </div>

      <div class="col2">
        <label>Technologie</label>
        <select><option>FDM</option><option>SLS</option></select>
        <label>Matériaux</label>
        <select><option>PLA</option><option>PA12</option></select>
        <label>Finition</label>
        <select><option>Brut</option><option>Colorée</option></select>
        <label>Couleur</label>
        <select><option>Rouge</option><option>Gris</option></select>
      </div>

      <div class="col3">
        <label>Inserts / taraudages</label>
        <div><button>-</button> <input type="number" value="0"/> <button>+</button></div>
        <label>Délai de livraison</label>
        <div style="display:flex; gap:10px; margin-top:5px;">
          <button>Fast<br>29/04</button>
          <button style="background:#ff6200; color:white;">Standard<br>29/04</button>
          <button>Eco<br>29/04</button>
        </div>
        <label><input type="checkbox" /> Contrôle du fichier</label><br/>
        <label><input type="checkbox" /> Orientation d’origine</label>
      </div>

      <div class="col4">
        <label>Quantité</label>
        <input type="number" value="1"/>
        <label>Prix unitaire</label>
        <input type="text" value="198.41€"/>
        <label>Total</label>
        <input type="text" value="198.41€"/>
        <table>
          <tr><th>Qté</th><th>Unité</th><th>Total</th></tr>
          <tr><td>1</td><td>198.41</td><td>198.41</td></tr>
          <tr><td>2</td><td>196.80</td><td>393.60</td></tr>
          <tr><td>3</td><td>195.98</td><td>587.94</td></tr>
        </table>
      </div>
    `;

    preview.appendChild(block);
  });
});
