import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ArrowStyle

def create_workflow_diagram(output_path="workflow_diagram.png"):
    fig, ax = plt.subplots(figsize=(15, 8.5), dpi=300)
    fig.patch.set_facecolor('#0f172a')  # Dark navy slate background
    ax.set_facecolor('#0f172a')
    
    # Hide axes
    ax.axis('off')
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 8.5)

    # Title Banner
    ax.text(7.5, 8.1, "AEGIS EARTH - ALERTNEST: END-TO-END DECISION INTELLIGENCE WORKFLOW", 
            ha='center', va='center', color='#38bdf8', fontsize=16, fontweight='bold', family='sans-serif')
    ax.text(7.5, 7.75, "Hyperlocal Flood Early-Warning, Cascading Risk Modeling & Multilingual Evacuation Copilot (HW01)", 
            ha='center', va='center', color='#94a3b8', fontsize=10, family='sans-serif')

    # Color Palette
    c_ingest = '#1e293b'     # Slate
    c_fusion = '#1e3a5f'     # Slate blue
    c_engine = '#064e3b'     # Deep emerald
    c_opt = '#3b0764'        # Deep purple
    c_delivery = '#701a75'   # Deep magenta
    
    border_ingest = '#38bdf8'
    border_fusion = '#60a5fa'
    border_engine = '#34d399'
    border_opt = '#c084fc'
    border_delivery = '#f472b6'

    stages = [
        {"name": "STAGE 1: MULTI-SOURCE INGESTION", "x": 0.5, "w": 2.5, "border": border_ingest, "bg": c_ingest,
         "items": [
             ("IMD Sovereign REST APIs", "cityforecastloc, current_wx,\ndistrictnowcast, districtwarning"),
             ("NDMA SACHET (CAP)", "Common Alerting Protocol\nv1.2 Official Warnings"),
             ("CWC & India-WRIS", "Adyar/Cooum Basin Gauges,\nChembarambakkam Outflows"),
             ("Open-Meteo & GloFAS", "18+ Hourly Parameters &\nRiver Runoff Hydrograph"),
             ("Sentinel-1 SAR Radar", "ESA C-Band Microwave Radar\nCloud-Penetrating Inundation"),
             ("OpenStreetMap & DEM", "Road Arterials, Hospitals &\nCopernicus 90m Elevation")
         ]},
        {"name": "STAGE 2: FUSION & UNCERTAINTY", "x": 3.4, "w": 2.5, "border": border_fusion, "bg": c_fusion,
         "items": [
             ("Circuit Breakers & Cache", "Zero-failure fallbacks with\ncalibrated historical priors"),
             ("Forecast Agreement Score", "Inter-model dispersion metric:\nCV = std_dev / mean_rain"),
             ("Sensor Health Audit", "Live ping latency monitor &\nradar availability checks"),
             ("Uncertainty Quantification", "Monte Carlo variance bands &\ncalibrated confidence bounds")
         ]},
        {"name": "STAGE 3: HYDROLOGY & CASCADES", "x": 6.3, "w": 2.5, "border": border_engine, "bg": c_engine,
         "items": [
             ("Latent Susceptibility Core", "Physics DEM elevation MSL,\nwaterway proximity, drainage"),
             ("Active Water Volume Trigger", "Threshold: f_rain/25 + f_river/35\nPrevents dry-weather false alerts"),
             ("Time-to-Impact & Depth", "Ward TTI (hours), depth (cm) &\nwater rise rate (cm/hr)"),
             ("Cascading Failure Graph", "NetworkX directed graph:\nFlood -> Road -> Power -> Hospital")
         ]},
        {"name": "STAGE 4: ACTION OPTIMIZATION", "x": 9.2, "w": 2.5, "border": border_opt, "bg": c_opt,
         "items": [
             ("Counterfactual 'What-If'", "Sub-40ms real-time simulator:\nRainfall +50%, road cut, trips"),
             ("Resilience Action Score", "RAS = [Pop * Vuln * Time * Conf]\n       / [Cost + 1.5]"),
             ("Google OR-Tools MILP", "Optimal deployment of Boats,\nPumps, Ambulances, NDRF"),
             ("Risk-Aware Resilient Route", "Safest bypass corridor avoiding\n1.1m submerged traps")
         ]},
        {"name": "STAGE 5: DUAL-PERSONA DELIVERY", "x": 12.1, "w": 2.5, "border": border_delivery, "bg": c_delivery,
         "items": [
             ("PERSONA A: DISASTER CELL", "Municipal Command Center:\n* MapLibre GL Interactive GIS\n* Real-Time What-If Sliders\n* Cascading Risk Inspector"),
             ("Human-in-the-Loop Signoff", "Duty officer review & approval\nworkflow for public alerts"),
             ("PERSONA B: CITIZEN COPILOT", "ALERTNEST Agentic Copilot:\n* Groq Llama-3.3-70b AI Engine\n* Tamil & English Natural Chat\n* Turn-by-Turn Safe Shelter Routing"),
             ("Multilingual Broadcasts", "Ward-level SMS, WhatsApp &\nPublic Warning Bulletins")
         ]}
    ]

    for st in stages:
        sx = st["x"]
        sw = st["w"]
        s_border = st["border"]
        s_bg = st["bg"]
        
        # Header Box
        header_box = FancyBboxPatch((sx, 7.0), sw, 0.45,
                                    boxstyle="round,pad=0.04,rounding_size=0.08",
                                    facecolor=s_border, edgecolor='none')
        ax.add_patch(header_box)
        ax.text(sx + sw/2, 7.22, st["name"], ha='center', va='center',
                color='#0f172a', fontsize=7.5, fontweight='bold')

        # Items
        n_items = len(st["items"])
        y_start = 6.6
        spacing = 5.8 / max(n_items, 1)

        for i, (title, desc) in enumerate(st["items"]):
            iy = y_start - i * spacing
            item_h = spacing * 0.85
            
            # Card background
            card = FancyBboxPatch((sx, iy - item_h), sw, item_h,
                                  boxstyle="round,pad=0.04,rounding_size=0.06",
                                  facecolor=s_bg, edgecolor=s_border, linewidth=1.2)
            ax.add_patch(card)
            
            # Text inside card
            ax.text(sx + 0.12, iy - 0.22, title, ha='left', va='center',
                    color='#ffffff', fontsize=8, fontweight='bold')
            ax.text(sx + 0.12, iy - item_h/2 - 0.1, desc, ha='left', va='center',
                    color='#cbd5e1', fontsize=6.8, linespacing=1.2)

    # Connective Arrows between stages
    arrow_props = dict(arrowstyle="->,head_width=0.3,head_length=0.4",
                       color="#38bdf8", lw=2, mutation_scale=15)
    
    arrow_y_positions = [5.5, 3.8, 2.1]
    for y_arr in arrow_y_positions:
        # Stage 1 -> Stage 2
        ax.annotate("", xy=(3.35, y_arr), xytext=(3.05, y_arr), arrowprops=arrow_props)
        # Stage 2 -> Stage 3
        ax.annotate("", xy=(6.25, y_arr), xytext=(5.95, y_arr), arrowprops=dict(arrowstyle="->,head_width=0.3,head_length=0.4", color="#34d399", lw=2, mutation_scale=15))
        # Stage 3 -> Stage 4
        ax.annotate("", xy=(9.15, y_arr), xytext=(8.85, y_arr), arrowprops=dict(arrowstyle="->,head_width=0.3,head_length=0.4", color="#c084fc", lw=2, mutation_scale=15))
        # Stage 4 -> Stage 5
        ax.annotate("", xy=(12.05, y_arr), xytext=(11.75, y_arr), arrowprops=dict(arrowstyle="->,head_width=0.3,head_length=0.4", color="#f472b6", lw=2, mutation_scale=15))

    # Bottom Legend / Architecture Notes
    legend_box = FancyBboxPatch((0.5, 0.25), 14.1, 0.45,
                                boxstyle="round,pad=0.03,rounding_size=0.06",
                                facecolor='#111827', edgecolor='#334155', linewidth=1)
    ax.add_patch(legend_box)
    ax.text(7.55, 0.47, 
            "Data Pipeline Flow: 100% Keyless Sovereign & Open Data  ->  Continuous Circuit Breakers  ->  Surrogate Physics Modeling (<40ms)  ->  OR-Tools MILP  ->  Bilingual Citizen & Incident Cell Delivery",
            ha='center', va='center', color='#38bdf8', fontsize=7.8, fontweight='bold')

    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print(f"Workflow diagram successfully created at {output_path}")

if __name__ == "__main__":
    create_workflow_diagram()
