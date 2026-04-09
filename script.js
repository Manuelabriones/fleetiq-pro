const data = [
  { id: "U-07", score: 94 },
  { id: "U-01", score: 88 },
  { id: "U-18", score: 61 },
  { id: "U-22", score: 42 }
];

const tabla = document.getElementById("tabla");
const chatBox = document.getElementById("chatBox");

function riesgo(score) {
  if (score > 80) return "alto";
  if (score > 50) return "medio";
  return "bajo";
}

function accion(r) {
  if (r === "alto") return "Intervenir";
  if (r === "medio") return "Revisar";
  return "Mantener";
}

data.forEach(u => {
  const r = riesgo(u.score);

  tabla.innerHTML += `
    <tr onclick="analizar('${u.id}', ${u.score})">
      <td>${u.id}</td>
      <td class="${r}">${r}</td>
      <td>${u.score}</td>
      <td>${accion(r)}</td>
    </tr>
  `;
});

function analizar(id, score) {
  const r = riesgo(score);

  chatBox.innerHTML += `
    <div class="msg">
      🔍 Unidad ${id}<br>
      Riesgo: ${r}<br>
      Acción: ${accion(r)}
    </div>
  `;
}

function enviar() {
  const input = document.getElementById("input");
  chatBox.innerHTML += `<div class="msg">👤 ${input.value}</div>`;
  input.value = "";
}