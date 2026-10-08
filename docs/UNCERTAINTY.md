# PRAVAH Uncertainty Engine & Conformal Prediction

Traditional disaster tools present deterministic pseudo-certainty (e.g., *"Flood Probability = 87%"*). In complex coastal urban hydrologic events, deterministic predictions fail emergency responders by concealing observation gaps, forecast spread, and model errors.

PRAVAH treats **Uncertainty Quantification (UQ)** as a core product differentiator.

---

## 1. What PRAVAH Outputs

Instead of a single scalar number, PRAVAH produces a structured quadruplet for every zone:

| Metric | Example Output | Meaning |
|---|---|---|
| **Flood Risk Score** | **$87.0\%$ (SEVERE)** | Tabular expected inundation exposure |
| **System Confidence** | **$81.4\%$** | Calibrated empirical reliability based on sensor availability |
| **Prediction Interval** | **$[76.2\% - 91.5\%]$** | $90\%$ Conformal prediction band (Monte Carlo perturbed) |
| **Evidence Strength** | **CRITICAL CONVERGENCE** | Inter-provider multi-source agreement tier |

---

## 2. Uncertainty Quantification Methodology

The `UncertaintyEngine` (`backend/app/uncertainty/engine.py`) performs $N = 100$ Monte Carlo perturbation draws over three input variance distributions:
1. **NWP Dispersion ($\sigma_{\text{rain}}$)**: Model disagreement between Open-Meteo, ECMWF, and IMD.
2. **Telemetry Gauge Proximity Penalty**: If a zone lacks a physical telemetry gauge within 2 km, the variance is scaled by $\times 1.4$.
3. **Synthetic Aperture Radar (SAR) Weight**: Confirmation of microwave C-band backscatter drop increases baseline confidence by $+6.0\%$.

### Interval Extraction:
$$\text{Lower Bound} = \text{Percentile}_{5\%}(\mathbf{Y}_{\text{MC}})$$
$$\text{Upper Bound} = \text{Percentile}_{95\%}(\mathbf{Y}_{\text{MC}})$$

$$\text{Confidence} = \text{Clip}\left(94.0 - 1.5 \times (\text{Upper} - \text{Lower}) - \Delta_{\text{gauge}} + \Delta_{\text{SAR}}, 45.0, 95.0\right)$$

---

## 3. Explainability: "Why Confidence is Not 100%"

PRAVAH explicitly presents the reasons for residual uncertainty in the UI:

```
[+] High precipitation accumulation (210.0 mm) exceeding local drain capacity
[+] Low-lying coastal floodplain topography (3.8 m MSL)
[+] Sentinel-1 SAR C-band radar backscatter attenuation confirms open water pooling
[+] Corroborated by active CWC / WRIS telemetry river level gauge
[-] Telemetry gap: No active physical gauge within 2km radius; relying on spatial interpolation
[-] NWP Forecast dispersion: Ensemble disagreement of 14% across rain bands
```

Responders immediately know whether low confidence is caused by storm volatility or local sensor network blind spots.
