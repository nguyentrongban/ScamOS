import { useEffect, useRef, useState, type PointerEvent } from 'react'
import * as THREE from 'three'
import { MessageSquare, Phone, Search, Sparkles, UserRound, X, Zap } from 'lucide-react'
import { useGame } from '../store/gameStore'

interface NPC { id: string; name: string; color: number; x: number; z: number; line: string }

const npcs: NPC[] = [
  { id: 'nam', name: 'Nam', color: 0x5b8def, x: -5, z: -1, line: 'Bro, tối nay đi ăn không? 😭' },
  { id: 'linh', name: 'Linh', color: 0xec4899, x: 4, z: -3, line: 'Ê, hình như số này vừa gọi cho mình...' },
  { id: 'bao', name: 'Bảo vệ', color: 0xf59e0b, x: 1, z: 5, line: 'Hôm nay khu này đông bất thường đấy.' },
]

function makeTextSprite(text: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(15,23,42,.88)'; ctx.roundRect(8, 18, 496, 92, 24); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Segoe UI'; ctx.textAlign = 'center'; ctx.fillText(text, 256, 75)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
  const sprite = new THREE.Sprite(material); sprite.scale.set(3.4, .85, 1); return sprite
}

export default function World3D() {
  const mount = useRef<HTMLDivElement>(null)
  const openApp = useGame(s => s.openApp)
  const minute = useGame(s => s.game.minute)
  const [selected, setSelected] = useState<NPC | null>(null)
  const [event, setEvent] = useState<string | null>('Một ngày bình thường... chắc vậy.')
  const [phoneHint, setPhoneHint] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)
  const joystick = useRef({ x: 0, y: 0 })
  const joystickActive = useRef(false)

  useEffect(() => {
    setTouchDevice(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
  }, [])

  useEffect(() => {
    const el = mount.current
    if (!el) return
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x9ec9ff)
    scene.fog = new THREE.Fog(0x9ec9ff, 20, 44)

    const camera = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, .1, 100)
    camera.position.set(0, 8.5, 11)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.setSize(el.clientWidth, el.clientHeight, false)
    renderer.shadowMap.enabled = !window.matchMedia('(pointer: coarse)').matches
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.touchAction = 'none'
    el.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x486581, 2.0))
    const sun = new THREE.DirectionalLight(0xffffff, 2.25)
    sun.position.set(-8, 14, 7); sun.castShadow = renderer.shadowMap.enabled; scene.add(sun)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), new THREE.MeshStandardMaterial({ color: 0x75a86b, roughness: 1 }))
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground)

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x3d4651, roughness: .9 })
    for (const [x, z, w, d] of [[0, 0, 7, 38], [0, 0, 38, 6]] as number[][]) {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, .04, d), roadMat); road.position.set(x, .02, z); road.receiveShadow = renderer.shadowMap.enabled; scene.add(road)
    }

    const addBuilding = (x: number, z: number, w: number, d: number, h: number, color: number, label: string) => {
      const group = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: .75 }))
      body.position.y = h / 2; body.castShadow = renderer.shadowMap.enabled; body.receiveShadow = renderer.shadowMap.enabled; group.add(body)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .18, .16, d + .18), new THREE.MeshStandardMaterial({ color: 0x1f2937 }))
      roof.position.y = h + .08; group.add(roof)
      const text = makeTextSprite(label); text.position.set(0, h + 1.15, 0); group.add(text)
      group.position.set(x, 0, z); scene.add(group)
    }
    addBuilding(-11, -10, 7, 7, 3.2, 0xe8d9c4, 'NHÀ')
    addBuilding(11, -10, 7, 7, 4.2, 0xd7e5f4, 'VĂN PHÒNG')
    addBuilding(-11, 10, 7, 7, 3, 0xf0d3a6, 'QUÁN CÀ PHÊ')
    addBuilding(11, 10, 7, 7, 4.8, 0xd8d2e8, 'NGÂN HÀNG')

    const player = new THREE.Group()
    const legs = new THREE.Mesh(new THREE.BoxGeometry(.72, .8, .45), new THREE.MeshStandardMaterial({ color: 0x111827 }))
    legs.position.y = .4; player.add(legs)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1, 1.35, .62), new THREE.MeshStandardMaterial({ color: 0x2563eb }))
    torso.position.y = 1.3; torso.castShadow = renderer.shadowMap.enabled; player.add(torso)
    const head = new THREE.Mesh(new THREE.SphereGeometry(.42, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf2c7a5 }))
    head.position.y = 2.25; head.castShadow = renderer.shadowMap.enabled; player.add(head)
    player.position.set(0, 0, 0); scene.add(player)

    const npcGroups = npcs.map(n => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48, .9, 4, 8), new THREE.MeshStandardMaterial({ color: n.color }))
      body.position.y = 1.05; body.castShadow = renderer.shadowMap.enabled; g.add(body)
      const head = new THREE.Mesh(new THREE.SphereGeometry(.34, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf1c3a2 }))
      head.position.y = 2; head.castShadow = renderer.shadowMap.enabled; g.add(head)
      const tag = makeTextSprite(n.name); tag.scale.set(2.1, .55, 1); tag.position.y = 2.8; g.add(tag)
      g.position.set(n.x, 0, n.z); scene.add(g); return g
    })

    const keys = new Set<string>()
    const down = (e: KeyboardEvent) => { if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) keys.add(e.key.toLowerCase()) }
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)

    const onResize = () => {
      if (!el) return
      const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight)
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(el)

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      const dt = Math.min(clock.getDelta(), .05)
      const dir = new THREE.Vector3()
      if (keys.has('w') || keys.has('arrowup')) dir.z -= 1
      if (keys.has('s') || keys.has('arrowdown')) dir.z += 1
      if (keys.has('a') || keys.has('arrowleft')) dir.x -= 1
      if (keys.has('d') || keys.has('arrowright')) dir.x += 1
      dir.x += joystick.current.x; dir.z += joystick.current.y
      if (dir.lengthSq() > 1) dir.normalize()
      if (dir.lengthSq()) {
        player.position.addScaledVector(dir, dt * 5.2)
        player.position.x = THREE.MathUtils.clamp(player.position.x, -15, 15)
        player.position.z = THREE.MathUtils.clamp(player.position.z, -15, 15)
        player.rotation.y = Math.atan2(dir.x, dir.z)
        player.position.y = Math.abs(Math.sin(clock.elapsedTime * 11)) * .035
      } else player.position.y = 0
      const target = new THREE.Vector3(player.position.x, 0, player.position.z)
      camera.position.lerp(new THREE.Vector3(target.x, 8.5, target.z + 11), .09)
      camera.lookAt(target.x, .25, target.z)
      npcGroups.forEach((g, i) => { g.rotation.y += Math.sin(clock.elapsedTime * .7 + i) * dt * .2 })
      renderer.render(scene, camera); raf = requestAnimationFrame(animate)
    }
    animate()

    const eventTimer = window.setInterval(() => {
      const surprises = ['📦 Shipper giao nhầm một gói hàng.', '📱 Có số lạ vừa gọi cho bạn.', '😂 Nam vừa gửi một meme cực vô tri.', '🎁 Bạn nhận được một thông báo trúng thưởng.', '☕ Quán cà phê hôm nay giảm 50%.', '👀 Có ai đó vừa đứng nhìn bạn từ xa.']
      setEvent(surprises[Math.floor(Math.random() * surprises.length)])
      if (Math.random() > .45) setPhoneHint(true)
    }, 14000)

    return () => {
      cancelAnimationFrame(raf); clearInterval(eventTimer)
      window.removeEventListener('keydown', down); window.removeEventListener('keyup', up)
      resizeObserver.disconnect(); renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const interact = () => {
    const npc = npcs[Math.floor(Math.random() * npcs.length)]
    setSelected(npc); setEvent(`${npc.name}: “${npc.line}”`); setInteracting(true)
  }

  const openPhone = () => { openApp('messages'); setPhoneHint(false) }

  const setStick = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const max = r.width * .32
    const len = Math.min(max, Math.hypot(dx, dy))
    const a = Math.atan2(dy, dx)
    joystick.current.x = Math.cos(a) * (len / max)
    joystick.current.y = Math.sin(a) * (len / max)
  }

  return <div className="relative h-full w-full overflow-hidden bg-sky-200 text-slate-900">
    <div ref={mount} className="absolute inset-0" />

    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 pt-[max(12px,env(safe-area-inset-top))] md:p-5">
      <div className="max-w-[calc(100%-108px)] rounded-2xl border border-white/30 bg-slate-950/72 px-3 py-2.5 text-white shadow-xl backdrop-blur-xl md:px-4 md:py-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-cyan-300"><Sparkles size={13}/> SCAMOS</div>
        <div className="mt-0.5 text-sm font-black sm:text-base md:text-lg">Một ngày bình thường... chắc vậy.</div>
        <div className="mt-1 hidden text-xs text-white/60 sm:block">Khám phá, gặp người và đừng vội tin bất kỳ ai.</div>
      </div>
      <div className="rounded-2xl border border-white/35 bg-white/82 px-3 py-2 text-right shadow-lg backdrop-blur-xl">
        <div className="text-[9px] font-black uppercase text-slate-500">Ngày 1</div>
        <div className="font-black text-slate-900 tabular-nums">{String(Math.floor(minute / 60) + 8).padStart(2, '0')}:{String(minute % 60).padStart(2, '0')}</div>
      </div>
    </div>

    {touchDevice && <div className="pointer-events-auto absolute bottom-[calc(24px+env(safe-area-inset-bottom))] left-4 z-30 h-28 w-28 select-none touch-none rounded-full border border-white/30 bg-slate-950/20 shadow-2xl backdrop-blur-sm sm:h-32 sm:w-32 sm:left-6" onPointerDown={e => { joystickActive.current = true; e.currentTarget.setPointerCapture(e.pointerId); setStick(e) }} onPointerMove={e => { if (joystickActive.current) setStick(e) }} onPointerUp={() => { joystickActive.current = false; joystick.current.x = 0; joystick.current.y = 0 }} onPointerCancel={() => { joystickActive.current = false; joystick.current.x = 0; joystick.current.y = 0 }}><div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/35 shadow-lg backdrop-blur" /></div>}

    <div className="absolute bottom-[calc(22px+env(safe-area-inset-bottom))] right-3 z-30 flex flex-col items-end gap-2 sm:right-5 md:flex-row md:items-end">
      <button aria-label="Điện thoại" onClick={openPhone} className="relative grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-950/20 transition active:scale-95 md:h-12 md:w-auto md:rounded-2xl md:px-4"><MessageSquare size={21}/><span className="hidden md:ml-2 md:inline text-sm font-black">Điện thoại</span>{phoneHint && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse rounded-full bg-rose-500 ring-2 ring-white"/>}</button>
      <button aria-label="Tương tác" onClick={interact} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-950/78 text-white shadow-xl backdrop-blur-xl transition active:scale-95 md:h-12 md:w-auto md:rounded-2xl md:px-4"><UserRound size={19}/><span className="hidden md:ml-2 md:inline text-sm font-bold">Gặp người</span></button>
      <button aria-label="Điều tra" onClick={() => setEvent('🔎 Hãy nhìn xung quanh. Không phải mọi chuyện kỳ lạ đều là scam.')} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-950/78 text-white shadow-xl backdrop-blur-xl transition active:scale-95 md:h-12 md:w-auto md:rounded-2xl md:px-4"><Search size={19}/><span className="hidden md:ml-2 md:inline text-sm font-bold">Điều tra</span></button>
      <button aria-label="Gọi điện" onClick={() => openApp('phone')} className="hidden h-12 w-12 place-items-center rounded-full border border-white/25 bg-slate-950/78 text-white shadow-xl backdrop-blur-xl md:grid"><Phone size={18}/></button>
    </div>

    <div className="pointer-events-none absolute bottom-[calc(162px+env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-160px)] max-w-xl -translate-x-1/2 sm:bottom-40 md:bottom-20">
      {event && <div className="rounded-2xl border border-white/20 bg-slate-950/88 px-4 py-2.5 text-center text-xs font-bold text-white shadow-2xl backdrop-blur-xl sm:text-sm">{event}</div>}
    </div>

    {selected && <div className="absolute left-1/2 top-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/30 bg-slate-950/94 text-white shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><UserRound size={20}/></div><div className="flex-1"><div className="text-base font-black">{selected.name}</div><div className="text-xs text-white/50">Đang ở gần bạn</div></div><button aria-label="Đóng" onClick={() => { setSelected(null); setInteracting(false) }} className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><X size={18}/></button></div>
      <div className="px-5 py-5 text-sm leading-6 text-white/85">{selected.line}</div>
      <div className="grid grid-cols-2 gap-2 px-5 pb-5"><button onClick={() => setEvent('😏 Bạn quyết định hỏi thêm...')} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">Hỏi thêm</button><button onClick={() => { setEvent('👀 Bạn để ý một chi tiết khá lạ.'); setSelected(null) }} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">Quan sát</button></div>
    </div>}

    {!touchDevice && <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-2xl border border-white/20 bg-slate-950/65 px-3 py-2 text-xs font-bold text-white/75 backdrop-blur-xl">WASD / ↑↓←→ • Di chuyển</div>}
    {touchDevice && <div className="pointer-events-none absolute left-1/2 top-20 z-10 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-slate-950/45 px-3 py-1.5 text-[10px] font-bold text-white/70 backdrop-blur md:flex"><Zap size={11}/> Chạm joystick để di chuyển</div>}
  </div>
}
