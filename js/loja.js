// ==========================================
// LOJA.JS - Sistema de Prêmios e Resgates
// ==========================================

function novaRecompensa() {
    const nome = document.getElementById("r-nome").value.trim();
    const custo = parseInt(document.getElementById("r-custo").value);
    if (!nome || !custo) return;
    let db = getDB();
    db.recompensas.push({ id: Date.now().toString(), nome, custo });
    saveDB(db);
    document.getElementById("r-nome").value = "";
    document.getElementById("r-custo").value = "";
}

async function comprarRecompensa(id, custo, nome) {
    let db = getDB();
    const compradorStr = await abrirModal("Resgatar Prêmio", `Quem está resgatando '${nome}' por ${custo} pontos?`, "prompt");
    if (!compradorStr) return;
    
    const idx = db.membros.findIndex(m => (m.nome || "").toLowerCase() === compradorStr.toLowerCase());
    if (idx === -1) {
        abrirModal("Atenção", "Membro não encontrado!", "alert");
        return;
    }
    if ((db.membros[idx].pontos || 0) < custo) {
        abrirModal("Saldo Insuficiente", `${db.membros[idx].nome} tem apenas ${db.membros[idx].pontos || 0} pontos.`, "alert");
        return;
    }
    db.membros[idx].pontos -= custo;
    saveDB(db);
    abrirModal("🎉 Sucesso!", `${db.membros[idx].nome} resgatou '${nome}'. Foram debitados ${custo} pontos.`, "alert");
}

function renderizarLoja() {
    const db = getDB();
    const lista = document.getElementById("lista-loja");
    if (!lista) return;

    lista.innerHTML = db.recompensas.map(r => `
        <div class="item-list">
            <div><strong>🎁 ${r.nome}</strong></div>
            <div>
                <span class="badge" style="background: var(--warning); color: white;">💰 ${r.custo} pts</span>
                <button class="btn-action success" onclick="comprarRecompensa('${r.id}', ${r.custo}, '${r.nome}')">Comprar</button>
                <button class="btn-action danger" onclick="apagarItem('recompensas', '${r.id}')">X</button>
            </div>
        </div>
    `).join("");
}
