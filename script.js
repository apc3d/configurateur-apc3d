document.getElementById('file-upload').addEventListener('change', function(event) {
    const container = document.getElementById('config-container');
    for (const file of event.target.files) {
        const div = document.createElement('div');
        div.className = 'column';
        div.innerHTML = `
            <div class="preview-3d">${file.name}</div>
            <h3>Technologie</h3>
            <select>
                <option>SLS</option>
                <option>FDM</option>
                <option>MSLA</option>
            </select>
            <h3>Matériau</h3>
            <select>
                <option>PA12</option>
                <option>ABS</option>
            </select>
            <h3>Finition</h3>
            <select>
                <option>Brut</option>
                <option>Peinture</option>
            </select>
            <h3>Délai de livraison</h3>
            <div class="delivery-buttons">
                <button class="delivery-btn">Express 48H</button>
                <button class="delivery-btn">Standard 5J</button>
                <button class="delivery-btn">Économique 10J</button>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="check1">
                <label for="check1">Contrôle par expert</label><br>
                <input type="checkbox" id="check2">
                <label for="check2">Conserver orientation</label>
            </div>
        `;
        container.appendChild(div);
    }
});
