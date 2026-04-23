// ==========================================
// COMPRAS.JS - Lista de Compras
// ==========================================

function novoItemCompra() {
    const nome = document.getElementById("c-item").value.trim();
    if (!nome) return;
    let db = getDB();
    db.compras.push({ id: Date.now().toString(), nome, comprado: false });
    saveDB(db);
    document.getElementById("c-item").value = "";
}

function toggleCompra(id) {
    let db = getDB();
    const idx = db.compras.findIndex(c => c.id === id);
    if (idx !== -1) {
        db.compras[idx].comprado = !db.compras[idx].comprado;
        saveDB(db);
    }
}

function renderizarCompras() {
    const db = getDB();
    const lista = document.getElementById("lista-compras");
    if (!lista) return;

    lista.innerHTML = db.compras.map(c => `
        <div class="item-list" style="padding: 10px 0;">
            <div style="display:flex; align-items:center; gap:10px;" class="compra-item ${c.comprado ? "riscado" : ""}">
                <input type="checkbox" class="compra-check" ${c.comprado ? "checked" : ""} onchange="toggleCompra('${c.id}')">
                <strong>${c.nome}</strong>
            </div>
            <button class="btn-action danger" onclick="apagarItem('compras', '${c.id}')">X</button>
        </div>
    `).join("");
}
