const FLEET = [
  { id:"U-01", score:88 },
  { id:"U-07", score:94 },
  { id:"U-14", score:76 },
  { id:"U-22", score:42 }
];

const tbody = document.getElementById("fleetBody");

function risk(score){
  if(score>=75) return "Alto";
  if(score>=45) return "Medio";
  return "Bajo";
}

function action(r){
  if(r==="Alto") return "Intervenir";
  if(r==="Medio") return "Revisar";
  return "Mantener";
}

FLEET.forEach(u=>{
  const r=risk(u.score);
  tbody.innerHTML+=`
  <tr onclick="selectUnit('${u.id}')">
    <td>${u.id}</td>
    <td>${r}</td>
    <td>${u.score}</td>
    <td>--</td>
    <td>--</td>
    <td>${action(r)}</td>
  </tr>`;
});

function selectUnit(id){
  document.getElementById("chatMessages").innerHTML+=`<p>Analizando ${id}</p>`;
}

function sendMessage(){
  const input=document.getElementById("chatInput");
  document.getElementById("chatMessages").innerHTML+=`<p>${input.value}</p>`;
  input.value="";
}

setInterval(()=>{
  document.getElementById("clock").innerText=new Date().toLocaleTimeString();
},1000);

function generateBrief(){
  document.getElementById("briefText").innerText="Flota estable con riesgos controlados.";
}