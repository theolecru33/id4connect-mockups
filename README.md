# iD4Connect — Refonte homepage (mockups)

Quatre directions de design pour la homepage du middleware iD4Connect, accessibles via le sélecteur de version dans le header.

| Version | Direction | Inspiration |
|---------|-----------|-------------|
| **V1** | Editorial dark / mockup produit type SaaS | interfere.com |
| **V2** | Card-based light / live counters / FAQ | Wibify |
| **V3** | Dashboard interactif / parallax / live KPIs | Databahn |
| **VO** | Version originale extraite du thème WordPress livré (`iD4Connect V2`) | — |

## Stack

- HTML / CSS / JS vanilla (pas de framework)
- Police unique : **Montserrat** (V1, V2, V3) ou **Inter** (VO)
- Couleur signature : orange iD4Connect `#F97316`
- Light & dark mode toggle persisté en localStorage
- Animations CSS + SVG paths dynamiques calculés au runtime

## Lancement local

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

Sur Windows : double-clic sur `start-localhost.bat`.

## Structure

```
.
├── index.html      # V1
├── v2.html         # V2
├── v3.html         # V3
├── vo.html         # VO (original)
├── css/
│   ├── style.css   # V1
│   ├── v2.css      # V2
│   ├── v3.css      # V3
│   └── vo.css      # VO
├── js/
│   ├── main.js     # V1
│   ├── v2.js       # V2
│   └── v3.js       # V3 (parallax, particles, live counters)
└── start-localhost.bat
```

## Contexte

Mockups commandés par iD4Connect pour explorer plusieurs directions visuelles avant la refonte effective du site WordPress livré dans `iD4Connect V2`.
