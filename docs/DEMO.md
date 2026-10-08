# PRAVAH Competition Demonstration Script (Walkthrough)

This document provides a guided walkthrough for judges, technical reviewers, and operational emergency directors evaluating the PRAVAH MVP.

---

## The Demonstration Narrative

### Act 1: Multi-Source Independent Signal Ingestion
1. **Open PRAVAH**: Launch `http://localhost:5173`.
2. **Observe Open Data Stack**:
   - The top header reveals `Forecast Agreement: 84.6% [VERY HIGH]` with an inter-model spread of $\pm 6.5\text{ mm}$ between **Open-Meteo**, **ECMWF IFS 0.25°**, and **IMD Regional Met**.
   - Review the Telemetry Strip: $545,737$ exposed civilians, $83.4\%$ confidence band, $3$ severed corridors.
   - Click **Sources Health**: Observe live latencies and transparent fallback statuses for Open-Meteo, GloFAS, ECMWF, Sentinel-1, NWDP, and OSM.

### Act 2: Zone Inspection, Conformal Uncertainty & SHAP Attribution
3. **Inspect High-Risk Zone**:
   - Click on the glowing red **Zone 14 - Mudichur** or **Zone 13 - Velachery** on the Map.
   - Review the **Feature Attribution (SHAP)** breakdown:
     - Rainfall accumulation: $+30.5$
     - Terrain low elevation: $+21.2$
     - Waterway proximity: $+18.4$
     - Drainage impedance: $+14.0$
     - Upstream river surge: $+12.2$
     - Sentinel-1 SAR evidence: $+6.8$
   - Review **Uncertainty Quantification**:
     - Flood Risk: $92.4\%$
     - Prediction Interval: $[88.1\% - 96.5\%]$
     - Supporting evidence: C-band radar drop & CWC river gauge at Saidapet Bridge.

### Act 3: Cascading Infrastructure Failure Graph
4. **Switch to Cascading Failures Tab**:
   - Click the **Cascading Impact** tab on the right drawer.
   - Observe the NetworkX directed graph:
     - Monsoon Inflow $\rightarrow$ Adyar Overflow $\rightarrow$ Mudichur Arterial Severance $\rightarrow$ Mudichur 110kV Substation Trip $\rightarrow$ MIOT Hospital Emergency Isolation $\rightarrow$ Relief Camp Power Degradation.
   - Every edge communicates real dependency factors and propagation delay penalties.

### Act 4: Counterfactual "What-If" Simulation
5. **Simulate a More Severe Future**:
   - In the bottom dock, adjust **Rainfall Multiplier** to `+25%` ($1.25\times$).
   - Toggle **Mudichur Main Road** to `IMPASSABLE`.
   - Click **RUN SIMULATION**:
     - The backend recalculates flood risk, exposure, and road statuses in real time.
     - Observe affected population increasing by $+142,800$ civilians and hospital access delays increasing.

### Act 5: Google OR-Tools Resource Optimization
6. **Trigger Decision Intelligence**:
   - In the counterfactual dock or recommendations tab, review the optimal resource deployment solved by Google OR-Tools.
   - Review **Recommendation Rank 1**:
     - *Pre-position 4 Motorized Inflatable Rescue Boats at Mudichur*
     - *Resilience Action Score (RAS)*: $92.4$
     - *Expected People Protected*: $2,080$
     - *Response Time Slashed*: $-18.5\text{ minutes}$
     - *Audited Decision Rationale*: 4 clear bullet points explaining why this action maximizes survival.

### Act 6: Risk-Aware Routing (Fastest vs. Safest)
7. **Click "Risk Routing" in the Header**:
   - The modal contrasts the **Naïve Fastest Route** (14 min nominal, 88% flood probability, 1.1m water, vehicle stranding trap) against the **PRAVAH Resilient Corridor** (18.5 min, 8% flood risk, elevated causeway).
   - In reality, the resilient route saves **54.3 minutes** by completely avoiding gridlocked standing water.

### Act 7: Empirical Model Validation
8. **Click "Validation" in the Header**:
   - View classifier precision ($0.892$), recall ($0.914$), and Brier calibration score ($0.082$).
   - View the audited $-33.8\%$ response time reduction comparing the reactive baseline against PRAVAH's predictive optimization.
