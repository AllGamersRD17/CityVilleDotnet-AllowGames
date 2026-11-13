# Ruffle build (CityVille Revived – Allow Games)

Built 2026-11-13 from ruffle-rs/ruffle master (f73f953bf) plus two open PRs that CityVille needs:

- #23248 avm2: Fix return font subclass in Font.enumerateFonts (besuper) – avoids getting stuck on the loading screen
- #25139 avm2: Serialize dense Arrays as AMF0 strict arrays (EnzoGrn) – avoids "Error #1300" during loading

With this build the looping/stuck sound effects are gone.
