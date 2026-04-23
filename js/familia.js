// ==========================================
// FAMILIA.JS - Gestão de Membros e Cofre
// ==========================================

function novoMembro() {
    const nome = document.getElementById("m-nome").value.trim();
    const avatar = document.getElementById("m-avatar").value;
    const papel = document.getElementById("m-papel").value;

    if (!nome) {
        abrirModal("Aviso", "Digite o nome do membro!", "alert");
        return;
    }

    let db = getDB();
    db.membros.push({
        id: Date.now().toString(),
        nome,
        avatar,
        papel,
        pontos: 0,
        saldo: 0,
        tarefasConcluidas: 0
    });
    saveDB(db);
    somNotificacao.play();
    document.getElementById("m-nome").value = "";
}

function alterarSaldo(id, valor) {
    let db = getDB();
    const idx = db.membros.findIndex(m => m.id === id);
    if (idx !== -1) {
        db.membros[idx].saldo = (db.membros[idx].saldo || 0) + valor;
        saveDB(db);
    }
}

async function editarSaldoDireto(id) {
    let db = getDB();
    const idx = db.membros.findIndex(m => m.id === id);
    if (idx !== -1) {
        const valorAtual = db.membros[idx].saldo || 0;
        const novoValor = await abrirModal(
            "Editar Saldo",
            `Digite o novo saldo (em Reais) para ${db.membros[idx].nome}:`,
            "prompt",
            valorAtual.toFixed(2)
        );

        if (novoValor !== null && novoValor.trim() !== "") {
            const num = parseFloat(novoValor.replace(",", "."));
            if (!isNaN(num)) {
                db.membros[idx].saldo = num;
                saveDB(db);
            }
        }
    }
}

function renderizarMembros() {
    const db = getDB();
    const listaMembros = document.getElementById("lista-membros-simples");
    if (!listaMembros) return;

    listaMembros.innerHTML = db.membros.map(m => `
        <div class="item-list">
            <div style="font-size: 1.1rem;">${m.avatar || "👤"} <strong>${m.nome || "Desconhecido"}</strong></div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end;">
                <span class="badge" style="background: var(--bg-input); color: var(--text-main); font-size: 1rem;">R$ ${(m.saldo || 0).toFixed(2)}</span>
                <div>
                    <button class="btn-action success" onclick="alterarSaldo('${m.id}', 5)">+5</button>
                    <button class="btn-action danger" onclick="alterarSaldo('${m.id}', -5)">-5</button>
                    <button class="btn-action warning" onclick="editarSaldoDireto('${m.id}')">✏️ Editar</button>
                    <button class="btn-action danger" onclick="apagarItem('membros', '${m.id}')">X</button>
                </div>
            </div>
        </div>
    `).join("");

    // Atualiza select de membros em Atividades
    const selectMembro = document.getElementById("a-membro");
    if (selectMembro) {
        const options = db.membros.map(m => 
            `<option value="${m.nome}">${m.avatar || "👤"} ${m.nome}</option>`
        ).join("");
        selectMembro.innerHTML = options || '<option value="">Cadastre membros...</option>';
    }
}
