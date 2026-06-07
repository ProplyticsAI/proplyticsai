/*!
 * MonteCarloSimulation — Proplytic.ai
 * Risikomodellierung der Verfahrens-Bewertung (Ertragswert-/Sachwertverfahren)
 * via Monte-Carlo-Stichproben über marktunsichere Eingangsgrößen.
 *
 * Idee: Statt eines einzigen Punktwerts (deterministische Verfahrensrechnung)
 * werden die mit Marktunsicherheit behafteten Parameter (Bodenrichtwert,
 * Liegenschaftszinssatz/Sachwertfaktor, Mietentwicklung, Baupreisindex) als
 * Wahrscheinlichkeitsverteilungen modelliert und N-fach durch die bestehende
 * Verfahrens-Engine (ValuationProcedures) gejagt. Aus der resultierenden
 * Wertverteilung lassen sich objektspezifische Konfidenzintervalle (P10/P50/P90)
 * sowie eine Sensitivitätsanalyse (welcher Faktor treibt die Unsicherheit?)
 * ableiten — anstelle einer pauschalen, fixen ±-Bandbreite.
 *
 * API:
 *   MonteCarloSimulation.runSimulation(verfahren, inputs, n) →
 *     { n, samples, mean, stdDev, percentiles: {p10,p25,p50,p75,p90}, sensitivity }
 *   MonteCarloSimulation.buildHistogram(samples, bins)
 */
const MonteCarloSimulation = (() => {
  'use strict';

  // Box-Muller-Transformation für normalverteilte Zufallszahlen
  function sampleNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + z * stdDev;
  }

  // Welche Eingangsgrößen tragen Marktunsicherheit, und wie stark
  // (relative Standardabweichung als Anteil des Basiswerts)?
  // `lookup`/`fallback` lösen Werte auf, die intern aus Tabellen abgeleitet
  // werden (z. B. Liegenschaftszinssatz), `overrideKey` ist der Parameter,
  // über den ValuationProcedures diesen Wert pro Simulationslauf übersteuern lässt.
  const PARAM_SPECS = {
    ertragswert: [
      { key: 'bodenrichtwert',       overrideKey: 'bodenrichtwert',                label: 'Bodenrichtwert',        relSigma: 0.12 },
      { key: 'jahresnettokaltmiete', overrideKey: 'jahresnettokaltmiete',          label: 'Jahresnettokaltmiete',  relSigma: 0.06 },
      { key: 'liegenschaftszinssatz',overrideKey: 'liegenschaftszinssatzOverride', label: 'Liegenschaftszinssatz', relSigma: 0.15,
        lookup: () => ValuationProcedures.LIEGENSCHAFTSZINS, fallback: 0.045 },
    ],
    sachwert: [
      { key: 'bodenrichtwert', overrideKey: 'bodenrichtwert',         label: 'Bodenrichtwert',                  relSigma: 0.12 },
      { key: 'sachwertfaktor', overrideKey: 'sachwertfaktorOverride', label: 'Sachwertfaktor (Marktanpassung)', relSigma: 0.08,
        lookup: () => ValuationProcedures.SACHWERTFAKTOR, fallback: 1.0 },
      { key: 'baupreisindex',  overrideKey: 'baupreisindexOverride',  label: 'Baupreis-/Herstellungskosten',    relSigma: 0.06, fixedBase: 1.55 },
    ],
  };

  function calcFnFor(verfahren) {
    return verfahren === 'ertragswert' ? ValuationProcedures.ertragswert : ValuationProcedures.sachwert;
  }

  function resolveBaseValue(spec, inputs) {
    if (spec.fixedBase !== undefined) return spec.fixedBase;
    if (spec.lookup) return spec.lookup()[inputs.gebaeudetyp] ?? spec.fallback;
    return inputs[spec.key];
  }

  function percentileOf(sortedSamples, q) {
    const idx = Math.min(sortedSamples.length - 1, Math.max(0, Math.round(q * (sortedSamples.length - 1))));
    return sortedSamples[idx];
  }

  // Hauptsimulation: N Durchläufe, in jedem werden die unsicheren Parameter
  // unabhängig normalverteilt um ihren Basiswert gezogen und das Ergebnis
  // der Verfahrens-Berechnung gesammelt.
  function runSimulation(verfahren, baseInputs, n = 2000) {
    const specs   = PARAM_SPECS[verfahren];
    const calcFn  = calcFnFor(verfahren);
    const baseVal = specs.map(s => resolveBaseValue(s, baseInputs));

    const samples = new Array(n);
    for (let i = 0; i < n; i++) {
      const perturbed = { ...baseInputs };
      specs.forEach((s, idx) => {
        const base = baseVal[idx];
        perturbed[s.overrideKey] = Math.max(0, sampleNormal(base, base * s.relSigma));
      });
      samples[i] = calcFn(perturbed).ergebnis;
    }
    samples.sort((a, b) => a - b);

    const mean     = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;

    return {
      n: samples.length,
      samples,
      mean,
      stdDev: Math.sqrt(variance),
      percentiles: {
        p10: percentileOf(samples, 0.10),
        p25: percentileOf(samples, 0.25),
        p50: percentileOf(samples, 0.50),
        p75: percentileOf(samples, 0.75),
        p90: percentileOf(samples, 0.90),
      },
      sensitivity: computeSensitivity(verfahren, baseInputs, specs, baseVal),
    };
  }

  // One-at-a-time-Sensitivitätsanalyse (Tornado-Diagramm-Grundlage):
  // jeder Parameter wird isoliert um ±1 Standardabweichung verschoben,
  // die resultierende Ergebnis-Spannweite zeigt seinen Einfluss auf die Unsicherheit.
  function computeSensitivity(verfahren, baseInputs, specs, baseVal) {
    const calcFn = calcFnFor(verfahren);

    return specs.map((s, idx) => {
      const base  = baseVal[idx];
      const sigma = base * s.relSigma;

      const lowResult  = calcFn({ ...baseInputs, [s.overrideKey]: Math.max(0, base - sigma) }).ergebnis;
      const highResult = calcFn({ ...baseInputs, [s.overrideKey]: base + sigma }).ergebnis;

      const low   = Math.min(lowResult, highResult);
      const high  = Math.max(lowResult, highResult);
      return { label: s.label, low, high, spread: high - low };
    }).sort((a, b) => b.spread - a.spread);
  }

  // Histogramm-Bins für die Verteilungsdarstellung (PropChart.Bar-kompatibel)
  function buildHistogram(samples, bins = 22) {
    const min = samples[0];
    const max = samples[samples.length - 1];
    const width = (max - min) / bins || 1;
    const counts = new Array(bins).fill(0);

    samples.forEach(v => {
      let idx = Math.floor((v - min) / width);
      if (idx >= bins) idx = bins - 1;
      counts[idx]++;
    });

    return counts.map((count, i) => ({
      label: Math.round((min + i * width) / 1000) + 'k',
      value: count,
    }));
  }

  return { runSimulation, buildHistogram };
})();
