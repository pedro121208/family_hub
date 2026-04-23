// ==========================================
// MURAL.JS - Recados da Família
// ==========================================

function novaMensagem() {
    const texto = document.getElementById("m-texto").value.trim();
    if (!texto) return;
    let db = getDB();
    db.mural.push({
        id: Date.now().toString(),
        autor: currentUser,
        texto,
        hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });
    saveDB(db);
    document.getElementById("m-texto").value = "";
}

function renderizarMural() {
    const db = getDB();
    const lista = document.getElementById("lista-mural");
    if (!lista) return;

    if (db.mural.length > 0) {
        lista.innerHTML = db.mural.slice().reverse().map(m => `
            <div class="msg-bubble">
                <div class="msg-header"><span>De: <strong style="color: var(--primary)">${m.autor}</strong></span> <span>${m.hora}</span></div>
                <div style="margin-top: 5px;">${m.texto}</div>
            </div>
        `).join("");
    } else {
        lista.innerHTML = "Nenhuma mensagem no mural.";
    }
}
