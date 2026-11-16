import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { clamp, rad, wingRotation, trackingTilt, autoAngle, stage } from './kinematics.js';

const $=id=>document.getElementById(id);
const canvas=$('scene'),host=$('viewer');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.35;

const scene=new THREE.Scene();
scene.background=new THREE.Color('#152a3b');
scene.fog=new THREE.Fog('#152a3b',26,70);
const camera=new THREE.PerspectiveCamera(43,1,.1,120);
const controls=new OrbitControls(camera,renderer.domElement);
const viewpoints={
  iso:[12,9,14], side:[1,5,20],rear:[-21,6,0.01],top:[0.01,24,0.01]
};
const center=new THREE.Vector3(0.6,2.2,0);
function setView(name){const [x,y,z]=viewpoints[name];camera.position.set(x,y,z);controls.target.copy(center);controls.update()}
setView('iso');
controls.enableDamping=true;
controls.maxPolarAngle=Math.PI*.88;
controls.minDistance=8;
controls.maxDistance=40;
controls.enablePan=false;

scene.add(new THREE.HemisphereLight('#d5edff','#233443',2.25));
const sun=new THREE.DirectionalLight('#fff0d8',3.1);
sun.position.set(-8,16,9);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-16;sun.shadow.camera.right=16;
sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;
sun.shadow.normalBias=.03;
scene.add(sun);
const ambient=new THREE.AmbientLight('#f2fbff',.35);scene.add(ambient);
const mat=(color,metalness=.08,roughness=.66)=>new THREE.MeshStandardMaterial({color,metalness,roughness,side:THREE.DoubleSide});
const red=mat('#df4d35',.24,.43),bright=mat('#f66945',.2,.38),dark=mat('#af2f22',.3,.54);
const frame=mat('#a8b8c3',.65,.37),steel=mat('#607782',.73,.43);
const black=mat('#24323a',.28,.8),roof=mat('#34444d',.38,.63);
const solar=mat('#173e66',.22,.38),grid=mat('#7ea0b5',.2,.54),rubber=mat('#151c23',.06,.94);
const glass=mat('#163d4d',.18,.17),chrome=mat('#c4d4d8',.75,.3);
function cuboid(parent,w,h,d,material,x=0,y=0,z=0){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh
}
function addLines(parent,verts,material){
  const geom=new THREE.BufferGeometry().setFromPoints(verts.map(v=>new THREE.Vector3(...v)));
  let l=new THREE.Line(geom,new THREE.LineBasicMaterial({color:material}));
  parent.add(l);return l;
}
const floor=new THREE.Mesh(new THREE.PlaneGeometry(120,120),mat('#233441',.01,.97));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const marking=mat('#647b87',.01,.97);
for(const z of [-5.2,5.2])cuboid(scene,22,.009,.055,marking,0,.01,z);

const vehicle=new THREE.Group();scene.add(vehicle);
// Container: X is longitudinal, Z is lateral, Y is up
cuboid(vehicle,8.4,2.8,2.65,black,-.82,2.23,0);
cuboid(vehicle,8.62,.16,2.79,roof,-.82,3.67,0);
cuboid(vehicle,8.66,.31,2.75,black,-.82,.84,0);
for(const s of [-1,1]){
  for(let i=0;i<10;i++)cuboid(vehicle,.025,2.55,.018,steel,-4.9+i*.9,2.26,s*1.345);
  cuboid(vehicle,8.42,.045,.06,frame,-.82,3.50,s*1.36);
}
// Cab profile in XY extruded through Z
const profile=[
 [3.55,.84],[3.55,2.94],[3.98,3.38],[4.5,3.59],
 [5.36,3.58],[5.91,3.25],[6.57,2.35],[6.92,1.18],[6.8,.87]
];
const shape=new THREE.Shape();
profile.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));
shape.closePath();
const geo=new THREE.ExtrudeGeometry(shape,{depth:2.42,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.08,bevelThickness:.05});
const cab=new THREE.Mesh(geo,red);
cab.position.z=-1.21;cab.castShadow=true;cab.receiveShadow=true;vehicle.add(cab);
cuboid(vehicle,2.4,.15,2.55,bright,4.66,3.57,0);
cuboid(vehicle,.7,.15,2.35,dark,6.74,1.08,0);
for(const s of [-1,1]){
  const windshield=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.92),glass);
  windshield.position.set(5.43,2.75,s*1.32);windshield.rotation.y=s>0?0:Math.PI;
  vehicle.add(windshield);
  cuboid(vehicle,.18,.29,.34,black,5.52,2.75,s*1.47);
}
const frontglass=cuboid(vehicle,.04,1.18,1.99,glass,6.07,2.7,0);frontglass.rotation.z=-.59;
for(const sx of [-3.96,-2.78,-1.6,2.65,3.42,6.04]){
  for(const s of [-1,1]){
    const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.30,32),rubber);
    wheel.rotation.x=Math.PI/2;wheel.position.set(sx,.44,s*1.38);wheel.castShadow=true;vehicle.add(wheel);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.235,.235,.318,32),chrome);
    rim.rotation.x=Math.PI/2;rim.position.copy(wheel.position);vehicle.add(rim);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.324,20),steel);
    cap.rotation.x=Math.PI/2;cap.position.copy(wheel.position);vehicle.add(cap);
  }
}

// Roof hinge system. Center module remains fixed during folding; tracker pivots the
// FULL coplanar 3-strip array only when both wings have reached 90 degrees.
const tracker=new THREE.Group();
tracker.position.set(-.82,3.86,0);
vehicle.add(tracker);
cuboid(tracker,8.48,.10,2.72,steel,0,-.09,0);
function moduleMesh(){
  const obj=new THREE.Group();
  cuboid(obj,2.03,.07,2.64,frame,0,0,0);
  cuboid(obj,1.95,.025,2.56,solar,0,.047,0);
  for(let k=1;k<7;k++)cuboid(obj,.012,.003,2.54,grid,-.975+k*1.95/7,.065,0);
  for(let k=1;k<6;k++)cuboid(obj,1.94,.003,.012,grid,0,.066,-1.28+k*2.56/6);
  return obj
}
const moduleStep=2.105;
function buildStrip(parent,localSpan=0){
 for(let i=0;i<4;i++){
   const m=moduleMesh();
   m.position.set((i-1.5)*moduleStep,0,localSpan);
   parent.add(m)
 }
}
buildStrip(tracker);
const wingPivot={};
for(const side of [-1,1]){
  const pivot=new THREE.Group();
  pivot.position.z=side*1.34;tracker.add(pivot);
  // A module is placed outward from each roof-edge hinge, NO translation during folding.
  buildStrip(pivot,side*1.32);
  const hinge=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,8.47,18),steel);
  hinge.rotation.z=Math.PI/2;tracker.add(hinge);hinge.position.z=side*1.34;
  wingPivot[side]=pivot;
}

// The actuator bases are fixed to the trailer body, and the heads move with
// the wing. A telescoping strut spans the actual pair of moving endpoints.
const actuators=[];
const upAxis=new THREE.Vector3(0,1,0);
const tmpVec=new THREE.Vector3();
function strutMesh(material,r){
  return new THREE.Mesh(new THREE.CylinderGeometry(r,r,1,12),material)
}
for(const side of [-1,1]){
 for(const x of [-2.8,2.0]){
  let barrel=strutMesh(steel,.07),piston=strutMesh(chrome,.045);
  barrel.castShadow=true;piston.castShadow=true;
  scene.add(barrel,piston);
  actuators.push({side,x,barrel,piston});
 }
}
const localTip=new THREE.Vector3();
function pointStrut(mesh,a,b){
  let delta=new THREE.Vector3().subVectors(b,a),len=delta.length();
  mesh.position.copy(a).addScaledVector(delta,.5);
  mesh.quaternion.setFromUnitVectors(upAxis,delta.clone().normalize());
  mesh.scale.set(1,Math.max(.02,len),1);
}
function updateStruts(){
  tracker.updateWorldMatrix(true,true);vehicle.updateWorldMatrix(true,true);
  for(const s of actuators){
    const a=vehicle.localToWorld(new THREE.Vector3(-.82+s.x,2.84,s.side*1.4));
    localTip.set(s.x,-.035,s.side*1.58);
    const b=wingPivot[s.side].localToWorld(localTip.clone());
    const mid=new THREE.Vector3().lerpVectors(a,b,.56);
    pointStrut(s.barrel,a,mid);
    pointStrut(s.piston,mid,b);
    s.barrel.visible=s.piston.visible=$('actuators').checked
  }
}
let left=0,right=0,leftTarget=0,rightTarget=0,tilt=0,tiltTarget=0,auto=false,autoStart=0,last=performance.now();
const cameraButtons=document.querySelectorAll('[data-view]');
const stepButtons=document.querySelectorAll('[data-preset]');
const setSteps=a=>{stepButtons.forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.preset)===a))};
function stop(){auto=false;$('play').textContent='▶ 전개 → 수납 자동 시연'}
function changeAngles(l,r=l){stop();leftTarget=clamp(l,0,90);rightTarget=clamp(r,0,90);if(l<90||r<90)tiltTarget=0}
stepButtons.forEach(button=>button.addEventListener('click',()=>{changeAngles(Number(button.dataset.preset));setSteps(Number(button.dataset.preset))}));
$('deployment').addEventListener('input',e=>changeAngles(+e.target.value));
$('sync').addEventListener('change',e=>{
  $('independent').hidden=e.target.checked;
  if(e.target.checked)rightTarget=leftTarget
});
$('left').addEventListener('input',e=>{changeAngles(+e.target.value,rightTarget)});
$('right').addEventListener('input',e=>{changeAngles(leftTarget,+e.target.value)});
$('tilt').addEventListener('input',e=>{stop();tiltTarget=+e.target.value});
$('play').addEventListener('click',()=>{
  auto=!auto;autoStart=performance.now();
  if(auto){$('sync').checked=true;$('independent').hidden=true;tiltTarget=0}
  $('play').textContent=auto?'❚❚ 자동 시연 중지':'▶ 전개 → 수납 자동 시연'
});
for(const btn of cameraButtons)btn.addEventListener('click',()=>{
  setView(btn.dataset.view);
  cameraButtons.forEach(b=>b.classList.toggle('active',b===btn))
});
$('reset-view').addEventListener('click',()=>setView('iso'));
const section=$('section').getContext('2d');
function sectionDiagram(){
 const w=180,h=150;section.clearRect(0,0,w,h);
 section.strokeStyle='#96aebb';section.lineWidth=5;section.strokeRect(56,37,68,98);
 section.fillStyle='#172e42';section.fillRect(58,39,64,93);
 section.strokeStyle='#6ee4d1';section.beginPath();section.moveTo(56,37);section.lineTo(124,37);section.stroke();
 for(const [angle,side] of [[left,-1],[right,1]]){
  let s=[90+side*34,37],a=rad(angle),t=[s[0]+side*49*Math.sin(a),s[1]+49*Math.cos(a)];
  section.strokeStyle='#b1c5d0';section.lineWidth=6;
  section.beginPath();section.moveTo(...s);section.lineTo(...t);section.stroke();
  section.fillStyle='#f4f6f9';section.beginPath();section.arc(...s,3,0,Math.PI*2);section.fill()
 }
}
function hud(){
 const avg=(left+right)/2,st=stage(avg);
 $('stage-label').textContent=String(st).padStart(2,'0')+' / 04';
 $('angle-label').textContent='FOLDING '+Math.round(avg)+'°';
 $('angle-output').textContent=Math.round(avg)+'° / 90°';
 $('left-output').textContent=Math.round(left)+'°';
 $('right-output').textContent=Math.round(right)+'°';
 $('tilt-output').textContent=(tilt>0?'+':'')+Math.round(tilt)+'°';
 $('section-label').textContent='좌 '+Math.round(left)+'° / 우 '+Math.round(right)+'°';
 $('status').textContent=['','컨테이너 측면 수납','상부 모서리 축 회전','액추에이터 신장 중','3면 수평 정렬 완료'][st];
 if($('sync').checked)$('deployment').value=Math.round(avg);
 $('left').value=Math.round(left);$('right').value=Math.round(right);$('tilt').value=Math.round(tilt);
 stepButtons.forEach(b=>b.classList.toggle('active',stage(+b.dataset.preset)===st));
 sectionDiagram()
}
function resize(){
 let r=host.getBoundingClientRect();
 const w=Math.max(100,Math.floor(r.width)),h=Math.max(100,Math.floor(r.width*9/16));
 if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio()))renderer.setSize(w,h,false);
 camera.aspect=w/h;camera.updateProjectionMatrix()
}
window.addEventListener('resize',resize);
resize();
function animate(now){
 requestAnimationFrame(animate);
 let dt=Math.min(.06,(now-last)/1000);last=now;
 if(auto){leftTarget=rightTarget=autoAngle((now-autoStart)/1000);tiltTarget=0}
 const lerp=1-Math.exp(-dt*5);
 left=THREE.MathUtils.lerp(left,leftTarget,lerp);
 right=THREE.MathUtils.lerp(right,rightTarget,lerp);
 tilt=THREE.MathUtils.lerp(tilt,trackingTilt(left,right,tiltTarget),lerp);
 wingPivot[-1].rotation.x=wingRotation(left,-1);
 wingPivot[1].rotation.x=wingRotation(right,1);
 tracker.rotation.x=-rad(tilt);
 updateStruts();controls.update();renderer.render(scene,camera);
 if(Math.floor(now/90)!==Math.floor((now-dt*1000)/90))hud()
}
hud();requestAnimationFrame(animate);
