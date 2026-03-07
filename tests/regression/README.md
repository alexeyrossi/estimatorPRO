## Regression Corpus

Quality gate:
- `npm run lint`
- `npm run regression`
- `npm run build`

Corpus layout:
- `tests/regression/cases.json` for the original shared baseline set
- `tests/regression/cases/*.json` for one-case-per-file business scenarios
- `tests/regression/cases/gold-*.json` for Tier-1 business-critical quotes

Commands:
- `npm run regression`
- `npm run regression:gold`
- `npm run regression -- --case <id>`
- `npm run regression:update`
- `npm run regression:update:gold`

Rule:
- add new real quoting patterns as one file per case
- update baselines only when behavior change is intentional
- gold baselines require explicit `--allow-gold-update`
