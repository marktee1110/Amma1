// ===== التنقل بين الواجهة الرئيسية وبرامج =====
let currentProgram = '';
let currentStation = '';

function showProgram(program){
  currentProgram = program;
  document.getElementById('mainInterface').classList.add('hidden');
  document.getElementById('stationSelect').classList.remove('hidden');
}

function selectStation(stationNum){
  currentStation = 'Station'+stationNum;
  document.getElementById('stationSelect').classList.add('hidden');
  document.getElementById(currentProgram).classList.remove('hidden');
  loadStationData(currentProgram);
}

function backToMain(){
  saveStationData(currentProgram);
  document.getElementById('p1').classList.add('hidden');
  document.getElementById('p2').classList.add('hidden');
  document.getElementById('p3').classList.add('hidden');
  document.getElementById('stationSelect').classList.add('hidden');
  document.getElementById('mainInterface').classList.remove('hidden');
}

// ===== الحفظ والاسترجاع لكل وقفة =====
function saveStationData(program){
  if(!currentStation) return;
  let data = {};
  if(program==='p1') data = {
    px: document.getElementById('p1_px').value,
    py: document.getElementById('p1_py').value,
    zx: document.getElementById('p1_zx').value,
    zy: document.getElementById('p1_zy').value,
    points: p1_points
  };
  else if(program==='p2') data = {
    px: document.getElementById('p2_px').value,
    py: document.getElementById('p2_py').value,
    zx: document.getElementById('p2_zx').value,
    zy: document.getElementById('p2_zy').value,
    points: p2_points
  };
  else if(program==='p3') data = {
    px: document.getElementById('p3_px').value,
    py: document.getElementById('p3_py').value,
    points: p3_points
  };
  localStorage.setItem(currentStation+'_'+program, JSON.stringify(data));
}

function loadStationData(program){
  if(!currentStation) return;
  let stored = localStorage.getItem(currentStation+'_'+program);
  if(!stored){
    if(program==='p1'){ p1_points=[]; document.querySelector('#p1_resultTable tbody').innerHTML=''; }
    else if(program==='p2'){ p2_points=[]; document.querySelector('#p2_resultTable tbody').innerHTML=''; }
    else if(program==='p3'){ p3_points=[]; updateP3Select(); document.querySelector('#p3_resultTable tbody').innerHTML=''; }
    return;
  }
  let data = JSON.parse(stored);
  if(program==='p1'){
    document.getElementById('p1_px').value=data.px;
    document.getElementById('p1_py').value=data.py;
    document.getElementById('p1_zx').value=data.zx;
    document.getElementById('p1_zy').value=data.zy;
    p1_points = data.points || [];
    p1_calculate();
  } else if(program==='p2'){
    document.getElementById('p2_px').value=data.px;
    document.getElementById('p2_py').value=data.py;
    document.getElementById('p2_zx').value=data.zx;
    document.getElementById('p2_zy').value=data.zy;
    p2_points = data.points || [];
    p2_calculate();
  } else if(program==='p3'){
    document.getElementById('p3_px').value=data.px;
    document.getElementById('p3_py').value=data.py;
    p3_points = data.points || [];
    updateP3Select();
    p3_calculate();
  }
}

// ===== البرنامج 1 =====
let p1_points = [];
function p1_addPoint(){
  let x = parseFloat(document.getElementById('p1_inputX').value);
  let y = parseFloat(document.getElementById('p1_inputY').value);
  if(isNaN(x)||isNaN(y)) return;
  x = (x>0)? -x : x; // X دائمًا بالسالب
  p1_points.push({x:x, y:y});
  document.getElementById('p1_inputX').value='';
  document.getElementById('p1_inputY').value='';
  p1_calculate();
  saveStationData('p1');
}

function p1_calculate(){
  const px=parseFloat(document.getElementById('p1_px').value);
  const py=parseFloat(document.getElementById('p1_py').value);
  const zx=parseFloat(document.getElementById('p1_zx').value);
  const zy=parseFloat(document.getElementById('p1_zy').value);
  const tbody=document.querySelector('#p1_resultTable tbody');
  tbody.innerHTML='';
  const baseX=(px>0)? -px : px;
  const baseY=py;
  const zeroX=(zx>0)? -zx : zx;
  const zeroY=zy;
  p1_points.forEach((p, idx)=>{
    const vecZeroX=zeroX-baseX;
    const vecZeroY=zeroY-baseY;
    const vecTargetX=p.x-baseX;
    const vecTargetY=p.y-baseY;
    let dot = vecZeroX*vecTargetX + vecZeroY*vecTargetY;
    let magZero = Math.sqrt(vecZeroX**2+vecZeroY**2);
    let magTarget = Math.sqrt(vecTargetX**2+vecTargetY**2);
    let angleRad = Math.acos(dot/(magZero*magTarget));
    const cross=vecZeroX*vecTargetY - vecZeroY*vecTargetX;
    if(cross<0) angleRad = 2*Math.PI - angleRad;
    const angleGrad = angleRad*(200/Math.PI);
    const dist = Math.sqrt((p.x-baseX)**2 + (p.y-baseY)**2);
    tbody.innerHTML += `<tr><td>${idx+1}</td><td>${p.x.toFixed(2)}</td><td>${p.y.toFixed(2)}</td><td>${dist.toFixed(2)}</td><td>${angleGrad.toFixed(4)}</td></tr>`;
  });
}

// ===== البرنامج 2 =====
let p2_points = [];
function p2_addPoint(){
  let angle = parseFloat(document.getElementById('p2_inputAngle').value);
  let dist = parseFloat(document.getElementById('p2_inputDist').value);
  if(isNaN(angle)||isNaN(dist)) return;
  p2_points.push({angle:angle, dist:dist});
  document.getElementById('p2_inputAngle').value='';
  document.getElementById('p2_inputDist').value='';
  p2_calculate();
  saveStationData('p2');
}

function p2_calculate(){
  const px=parseFloat(document.getElementById('p2_px').value);
  const py=parseFloat(document.getElementById('p2_py').value);
  const zx=parseFloat(document.getElementById('p2_zx').value);
  const zy=parseFloat(document.getElementById('p2_zy').value);
  const tbody=document.querySelector('#p2_resultTable tbody');
  tbody.innerHTML='';
  const baseX=(px>0)? -px : px;
  const baseY=py;
  const zeroX=(zx>0)? -zx : zx;
  const zeroY=zy;
  
  p2_points.forEach((p, idx)=>{
    const angleRad=p.angle*(Math.PI/200);
    const vecZeroX=zeroX-baseX;
    const vecZeroY=zeroY-baseY;
    const dx = baseX + vecZeroX + p.dist*Math.cos(angleRad);
    const dy = baseY + vecZeroY + p.dist*Math.sin(angleRad);
    const vecTargetX = dx - baseX;
    const vecTargetY = dy - baseY;
    const vecRefX = zeroX - baseX;
    const vecRefY = zeroY - baseY;
    let dot = vecRefX*vecTargetX + vecRefY*vecTargetY;
    let magRef = Math.sqrt(vecRefX**2 + vecRefY**2);
    let magTarget = Math.sqrt(vecTargetX**2 + vecTargetY**2);
    let angleRadResult = Math.acos(dot/(magRef*magTarget));
    const cross = vecRefX*vecTargetY - vecRefY*vecTargetX;
    if(cross<0) angleRadResult = 2*Math.PI - angleRadResult;
    const angleGrad = angleRadResult*(200/Math.PI);
    const dist = Math.sqrt(vecTargetX**2 + vecTargetY**2);
    tbody.innerHTML += `<tr>
      <td>${idx+1}</td>
      <td>${dx.toFixed(2)}</td>
      <td>${dy.toFixed(2)}</td>
      <td>${dist.toFixed(2)}</td>
      <td>${angleGrad.toFixed(4)}</td>
    </tr>`;
  });
}

// ===== البرنامج 3 - التحقيق =====
let p3_defaultPoints = [
  {name:"كرم اللوز", x:-247215.2, y:100333.37},
  {name:"خزان المشفى", x:-255228.98, y:100287.11},
  {name:"مئذنة الرسول الاعظم", x:-256310.81, y:100285.69},
  {name:"المشهد", x:-258347.019, y:97793.64},
  {name:"خزان بيرين", x:-226976.5, y:92788.47}
];
let p3_allPoints = [...p3_defaultPoints];
let p3_points = [];

function updateP3Select(){
  const sel = document.getElementById('p3_selectPoints');
  sel.innerHTML = '';
  p3_allPoints.forEach((p, idx)=>{
    const option = document.createElement('option');
    option.value = idx;
    option.text = p.name;
    sel.appendChild(option);
  });
}

function p3_addPoint(){
  const sel = document.getElementById('p3_selectPoints');
  const selectedIndices = Array.from(sel.selectedOptions).map(o=>parseInt(o.value));
  const px = parseFloat(document.getElementById('p3_px').value);
  const py = parseFloat(document.getElementById('p3_py').value);
  if(isNaN(px) || isNaN(py)) return alert("ادخل نقطة الوقوف X و Y أولاً");

  selectedIndices.forEach(idx => {
    const pt = p3_allPoints[idx];
    if(!p3_points.some(p=>p.name===pt.name)){
      const dx = pt.x - px;
      const dy = pt.y - py;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let angleRad = Math.atan2(dy, dx);
      if(angleRad < 0) angleRad += 2*Math.PI;
      const angleGrad = angleRad*(200/Math.PI);
      p3_points.push({name: pt.name, x: pt.x, y: pt.y, dist: dist, angle: angleGrad});
    }
  });
  p3_calculate();
  saveStationData('p3');
}

// ===== إضافة نقطة تحقق جديدة =====
function addNewP3Point(){
  const name = document.getElementById('p3_newName').value.trim();
  const x = parseFloat(document.getElementById('p3_newX').value);
  const y = parseFloat(document.getElementById('p3_newY').value);

  if(!name || isNaN(x) || isNaN(y)){
    return alert("ادخل اسم النقطة وX وY بشكل صحيح");
  }

  if(p3_allPoints.some(p => p.name === name)){
    return alert("النقطة موجودة مسبقاً");
  }

  p3_allPoints.push({name: name, x: x, y: y});
  updateP3Select();

  document.getElementById('p3_newName').value = '';
  document.getElementById('p3_newX').value = '';
  document.getElementById('p3_newY').value = '';

  alert("تم إضافة النقطة بنجاح!");
}

function p3_calculate(){
  const tbody = document.querySelector('#p3_resultTable tbody');
  tbody.innerHTML='';
  p3_points.forEach((p, idx)=>{
    tbody.innerHTML += `<tr>
      <td>${p.name}</td>
      <td>${p.x.toFixed(2)}</td>
      <td>${p.y.toFixed(2)}</td>
      <td>${p.dist.toFixed(2)}</td>
      <td>${p.angle.toFixed(4)}</td>
    </tr>`;
  });
}

// ===== مسح البيانات =====
function clearStation(program){
  if(!currentStation) return;
  if(program==='p1'){ p1_points=[]; document.querySelector('#p1_resultTable tbody').innerHTML=''; }
  else if(program==='p2'){ p2_points=[]; document.querySelector('#p2_resultTable tbody').innerHTML=''; }
  else if(program==='p3'){ p3_points=[]; document.querySelector('#p3_resultTable tbody').innerHTML=''; }
  localStorage.removeItem(currentStation+'_'+program);
}

// ===== بدء التشغيل =====
document.addEventListener('DOMContentLoaded', ()=>{
  updateP3Select();
});