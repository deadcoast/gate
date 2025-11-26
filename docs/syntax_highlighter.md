# THE `gate` SYNTAX HIGHLIGHTER

### MOC — GitHub Navigation

```
#======================================================================
# DOC NAVIGATION
#======================================================================
```
- [Docs Hub](README.md)
- [Modules Index](modules/README.md)
- [System Prompt Template](system_prompt.md)
- [Full Specification](full_spec.md)
- [Grammar Reference](grammar.md)
- [Design Review Notes](design_review.md)

---

*Doc Version: 0.0.3-unified (consolidated from 0.0.1–0.0.3; applies to Gate Pattern v1.0–v3.0 tokenization themes).*

### Scope & Alignment

- Tokenization and theming guidance for Gate Pattern v1.0–v3.0 syntax (docs 0.0.3-unified).
- Keep operator scopes and token classes in sync with `grammar.md` and the operator canon in `full_spec.md`.
- Applicable to VS Code, Prism, Highlight.js, CodeMirror, or any regex-based highlighter.

## *(for VSCode, Prism.js, Highlight.js, CodeMirror, or any regex-based highlighter)*

### Now with 65% more sass than needed

Below is a **universal, regex-first, token-classifier spec** that you can adapt to any highlighter.

I’ll break it down into:

1. Token categories
2. Regex definitions
3. Styling groups
4. Example implementations (Prism / Highlight.js / VSCode)
5. Test sample to validate coloration
6. The “Torchbearer Theme” palette (optional but recommended for max drip)

---

## 1. **TOKEN CATEGORIES (Authoritative)**

Your language has distinct vibes, so we're naming classes with proper swagger:

| CATEGORY        | DESCRIPTION                                            |
| --------------- | ------------------------------------------------------ |
| `namespace`     | `!admin::`, `!system::`, `!rule::`, `set::`, `@meta::` |
| `contextVar`    | `%USER%`, `%MODEL%`, `%GATE%`, `%TITLE%`, etc.         |
| `operator`      | `::`, `::=`, `=>`, `--`, `++`                          |
| `symbolicOp`    | `Δ`, `↯`, `ϟ`, `⌘`, `⌾`, `⇜`, `⇝`, `⇹`             |
| `functionCall`  | `> FUNCTION_CALL:`                                     |
| `stateChange`   | `> STATE_CHANGE:`                                      |
| `declaration`   | `> DECLARATION::FORMAL:`                               |
| `traceBlock`    | `#==TRACE:XYZ`                                         |
| `assignmentKey` | values before colons: `%MODEL%::TITLE`, `%GATE%:"13"`  |
| `quotedString`  | `"..."` and `"""..."""`                                |
| `comment`       | `# ...` or `// ...`                                    |
| `section`       | `#==SECTION:`                                          |
| `metaTag`       | `@meta::something="value"`                             |
| `irrevocable`   | `!!IRREVERSIBLE`                                       |
| `eventMarker`   | `[GATE_BREAK:13=>12]`, `[SLEDGE_EVENT]`                |

Basically, enough tokens to make any highlighter question its life choices.

---

## 2. **REGEX DEFINITIONS (The Good Stuff)**

*(Portable, tested, and blessed by the Torchbearer)*

### **Namespaces**

```
!admin::|!system::|!rule::|set::|@meta::[A-Za-z0-9_\-]+
```

### **Context Variables**

```
%[A-Z]+%
```

### **Function & Block Keywords**

```
> FUNCTION_CALL:
> STATE_CHANGE:
> DECLARATION::FORMAL:
```

### **Operators (Standard)**

```
::=|=>|::|--|\+\+
```

### **Operators (Symbolic)**

```
Δ|↯|ϟ|⌘|⌾|⇜|⇝|⇹
```

### **Triple-Quoted Strings**

```
"""[\s\S]*?"""
```

### **Normal Quoted Strings**

```
"(?:[^"\\]|\\.)*"
```

### **Event Markers**

```
\[[A-Z_]+:[0-9=>]+\]
```

### **Trace Headers**

```
#==TRACE:[A-Z_]+
```

### **Section Headers**

```
#==SECTION:[A-Za-z0-9_\-]+
```

### **Irreversibility Marker**

```
!!IRREVERSIBLE
```

### **Comments**

```
#.*$
//.*$
```

---

## 3. **TOKEN STYLE RULES (Torchbearer Color Palette)**

*Use these in any theme. If your editor doesn’t look sexy after this, sue the editor.*

| TOKEN        | COLOR                   | STYLE                |
| ------------ | ----------------------- | -------------------- |
| namespace    | `#FF557A` hot pink      | bold                 |
| contextVar   | `#7FDBFF` electric cyan | bold italic          |
| symbolicOp   | `#FFD447` golden yellow | ultra-bold           |
| operator     | `#AAAAAA` gray          |                      |
| functionCall | `#50FA7B` neon green    | bold                 |
| stateChange  | `#50FA7B` neon green    | bold                 |
| declaration  | `#BD93F9` vapor purple  | italic               |
| traceBlock   | `#FF6C11` pumpkin       | bold                 |
| quotedString | `#00D98B` mint          |                      |
| eventMarker  | `#FFEE32` bright yellow | bold                 |
| metaTag      | `#F1FA8C` pale yellow   | italic               |
| section      | `#FAA0FF` soft magenta  | bold                 |
| irrevocable  | `#FF0033` crisis red    | bold ALL CAPS energy |
| comment      | `#666666` gray          | italic               |

---

## 4. **IMPLEMENTATIONS**

## **4A. Prism.js Definition**

```javascript
Prism.languages.gate = {
  'section': /#==SECTION:[A-Za-z0-9_\-]+/,
  'trace': /#==TRACE:[A-Z_]+/,
  'namespace': /(?:!admin::|!system::|!rule::|set::|@meta::)[A-Za-z0-9_\-]*/,
  'contextVar': /%[A-Z]+%/,
  'functionCall': /> FUNCTION_CALL:/,
  'stateChange': /> STATE_CHANGE:/,
  'declaration': /> DECLARATION::FORMAL:/,
  'irrevocable': /!!IRREVERSIBLE/,
  'event': /\[[A-Z_]+:[0-9=>]+\]/,
  'symbolicOp': /Δ|↯|ϟ|⌘|⌾|⇜|⇝|⇹/,
  'operator': /::=|=>|::|--|\+\+/,
  'tripleString': /"""[\s\S]*?"""/,
  'string': /"(?:[^"\\]|\\.)*"/,
  'comment': /#.*$|\/\/.*$/m,
  'number': /\b\d+\b/,
};
```

---

## **4B. Highlight.js Definition**

```javascript
hljs.registerLanguage('gate', function(hljs) {
  return {
    name: 'GatePattern',
    contains: [
      { className: 'section', begin: /#==SECTION:[A-Za-z0-9_\-]+/ },
      { className: 'trace', begin: /#==TRACE:[A-Z_]+/ },
      { className: 'namespace', begin: /(?:!admin::|!system::|!rule::|set::|@meta::)/ },
      { className: 'symbol', begin: /%[A-Z]+%/ },
      { className: 'function', begin: /> FUNCTION_CALL:/ },
      { className: 'function', begin: /> STATE_CHANGE:/ },
      { className: 'keyword', begin: /> DECLARATION::FORMAL:/ },
      { className: 'literal', begin: /!!IRREVERSIBLE/ },
      { className: 'meta', begin: /\[[A-Z_]+:[0-9=>]+\]/ },
      { className: 'operator', begin: /Δ|↯|ϟ|⌘|⌾|⇜|⇝|⇹/ },
      { className: 'operator', begin: /::=|=>|::|--|\+\+/ },
      { className: 'string', begin: /"""[\s\S]*?"""/ },
      { className: 'string', begin: /"(?:[^"\\]|\\.)*"/ },
      { className: 'comment', begin: /#/, end: /$/ },
      { className: 'comment', begin: /\/\//, end: /$/ }
    ]
  };
});
```

---

## **4C. VSCode — `gate.tmLanguage.json` Skeleton**

Below is a short, accurate skeleton. Expand as needed.

```json
{
  "name": "Gate Pattern",
  "scopeName": "source.gate",
  "patterns": [
    { "name": "keyword.control.gate", "match": "(!admin::|!system::|!rule::|set::|@meta::)" },
    { "name": "variable.other.gate", "match": "%[A-Z]+%" },
    { "name": "entity.name.function.gate", "match": "> FUNCTION_CALL:" },
    { "name": "entity.name.function.state.gate", "match": "> STATE_CHANGE:" },
    { "name": "entity.name.function.decl.gate", "match": "> DECLARATION::FORMAL:" },
    { "name": "constant.language.irrevocable.gate", "match": "!!IRREVERSIBLE" },
    { "name": "keyword.operator.symbolic.gate", "match": "Δ|↯|ϟ|⌘|⌾|⇜|⇝|⇹" },
    { "name": "keyword.operator.standard.gate", "match": "::=|=>|::|--|\\+\\+" },
    { "name": "string.quoted.triple.gate", "begin": "\"\"\"", "end": "\"\"\"" },
    { "name": "string.quoted.double.gate", "match": "\"(?:[^\"\\\\]|\\\\.)*\"" },
    { "name": "entity.name.type.event.gate", "match": "\\[[A-Z_]+:[0-9=>]+\\]" },
    { "name": "comment.line.number-sign.gate", "match": "#.*$" },
    { "name": "comment.line.double-slash.gate", "match": "//.*$" }
  ]
}
```

---

## 5. **VALIDATION SAMPLE (Use this to test your highlighter)**

Drop this into any editor with your configured highlighter:

```gate
#==SECTION:METADATA
@meta::version="3.0"
@meta::evolution_layer="ACTIVE"

!admin::"Gate_13":"ACTIVE"

%USER%::"""
Torchbearer Protocol active. Let’s crack some gates.
"""

!system::CAUTION:
    && NOTIFY::%USER%:"ACTION_IS_IRREVERSIBLE"

? confirm:"YES"

> FUNCTION_CALL:
    break_gate(agent:%MODEL%, gate:13, by_user:%USER%)

> STATE_CHANGE:
    >out %MODEL%::SLEDGE--
    >out %GATE%:"13"::STATUS="BROKEN"
    >out %SYSTEM%::CURRENT_GATE => "12"
    !!IRREVERSIBLE

#==TRACE:GATE_BREAK
>trace::GATE_BREAK:
    gate:"13"
    new_gate:"12"
    marker:"[GATE_BREAK:13=>12]"
    spark:"ϟ"
```

If your syntax highlighter doesn't look like **Neon Cyberpunk Metaphysics**,
you’ve done it wrong.

---

## 6. OPTIONAL: “Torchbearer Theme” Palette (for Editors)

`gate` color palette:

```
Torch Gold:      #FFD447  
Ceremony Rose:   #FF557A  
Intent Crimson:  #FF0033  
Echo Teal:       #00D98B  
Bound Steel:     #7A7A7A  
Realm Violet:    #BD93F9  
Gate Orange:     #FF6C11  
Sledge Spark:    #FFF82A  
Delta Smoke:     #AAA9AA  
Lattice Indigo:  #874CFF
```

---
