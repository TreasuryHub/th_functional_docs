#!/usr/bin/env python3
"""
List which referenced screenshots are present vs still missing.

Usage:  python _meta/check_screenshots.py
Scans all docs for image references to assets/screenshots/*.png and checks the folder.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    refs = {}  # filename -> list of pages referencing it
    for f in glob.glob(os.path.join(ROOT, "**", "*.md"), recursive=True):
        rel = os.path.relpath(f, ROOT).replace("\\", "/")
        if rel.startswith("_meta/"):  # skip template/checklist placeholders
            continue
        txt = open(f, encoding="utf-8").read()
        for m in re.finditer(r'assets/screenshots/([a-z0-9-]+\.png)', txt):
            refs.setdefault(m.group(1), []).append(rel)

    shots_dir = os.path.join(ROOT, "assets", "screenshots")
    present = set(os.listdir(shots_dir)) if os.path.isdir(shots_dir) else set()

    have = sorted(fn for fn in refs if fn in present)
    missing = sorted(fn for fn in refs if fn not in present)
    orphan = sorted(fn for fn in present if fn.endswith(".png") and fn not in refs)

    total = len(refs)
    print("Screenshots: %d/%d present\n" % (len(have), total))
    if have:
        print("PRESENT (%d):" % len(have))
        for fn in have:
            print("  [x] " + fn)
        print()
    print("MISSING (%d):" % len(missing))
    for fn in missing:
        print("  [ ] %-38s  -> %s" % (fn, ", ".join(sorted(set(refs[fn])))))
    if orphan:
        print("\nORPHAN files in folder (not referenced by any doc):")
        for fn in orphan:
            print("  (?) " + fn)

if __name__ == "__main__":
    main()
