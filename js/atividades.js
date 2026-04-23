// ==========================================
// ATIVIDADES.JS - Gestão de Tarefas e Pontos
// ==========================================

function calcularPreviaPontos() {
    const vals = { facil: 0, media: 5, dificil: 10, normal: 0, alta: 5, urgente: 10 };
    const dif = document.getElementById("a-dificuldade").value;
    const imp = document.getElementById("a-importancia").value;
    const t = 10 + (vals[dif] || 0) + (vals[imp] || 0);
    const btn = document.getElementById("btn-add-atv");
    if (btn) btn.innerText = `Adicionar (${t} pts)`;
    return t;
}

function novaAtividade() {
    const desc = document.getElementById("a-desc").value.trim();
    const data = document.getElementById("a-data").value;
    const membro = document.getElementById("a-membro").value;

    if (!desc || !membro || !data) {
        abrirModal("Aviso", "Preencha descrição, data e responsável!", "alert");
        return;
    }

    let db = getDB();
    db.atividades.push({
        id: Date.now().toString(),
        descricao: desc,
        data: data,
        membro: membro,
        dificuldade: document.getElementById("a-dificuldade").value,
        pontos: calcularPreviaPontos()
    });
    saveDB(db);
    somNotificacao.play();
    document.getElementById("a-desc").value = "";
    document.getElementById("a-data").value = "";
}

function concluirAtividade(id) {
    let db = getDB();
    const atv = db.atividades.find(a => a.id === id);
    if (atv) {
        const idx = db.membros.findIndex(m => m.nome === atv.membro);
        if (idx !== -1) {
            db.membros[idx].pontos = (db.membros[idx].pontos || 0) + (atv.pontos || 0);
            db.membros[idx].tarefasConcluidas = (db.membros[idx].tarefasConcluidas || 0) + 1;
            abrirModal("🎉 Mandou bem!", `${atv.membro} ganhou +${atv.pontos || 0} pontos!`, "alert");
        }
        db.atividades = db.atividades.filter(a => a.id !== id);
        saveDB(db);
    }
}

function renderizarAtividades() {
    const db = getDB();
    const lista = document.getElementById("lista-atividades");
    if (!lista) return;

    lista.innerHTML = db.atividades.map(a => {
        const mObj = db.membros.find(mb => mb.nome === a.membro);
        const avatar = mObj ? mObj.avatar || "👤" : "👤";
        return `
            <div class="item-list">
                <div>
                    <strong>${a.descricao}</strong> <span class="tag-dif ${a.dificuldade}">${a.dificuldade}</span><br>
                    <small style="color:var(--text-muted)">${avatar} ${a.membro} | 📅 ${formatarDataBR(a.data)} | <span class="tag-pts">💰 ${a.pontos} pts</span></small>
                </div>
                <div>
                    <button class="btn-action success" onclick="concluirAtividade('${a.id}')">✔ Concluir</button>
                    <button class="btn-action danger" onclick="apagarItem('atividades', '${a.id}')">X</button>
                </div>
            </div>`;
    }).join("");

    const infoAtv = document.getElementById("info-atividades");
    if (infoAtv) infoAtv.innerText = `${db.atividades.length} Atv`;
}
