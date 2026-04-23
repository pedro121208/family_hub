// ==========================================
// AUTH.JS - Cadastro e Login
// ==========================================

function initAuth() {
    const authData = localStorage.getItem("familyAuthDB");
    if (authData) {
        const auth = JSON.parse(authData);
        const titleEl = document.getElementById("login-family-title");
        if (titleEl) titleEl.innerText = `Família: ${auth.familyName || "Cadastrada"}`;
        alternarAuth("login");
    } else {
        alternarAuth("cadastro");
    }
}

function alternarAuth(tela) {
    const boxLogin = document.getElementById("box-login");
    const boxCadastro = document.getElementById("box-cadastro");
    if (boxLogin) boxLogin.style.display = tela === "login" ? "block" : "none";
    if (boxCadastro) boxCadastro.style.display = tela === "cadastro" ? "block" : "none";
}

async function registrarFamilia() {
    const family = document.getElementById("reg-family").value.trim();
    const admin = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value.trim();
    
    if (!family || !admin || !pass) {
        abrirModal("Atenção", "Preencha todos os campos!", "alert");
        return;
    }

    localStorage.setItem("familyAuthDB", JSON.stringify({ familyName: family, password: pass }));
    
    let db = getDB();
    db.membros.push({
        id: Date.now().toString(),
        nome: admin,
        avatar: "👑",
        papel: "Administrador",
        pontos: 0,
        saldo: 0,
        tarefasConcluidas: 0
    });
    saveDB(db);

    await abrirModal("Sucesso", "Família criada! Faça login para começar.", "alert");
    initAuth();
}

async function fazerLogin() {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();
    const authData = localStorage.getItem("familyAuthDB");

    if (!authData) {
        abrirModal("Aviso", "Nenhuma família cadastrada!", "alert");
        return;
    }

    const auth = JSON.parse(authData);
    const db = getDB();

    if (pass !== auth.password) {
        abrirModal("Erro", "Senha incorreta!", "alert");
        return;
    }

    const usuarioExiste = db.membros.find(m => (m.nome || "").toLowerCase() === user.toLowerCase());

    if (!usuarioExiste) {
        abrirModal("Erro", "Usuário não cadastrado!", "alert");
        return;
    }

    currentUser = usuarioExiste.nome;
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "flex";
    document.getElementById("saudacao-user").innerHTML = `🌤️ Olá, ${currentUser}!`;

    if (typeof atualizarListas === 'function') atualizarListas();
}

function logout() {
    currentUser = "";
    document.getElementById("app-screen").style.display = "none";
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("login-user").value = "";
    document.getElementById("login-pass").value = "";
}
