"""One-shot i18n helper: extend dashboard.item dicts + mascot.welcome variants."""

p = "src/lib/i18n.tsx"
src = open(p, encoding="utf-8").read()

# --- 1. dashboard.item extensions, per language (after its datePh line) ---
item_additions = {
    "datePh: \"March 2025\",": '''      datePh: "March 2025",
      startDate: "Start date",
      startDatePh: "Jan 2024",
      endDate: "End date",
      endDatePh: "Jun 2025 (or: present)",
      client: "Client / employer",
      clientPh: "Studio Kivu",
      role: "Role",
      rolePh: "Lead carpenter",
      body: "Full article (long form)",
      bodyPh: "Write the full article, case study or story here…",''',
    "datePh: \"Mars 2025\",": '''      datePh: "Mars 2025",
      startDate: "Date de début",
      startDatePh: "Janv. 2024",
      endDate: "Date de fin",
      endDatePh: "Juin 2025 (ou : en cours)",
      client: "Client / employeur",
      clientPh: "Studio Kivu",
      role: "Rôle",
      rolePh: "Menuisier principal",
      body: "Article complet (format long)",
      bodyPh: "Rédigez ici l'article complet, l'étude de cas ou l'histoire…",''',
    'datePh: "Mart 2025",': '''      datePh: "Mart 2025",
      startDate: "Ba\u015flang\u0131\u00e7 tarihi",
      startDatePh: "Oca 2024",
      endDate: "Biti\u015f tarihi",
      endDatePh: "Haz 2025 (veya: s\u00fcr\u00fcyor)",
      client: "M\u00fc\u015fteri / i\u015fveren",
      clientPh: "Studio Kivu",
      role: "Rol",
      rolePh: "Ba\u015f marangoz",
      body: "Tam yaz\u0131 (uzun format)",
      bodyPh: "Tam yaz\u0131y\u0131, vaka \u00e7al\u0131\u015fmas\u0131n\u0131 veya hikayeyi buraya yaz\u0131n\u2026",''',
}
for anchor, addition in item_additions.items():
    assert anchor in src, f"anchor missing: {anchor}"
    src = src.replace(anchor, addition, 1)

# --- 2. mascot.welcome: keep base, add page-specific welcome next to it ---
welcome_map = {
    'welcome: "Psst — new here? Let me show you around Elio Pages in 5 quick steps!",':
        '''welcome: "Psst — new here? Let me show you around Elio Pages in 5 quick steps!",
    welcomePage: "Hey! I'm the page guide — 5 quick steps and you'll know everything about this portfolio.",''',
    'welcome: "Psst — nouveau ici ? Je te fais visiter Elio Pages en 5 étapes rapides !",':
        '''welcome: "Psst — nouveau ici ? Je te fais visiter Elio Pages en 5 étapes rapides !",
    welcomePage: "Salut ! Je suis le guide de la page — 5 petites étapes et tu sauras tout sur ce portfolio.",''',
    'welcome: "Selam — yeni misin? Elio Pages\'i 5 h\u0131zl\u0131 ad\u0131mda gezdireyim!",':
        '''welcome: "Selam — yeni misin? Elio Pages'i 5 h\u0131zl\u0131 ad\u0131mda gezdireyim!",
    welcomePage: "Selam! Sayfa rehberiyim \u2014 5 k\u0131sa ad\u0131mda bu portf\u00f6y\u00fc \u00f6\u011freneceksin.",''',
}
for anchor, addition in welcome_map.items():
    assert anchor in src, f"welcome anchor missing: {anchor[:40]}"
    src = src.replace(anchor, addition, 1)

open(p, "w", encoding="utf-8").write(src)
print("OK")
