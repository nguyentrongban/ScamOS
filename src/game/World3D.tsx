import { useEffect, useRef, useState, type PointerEvent } from 'react'
import * as THREE from 'three'
import { Compass, MessageSquare, Moon, Phone, Search, Sparkles, Sun, UserRound, X, Zap } from 'lucide-react'
import { useGame } from '../store/gameStore'

interface NPCDef { id: string; name: string; role: string; color: number; x: number; z: number; line: string; speed: number; route: [number, number][] }

const NPCS: NPCDef[] = [
  { id: 'nam', name: 'Nam', role: 'Bạn thân', color: 0x3b82f6, x: -9, z: -5, line: 'Bro, tối nay đi ăn không? 😭', speed: 1.15, route: [[-9,-5],[-6,-5],[-6,-1],[-10,-1]] },
  { id: 'linh', name: 'Linh', role: 'Nhân viên văn phòng', color: 0xec4899, x: 7, z: -7, line: 'Ê, hình như số này vừa gọi cho mình...', speed: 1.0, route: [[7,-7],[10,-7],[10,-3],[7,-3]] },
  { id: 'bao', name: 'Bảo vệ', role: 'Bảo vệ tòa nhà', color: 0xf59e0b, x: 9, z: 8, line: 'Hôm nay khu này đông bất thường đấy.', speed: .65, route: [[9,8],[12,8],[12,11],[9,11]] },
  { id: 'shipper', name: 'Minh', role: 'Shipper', color: 0x16a34a, x: -11, z: 8, line: 'Anh ơi, có đơn giao nhầm địa chỉ này...', speed: 1.35, route: [[-11,8],[-8,8],[-8,11],[-11,11]] },
  { id: 'coffee', name: 'Vy', role: 'Nhân viên quán', color: 0x8b5cf6, x: -10, z: -12, line: 'Hôm nay quán có khách lạ từ sáng.', speed: .5, route: [[-10,-12],[-7,-12],[-7,-10],[-10,-10]] },
]

const COLORS = {
  asphalt: 0x252b35, sidewalk: 0x9aa3ad, grass: 0x78966b, white: 0xf8fafc,
  glass: 0x7dd3fc, concrete: 0xcbd5e1, dark: 0x172033, tree: 0x3f7d4a,
}

function mat(color: number, roughness = .8, metalness = 0) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }) }

function textSprite(text: string, bg = 'rgba(9,15,28,.86)', fg = '#fff', scale = 1) {
  const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 160
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(12, 18, 616, 124, 32); ctx.fill()
  ctx.fillStyle = fg; ctx.font = '800 34px Inter, Segoe UI, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 320, 80)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false }))
  sprite.scale.set(3.8 * scale, .95 * scale, 1); return sprite
}

function box(scene: THREE.Scene, x: number, z: number, w: number, d: number, h: number, color: number, y = 0, rough = .82) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough)); m.position.set(x, y + h / 2, z); scene.add(m); return m
}

function addRoad(scene: THREE.Scene, x: number, z: number, w: number, d: number, horizontal = false) {
  box(scene, x, z, w, d, .06, COLORS.asphalt, 0)
  const line = new THREE.Mesh(new THREE.PlaneGeometry(horizontal ? w : .12, horizontal ? .12 : d), new THREE.MeshBasicMaterial({ color: 0xf5e8a6 }))
  line.rotation.x = -Math.PI / 2; line.position.set(x, .045, z); scene.add(line)
  const sidewalkW = horizontal ? w : .55, sidewalkD = horizontal ? .55 : d
  if (horizontal) { box(scene, x, z - d / 2 - .32, w, .64, .08, COLORS.sidewalk); box(scene, x, z + d / 2 + .32, w, .64, .08, COLORS.sidewalk) }
  else { box(scene, x - w / 2 - .32, z, .64, d, .08, COLORS.sidewalk); box(scene, x + w / 2 + .32, z, .64, d, .08, COLORS.sidewalk) }
  void sidewalkW; void sidewalkD
}

function addTree(scene: THREE.Scene, x: number, z: number, scale = 1) {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.12 * scale, .16 * scale, 1.3 * scale, 7), mat(0x76533d)); trunk.position.y = .65 * scale; g.add(trunk)
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.9 * scale, 1), mat(COLORS.tree, .95)); crown.position.y = 1.65 * scale; g.add(crown)
  const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(.6 * scale, 1), mat(0x4f8f55, .95)); crown2.position.set(.35 * scale, 2.0 * scale, .1); g.add(crown2)
  g.position.set(x, 0, z); scene.add(g)
}

function addStreetLight(scene: THREE.Scene, x: number, z: number) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.045, .07, 3.2, 8), mat(0x334155, .5, .45)); pole.position.y = 1.6; g.add(pole)
  const arm = box(scene, 0, 0, .65, .08, .06, 0x334155, 0); arm.position.set(.25, 3.05, 0); g.add(arm); scene.remove(arm)
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfff4c2, emissive: 0xffb84d, emissiveIntensity: .2 })); lamp.position.set(.55, 3.02, 0); g.add(lamp)
  const light = new THREE.PointLight(0xffd58a, 0, 5.5); light.position.set(.55, 2.95, 0); g.add(light); ;(g as any).userData.light = light
  g.position.set(x, 0, z); scene.add(g)
}

function addBuilding(scene: THREE.Scene, x: number, z: number, w: number, d: number, h: number, color: number, label: string, accent = 0x38bdf8) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, .68)); body.position.y = h / 2; g.add(body)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .18, .14, d + .18), mat(0x1e293b, .55, .15)); roof.position.y = h + .07; g.add(roof)
  for (let yy = 1.1; yy < h - .3; yy += 1.15) {
    for (let xx = -w / 2 + .75; xx < w / 2 - .2; xx += 1.05) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(.48, .5, .025), mat(accent, .18, .15)); win.position.set(xx, yy, d / 2 + .012); g.add(win)
      if (w > 6) { const back = win.clone(); back.position.z = -d / 2 - .012; g.add(back) }
    }
  }
  const sign = textSprite(label, 'rgba(7,12,22,.92)', '#e0f2fe', .82); sign.position.set(0, Math.min(h + 1.05, 5.5), d / 2 + .1); g.add(sign)
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.9, .06), mat(0x10243a, .22, .2)); door.position.set(0, .95, d / 2 + .04); g.add(door)
  g.position.set(x, 0, z); scene.add(g)
}

function addHouse(scene: THREE.Scene, x: number, z: number, color: number, label: string) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.7, 3.8), mat(color, .82)); body.position.y = 1.35; g.add(body)
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.15, 1.2, 4), mat(0x8b5e4a, .9)); roof.rotation.y = Math.PI / 4; roof.position.y = 3.25; g.add(roof)
  const balcony = new THREE.Mesh(new THREE.BoxGeometry(3.6, .12, .7), mat(0x64748b, .65)); balcony.position.set(0, 2.0, 2.02); g.add(balcony)
  const door = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.45, .05), mat(0x4b3428)); door.position.set(0, .72, 1.93); g.add(door)
  const sign = textSprite(label, 'rgba(30,41,59,.85)', '#fff', .7); sign.position.set(0, 3.9, 0); g.add(sign)
  g.position.set(x, 0, z); scene.add(g)
}

function addCar(scene: THREE.Scene, x: number, z: number, color: number, rot = 0) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, .45, 3.4), mat(color, .42, .15)); base.position.y = .42; g.add(base)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.45, .48, 1.55), new THREE.MeshStandardMaterial({ color: 0x9bd3e6, roughness: .15, metalness: .15, transparent: true, opacity: .88 })); cabin.position.set(0, .78, -.1); g.add(cabin)
  for (const sx of [-.88, .88]) for (const sz of [-1.05, 1.05]) { const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .18, 10), mat(0x111827, .95)); wheel.rotation.z = Math.PI / 2; wheel.position.set(sx, .3, sz); g.add(wheel) }
  g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g)
}

function addMotorbike(scene: THREE.Scene, x: number, z: number, rot = 0) {
  const g = new THREE.Group(); const dark = mat(0x111827, .65, .15); const body = new THREE.Mesh(new THREE.BoxGeometry(.32, .32, 1.2), mat(0xef4444, .5, .05)); body.position.y = .5; g.add(body)
  for (const zz of [-.45, .45]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .08, 10), dark); w.rotation.z = Math.PI / 2; w.position.set(0, .22, zz); g.add(w) }
  const handle = new THREE.Mesh(new THREE.BoxGeometry(.6, .07, .08), dark); handle.position.set(0, .92, -.28); g.add(handle)
  g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g)
}

function makePerson(def: NPCDef) {
  const g = new THREE.Group();
  const skin = mat(0xc98962, .9); const shirt = mat(def.color, .72); const pants = mat(0x263247, .85)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.34, .62, 5, 10), shirt); torso.position.y = 1.15; g.add(torso)
  const head = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 12), skin); head.scale.set(1, 1.08, .95); head.position.y = 1.92; g.add(head)
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.315, 14, 8, 0, Math.PI * 2, 0, Math.PI * .48), mat(0x251b18, .95)); hair.position.set(0, 2.04, -.015); g.add(hair)
  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .52, 4, 8), shirt); armL.position.set(-.43, 1.18, 0); armL.rotation.z = -.18; g.add(armL)
  const armR = armL.clone(); armR.position.x = .43; armR.rotation.z = .18; g.add(armR)
  for (const sx of [-.18, .18]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.105, .55, 4, 8), pants); leg.position.set(sx, .48, 0); g.add(leg); const shoe = new THREE.Mesh(new THREE.BoxGeometry(.23, .13, .4), mat(0x111827, .9)); shoe.position.set(sx, .15, .05); g.add(shoe) }
  const tag = textSprite(def.name, 'rgba(7,12,22,.78)', '#fff', .55); tag.position.y = 2.65; g.add(tag)
  return g
}

export default function World3D() {
  const mount = useRef<HTMLDivElement>(null)
  const openApp = useGame(s => s.openApp)
  const minute = useGame(s => s.game.minute)
  const [selected, setSelected] = useState<NPCDef | null>(null)
  const [event, setEvent] = useState('Thành phố đang thức giấc...')
  const [phoneHint, setPhoneHint] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)
  const [dayPhase, setDayPhase] = useState('SÁNG')
  const joystick = useRef({ x: 0, y: 0 }); const joystickActive = useRef(false); const minuteRef = useRef(minute)
  useEffect(() => { minuteRef.current = minute }, [minute])

  useEffect(() => setTouchDevice(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window), [])

  useEffect(() => {
    const el = mount.current; if (!el) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8fc7ed); scene.fog = new THREE.Fog(0x8fc7ed, 28, 78)
    const camera = new THREE.PerspectiveCamera(58, el.clientWidth / el.clientHeight, .1, 130)
    let camYaw = 0, camPitch = .42, camDistance = 9
    const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.35 : 1.7)); renderer.setSize(el.clientWidth, el.clientHeight, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08
    renderer.shadowMap.enabled = !coarse; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.domElement.style.touchAction = 'none'; el.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xeaf6ff, 0x344a38, 1.9); scene.add(hemi)
    const sun = new THREE.DirectionalLight(0xfff5d8, 2.4); sun.position.set(-22, 30, 14); sun.castShadow = renderer.shadowMap.enabled; sun.shadow.mapSize.set(1024, 1024); scene.add(sun)
    const night = new THREE.AmbientLight(0x4969aa, 0); scene.add(night)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), mat(COLORS.grass, 1)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground)
    addRoad(scene, 0, 0, 7, 90, false); addRoad(scene, 0, 0, 90, 7, true)
    addRoad(scene, -20, 0, 4.5, 90, false); addRoad(scene, 20, 0, 4.5, 90, false); addRoad(scene, 0, -20, 90, 4.5, true); addRoad(scene, 0, 20, 90, 4.5, true)
    addRoad(scene, -20, -12, 3.8, 34, false); addRoad(scene, 20, 12, 3.8, 34, false); addRoad(scene, -12, -20, 34, 3.8, true); addRoad(scene, 12, 20, 34, 3.8, true)

    // Crosswalks
    for (const z of [-3.2, 3.2]) for (let x = -2.5; x <= 2.5; x += .9) box(scene, x, z, .45, .18, .025, 0xe7e5e4, .06)
    for (const x of [-3.2, 3.2]) for (let z = -2.5; z <= 2.5; z += .9) box(scene, x, z, .18, .45, .025, 0xe7e5e4, .06)

    // Districts
    addBuilding(scene, 11, -10, 10, 7, 7.5, 0xdbeafe, 'VĂN PHÒNG', 0x38bdf8)
    addBuilding(scene, 22, -18, 7, 7, 5.5, 0xf1f5f9, 'NGÂN HÀNG', 0xfbbf24)
    addBuilding(scene, -11, -11, 8, 6, 3.8, 0xf0d6bd, 'QUÁN CÀ PHÊ', 0xa78bfa)
    addBuilding(scene, -21, -18, 8, 7, 4.5, 0xfef3c7, 'SIÊU THỊ', 0x22c55e)
    addBuilding(scene, 12, 11, 8, 6, 4.2, 0xe0e7ff, 'CỬA HÀNG', 0x60a5fa)
    addBuilding(scene, 22, 19, 7, 7, 3.6, 0xffedd5, 'NHÀ THUỐC', 0x22c55e)
    addBuilding(scene, -11, 11, 7, 6, 3.2, 0xfee2e2, 'NHÀ HÀNG', 0xef4444)
    addBuilding(scene, -22, 20, 8, 7, 4.5, 0xe2e8f0, 'CHUNG CƯ', 0x818cf8)
    addBuilding(scene, 22, -2, 7, 6, 4.0, 0xd1fae5, 'CỬA HÀNG TIỆN LỢI', 0x10b981)
    addHouse(scene, -30, -12, 0xf1d0bd, 'NHÀ PHỐ'); addHouse(scene, -30, 0, 0xd9ead3, 'NHÀ PHỐ'); addHouse(scene, 30, 8, 0xd8e3f4, 'NHÀ PHỐ'); addHouse(scene, 30, 22, 0xf5d7aa, 'NHÀ PHỐ')

    // Park
    box(scene, -18, 10, 12, 10, .08, 0x5e9160, .03); addTree(scene, -21, 7, 1); addTree(scene, -16, 7, 1.15); addTree(scene, -21, 13, .9); addTree(scene, -15, 13, 1.1)
    box(scene, -18, 10, 5, .14, .9, 0x6b7280, .08); box(scene, -18, 10, .14, 5, .9, 0x6b7280, .08)

    for (const [x,z] of [[-5,-6],[5,-6],[-5,6],[5,6],[-18,-4],[18,4],[-18,4],[18,-4],[-4,-18],[4,18]] as [number,number][]) addStreetLight(scene,x,z)
    for (const [x,z,s] of [[-27,-7,1],[-27,6,1.1],[-27,16,.9],[-8,15,.9],[8,15,1.1],[16,27,1],[-15,-27,1.1],[15,-27,.9],[28,-8,1]]) addTree(scene,x,z,s)
    addCar(scene, -3.8, -12, 0x2563eb, Math.PI / 2); addCar(scene, 5.2, 12, 0xef4444, -Math.PI / 2); addCar(scene, -12, 3.8, 0xf8fafc, 0); addCar(scene, 12, -4.1, 0x111827, Math.PI)
    addMotorbike(scene, -2.2, -11.3, 0); addMotorbike(scene, -1.3, -11.3, 0); addMotorbike(scene, 10.4, -5.2, Math.PI / 2); addMotorbike(scene, 10.4, -4.2, Math.PI / 2)

    const player = new THREE.Group();
    const skin = mat(0xd39a78, .86); const shirt = mat(0x0ea5e9, .68); const pants = mat(0x182337, .86)
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(.38, .72, 6, 12), shirt); body.position.y = 1.18; player.add(body)
    const head = new THREE.Mesh(new THREE.SphereGeometry(.34, 20, 14), skin); head.position.y = 2.0; player.add(head)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(.355, 18, 10, 0, Math.PI*2, 0, Math.PI*.48), mat(0x17120f)); hair.position.set(0,2.12,-.02); player.add(hair)
    for (const sx of [-.19,.19]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.11,.58,5,8), pants); leg.position.set(sx,.48,0); player.add(leg) }
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(.52,.72,.22), mat(0x334155,.8)); backpack.position.set(0,1.22,-.4); player.add(backpack)
    player.position.set(0, 0, 10); scene.add(player)

    const npcGroups = NPCS.map(d => { const g = makePerson(d); g.position.set(d.x,0,d.z); scene.add(g); return g })
    const targets = NPCS.map(d => ({ i: 0, t: new THREE.Vector3(d.route[0][0],0,d.route[0][1]) }))

    const colliders = [
      [-16,-10,8,6],[-21,-18,8,7],[-18,10,12,10],[-11,11,7,6],[-22,20,8,7],[11,-10,10,7],[22,-18,7,7],[12,11,8,6],[22,19,7,7],[22,-2,7,6],[-30,-12,4.5,3.8],[-30,0,4.5,3.8],[30,8,4.5,3.8],[30,22,4.5,3.8]
    ]
    const blocked = (x:number,z:number) => colliders.some(([cx,cz,w,d]) => Math.abs(x-cx)<w/2+.7 && Math.abs(z-cz)<d/2+.7)
    const keys = new Set<string>(); let dragging = false; let lastX = 0, lastY = 0
    const down = (e: KeyboardEvent) => { if (!['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) keys.add(e.key.toLowerCase()) }
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    const pd = (e: PointerEvent<HTMLCanvasElement>) => { if (e.pointerType === 'mouse' || (coarse && e.clientX > el.clientWidth*.45)) { dragging = true; lastX=e.clientX; lastY=e.clientY; renderer.domElement.setPointerCapture(e.pointerId) } }
    const pm = (e: globalThis.PointerEvent) => { if (!dragging) return; camYaw -= (e.clientX-lastX)*.006; camPitch = THREE.MathUtils.clamp(camPitch-(e.clientY-lastY)*.004,.18,.8); lastX=e.clientX; lastY=e.clientY }
    const pu = () => { dragging=false }
    renderer.domElement.addEventListener('pointerdown', pd as any); renderer.domElement.addEventListener('pointermove', pm); renderer.domElement.addEventListener('pointerup', pu); renderer.domElement.addEventListener('pointercancel',pu)
    window.addEventListener('keydown',down); window.addEventListener('keyup',up)
    const resize = () => { const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight); camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false) }
    const ro = new ResizeObserver(resize); ro.observe(el)
    const clock = new THREE.Clock(); let raf=0
    const animate = () => {
      const dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime; const dir=new THREE.Vector3()
      if(keys.has('w')||keys.has('arrowup'))dir.z-=1;if(keys.has('s')||keys.has('arrowdown'))dir.z+=1;if(keys.has('a')||keys.has('arrowleft'))dir.x-=1;if(keys.has('d')||keys.has('arrowright'))dir.x+=1;dir.x+=joystick.current.x;dir.z+=joystick.current.y
      if(dir.lengthSq()>1)dir.normalize(); const speed=(keys.has('shift')?7:4.7)
      if(dir.lengthSq()>0){const nx=THREE.MathUtils.clamp(player.position.x+dir.x*dt*speed,-38,38),nz=THREE.MathUtils.clamp(player.position.z+dir.z*dt*speed,-38,38);if(!blocked(nx,nz)){player.position.x=nx;player.position.z=nz}player.rotation.y=Math.atan2(dir.x,dir.z);player.position.y=Math.abs(Math.sin(t*10))*.025}else player.position.y=0
      npcGroups.forEach((g,i)=>{const d=NPCS[i],q=targets[i],p=new THREE.Vector3(q.t.x,g.position.y,q.t.z),v=p.clone().sub(g.position);if(v.length()<.25){q.i=(q.i+1)%d.route.length;q.t.set(d.route[q.i][0],0,d.route[q.i][1])}else{v.normalize();g.position.addScaledVector(v,dt*d.speed);g.rotation.y=Math.atan2(v.x,v.z);g.position.y=Math.abs(Math.sin(t*8+i))*.018}})
      const hours=(8+minuteRef.current/60)%24, daylight=THREE.MathUtils.clamp((hours-6)/12,0,1)*THREE.MathUtils.clamp((18-hours)/6,0,1); const nightAmt=hours<6?1-hours/6:hours>18?THREE.MathUtils.clamp((hours-18)/6,0,1):0
      sun.intensity=0.65+daylight*2.0; hemi.intensity=.75+daylight*1.2; night.intensity=nightAmt*.7; const sky = new THREE.Color().lerpColors(new THREE.Color(0x09152d), new THREE.Color(0x8fc7ed), 1-nightAmt); if (scene.background instanceof THREE.Color) scene.background.copy(sky); if (scene.fog) scene.fog.color.copy(sky)
      scene.traverse(o=>{const l=(o as any).userData?.light as THREE.PointLight|undefined;if(l)l.intensity=nightAmt*1.7})
      const target=new THREE.Vector3(player.position.x,1,player.position.z), horiz=camDistance*Math.cos(camPitch); const desired=new THREE.Vector3(target.x+Math.sin(camYaw)*horiz,target.y+camDistance*Math.sin(camPitch),target.z+Math.cos(camYaw)*horiz); camera.position.lerp(desired,.1);camera.lookAt(target)
      renderer.render(scene,camera);raf=requestAnimationFrame(animate)
    }; animate()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);ro.disconnect();renderer.domElement.removeEventListener('pointerdown',pd as any);renderer.domElement.removeEventListener('pointermove',pm);renderer.domElement.removeEventListener('pointerup',pu);renderer.domElement.removeEventListener('pointercancel',pu);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)}
  }, [])

  useEffect(()=>{const h=(8+minute/60)%24;setDayPhase(h<12?'SÁNG':h<17?'TRƯA':h<19?'CHIỀU':'TỐI')},[minute])
  useEffect(()=>{const timer=window.setInterval(()=>{const e=['📦 Shipper giao nhầm một gói hàng.','📱 Có số lạ vừa gọi cho bạn.','😂 Nam vừa gửi một meme cực vô tri.','🎁 Bạn nhận được thông báo trúng thưởng.','☕ Quán cà phê hôm nay giảm 50%.','👀 Có người vừa đứng nhìn bạn từ xa.','🚗 Một chiếc xe dừng lại trước cửa ngân hàng.','🛵 Một shipper đang tìm đúng địa chỉ của bạn.'];setEvent(e[Math.floor(Math.random()*e.length)]);if(Math.random()>.45)setPhoneHint(true)},12000);return()=>clearInterval(timer)},[])

  const interact=()=>{const n=NPCS[Math.floor(Math.random()*NPCS.length)];setSelected(n);setEvent(`${n.name}: “${n.line}”`)}
  const openPhone=()=>{openApp('messages');setPhoneHint(false)}
  const setStick=(e:PointerEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=r.width*.32,len=Math.min(max,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);joystick.current.x=Math.cos(a)*(len/max);joystick.current.y=Math.sin(a)*(len/max)}
  const clockText=`${String(Math.floor(8+minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`

  return <div className="relative h-full w-full overflow-hidden bg-slate-950 text-white">
    <div ref={mount} className="absolute inset-0" />
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 pt-[max(12px,env(safe-area-inset-top))] md:p-5">
      <div className="max-w-[72vw] rounded-3xl border border-white/15 bg-slate-950/72 px-3.5 py-3 shadow-2xl backdrop-blur-2xl md:px-5 md:py-4">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[.2em] text-cyan-300"><Sparkles size={13}/> SCAMOS CITY</div>
        <div className="mt-1 text-sm font-black md:text-xl">Một thành phố. Hàng trăm câu chuyện.</div>
        <div className="mt-1 hidden text-xs text-white/55 md:block">Đi lang thang, gặp người, khám phá và tự quyết định điều gì đáng tin.</div>
      </div>
      <div className="flex items-center gap-2 rounded-3xl border border-white/15 bg-white/88 px-3 py-2.5 text-slate-900 shadow-2xl backdrop-blur-xl md:px-4">
        {dayPhase==='TỐI'?<Moon size={15}/>:<Sun size={15}/>}<div><div className="text-[9px] font-black text-slate-500">{dayPhase} • NGÀY 1</div><div className="font-black tabular-nums">{clockText}</div></div>
      </div>
    </div>

    <div className="pointer-events-none absolute left-3 top-24 z-20 hidden w-36 rounded-3xl border border-white/15 bg-slate-950/60 p-2.5 backdrop-blur-xl sm:block md:left-5 md:top-28 md:w-44">
      <div className="mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/60"><Compass size={12}/> Bản đồ thành phố</div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-emerald-900/60">
        <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-slate-500/75"/><div className="absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 bg-slate-500/75"/><div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-400 shadow-lg"/><div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-300"/><div className="absolute left-2 bottom-3 h-2 w-2 rounded-full bg-pink-400"/><div className="absolute right-3 bottom-2 h-2 w-2 rounded-full bg-violet-400"/>
      </div>
      <div className="mt-1.5 flex justify-between text-[8px] font-bold text-white/40"><span>NHÀ</span><span>TRUNG TÂM</span></div>
    </div>

    {touchDevice && <div className="pointer-events-auto absolute bottom-[calc(22px+env(safe-area-inset-bottom))] left-4 z-30 h-28 w-28 select-none touch-none rounded-full border border-white/20 bg-slate-950/20 shadow-2xl backdrop-blur-sm sm:left-6 sm:h-32 sm:w-32" onPointerDown={e=>{joystickActive.current=true;e.currentTarget.setPointerCapture(e.pointerId);setStick(e)}} onPointerMove={e=>{if(joystickActive.current)setStick(e)}} onPointerUp={()=>{joystickActive.current=false;joystick.current={x:0,y:0}}} onPointerCancel={()=>{joystickActive.current=false;joystick.current={x:0,y:0}}}><div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/35 shadow-lg backdrop-blur"/></div>}
    <div className="absolute bottom-[calc(22px+env(safe-area-inset-bottom))] right-3 z-30 flex flex-col items-end gap-2 sm:right-5 md:flex-row md:items-end">
      <button onClick={openPhone} className="relative grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-cyan-400 text-slate-950 shadow-xl transition active:scale-95 md:h-12 md:w-auto md:rounded-2xl md:px-4"><MessageSquare size={21}/><span className="hidden md:ml-2 md:inline text-sm font-black">Điện thoại</span>{phoneHint&&<span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse rounded-full bg-rose-500 ring-2 ring-white"/>}</button>
      <button onClick={interact} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-xl backdrop-blur-xl transition active:scale-95 md:w-auto md:rounded-2xl md:px-4"><UserRound size={19}/><span className="hidden md:ml-2 md:inline text-sm font-bold">Gặp người</span></button>
      <button onClick={()=>setEvent('🔎 Bạn quan sát xung quanh. Có vài chi tiết khá lạ...')} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-xl backdrop-blur-xl transition active:scale-95 md:w-auto md:rounded-2xl md:px-4"><Search size={19}/><span className="hidden md:ml-2 md:inline text-sm font-bold">Điều tra</span></button>
      <button onClick={()=>openApp('phone')} className="hidden h-12 w-12 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-xl backdrop-blur-xl md:grid"><Phone size={18}/></button>
    </div>

    <div className="pointer-events-none absolute bottom-[calc(158px+env(safe-area-inset-bottom))] left-1/2 z-20 w-[min(90vw,620px)] -translate-x-1/2 sm:bottom-40 md:bottom-20"><div className="rounded-2xl border border-white/15 bg-slate-950/84 px-4 py-2.5 text-center text-xs font-bold text-white shadow-2xl backdrop-blur-2xl md:text-sm">{event}</div></div>
    {!touchDevice&&<div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-2xl border border-white/15 bg-slate-950/65 px-3 py-2 text-xs font-bold text-white/70 backdrop-blur-xl">WASD / ↑↓←→ • Di chuyển & kéo chuột để xoay camera</div>}
    {touchDevice&&<div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 rounded-full bg-slate-950/45 px-3 py-1.5 text-[10px] font-bold text-white/65 backdrop-blur-xl sm:block"><Zap size={11} className="mr-1 inline"/> Joystick trái • Kéo bên phải để xoay camera</div>}

    {selected&&<div className="absolute left-1/2 top-1/2 z-50 w-[min(92vw,430px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/95 text-white shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><UserRound size={21}/></div><div className="flex-1"><div className="font-black">{selected.name}</div><div className="text-xs text-white/45">{selected.role}</div></div><button onClick={()=>setSelected(null)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><X size={18}/></button></div>
      <div className="px-5 py-5 text-sm leading-6 text-white/80">“{selected.line}”</div>
      <div className="grid grid-cols-2 gap-2 px-5 pb-5"><button onClick={()=>setEvent(`💬 Bạn hỏi ${selected.name} thêm vài câu...`)} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">Hỏi thêm</button><button onClick={()=>{setEvent(`👀 Bạn để ý một chi tiết về ${selected.name}.`);setSelected(null)}} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">Quan sát</button></div>
    </div>}
  </div>
}
