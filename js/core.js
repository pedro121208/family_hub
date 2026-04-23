// ==========================================
// CORE.JS - Funções Base e Configurações Globais
// ==========================================

const somNotificacao = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
const hojeObj = new Date();
const hojeISO = hojeObj.toISOString().split("T")[0];

let currentUser = "";

// --- Banco de Dados Local ---
function getDB() {
    let dbStr = localStorage.getItem("familyHubDB");
    let db = dbStr ? JSON.parse(dbStr) : {};

    db.atividades = db.atividades || [];
    db.membros = db.membros || [];
    db.mural = db.mural || [];
    db.compras = db.compras || [];
    db.calendario = db.calendario || [];
    db.recompensas = db.recompensas || [
        { id: "def1", nome: "Escolher o filme do final de semana", custo: 50 },
        { id: "def2", nome: "Pedir Pizza", custo: 100 },
        { id: "def3", nome: "1h a mais no PC/Videogame", custo: 30 }
    ];
    db.metaFamiliar = db.metaFamiliar || { objetivo: "Defina uma meta!", pontos: 1000 };
    
    return db;
}

function saveDB(db) {
    localStorage.setItem("familyHubDB", JSON.stringify(db));
    if (typeof atualizarListas === 'function') atualizarListas();
}

// --- Interface e Navegação ---
function navegar(idAba, btn) {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
    document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("aba-" + idAba).classList.add("ativa");
    btn.classList.add("active");

    if (idAba === "calendario" && typeof renderizarCalendario === 'function') {
        renderizarCalendario();
    }
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
    } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
}

function toggleNotificacoes() {
    document.getElementById("notif-dropdown").classList.toggle("active");
}

// --- Utilitários ---
function formatarDataBR(dataISO) {
    if (!dataISO) return "Sem data";
    const partes = dataISO.split("-");
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// --- Modal Personalizado ---
function abrirModal(titulo, mensagem, tipo = "alert", valorPadrao = "") {
    return new Promise((resolve) => {
        const overlay = document.getElementById("custom-modal-overlay");
        const tituloEl = document.getElementById("custom-modal-title");
        const msgEl = document.getElementById("custom-modal-msg");
        const inputEl = document.getElementById("custom-modal-input");
        const btnCancel = document.getElementById("custom-modal-cancel");
        const btnConfirm = document.getElementById("custom-modal-confirm");

        tituloEl.innerText = titulo;
        msgEl.innerText = mensagem;

        if (tipo === "prompt") {
            inputEl.style.display = "block";
            inputEl.value = valorPadrao;
            setTimeout(() => inputEl.focus(), 100);
        } else {
            inputEl.style.display = "none";
        }

        btnCancel.style.display = tipo === "alert" ? "none" : "block";
        overlay.style.display = "flex";

        const fechar = () => {
            overlay.style.display = "none";
            btnConfirm.onclick = null;
            btnCancel.onclick = null;
        };

        btnCancel.onclick = () => { fechar(); resolve(null); };
        btnConfirm.onclick = () => {
            const val = inputEl.value;
            fechar();
            resolve(tipo === "prompt" ? val : true);
        };
    });
}

async function apagarItem(tabela, id) {
    const confirmacao = await abrirModal("Atenção", "Tem certeza que deseja remover este item definitivamente?", "confirm");
    if (confirmacao) {
        let db = getDB();
        db[tabela] = db[tabela].filter(item => item.id !== id);
        saveDB(db);
    }
}

// Inicialização Global
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "light") {
        document.documentElement.removeAttribute("data-theme");
    }
    
    const dataAtualEl = document.getElementById("data-atual");
    if (dataAtualEl) {
        dataAtualEl.innerText = hojeObj.toLocaleDateString("pt-BR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    }

    if (typeof initAuth === 'function') initAuth();
});
