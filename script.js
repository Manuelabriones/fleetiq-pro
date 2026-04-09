const data = [
  { id: "U-01", km: 95, dias: 60, fallas: 3 },
  { id: "U-02", km: 80, dias: 30, fallas: null }, // dato incompleto
  { id: "U-03", km: 40, dias: 10, fallas: 0 }
];

const tabla = document.getElementById("tabla");
const respuesta = document.getElementById("respuesta");

function calcularScore(u) {
  let score = 0;

  // KM
  if (u.km > 90) score += 40;
  else if (u.km > 80) score += 30;
  else score += 10;

  // FALLAS
  if (u.fallas === null) score += 15; // dato incompleto
  else if (u.fallas >= 3) score += 30;
  else if (u.fallas > 0) score += 15;

  // DIAS
  if (u.dias > 45) score += 20;
  else if (u.dias > 20) score += 10;

  return score;
}

function getRiesgo(score) {
  if (score >= 70) return "alto";
  if (score >= 40) return "medio";
  return "bajo";
}

function getAccion(riesgo) {
  if (riesgo === "alto") return "Intervención inmediata (24h)";
  if (riesgo === "medio") return "Programar revisión";
  return "Operación normal";
}

function explicar(u, score) {
  let razones = [];

  if (u.km > 90) razones.push("alto kilometraje");
  if (u.dias > 45) razones.push("muchos días sin mantenimiento");

  if (u.fallas === null) {
    razones.push("datos incompletos → se asume riesgo medio");
  } else if (u.fallas > 0) {
    razones.push(`${u.fallas} fallas detectadas`);
  }

  return `
  🔍 <b>Unidad ${u.id}</b><br><br>
  Riesgo: <b>${getRiesgo(score).toUpperCase()}</b><br><br>

  📊 Motivo:
  - ${razones.join("<br>- ")}<br><br>

  ⚠️ Acción:
  <b>${getAccion(getRiesgo(score))}</b><br><br>

  💡 Impacto:
  Evitar fallas en ruta, reducir costos y mejorar disponibilidad de la flota.
  `;
}

// render tabla
data.forEach(u => {
  const score = calcularScore(u);
  const riesgo = getRiesgo(score);

  const row = `
    <tr onclick="ver('${u.id}')">
      <td>${u.id}</td>
      <td><span class="riesgo ${riesgo}">${riesgo}</span></td>
      <td>${score}</td>
      <td>${getAccion(riesgo)}</td>
    </tr>
  `;
  tabla.innerHTML += row;
});

function ver(id) {
  const u = data.find(x => x.id === id);
  const score = calcularScore(u);
  respuesta.innerHTML = explicar(u, score);
}