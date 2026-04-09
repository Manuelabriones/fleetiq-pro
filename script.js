// DATOS INICIALES COMPLETOS
const FLEET = [
  { id:"U-01", model:"Freightliner Cascadia", km:97, dtc:2, dias:45, conduccion:"agresiva", ruta:"carretera", score:88 },
  { id:"U-07", model:"Kenworth T680", km:103, dtc:3, dias:62, conduccion:"agresiva", ruta:"mixta", score:94 },
  { id:"U-14", model:"Volvo FH16", km:91, dtc:1, dias:38, conduccion:"normal", ruta:"carretera", score:76 },
  { id:"U-22", model:"International LT", km:78, dtc:0, dias:25, conduccion:"normal", ruta:"urbana", score:42 },
  { id:"U-03", model:"Peterbilt 579", km:55, dtc:0, dias:12, conduccion:"suave", ruta:"carretera", score:18 },
  { id:"U-18", model:"Mack Anthem", km:85, dtc:1, dias:31, conduccion:"normal", ruta:"mixta", score:61 },
  { id:"U-09", model:"Freightliner Cascadia", km:44, dtc:0, dias:8, conduccion:"suave", ruta:"urbana", score:12 },
  { id:"U-25", model:"Kenworth W900", km:69, dtc:0, dias:19, conduccion:"normal", ruta:"carretera", score:35 },
];

// AGENDA ACTUALIZADA CON TODOS LOS ELEMENTOS DE LA IMAGEN
const AGENDA = [
  { day:"HOY", unit:"U-07", reason:"DTC activos P0300, P0171 · km excedido", risk:"red" },
  { day:"HOY", unit:"U-01", reason:"62 días sin servicio · conducción agresiva", risk:"red" },
  { day:"MIÉ", unit:"U-14", reason:"DTC histórico · km al 91%", risk:"amber" },
  { day:"JUE", unit:"U-18", reason:"Revisión preventiva programada", risk:"amber" },
  { day:"VIE", unit:"U-22", reason:"Servicio de rutina · km al 78%", risk:"amber" },
];

// LÓGICA DE RIESGO
function riskLevel(score) {
  if (score >= 75) return { label:"Alto", cls:"risk-red", dot:"risk-dot-red", action:"Intervenir", actionCls:"action-red" };
  if (score >= 45) return { label:"Medio", cls:"risk-amber", dot:"risk-dot-amber", action:"Revisar", actionCls:"action-amber" };
  return { label:"Bajo", cls:"risk-green", dot:"risk-dot-green", action:"Mantener", actionCls:"action-green" };
}

// RENDERIZADO DE TABLA
function renderFleet() {
  const sorted = [...FLEET].sort((a,b) => b.score - a.score);
  const tbody = document.getElementById("fleetBody");
  if(!tbody) return;
  
  tbody.innerHTML = sorted.map(u => {
    const r = riskLevel(u.score);
    const fill = u.score >= 75 ? "var(--red)" : u.score >= 45 ? "var(--amber)" : "var(--green)";
    return `<tr onclick="selectUnit('${u.id}')" id="row-${u.id.replace('-','')}">
      <td><span class="mono" style="font-weight:700;">${u.id}</span><br><span style="font-size:11px;color:var(--muted);">${u.model}</span></td>
      <td><span class="risk-pill ${r.cls}"><span class="risk-dot ${r.dot}"></span>${r.label}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="score-bar"><div class="score-fill" style="width:${u.score}%;background:${fill};"></div></div>
          <span class="mono" style="font-size:12px;">${u.score}</span>
        </div>
      </td>
      <td><span class="mono">${100 - u.km < 0 ? 0 : 100 - u.km}%</span></td>
      <td><span style="font-size:12px;">${u.dias}d atrás</span></td>
      <td><span class="action-tag ${r.actionCls}">${r.action}</span></td>
    </tr>`;
  }).join("");
}

// RENDERIZADO DE AGENDA (Muestra todas las tarjetas de la lista)
function renderAgenda() {
  const container = document.getElementById("agendaList");
  if(!container) return;

  container.innerHTML = AGENDA.map(a => {
    const color = a.risk === 'red' ? 'var(--red)' : 'var(--amber)';
    return `
      <div class="agenda-item">
        <div class="agenda-day">${a.day}</div>
        <div class="agenda-dot" style="background: ${color}; box-shadow: 0 0 8px ${color};"></div>
        <div class="agenda-unit">${a.unit}</div>
        <div class="agenda-reason">${a.reason}</div>
      </div>`;
  }).join("");
}

// BRIEF IA (Resumen)
function generateBrief() {
  const brief = document.getElementById("briefText");
  if(!brief) return;
  brief.innerHTML = `Hay <span style="color:var(--red);font-weight:700;">3 unidades en riesgo alto</span> (U-01, U-07, U-14). 
  Se recomienda priorizar la <span class="unit-highlight">U-07</span> por múltiples DTCs críticos. 
  La disponibilidad de la flota se mantiene en <span style="color:var(--green);font-weight:700;">75%</span>.`;
}

// CHAT & LÓGICA DE MENSAJERÍA
function addMessage(role, text) {
  const msgs = document.getElementById("chatMessages");
  if(!msgs) return;
  const div = document.createElement("div");
  div.className = `msg msg-${role}`;
  const now = new Date().toLocaleTimeString("es-MX", {hour:"2-digit",minute:"2-digit"});
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  
  addMessage("user", text);
  input.value = "";
  input.style.height = "auto";

  // Respuesta simulada
  setTimeout(() => {
    let reply = "He analizado los datos. ¿Deseas que genere una orden de servicio para estas unidades?";
    if(text.toLowerCase().includes("u-07")) reply = "La unidad **U-07** reporta fallas en el sistema de inyección (P0300). Riesgo crítico detectado.";
    addMessage("ai", reply);
  }, 700);
}

// UTILIDADES
function selectUnit(id) {
  const input = document.getElementById("chatInput");
  input.value = `Analiza la unidad ${id}`;
  sendMessage();
}

function updateClock() {
  const clock = document.getElementById("clock");
  if(clock) clock.textContent = new Date().toLocaleTimeString("es-MX");
}

function handleKey(e) { 
  if (e.key === "Enter" && !e.shiftKey) { 
    e.preventDefault(); 
    sendMessage(); 
  } 
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 100) + "px";
}

function askSuggestion(el) {
  document.getElementById("chatInput").value = el.textContent;
  sendMessage();
}

// INICIALIZACIÓN AL CARGAR
window.onload = () => {
  renderFleet();
  renderAgenda();
  generateBrief();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Mensaje de bienvenida
  setTimeout(() => {
    addMessage("ai", "Sistema listo. Hoy hay <strong>3 unidades críticas</strong>. ¿Por dónde empezamos?");
  }, 500);
};