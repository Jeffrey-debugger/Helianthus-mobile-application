import test from 'node:test';
import assert from 'node:assert/strict';
import {wingRotation,wingPoint,trackingTilt,autoAngle,stage} from '../src/kinematics.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
test('both wings stow vertically against their trailer walls',()=>{
  for(const side of [-1,1]){const p=wingPoint(2.64,0,side);close(p.y,-2.64);close(p.z,0)}
});
test('both wings deploy outward to a single horizontal plane',()=>{
  for(const side of [-1,1]){const p=wingPoint(2.64,90,side);close(p.y,0);close(p.z,side*2.64);close(wingRotation(90,side),0)}
});
test('mid-angle rotation preserves the panel span',()=>{
  const p=wingPoint(2,45,1);close(p.y,-Math.sqrt(2));close(p.z,Math.sqrt(2))
});
test('tracking is locked until both sides are fully deployed',()=>{
  assert.equal(trackingTilt(90,90,25),25);
  assert.equal(trackingTilt(90,80,25),0);
  assert.equal(trackingTilt(50,90,-20),0);
  assert.equal(trackingTilt(90,90,45),30)
});
test('full automated cycle deploys then returns to stowed position',()=>{
  close(autoAngle(0),0);close(autoAngle(1),0);close(autoAngle(5),90);
  close(autoAngle(7),90);close(autoAngle(11),0);close(autoAngle(12),0)
});
test('four stage presets',()=>assert.deepEqual([0,30,65,90].map(stage),[1,2,3,4]));
