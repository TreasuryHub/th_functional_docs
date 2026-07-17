#!/usr/bin/env python3
"""
Build a single self-contained preview.html from all the Markdown docs.

Usage:  python _meta/build_preview.py
Output: preview.html at the repo root — open it directly in a browser (no server needed).

Re-run this any time you edit the docs or add screenshots to assets/screenshots/.
Requires: python-markdown  (pip install markdown)
"""
import os, re, html, json, markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---- section order + friendly names (mirrors the platform menu) --------------
SECTION_ORDER = [
    ("_root",            "Overview"),
    ("00-getting-started","Getting Started"),
    ("01-home",          "1 · Home"),
    ("02-integrations",  "2 · Integrations"),
    ("03-data",          "3 · Data"),
    ("04-reconciliation","4 · Reconciliation"),
    ("05-payments",      "5 · Payments"),
    ("06-reporting",     "6 · Reporting"),
    ("07-workflows",     "7 · Workflows"),
    ("08-alerts",        "8 · Alerts"),
    ("09-agents",        "9 · Agents (AI)"),
    ("10-admin-console", "10 · Admin Console"),
    ("11-accounting",    "11 · Accounting"),
    ("12-platform",      "12 · Platform"),
    ("_meta",            "Docs Meta"),
]

def slug_for(relpath):
    p = relpath.replace("\\", "/")
    p = p[:-3] if p.endswith(".md") else p
    return re.sub(r"[^A-Za-z0-9]+", "_", p).strip("_")

def collect_files():
    files = []
    for dirpath, _, filenames in os.walk(ROOT):
        # skip the generated site + node stuff
        rel_dir = os.path.relpath(dirpath, ROOT).replace("\\", "/")
        if rel_dir.startswith(("site", "_drafts")) or "/." in ("/" + rel_dir):
            continue
        for fn in filenames:
            if fn.endswith(".md"):
                rel = os.path.relpath(os.path.join(dirpath, fn), ROOT).replace("\\", "/")
                files.append(rel)
    return files

def top_section(rel):
    if "/" not in rel:
        return "_root"
    top = rel.split("/")[0]
    return top

def first_h1(md_text, fallback):
    for line in md_text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback

def rewrite_links(html_text, cur_rel, slugs):
    """Turn internal .md links into hash routes (#slug or #slug::anchor)."""
    cur_dir = os.path.dirname(cur_rel)
    def repl(m):
        href = m.group(1)
        if href.startswith(("http://", "https://", "#", "mailto:")):
            return m.group(0)
        anchor = ""
        if "#" in href:
            href, anchor = href.split("#", 1)
        if not href.endswith(".md"):
            return m.group(0)
        target = os.path.normpath(os.path.join(cur_dir, href)).replace("\\", "/")
        s = slug_for(target)
        if s not in slugs:
            return m.group(0)
        route = "#" + s + ("::" + anchor if anchor else "")
        return 'href="%s"' % route
    return re.sub(r'href="([^"]+)"', repl, html_text)

def rewrite_images(html_text, cur_rel):
    """Point images at a root-relative path so real screenshots resolve later."""
    cur_dir = os.path.dirname(cur_rel)
    def repl(m):
        pre, src, post = m.group(1), m.group(2), m.group(3)
        if src.startswith(("http://", "https://", "data:")):
            return m.group(0)
        target = os.path.normpath(os.path.join(cur_dir, src)).replace("\\", "/")
        return '<img%ssrc="%s" class="doc-img"%s' % (pre, target, post)
    return re.sub(r'<img([^>]*?)src="([^"]+)"([^>]*?)', repl, html_text)

def main():
    rels = collect_files()
    slugs = {slug_for(r) for r in rels}

    # group by section
    by_section = {key: [] for key, _ in SECTION_ORDER}
    meta = {}
    for rel in rels:
        sec = top_section(rel)
        if sec not in by_section:
            by_section.setdefault(sec, [])
        md_text = open(os.path.join(ROOT, rel), encoding="utf-8").read()
        title = first_h1(md_text, os.path.basename(rel))
        if rel == "README.md":
            title = "Home / Index"
        md = markdown.Markdown(extensions=["extra", "toc", "sane_lists"])
        body = md.convert(md_text)
        body = rewrite_links(body, rel, slugs)
        body = rewrite_images(body, rel)
        meta[rel] = {"slug": slug_for(rel), "title": title, "body": body, "section": sec}

    # order files within a section: overview.md first in each directory, then alphabetical
    def order_key(rel):
        d = os.path.dirname(rel)
        base = os.path.basename(rel)
        return (d, 0 if base == "overview.md" else 1, base)
    for sec in by_section:
        by_section[sec] = sorted([r for r in rels if top_section(r) == sec], key=order_key)

    # ---- build nav + pages -------------------------------------------------
    nav_parts, page_parts = [], []
    known = {k for k, _ in SECTION_ORDER}
    ordered_sections = [k for k, _ in SECTION_ORDER] + [s for s in by_section if s not in known]
    names = dict(SECTION_ORDER)

    first_slug = "README" and meta.get("README.md", {}).get("slug")
    for sec in ordered_sections:
        items = by_section.get(sec, [])
        if not items:
            continue
        label = names.get(sec, sec)
        nav_parts.append('<div class="nav-section"><div class="nav-head">%s</div><ul>' % html.escape(label))
        # nest risk-management under reporting visually
        for rel in items:
            m = meta[rel]
            depth = " sub" if "/risk-management/" in rel else ""
            nav_parts.append(
                '<li class="nav-item%s" data-slug="%s"><a href="#%s">%s</a></li>'
                % (depth, m["slug"], m["slug"], html.escape(m["title"]))
            )
        nav_parts.append("</ul></div>")
        for rel in items:
            m = meta[rel]
            page_parts.append(
                '<article class="page" id="%s" data-title="%s"><div class="crumb">%s</div>%s</article>'
                % (m["slug"], html.escape(m["title"]), html.escape(label), m["body"])
            )

    nav_html = "\n".join(nav_parts)
    pages_html = "\n".join(page_parts)
    count = len(rels)
    home_slug = meta.get("README.md", {}).get("slug", "")

    tpl = TEMPLATE
    tpl = tpl.replace("__NAV__", nav_html)
    tpl = tpl.replace("__PAGES__", pages_html)
    tpl = tpl.replace("__COUNT__", str(count))
    tpl = tpl.replace("__HOME__", home_slug)

    out = os.path.join(ROOT, "preview.html")
    open(out, "w", encoding="utf-8").write(tpl)
    print("Wrote %s (%d pages)" % (out, count))

TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Treasury Hub — User Documentation (Preview)</title>
<style>
  :root{
    --gold:#B4975A; --gold-d:#8f7442; --cream:#FCEACD; --silver:#C8CACC; --dark:#1E1E1E;
    --bg:#ffffff; --fg:#23262b; --muted:#6b7280; --line:#e7e5e0; --card:#faf8f4;
    --code-bg:#f3f1ec; --side:#1E1E1E; --side-fg:#d9d9d9; --side-mut:#8b8b8b;
    --accent:var(--gold);
  }
  html[data-theme="dark"]{
    --bg:#16181d; --fg:#e7e7e9; --muted:#9aa0aa; --line:#2b2f37; --card:#1c1f26;
    --code-bg:#22262e;
  }
  *{box-sizing:border-box}
  body{margin:0;font:15px/1.65 "Segoe UI",system-ui,-apple-system,sans-serif;color:var(--fg);background:var(--bg)}
  a{color:var(--gold-d);text-decoration:none}
  a:hover{text-decoration:underline}
  html[data-theme="dark"] a{color:var(--gold)}
  /* layout */
  .wrap{display:flex;min-height:100vh}
  .side{width:310px;flex:none;background:var(--side);color:var(--side-fg);position:sticky;top:0;height:100vh;overflow-y:auto;border-right:1px solid #000}
  .brand{padding:18px 18px 10px;border-bottom:1px solid #2c2c2c;position:sticky;top:0;background:var(--side);z-index:2}
  .brand .logo{font-weight:700;font-size:18px;color:#fff;letter-spacing:.3px}
  .brand .logo span{color:var(--gold)}
  .brand .sub{font-size:11px;color:var(--side-mut);margin-top:2px}
  .search{margin:12px 14px 6px;position:relative}
  .search input{width:100%;padding:8px 10px;border-radius:8px;border:1px solid #333;background:#111;color:#eee;font-size:13px}
  .search input::placeholder{color:#777}
  nav{padding:6px 8px 30px}
  .nav-section{margin:6px 0}
  .nav-head{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--gold);padding:10px 12px 4px;font-weight:700}
  nav ul{list-style:none;margin:0;padding:0}
  .nav-item a{display:block;padding:5px 12px;border-radius:7px;color:var(--side-fg);font-size:13px}
  .nav-item.sub a{padding-left:26px;font-size:12.5px;color:#bdbdbd}
  .nav-item a:hover{background:#2a2a2a;text-decoration:none}
  .nav-item.active a{background:var(--gold);color:#1a1a1a;font-weight:600}
  .nav-item.hide{display:none}
  .nav-head.hide{display:none}
  /* content */
  main{flex:1;min-width:0}
  .topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 28px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:3}
  .topbar .meta{font-size:12px;color:var(--muted)}
  .btns{display:flex;gap:8px}
  .btn{border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:6px 12px;font-size:13px;cursor:pointer}
  .btn:hover{border-color:var(--gold)}
  .content{max-width:900px;margin:0 auto;padding:30px 40px 90px}
  .crumb{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--gold-d);font-weight:700;margin-bottom:6px}
  html[data-theme="dark"] .crumb{color:var(--gold)}
  .page{display:none}
  .page.active{display:block;animation:fade .2s ease}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  h1{font-size:30px;margin:.1em 0 .5em;line-height:1.2}
  h2{font-size:22px;margin:1.6em 0 .5em;padding-bottom:.25em;border-bottom:1px solid var(--line)}
  h3{font-size:17px;margin:1.4em 0 .4em}
  h4{font-size:15px;margin:1.2em 0 .3em}
  p,li{color:var(--fg)}
  blockquote{margin:1em 0;padding:.6em 1em;border-left:4px solid var(--gold);background:var(--card);border-radius:0 8px 8px 0;color:var(--fg)}
  blockquote p{margin:.3em 0}
  code{background:var(--code-bg);padding:2px 6px;border-radius:5px;font:13px/1.4 "Cascadia Code",Consolas,monospace}
  pre{background:var(--code-bg);padding:14px 16px;border-radius:10px;overflow:auto;border:1px solid var(--line)}
  pre code{background:none;padding:0}
  table{border-collapse:collapse;width:100%;margin:1em 0;font-size:13.5px;display:block;overflow-x:auto}
  th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
  th{background:var(--card);font-weight:600}
  tr:nth-child(even) td{background:var(--card)}
  hr{border:none;border-top:1px solid var(--line);margin:2em 0}
  .doc-img{max-width:100%;border:1px solid var(--line);border-radius:10px;margin:12px 0}
  .img-ph{display:flex;align-items:center;gap:10px;max-width:100%;padding:18px;border:1px dashed var(--gold);border-radius:10px;background:var(--card);color:var(--muted);font-size:13px;margin:12px 0}
  .img-ph b{color:var(--gold-d)}
  /* availability badges */
  .badge{display:inline-block;padding:1px 8px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid transparent}
  .b-avail{background:#e6f6ec;color:#1c7a3f;border-color:#bfe6cd}
  .b-addon{background:#fff3e0;color:#a15c00;border-color:#f2d19a}
  .b-soon{background:#eef1f6;color:#5b6472;border-color:#d5dbe6}
  html[data-theme="dark"] .b-avail{background:#12331f;color:#5fd08a;border-color:#1e5233}
  html[data-theme="dark"] .b-addon{background:#3a2a10;color:#e2a44b;border-color:#5a4018}
  html[data-theme="dark"] .b-soon{background:#20242c;color:#9aa4b4;border-color:#333b47}
  .menu-toggle{display:none}
  @media(max-width:880px){
    .side{position:fixed;left:-320px;transition:left .2s;z-index:20}
    .side.open{left:0}
    .menu-toggle{display:inline-block}
    .content{padding:20px}
  }
  .noresults{color:var(--muted);padding:10px 16px;font-size:13px;display:none}
</style>
</head>
<body>
<div class="wrap">
  <aside class="side" id="side">
    <div class="brand">
      <div class="logo">Treasury<span>Hub</span></div>
      <div class="sub">User Documentation · Preview</div>
    </div>
    <div class="search"><input id="q" type="search" placeholder="Search documentation…" autocomplete="off"></div>
    <div class="noresults" id="noresults">No pages match.</div>
    <nav id="nav">
      __NAV__
    </nav>
  </aside>
  <main>
    <div class="topbar">
      <button class="btn menu-toggle" id="menu">☰ Menu</button>
      <div class="meta">__COUNT__ pages · working draft — statuses to be confirmed</div>
      <div class="btns">
        <button class="btn" id="theme">◐ Theme</button>
      </div>
    </div>
    <div class="content" id="content">
      __PAGES__
    </div>
  </main>
</div>
<script>
(function(){
  var HOME="__HOME__";
  var pages=document.querySelectorAll(".page");
  var navItems=document.querySelectorAll(".nav-item");

  // colorize availability badges
  document.querySelectorAll("blockquote code, td code, li code, p code").forEach(function(c){
    var t=c.textContent.trim();
    if(t==="Available"){c.className="badge b-avail";}
    else if(t==="In Preview"){c.className="badge b-addon";}
  });

  // screenshot placeholders for images that don't exist yet
  document.querySelectorAll("img.doc-img").forEach(function(img){
    img.addEventListener("error",function(){
      var ph=document.createElement("div");
      ph.className="img-ph";
      ph.innerHTML="📷 <span><b>Screenshot pending.</b> "+(img.alt||"")+"</span>";
      img.replaceWith(ph);
    });
  });

  function show(slug, anchor){
    var found=false;
    pages.forEach(function(p){
      var on=(p.id===slug);
      p.classList.toggle("active",on);
      if(on)found=true;
    });
    if(!found && HOME){ slug=HOME; pages.forEach(function(p){p.classList.toggle("active",p.id===HOME);}); }
    navItems.forEach(function(n){ n.classList.toggle("active", n.getAttribute("data-slug")===slug); });
    var active=document.querySelector(".nav-item.active");
    if(active) active.scrollIntoView({block:"nearest"});
    if(anchor){ var el=document.getElementById(anchor); if(el){el.scrollIntoView({behavior:"smooth"}); return;} }
    document.getElementById("content").scrollTo(0,0);
    window.scrollTo(0,0);
    document.getElementById("side").classList.remove("open");
  }
  function route(){
    var h=location.hash.replace(/^#/,"");
    var anchor=""; if(h.indexOf("::")>-1){ var parts=h.split("::"); h=parts[0]; anchor=parts[1]; }
    show(h||HOME, anchor);
  }
  window.addEventListener("hashchange",route);
  route();

  // search
  var q=document.getElementById("q");
  var nores=document.getElementById("noresults");
  q.addEventListener("input",function(){
    var term=q.value.trim().toLowerCase();
    var anyVisible=false;
    document.querySelectorAll(".nav-section").forEach(function(sec){
      var secHas=false;
      sec.querySelectorAll(".nav-item").forEach(function(it){
        var slug=it.getAttribute("data-slug");
        var title=it.textContent.toLowerCase();
        var body=(document.getElementById(slug)||{}).textContent||"";
        var match=!term || title.indexOf(term)>-1 || body.toLowerCase().indexOf(term)>-1;
        it.classList.toggle("hide",!match);
        if(match){secHas=true;anyVisible=true;}
      });
      sec.querySelector(".nav-head").classList.toggle("hide",!secHas);
    });
    nores.style.display=anyVisible?"none":"block";
  });

  // theme
  var themeBtn=document.getElementById("theme");
  function setTheme(t){document.documentElement.setAttribute("data-theme",t);try{localStorage.setItem("th_theme",t);}catch(e){}}
  var saved="light"; try{saved=localStorage.getItem("th_theme")||"light";}catch(e){}
  setTheme(saved);
  themeBtn.addEventListener("click",function(){
    setTheme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark");
  });

  document.getElementById("menu").addEventListener("click",function(){
    document.getElementById("side").classList.toggle("open");
  });
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
