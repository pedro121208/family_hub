// ==========================================
// CALENDARIO.JS - Lógica do Calendário e Feriados
// ==========================================

let calMesAtual = hojeObj.getMonth();
let calAnoAtual = hojeObj.getFullYear();

const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function mudarMes(direcao) {
    calMesAtual += direcao;
    if (calMesAtual < 0) { calMesAtual = 11; calAnoAtual--; }
    else if (calMesAtual > 11) { calMesAtual = 0; calAnoAtual++; }
    renderizarCalendario();
}

function novoEvento() {
    const data = document.getElementById("cal-data").value;
    const desc = document.getElementById("cal-desc").value.trim();
    if (!data || !desc) {
        abrirModal("Aviso", "Preencha a data e a descrição do evento!", "alert");
        return;
    }
    let db = getDB();
    db.calendario.push({ id: Date.now().toString(), data, descricao: desc });
    saveDB(db);
    somNotificacao.play();
    document.getElementById("cal-data").value = "";
    document.getElementById("cal-desc").value = "";
    renderizarCalendario();
}

async function apagarEventoCalendario(id) {
    const confirmacao = await abrirModal("Remover Evento", "Deseja remover este evento do calendário?", "confirm");
    if (confirmacao) {
        let db = getDB();
        db.calendario = db.calendario.filter(item => item.id !== id);
        saveDB(db);
        renderizarCalendario();
    }
}

function renderizarCalendario() {
    const db = getDB();
    const grid = document.getElementById("calendar-grid");
    const title = document.getElementById("calendar-title");
    if (!grid || !title) return;

    title.innerText = `${nomesMeses[calMesAtual]} ${calAnoAtual}`;
    grid.innerHTML = "";

    diasSemana.forEach(dia => { grid.innerHTML += `<div class="calendar-day-header">${dia}</div>`; });

    const primeiroDia = new Date(calAnoAtual, calMesAtual, 1).getDay();
    const ultimoDia = new Date(calAnoAtual, calMesAtual + 1, 0).getDate();
    const feriados = getFeriados(calAnoAtual);

    for (let i = 0; i < primeiroDia; i++) grid.innerHTML += `<div class="calendar-day empty"></div>`;

    for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataStr = `${calAnoAtual}-${String(calMesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        let isToday = dataStr === hojeISO ? "today" : "";
        let badgesHTML = "";

        if (feriados[dataStr]) badgesHTML += `<div class="cal-badge holiday" title="${feriados[dataStr]}">${feriados[dataStr]}</div>`;
        db.calendario.forEach(ev => {
            if (ev.data === dataStr) badgesHTML += `<div class="cal-badge event" title="${ev.descricao}" onclick="apagarEventoCalendario('${ev.id}')">🗓️ ${ev.descricao}</div>`;
        });
        db.atividades.forEach(atv => {
            if (atv.data === dataStr) {
                const m = db.membros.find(mb => mb.nome === atv.membro);
                badgesHTML += `<div class="cal-badge activity" title="${atv.descricao}">📋 ${m ? m.avatar : "👤"} ${atv.descricao}</div>`;
            }
        });

        grid.innerHTML += `<div class="calendar-day ${isToday}"><span class="day-number">${dia}</span>${badgesHTML}</div>`;
    }
}

// --- Lógica de Feriados ---
function getFeriados(ano) {
    const f = {};
    f[`${ano}-01-01`] = "🎆 Ano Novo";
    f[`${ano}-04-21`] = "🏛️ Tiradentes";
    f[`${ano}-05-01`] = "👷 Dia do Trabalho";
    f[`${ano}-09-07`] = "🇧🇷 Independência";
    f[`${ano}-10-12`] = "🧸 Dia das Crianças";
    f[`${ano}-11-02`] = "🕯️ Finados";
    f[`${ano}-11-15`] = "📜 Proclamação";
    f[`${ano}-12-25`] = "🎄 Natal";
    
    // Páscoa e derivados (simplificado)
    const pascoa = calcularPascoa(ano);
    f[formatarDataISO(pascoa)] = "🐇 Páscoa";
    f[formatarDataISO(new Date(pascoa.getTime() - 47 * 86400000))] = "🎉 Carnaval";
    f[formatarDataISO(new Date(pascoa.getTime() + 60 * 86400000))] = "🍷 Corpus Christi";
    return f;
}

function calcularPascoa(ano) {
    const f = Math.floor, G = ano % 19, C = f(ano / 100);
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
    const J = (ano + f(ano / 4) + I + 2 - C + f(C / 4)) % 7;
    const L = I - J, m = 3 + f((L + 40) / 44), d = L + 28 - 31 * f(m / 4);
    return new Date(ano, m - 1, d);
}

function formatarDataISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
