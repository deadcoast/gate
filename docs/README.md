# Gate Docs MOC

*(GitHub-friendly map of content for the Gate Pattern knowledge base.)*
*Doc Version: **0.0.3-unified** (consolidated from 0.0.1–0.0.3; compatible with Gate Pattern v1.0–v3.0).*

```
#======================================================================
# DOCS NAVIGATION HUB (MOC)
#======================================================================
```

- [Modules Index](modules/README.md)
- [System Prompt Template](system_prompt.md)
- [Full Specification](full_spec.md)
- [Grammar Reference](grammar.md)
- [Design Review Notes](design_review.md)
- [Syntax Highlighter Guide](syntax_highlighter.md)
- [SLEDGE Manifesto (Module E)](modules/module_e.md)
- [F2 Compiler Trace Emitter (Module G)](modules/module_g.md)

---

## Using This MOC

- Keep the `#======================================================================` separators as the visual anchor for every doc-level navigation block.
- Place the navigation block near the top of each doc so GitHub renders the links immediately.
- Use relative links (as above) so the MOC works both in GitHub and locally.
- When adding a new doc, copy the separator lines and add a short bullet list that points to the hub, module index, and any tightly related specs.

```
#======================================================================
# DOC / MOC TEMPLATE
#======================================================================
```
- [Docs Hub](README.md)
- [Modules Index](modules/README.md)
- [Related Spec](./path-to-file.md)

Each module and spec should now include this pattern so the ecosystem stays navigable and consistent.

---

## Docs Style & Alignment (keep cohesive)

- Keep a **Doc Version** line under the title using `0.0.3-unified` to show the merged provenance.
- Place the **MOC block** immediately after the title/version so GitHub renders cross-links up front.
- Align operator meanings with the canon in `grammar.md` and `full_spec.md`; update both if new symbols appear.
- Reference Gate Pattern coverage explicitly (v1 core template, v2 metaphysics, v3 evolution) so readers know the scope.
- Prefer relative links; avoid deleting legacy content—add clarifying scope notes instead.
