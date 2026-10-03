"use client";
import React, { useEffect, useRef, useState, useId } from 'react';

interface HeartButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export default function HeartButton({ isFavorite, onToggle, className = '' }: HeartButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    if (!rootRef.current) return;
    const NS = 'http://www.w3.org/2000/svg';
    const root = rootRef.current;
    
    // Elements
    const heart = root.querySelector('.heart-svg') as SVGSVGElement;
    const trimL = root.querySelector('.trimL') as SVGPathElement;
    const trimR = root.querySelector('.trimR') as SVGPathElement;
    const wipeC = root.querySelector('.wipeC') as SVGCircleElement;
    const shine = root.querySelector('.shine') as SVGPathElement;
    const glow = root.querySelector('.glow') as SVGCircleElement;
    const ring = root.querySelector('.ring') as SVGCircleElement;
    const sparksContainer = root.querySelector('.sparks') as SVGGElement;
    const dotsContainer = root.querySelector('.dots') as SVGGElement;
    const minisContainer = root.querySelector('.minis') as SVGGElement;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // easing
    const c01 = (v: number) => Math.min(1, Math.max(0, v));
    const E = {
      lin: (x: number) => x,
      outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
      inCubic: (x: number) => x * x * x,
      inQuad: (x: number) => x * x,
      inOutCubic: (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
      outExpo: (x: number) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
      outBack: (x: number) => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
    };

    // state
    const S = { x: 1, v: 0, t: 1, k: 260, c: 20 };
    const R = { x: 0, v: 0, t: 0, k: 200, c: 16 };
    const HID = 1.06;
    let trimV = isFavorite ? 0 : HID;
    let wipeV = isFavorite ? 15 : 0;
    let hover = false, pressing = false, popUntil = 0;
    let raf = 0, last = 0;
    const tweens = new Map();
    const timers: any[] = [];

    const base = () => pressing ? .86 : hover ? 1.1 : 1;

    function play(key: string, o: any) {
      tweens.set(key, { t0: performance.now() + (o.delay || 0), dur: o.dur, ease: o.ease, from: o.from, to: o.to, fn: o.fn });
      wake();
    }
    function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }

    function stepSpring(sp: any, dt: number) {
      const n = Math.ceil(dt / (1 / 240)), h = dt / n;
      for (let i = 0; i < n; i++) { sp.v += (-sp.k * (sp.x - sp.t) - sp.c * sp.v) * h; sp.x += sp.v * h; }
    }
    const settled = (sp: any) => Math.abs(sp.x - sp.t) < .0004 && Math.abs(sp.v) < .004;

    function loop(t: number) {
      const dt = Math.min((t - last) / 1000, 1 / 30); last = t;
      stepSpring(S, dt); stepSpring(R, dt);

      for (let i = timers.length - 1; i >= 0; i--) if (t >= timers[i].at) { const f = timers[i].fn; timers.splice(i, 1); f(); }

      for (const [key, tw] of tweens) {
        let p = (t - tw.t0) / tw.dur; if (p < 0) continue;
        p = Math.min(1, p);
        tw.fn(tw.from + (tw.to - tw.from) * tw.ease(p));
        if (p >= 1) tweens.delete(key);
      }

      heart.style.transform = `scale(${S.x.toFixed(4)}) rotate(${R.x.toFixed(3)}deg)`;

      if (!settled(S) || !settled(R) || tweens.size || timers.length) raf = requestAnimationFrame(loop);
      else { S.x = S.t; S.v = 0; R.x = R.t; R.v = 0; heart.style.transform = `scale(${S.x}) rotate(${R.x}deg)`; raf = 0; }
    }

    const setTrim = (v: number) => { trimV = v; trimL.style.strokeDashoffset = v.toString(); trimR.style.strokeDashoffset = v.toString(); };
    const setWipe = (v: number) => { wipeV = v; wipeC.setAttribute('r', v.toFixed(3)); };

    function fillIn() {
      play('trim', { dur: 520, ease: E.inOutCubic, from: trimV, to: 0, fn: setTrim });
      play('wipe', { delay: 120, dur: 560, ease: E.outCubic, from: wipeV, to: 15, fn: setWipe });
      play('shine', { delay: 200, dur: 520, ease: E.lin, from: 0, to: 1, fn: (p: number) => {
        shine.setAttribute('opacity', Math.sin(p * Math.PI).toFixed(3));
        shine.setAttribute('stroke-dasharray', `${(0.5 * Math.sin(p * Math.PI)).toFixed(3)} 1`);
        shine.setAttribute('stroke-dashoffset', (-p * .5).toFixed(3));
      }});
    }
    function fillOut() {
      play('trim', { dur: 320, ease: E.inOutCubic, from: trimV, to: HID, fn: setTrim });
      play('wipe', { dur: 300, ease: E.inCubic, from: wipeV, to: 0, fn: setWipe });
    }

    // Initialize particles
    const mk = (tag: string, attrs: any, parent: SVGElement) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); parent.appendChild(el); return el; };
    const colors = ['#ff3b5c', '#ff8aa0', '#ffb347'];

    sparksContainer.innerHTML = '';
    const sparks = [...Array(8)].map((_, i) => ({
      el: mk('line', { 'stroke-width': 2.2, 'stroke-linecap': 'round', stroke: colors[i % 3], opacity: 0 }, sparksContainer),
      a: i * Math.PI / 4, delay: (i % 2) * 35
    }));
    
    dotsContainer.innerHTML = '';
    const dots = [...Array(8)].map((_, i) => ({
      el: mk('circle', { r: 0, fill: colors[(i + 1) % 3], opacity: 0 }, dotsContainer),
      a: i * Math.PI / 4 + Math.PI / 8, reach: 18 + (i % 3) * 6, delay: 40 + (i % 3) * 25, size: 2.4 + (i % 2) * .8
    }));
    
    minisContainer.innerHTML = '';
    const minis = [
      { x: -15, rot: -26, delay: 70,  size: 13, c: '#ff3b5c' },
      { x:  14, rot:  22, delay: 130, size: 11, c: '#ff8aa0' },
      { x:   1, rot:  -8, delay: 200, size: 9,  c: '#ff6b86' }
    ].map(m => {
      const g = mk('g', { opacity: 0 }, minisContainer);
      mk('use', { href: `#mh-${id}`, width: m.size, height: m.size, x: -m.size / 2, y: -m.size / 2, fill: m.c }, g);
      return { ...m, g };
    });

    function renderFx(ms: number) {
      let p = c01(ms / 850);
      glow.setAttribute('opacity', (Math.sin(p * Math.PI) * .9).toFixed(3));
      glow.setAttribute('r', (16 + E.outCubic(p) * 22).toFixed(2));

      p = c01(ms / 700);
      ring.setAttribute('r', (12 + E.outExpo(p) * 20).toFixed(2));
      ring.setAttribute('stroke-width', (2.6 * (1 - p) + .3).toFixed(2));
      ring.setAttribute('opacity', (Math.pow(1 - p, 1.6) * .75).toFixed(3));

      for (const s of sparks) {
        p = c01((ms - s.delay) / 640);
        const outer = 14 + E.outExpo(p) * 22;
        const inner = 14 + (outer - 14) * E.inOutCubic(c01((p - .12) / .88));
        const cx = Math.cos(s.a), cy = Math.sin(s.a);
        s.el.setAttribute('x1', (cx * inner).toFixed(2)); s.el.setAttribute('y1', (cy * inner).toFixed(2));
        s.el.setAttribute('x2', (cx * outer).toFixed(2)); s.el.setAttribute('y2', (cy * outer).toFixed(2));
        s.el.setAttribute('opacity', (p > 0 && p < 1 ? 1 : 0).toString());
      }

      for (const d of dots) {
        p = c01((ms - d.delay) / 760);
        const dist = 13 + E.outExpo(p) * d.reach;
        d.el.setAttribute('cx', (Math.cos(d.a) * dist).toFixed(2));
        d.el.setAttribute('cy', (Math.sin(d.a) * dist).toFixed(2));
        d.el.setAttribute('r', (d.size * (1 - E.inQuad(p))).toFixed(2));
        d.el.setAttribute('opacity', (p > 0 && p < 1 ? 1 : 0).toString());
      }

      for (const m of minis) {
        p = c01((ms - m.delay) / 1000);
        const y = -E.outCubic(p) * 44 - 8;
        const x = m.x * E.outCubic(p) + Math.sin(p * Math.PI * 2.2) * 3.5 * p;
        const sc = E.outBack(c01(p / .28)) * (1 - E.inQuad(c01((p - .55) / .45)));
        const rot = m.rot * Math.sin(p * Math.PI * 1.4);
        m.g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)}) scale(${Math.max(sc, 0).toFixed(3)})`);
        m.g.setAttribute('opacity', (p > 0 && p < 1 ? 1 : 0).toString());
      }
    }

    function idleSprings() {
      if (performance.now() > popUntil) { S.k = 260; S.c = 20; R.k = 200; R.c = 16; }
      S.t = base(); R.t = 0; wake();
    }

    const handleEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') { hover = true; idleSprings(); } };
    const handleLeave = () => { hover = false; pressing = false; idleSprings(); };
    const handleDown = () => { pressing = true; S.k = 520; S.c = 34; S.t = base(); wake(); };
    const handleUp = () => { pressing = false; };
    const handleCancel = () => { pressing = false; idleSprings(); };

    root.addEventListener('pointerenter', handleEnter as EventListener);
    root.addEventListener('pointerleave', handleLeave as EventListener);
    root.addEventListener('pointerdown', handleDown as EventListener);
    root.addEventListener('pointerup', handleUp as EventListener);
    root.addEventListener('pointercancel', handleCancel as EventListener);

    // Initial state
    setTrim(isFavorite ? 0 : HID);
    setWipe(isFavorite ? 15 : 0);

    // Setup an external trigger for React state sync
    (root as any).triggerAnimation = (newLikedState: boolean) => {
      if (reduce) { setTrim(newLikedState ? 0 : HID); setWipe(newLikedState ? 15 : 0); return; }

      const t0 = performance.now();
      timers.length = 0;

      if (newLikedState) {
        S.k = 600; S.c = 40; S.t = .8;
        R.k = 600; R.c = 40; R.t = -8;
        popUntil = t0 + 1000;
        timers.push({ at: t0 + 95, fn: () => {
          pressing = false;
          S.k = 215; S.c = 9.5; S.v += 6.5; S.t = base();
          R.k = 170; R.c = 8;   R.v += 110; R.t = 0;
          fillIn();
          play('fx', { dur: 1150, ease: E.lin, from: 0, to: 1150, fn: renderFx });
        }});
      } else {
        S.k = 520; S.c = 36; S.t = .78;
        R.k = 520; R.c = 36; R.t = 6;
        popUntil = t0 + 800;
        timers.push({ at: t0 + 75, fn: () => {
          pressing = false;
          S.k = 200; S.c = 9; S.v += 3; S.t = base();
          R.k = 170; R.c = 9; R.v -= 60; R.t = 0;
          fillOut();
        }});
      }
      wake();
    };

    return () => {
      root.removeEventListener('pointerenter', handleEnter as EventListener);
      root.removeEventListener('pointerleave', handleLeave as EventListener);
      root.removeEventListener('pointerdown', handleDown as EventListener);
      root.removeEventListener('pointerup', handleUp as EventListener);
      root.removeEventListener('pointercancel', handleCancel as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (rootRef.current && (rootRef.current as any).triggerAnimation) {
      (rootRef.current as any).triggerAnimation(isFavorite);
    }
  }, [isFavorite]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(e);
  };

  return (
    <button 
      ref={rootRef}
      className={`hb-like ${className}`} 
      type="button" 
      aria-pressed={isFavorite} 
      aria-label="Like"
      onClick={handleClick}
    >
      <span className="hb-icon" aria-hidden="true">
        <svg className="hb-fx" viewBox="-60 -60 120 120">
          <defs>
            <radialGradient id={`glowGrad-${id}`}>
              <stop offset="0" stopColor="#ff3b5c" stopOpacity=".55"/>
              <stop offset="1" stopColor="#ff3b5c" stopOpacity="0"/>
            </radialGradient>
            <symbol id={`mh-${id}`} viewBox="0 0 24 24">
              <path d="M12 21s-8-5-9.5-10.2C1.4 7 3.8 4 7 4c2 0 3.8 1.2 5 3 1.2-1.8 3-3 5-3 3.2 0 5.6 3 4.5 6.8C20 16 12 21 12 21z"/>
            </symbol>
          </defs>
          <circle className="glow" r="26" fill={`url(#glowGrad-${id})`} opacity="0"/>
          <circle className="ring" r="12" fill="none" stroke="#ff3b5c" strokeWidth="2" opacity="0"/>
          <g className="sparks"></g>
          <g className="dots"></g>
          <g className="minis"></g>
        </svg>

        <svg className="heart-svg hb-heart" viewBox="0 0 24 24">
          <defs>
            <clipPath id={`wipe-${id}`}><circle className="wipeC" cx="12" cy="13" r="0"/></clipPath>
          </defs>
          <path className="hb-outline" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path className="hb-fill" clipPath={`url(#wipe-${id})`} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path className="trimL hb-trim" pathLength="1" d="M12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2"/>
          <path className="trimR hb-trim" pathLength="1" d="M12 21l7-7c1.5-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2"/>
          <path className="shine hb-shine" pathLength="1" d="M5.2 8.4c.35-1.7 1.5-2.8 3.2-2.9" strokeDasharray="0 1" opacity="0"/>
        </svg>
      </span>
    </button>
  );
}
