// ==========================================
// RANKING.JS - Ranking e Metas Coletivas
// ==========================================

function salvarMeta() {
    const obj = document.getElementById("meta-obj").value.trim();
    const pts = parseInt(document.getElementById("meta-pontos").value);
    if (!obj || !pts) {
        abrirModal("Aviso", "Preencha o objetivo e os pontos necessários!", "alert");
        return;
    }
    let db = getDB();
    db.metaFamiliar = { objetivo: obj, pontos: pts };
    saveDB(db);
}

function calcularMedalhas(m) {
    let medals = "";
    if ((m.tarefasConcluidas || 0) >= 5) medals += "⭐ ";
    if ((m.pontos || 0) >= 50 && (m.pontos || 0) < 150) medals += "🥉 ";
    if ((m.pontos || 0) >= 150 && (m.pontos || 0) < 300) medals += "🥈 ";
    if ((m.pontos || 0) >= 300) medals += "👑 ";
    return medals;
}

function renderizarRanking() {
    const db = getDB();
    const lista = document.getElementById("lista-ranking");
    if (!lista) return;

    let pontosTotais = 0;
    const membrosOrdenados = [...db.membros].sort((a, b) => (b.pontos || 0) - (a.pontos || 0));
    
    lista.innerHTML = membrosOrdenados.map((m, i) => {
        pontosTotais += m.pontos || 0;
        const pos = i === 0 ? "1º" : i === 1 ? "2º" : i === 2 ? "3º" : `${i + 1}º`;
        return `
            <div class="item-list">
                <div><strong style="font-size: 1.2rem;">${pos} ${m.avatar || "👤"} ${m.nome}</strong> <span style="margin-left: 10px;">${calcularMedalhas(m)}</span></div>
                <div><span class="badge pontos" style="font-size: 1rem;">${m.pontos || 0} pts</span></div>
            </div>`;
    }).join("");

    // Meta Coletiva
    const metaTexto = document.getElementById("meta-texto-display");
    const metaProgress = document.getElementById("meta-progress");
    const metaStatus = document.getElementById("meta-status");

    if (metaTexto) metaTexto.innerText = `Objetivo: ${db.metaFamiliar.objetivo}`;
    if (metaProgress) {
        metaProgress.max = db.metaFamiliar.pontos;
        metaProgress.value = pontosTotais;
    }
    if (metaStatus) metaStatus.innerText = `${pontosTotais} / ${db.metaFamiliar.pontos} pts`;
}

// --- Função Central de Atualização ---
function atualizarListas() {
    if (typeof renderizarMembros === 'function') renderizarMembros();
    if (typeof renderizarAtividades === 'function') renderizarAtividades();
    if (typeof renderizarCalendario === 'function') renderizarCalendario();
    if (typeof renderizarCompras === 'function') renderizarCompras();
    if (typeof renderizarLoja === 'function') renderizarLoja();
    if (typeof renderizarMural === 'function') renderizarMural();
    if (typeof renderizarRanking === 'function') renderizarRanking();
    
    // Notificações
    const db = getDB();
    let notificacoes = [];
    db.atividades.forEach(a => {
        if (a.data < hojeISO) notificacoes.push(`<div class="notify-item atrasada"><strong>🔴 Atrasada:</strong> ${a.descricao} (${a.membro})</div>`);
        else if (a.data === hojeISO) notificacoes.push(`<div class="notify-item hoje"><strong>🟡 Hoje:</strong> ${a.descricao} (${a.membro})</div>`);
    });
    
    const cNotif = document.getElementById("notif-count");
    const listaNotif = document.getElementById("lista-notificacoes");
    if (cNotif && listaNotif) {
        if (notificacoes.length > 0) {
            cNotif.innerText = notificacoes.length;
            cNotif.style.display = "block";
            listaNotif.innerHTML = notificacoes.join("");
        } else {
            cNotif.style.display = "none";
            listaNotif.innerHTML = '<div class="notify-item">Tudo tranquilo! ✨</div>';
        }
    }
}
