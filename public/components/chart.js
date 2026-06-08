/*!
 * PropChart — Proplytic.ai Design System
 * Vanilla-JS SVG Charts, keine Abhängigkeiten
 *
 * API:
 *   new PropChart.Line(el, data, opts)
 *   new PropChart.MultiLine(el, series, opts)
 *   new PropChart.Bar(el, data, opts)
 *   new PropChart.Donut(el, segments, opts)
 *   PropChart.sparkline(el, values, opts)
 */

const PropChart = (() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  // ── Hilfsfunktionen ───────────────────────

  function svgEl(tag, attrs = {}) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  function htmlEl(tag, cls = '', text = '') {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function scale(v, inMin, inMax, outMin, outMax) {
    if (inMax === inMin) return (outMin + outMax) / 2;
    return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  function fmt(value, unit = '') {
    let s;
    if (typeof value !== 'number') return String(value);
    if (value >= 1_000_000) s = (value / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + ' Mio.';
    else if (value >= 1_000) s = value.toLocaleString('de-DE');
    else s = value % 1 === 0 ? String(value) : value.toFixed(1);
    return unit ? s + ' ' + unit : s;
  }

  function niceMax(max) {
    const exp = Math.floor(Math.log10(max || 1));
    const factor = Math.pow(10, exp);
    return Math.ceil(max / factor) * factor;
  }

  // ── Tooltip ───────────────────────────────

  class Tooltip {
    constructor(parent) {
      this.el = htmlEl('div', 'chart-tooltip');
      parent.appendChild(this.el);
    }
    show(html, x, y) {
      this.el.innerHTML = html;
      this.el.classList.add('is-visible');
      const p = this.el.parentElement;
      const tw = this.el.offsetWidth;
      const th = this.el.offsetHeight;
      let left = x - tw / 2;
      let top  = y - th - 14;
      if (left < 4) left = 4;
      if (left + tw > p.clientWidth - 4) left = p.clientWidth - tw - 4;
      if (top < 4) top = y + 18;
      this.el.style.cssText = `left:${left}px;top:${top}px`;
    }
    hide() { this.el.classList.remove('is-visible'); }
  }

  // ── Line Chart ────────────────────────────

  class Line {
    constructor(container, data, opts = {}) {
      this.el   = typeof container === 'string' ? document.querySelector(container) : container;
      this.data = data;
      this.opts = {
        color:  'var(--color-chart-1)',
        unit:   '',
        area:   true,
        label:  null,
        aspect: 16 / 5,
        yPad:   0.08,
        ...opts,
      };
      this._render();
    }

    _render() {
      const { data, opts } = this;
      const W = 600, H = 200;
      const P = { t: 16, r: 20, b: 42, l: 58 };
      const cW = W - P.l - P.r, cH = H - P.t - P.b;
      const n = data.length;

      const vals  = data.map(d => d.value);
      const vMin  = Math.min(...vals), vMax = Math.max(...vals);
      const range = vMax - vMin || 1;
      const yMin  = vMin - range * opts.yPad;
      const yMax  = vMax + range * opts.yPad;

      const wrap = htmlEl('div', 'chart-wrapper');
      wrap.style.aspectRatio = opts.aspect;

      const svg = svgEl('svg', {
        viewBox: `0 0 ${W} ${H}`,
        preserveAspectRatio: 'xMidYMid meet',
        class: 'chart-svg',
      });

      const tip = new Tooltip(wrap);

      const xs = data.map((_, i) => P.l + (n > 1 ? (i / (n - 1)) * cW : cW / 2));
      const ys = data.map(d   => P.t + cH - scale(d.value, yMin, yMax, 0, cH));

      // Y-Gitter + Labels
      const gGrid = svgEl('g');
      const ySteps = 4;
      for (let i = 0; i <= ySteps; i++) {
        const v = yMin + (i / ySteps) * (yMax - yMin);
        const y = P.t + cH - (i / ySteps) * cH;
        const cls = 'chart-grid-line' + (i === 0 ? ' chart-grid-base' : '');
        const line = svgEl('line', { x1: P.l, y1: y, x2: W - P.r, y2: y, class: cls });
        gGrid.appendChild(line);
        if (i > 0) {
          const t = svgEl('text', { x: P.l - 8, y: y + 4, class: 'chart-axis-text', 'text-anchor': 'end' });
          t.textContent = fmt(v, opts.unit);
          gGrid.appendChild(t);
        }
      }
      svg.appendChild(gGrid);

      // Area
      if (opts.area) {
        const base = P.t + cH;
        const pts = [`${xs[0]},${base}`, ...xs.map((x, i) => `${x},${ys[i]}`), `${xs[n - 1]},${base}`].join(' ');
        svg.appendChild(svgEl('polygon', { points: pts, fill: opts.color, class: 'chart-area' }));
      }

      // Linie
      const pts = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
      svg.appendChild(svgEl('polyline', { points: pts, stroke: opts.color, class: 'chart-line' }));

      // X-Labels
      const gX = svgEl('g');
      const step = Math.max(1, Math.ceil(n / 8));
      data.forEach((d, i) => {
        if (i % step !== 0 && i !== n - 1) return;
        const t = svgEl('text', { x: xs[i], y: H - P.b + 16, class: 'chart-axis-text', 'text-anchor': 'middle' });
        t.textContent = d.label;
        gX.appendChild(t);
      });
      svg.appendChild(gX);

      // Hover-Punkte
      const gPts = svgEl('g');
      data.forEach((d, i) => {
        const slotW = cW / Math.max(n - 1, 1);
        const hx = xs[i] - slotW / 2, hw = slotW;
        const hit = svgEl('rect', { x: hx, y: P.t, width: hw, height: cH, fill: 'transparent', class: 'chart-hitbox' });
        const dot = svgEl('circle', { cx: xs[i], cy: ys[i], r: 4, class: 'chart-point', stroke: opts.color });

        hit.addEventListener('mouseenter', () => {
          dot.classList.add('is-active');
          tip.show(`<strong>${fmt(d.value, opts.unit)}</strong><span>${d.label}</span>`, xs[i], ys[i]);
        });
        hit.addEventListener('mouseleave', () => { dot.classList.remove('is-active'); tip.hide(); });

        gPts.appendChild(hit);
        gPts.appendChild(dot);
      });
      svg.appendChild(gPts);

      wrap.appendChild(svg);

      if (opts.label) {
        const leg = htmlEl('div', 'chart-legend-single');
        const dot = htmlEl('span', 'chart-legend-dot');
        dot.style.background = opts.color;
        leg.appendChild(dot);
        leg.appendChild(document.createTextNode(opts.label));
        wrap.appendChild(leg);
      }

      this.el.innerHTML = '';
      this.el.appendChild(wrap);
    }
  }

  // ── Multi-Line Chart ──────────────────────

  class MultiLine {
    constructor(container, series, opts = {}) {
      this.el     = typeof container === 'string' ? document.querySelector(container) : container;
      this.series = series;
      this.opts   = { unit: '', aspect: 16 / 5, yPad: 0.08, ...opts };
      this._render();
    }

    _render() {
      const { series, opts } = this;
      const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];
      const HEX    = ['#3AA7B5', '#2E4150', '#C4883A', '#7A7A7A'];
      const W = 600, H = 200;
      const P = { t: 16, r: 20, b: 42, l: 58 };
      const cW = W - P.l - P.r, cH = H - P.t - P.b;
      const labels = series[0].data.map(d => d.label);
      const n = labels.length;

      const allVals = series.flatMap(s => s.data.map(d => d.value));
      const vMin = Math.min(...allVals), vMax = Math.max(...allVals);
      const range = vMax - vMin || 1;
      const yMin = vMin - range * opts.yPad, yMax = vMax + range * opts.yPad;

      const wrap = htmlEl('div', 'chart-wrapper');
      wrap.style.aspectRatio = opts.aspect;

      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet', class: 'chart-svg' });
      const tip = new Tooltip(wrap);

      const xs = labels.map((_, i) => P.l + (n > 1 ? (i / (n - 1)) * cW : cW / 2));

      // Grid
      const gGrid = svgEl('g');
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (i / 4) * (yMax - yMin);
        const y = P.t + cH - (i / 4) * cH;
        gGrid.appendChild(svgEl('line', { x1: P.l, y1: y, x2: W - P.r, y2: y, class: 'chart-grid-line' + (i === 0 ? ' chart-grid-base' : '') }));
        if (i > 0) {
          const t = svgEl('text', { x: P.l - 8, y: y + 4, class: 'chart-axis-text', 'text-anchor': 'end' });
          t.textContent = fmt(v, opts.unit);
          gGrid.appendChild(t);
        }
      }
      svg.appendChild(gGrid);

      // Linien
      series.forEach((s, si) => {
        const ys  = s.data.map(d => P.t + cH - scale(d.value, yMin, yMax, 0, cH));
        const pts = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
        svg.appendChild(svgEl('polyline', { points: pts, stroke: COLORS[si % COLORS.length], class: 'chart-line' }));
      });

      // X-Labels
      const gX = svgEl('g');
      const step = Math.max(1, Math.ceil(n / 8));
      labels.forEach((label, i) => {
        if (i % step !== 0 && i !== n - 1) return;
        const t = svgEl('text', { x: xs[i], y: H - P.b + 16, class: 'chart-axis-text', 'text-anchor': 'middle' });
        t.textContent = label;
        gX.appendChild(t);
      });
      svg.appendChild(gX);

      // Hover
      labels.forEach((label, i) => {
        const slotW = cW / Math.max(n - 1, 1);
        const hit = svgEl('rect', { x: xs[i] - slotW / 2, y: P.t, width: slotW, height: cH, fill: 'transparent', class: 'chart-hitbox' });
        hit.addEventListener('mouseenter', () => {
          const rows = series.map((s, si) =>
            `<span style="color:${HEX[si % HEX.length]}">${s.name}: ${fmt(s.data[i].value, opts.unit)}</span>`
          ).join('');
          tip.show(`<strong>${label}</strong>${rows}`, xs[i], P.t + cH / 3);
        });
        hit.addEventListener('mouseleave', () => tip.hide());
        svg.appendChild(hit);
      });

      wrap.appendChild(svg);

      // Legende
      const leg = htmlEl('div', 'chart-legend');
      series.forEach((s, i) => {
        const item = htmlEl('div', 'chart-legend-item');
        const dot  = htmlEl('span', 'chart-legend-dot');
        dot.style.background = COLORS[i % COLORS.length];
        item.appendChild(dot);
        item.appendChild(document.createTextNode(s.name));
        leg.appendChild(item);
      });
      wrap.appendChild(leg);

      this.el.innerHTML = '';
      this.el.appendChild(wrap);
    }
  }

  // ── Bar Chart ─────────────────────────────

  class Bar {
    constructor(container, data, opts = {}) {
      this.el   = typeof container === 'string' ? document.querySelector(container) : container;
      this.data = data;
      this.opts = {
        unit:   '',
        aspect: 16 / 6,
        yPad:   0.1,
        radius: 3,
        ...opts,
      };
      this._render();
    }

    _render() {
      const { data, opts } = this;
      const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];
      const W = 600, H = 220;
      const P = { t: 16, r: 16, b: 50, l: 60 };
      const cW = W - P.l - P.r, cH = H - P.t - P.b;
      const n = data.length;

      const vals = data.map(d => d.value);
      const yMax = niceMax(Math.max(...vals) * (1 + opts.yPad));

      const wrap = htmlEl('div', 'chart-wrapper');
      wrap.style.aspectRatio = opts.aspect;

      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet', class: 'chart-svg' });
      const tip = new Tooltip(wrap);

      // Grid
      const gGrid = svgEl('g');
      for (let i = 0; i <= 4; i++) {
        const v = (i / 4) * yMax;
        const y = P.t + cH - (i / 4) * cH;
        gGrid.appendChild(svgEl('line', { x1: P.l, y1: y, x2: W - P.r, y2: y, class: 'chart-grid-line' + (i === 0 ? ' chart-grid-base' : '') }));
        if (i > 0) {
          const t = svgEl('text', { x: P.l - 8, y: y + 4, class: 'chart-axis-text', 'text-anchor': 'end' });
          t.textContent = fmt(v, opts.unit);
          gGrid.appendChild(t);
        }
      }
      svg.appendChild(gGrid);

      // Balken
      const slotW = cW / n;
      const barW  = slotW * 0.6;
      const gBars = svgEl('g', { class: 'chart-bars' });

      data.forEach((d, i) => {
        const barH  = Math.max(2, scale(d.value, 0, yMax, 0, cH));
        const x     = P.l + i * slotW + (slotW - barW) / 2;
        const y     = P.t + cH - barH;
        const color = d.color || opts.color || COLORS[i % COLORS.length];

        const bar = svgEl('rect', {
          x, y, width: barW, height: barH,
          rx: opts.radius, ry: opts.radius,
          fill: color,
          class: 'chart-bar',
          style: `animation-delay:${i * 40}ms`,
        });

        const cx = P.l + i * slotW + slotW / 2;
        const xt = svgEl('text', { x: cx, y: H - P.b + 16, class: 'chart-axis-text', 'text-anchor': 'middle' });
        xt.textContent = d.label;

        bar.addEventListener('mouseenter', () => {
          bar.classList.add('is-hover');
          tip.show(`<strong>${fmt(d.value, opts.unit)}</strong><span>${d.label}</span>`, cx, y);
        });
        bar.addEventListener('mouseleave', () => { bar.classList.remove('is-hover'); tip.hide(); });

        gBars.appendChild(bar);
        svg.appendChild(xt);
      });
      svg.appendChild(gBars);

      wrap.appendChild(svg);
      this.el.innerHTML = '';
      this.el.appendChild(wrap);
    }
  }

  // ── Donut Chart ───────────────────────────

  class Donut {
    constructor(container, segments, opts = {}) {
      this.el       = typeof container === 'string' ? document.querySelector(container) : container;
      this.segments = segments;
      this.opts     = {
        size:        180,
        thickness:   32,
        center:      null,
        centerLabel: null,
        gap:         2,
        ...opts,
      };
      this._render();
    }

    _render() {
      const { segments, opts } = this;
      const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];
      const { size, thickness, gap } = opts;
      const cx = size / 2, cy = size / 2;
      const r  = cx - thickness / 2 - 2;
      const C  = 2 * Math.PI * r;
      const total = segments.reduce((s, d) => s + d.value, 0);

      const wrap = htmlEl('div', 'chart-donut-wrapper');

      const svg = svgEl('svg', {
        viewBox: `0 0 ${size} ${size}`,
        width: size, height: size,
        class: 'chart-donut-svg',
        style: `transform: rotate(-90deg)`,
      });

      const tip = new Tooltip(wrap);

      // Hintergrundring
      svg.appendChild(svgEl('circle', {
        cx, cy, r,
        fill: 'none',
        stroke: 'var(--color-border)',
        'stroke-width': thickness,
      }));

      let cumulative = 0;
      segments.forEach((seg, i) => {
        const pct  = seg.value / total;
        const dash = Math.max(0, pct * C - gap);
        const color = seg.color || COLORS[i % COLORS.length];

        const arc = svgEl('circle', {
          cx, cy, r,
          fill: 'none',
          stroke: color,
          'stroke-width': thickness,
          'stroke-dasharray': `${dash} ${C - dash}`,
          'stroke-dashoffset': C - cumulative,
          'stroke-linecap': gap > 0 ? 'round' : 'butt',
          class: 'chart-donut-segment',
        });

        arc.addEventListener('mouseenter', () => {
          arc.setAttribute('stroke-width', thickness + 4);
          const pctStr = (pct * 100).toFixed(1) + ' %';
          tip.show(
            `<strong>${seg.label}</strong><span>${fmt(seg.value, opts.unit)} · ${pctStr}</span>`,
            size / 2 + wrap.getBoundingClientRect().left - wrap.getBoundingClientRect().left,
            size / 2 - r - 10
          );
        });
        arc.addEventListener('mouseleave', () => {
          arc.setAttribute('stroke-width', thickness);
          tip.hide();
        });

        svg.appendChild(arc);
        cumulative += pct * C;
      });

      // Mittel-Beschriftung (nicht gedreht)
      if (opts.center !== null) {
        const label = svgEl('g', { style: `transform: rotate(90deg); transform-origin: ${cx}px ${cy}px` });
        const val   = opts.center === 'total' ? fmt(total, opts.unit) : opts.center;
        const vt    = svgEl('text', { x: cx, y: cy + (opts.centerLabel ? -6 : 7), class: 'chart-donut-center-value', 'text-anchor': 'middle' });
        vt.textContent = val;
        label.appendChild(vt);
        if (opts.centerLabel) {
          const lt = svgEl('text', { x: cx, y: cy + 14, class: 'chart-donut-center-label', 'text-anchor': 'middle' });
          lt.textContent = opts.centerLabel;
          label.appendChild(lt);
        }
        svg.appendChild(label);
      }

      wrap.appendChild(svg);

      // Legende
      const leg = htmlEl('div', 'chart-donut-legend');
      segments.forEach((seg, i) => {
        const pct  = ((seg.value / total) * 100).toFixed(1);
        const color = seg.color || COLORS[i % COLORS.length];
        const item = htmlEl('div', 'chart-legend-item');
        const dot  = htmlEl('span', 'chart-legend-dot');
        dot.style.background = color;
        const name = htmlEl('span', '', seg.label);
        const val  = htmlEl('span', 'chart-legend-value', `${fmt(seg.value)} (${pct} %)`);
        item.appendChild(dot);
        item.appendChild(name);
        item.appendChild(val);
        leg.appendChild(item);
      });
      wrap.appendChild(leg);

      this.el.innerHTML = '';
      this.el.appendChild(wrap);
    }
  }

  // ── Sparkline ─────────────────────────────

  function sparkline(container, values, opts = {}) {
    const el_ = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el_ || values.length < 2) return;
    const W = opts.width || 72, H = opts.height || 28;
    const min = Math.min(...values), max = Math.max(...values);
    const trend = values[values.length - 1] >= values[0];
    const color = opts.color || (trend ? 'var(--color-chart-1)' : 'var(--color-chart-5)');

    const xs  = values.map((_, i) => (i / (values.length - 1)) * W);
    const ys  = values.map(v => H - 2 - scale(v, min, max, 0, H - 4));
    const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');

    const svg = svgEl('svg', {
      viewBox: `0 0 ${W} ${H}`,
      width: W, height: H,
      class: 'chart-sparkline',
      'aria-hidden': 'true',
    });
    svg.appendChild(svgEl('polyline', {
      points: pts,
      stroke: color,
      fill: 'none',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }));

    el_.innerHTML = '';
    el_.appendChild(svg);
    return { trend };
  }

  return { Line, MultiLine, Bar, Donut, sparkline };
})();
