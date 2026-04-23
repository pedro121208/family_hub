#  Sistema de Gestão Familiar

##  Desafio
Desenvolver um sistema web completo para gerenciar a rotina da família, aplicando conhecimentos em:

- `HTML`
- `CSS`
- `JavaScript`
- `Banco de Dados`

---

##  Estrutura de Arquivo 

*Projeto*

`index.html`
`style.css`
`script.js` 


##  Arquitetura do Sistema

###  Front-end
Interface intuitiva e responsiva para:
-  Dispositivos móveis
-  Computadores

---

###  Back-end
Responsável por:
- Lógica de negócio
- Processamento de dados
- Criação de API

---

###  Banco de Dados
Armazenamento seguro e estruturado de:
- Membros da família
- Atividades

---

##  Funcionalidades

###  Obrigatórias (MVP)
- Cadastro de membros da família
- Gestão de atividades (escola, esportes, etc.)
- Visualização em calendário
- Notificações de compromissos

---

##  Layout do Sistema

###  Dashboard
- Menu lateral com navegação:
  - Dashboard
  - Membros
  - Calendário
- Área central com:
  - Cards de status
  - Lista de atividades recentes

---

##  Modelagem de Dados

###  Tabela: Membros

| Campo      | Tipo    | Descrição             |
|------------|--------|----------------------|
| id_membro  | INT    | Chave primária       |
| nome       | VARCHAR| Nome completo        |
| papel      | VARCHAR| Pai, Mãe, Filho etc. |

---

###  Tabela: Atividades

| Campo      | Tipo | Descrição                  |
|------------|------|---------------------------|
| id_ativ    | INT  | Chave primária            |
| descricao  | TEXT | Descrição da atividade    |
| id_membro  | INT  | Chave estrangeira         |


