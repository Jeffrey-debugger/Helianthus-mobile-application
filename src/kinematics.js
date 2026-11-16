export const PRESETS = [0,30,65,90];
export const clamp = (x,min,max) => Math.max(min, Math.min(max, Number.isFinite(x)?x:min));
export const rad = deg => deg*Math.PI/180;
export function wingRotation(deg,side){
  if(side!==1&&side!==-1)throw new Error('side must be ±1');
  return side*rad(90-clamp(deg,0,90));
}
export function wingPoint(span,deg,side){
  const a=wingRotation(deg,side), z=side*span;
  return {y:-Math.sin(a)*z,z:Math.cos(a)*z};
}
export function trackingTilt(left,right,tilt){
  return left>=89.9&&right>=89.9?clamp(tilt,-30,30):0;
}
export function smoothstep(t){let v=clamp(t,0,1);return v*v*(3-2*v)}
export function autoAngle(sec){
  const t=((sec%12)+12)%12;
  if(t<1)return 0;
  if(t<5)return 90*smoothstep((t-1)/4);
  if(t<7)return 90;
  if(t<11)return 90*(1-smoothstep((t-7)/4));
  return 0;
}
export function stage(a){return a<15?1:a<48?2:a<84?3:4}
