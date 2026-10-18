# Graph Report - AboStesha-claude  (2026-10-18)

## Corpus Check
- 62 files · ~155,296 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 37, (none) 2, .ico 1)

## Summary
- 590 nodes · 1210 edges · 25 communities (19 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24

## God Nodes (most connected - your core abstractions)
1. `search()` - 43 edges
2. `DesignSystemGenerator` - 38 edges
3. `search_stack()` - 35 edges
4. `BM25` - 18 edges
5. `detect_domain()` - 18 edges
6. `read_rows()` - 16 edges
7. `compilerOptions` - 16 edges
8. `CatalogRefreshTest` - 15 edges
9. `TestReasoningContract` - 15 edges
10. `validate()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `TestEndToEndCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestLightResultOutputCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestBm25CoreBehavior` --uses--> `BM25`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_core.py → .agents/skills/ui-ux-pro-max/scripts/core.py
- `TestTokenizer` --uses--> `BM25`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_core.py → .agents/skills/ui-ux-pro-max/scripts/core.py
- `_generate_intelligent_overrides()` --calls--> `search()`  [EXTRACTED]
  .agents/skills/ui-ux-pro-max/scripts/design_system.py → .agents/skills/ui-ux-pro-max/scripts/core.py

## Import Cycles
- None detected.

## Communities (25 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (44): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, TestGeneratedCatalogContract, _catalog_date(), _check_app_interface_contract() (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (12): DesignSystemGenerator, apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), TestReasoningMatch, read_rows(), split_values() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (47): About(), Approach(), ClientList(), Clients(), Contact(), Footer(), Gauge(), Hero() (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (10): _write_persisted_file(), CatalogSummaryLineEndingsTest, _load_generator(), TestStackFlagWithDesignSystem, TestFixtureValidation, TestMetricMath, TestThresholdGate, resolve() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (11): _exact_stack_identifier(), search_stack(), _valid_max_results(), _rows(), TestNativeDesktopStackFreshness, read_rows(), read_rows(), TestTextLayoutDataContracts (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (39): eslintConfig, nextConfig, dependencies, lucide-react, next, react, react-dom, devDependencies (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (5): BM25, _suggest_identities(), TestBm25CoreBehavior, TestDiagnosticsContracts, TestTokenizer

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (9): ansi_ljust(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown(), hex_to_ansi(), _mode_support_labels(), section_header() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (5): _detect_page_type(), format_page_override_md(), _generate_intelligent_overrides(), _resolve_dial(), format_output()

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (8): _contains_phrase(), _passes_threshold(), _project_row(), _query_coverage(), _rewrite_query_for_domain(), _search_csv(), _search_csv_detailed(), _suggest_terms()

### Community 11 - "Community 11"
Cohesion: 0.21
Nodes (3): search(), _style_search_destination(), TestSearchDomains

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (4): _palette_is_dark(), _relative_luminance(), TestEndToEndCoherence, TestLuminance

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (4): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (7): _domain_keywords(), _file_signature(), _get_bm25(), _load_csv(), _load_csv_snapshot(), _load_product_keywords(), _load_rows_or_empty()

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (5): _exact_match_diagnostic(), _legacy_successor_guidance(), _normalize(), _stack_query_requests_legacy(), _stack_row_filter()

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (4): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), format_master_md()

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (4): generate_design_system(), persist_design_system(), safe_slug(), TestPersistence

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (3): _exact_row_identity(), _row_identities(), _style_identity()

## Knowledge Gaps
- **7 isolated node(s):** `react-dom`, `@tailwindcss/turbopack`, `@types/node`, `@types/react`, `@types/react-dom` (+2 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `search()` connect `Community 11` to `Community 0`, `Community 1`, `Community 4`, `Community 6`, `Community 9`, `Community 10`, `Community 14`, `Community 16`, `Community 17`, `Community 20`, `Community 23`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `react-dom`, `@tailwindcss/turbopack`, `@types/node` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06455399061032864 - nodes in this community are weakly interconnected._
- **Why does `DesignSystemGenerator` connect `Community 1` to `Community 6`, `Community 7`, `Community 9`, `Community 12`, `Community 15`, `Community 18`, `Community 19`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `BM25` (e.g. with `TestBm25CoreBehavior` and `TestTokenizer`) actually correct?**
  _`BM25` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.060515873015873016 - nodes in this community are weakly interconnected._