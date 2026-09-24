import { jsPDF } from "jspdf";

export type BriefData = {
  businessName: string;
  contactName?: string;
  trade?: string;
  location?: string;
  since?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  headline?: string;
  bio?: string;
  story?: string;
  accent?: string;
  style?: string;
  logoUrl?: string;
  coverUrl?: string;
  username?: string;
  profileLink?: string;
  items: {
    kind: string;
    title: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    tags?: string[];
    date?: string;
    status?: string;
  }[];
};

const BRAND = "Elio Pages — by Aethel Technologies";
const EMBER: [number, number, number] = [176, 112, 10];
const INK: [number, number, number] = [26, 27, 32];
const GREY: [number, number, number] = [110, 113, 124];

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Build the multi-section order brief as a PDF Blob. */
export function buildBriefPdf(d: BriefData): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  const accent = d.accent && /^#[0-9a-fA-F]{6}$/.test(d.accent) ? hexToRgb(d.accent) : EMBER;

  const ensure = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - M) {
      doc.addPage();
      y = M;
    }
  };

  const row = (label: string, value?: string) => {
    if (!value) return;
    ensure(30);
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GREY);
    doc.text(label.toUpperCase(), M, y);
    y += 14;
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...INK);
    const lines = doc.splitTextToSize(value, W - M * 2) as string[];
    doc.text(lines, M, y);
    y += lines.length * 14 + 8;
  };

  const section = (title: string) => {
    ensure(50);
    y += 10;
    doc.setDrawColor(...accent).setLineWidth(2);
    doc.line(M, y, M + 26, y);
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...INK);
    doc.text(title, M + 36, y + 4);
    y += 22;
  };

  /* ---------- Header band ---------- */
  doc.setFillColor(12, 14, 22);
  doc.rect(0, 0, W, 108, "F");
  doc.setFillColor(...accent);
  doc.circle(W - 78, 54, 22, "F");

  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(255, 255, 255);
  doc.text("Elio Pages", M, 52);
  doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(170, 174, 190);
  doc.text("Portfolio page order brief — sent to the Elio team on WhatsApp", M, 72);
  doc.text(new Date().toLocaleDateString(undefined, { dateStyle: "long" }), M, 88);
  y = 150;

  /* ---------- Business identity ---------- */
  section("Business");
  row("Business name", d.businessName);
  row("Contact person", d.contactName);
  row("Trade / sector", d.trade);
  row("Location", d.location);
  row("Founded", d.since);
  row("Tagline", d.headline);
  row("Short pitch", d.bio);
  row("Full story", d.story);

  /* ---------- Contact ---------- */
  section("Contact");
  row("WhatsApp", d.whatsapp);
  row("Email", d.email);
  row("Instagram", d.instagram);
  row("LinkedIn", d.linkedin);

  /* ---------- Look & feel ---------- */
  section("Look & feel");
  ensure(26);
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GREY);
  doc.text("ACCENT COLOR", M, y);
  doc.setFillColor(...accent);
  doc.roundedRect(M + 110, y - 9, 44, 16, 4, 4, "F");
  doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...INK);
  doc.text(d.accent ?? "#b0700a", M + 164, y + 3);
  y += 30;
  row("Page style", d.style);
  row("Logo URL", d.logoUrl);
  row("Cover image URL", d.coverUrl);

  /* ---------- Catalog ---------- */
  if (d.items.length > 0) {
    section(`Catalog — ${d.items.length} item${d.items.length > 1 ? "s" : ""}`);
    let n = 0;
    for (const it of d.items) {
      n += 1;
      ensure(70);
      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
      doc.text(`${n}. ${it.title}`, M, y);
      y += 14;
      doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GREY);
      const meta = [it.kind.toUpperCase(), it.date, it.status, (it.tags ?? []).join(", ")]
        .filter(Boolean)
        .join("  ·  ");
      if (meta) {
        doc.text(meta, M, y);
        y += 13;
      }
      if (it.description) {
        doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...INK);
        const lines = doc.splitTextToSize(it.description, W - M * 2 - 14) as string[];
        ensure(lines.length * 13 + 4);
        doc.text(lines, M + 14, y);
        y += lines.length * 13 + 4;
      }
      if (it.linkUrl || it.imageUrl) {
        doc.setFontSize(9).setTextColor(...GREY);
        if (it.imageUrl) {
          doc.text(`Image: ${it.imageUrl}`, M + 14, y);
          y += 12;
        }
        if (it.linkUrl) {
          doc.text(`Link: ${it.linkUrl}`, M + 14, y);
          y += 12;
        }
      }
      y += 10;
    }
  }

  /* ---------- Footer ---------- */
  ensure(70);
  y += 14;
  doc.setDrawColor(225, 222, 214).setLineWidth(1);
  doc.line(M, y, W - M, y);
  y += 20;
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK);
  doc.text("This brief is the order.", M, y);
  y += 16;
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GREY);
  doc.text("The Elio team builds the page from this information and publishes it with you. Free of charge.", M, y, {
    maxWidth: W - M * 2,
  });
  if (d.profileLink) {
    y += 16;
    doc.setTextColor(...accent);
    doc.textWithLink("Preview: " + d.profileLink, M, y, { url: d.profileLink });
  }
  y += 24;
  doc.setTextColor(150, 152, 160).setFontSize(8.5);
  doc.text(BRAND, M, y);

  return doc.output("blob");
}

/** Trigger a browser download of the brief PDF. */
export function downloadBriefPdf(d: BriefData) {
  const blob = buildBriefPdf(d);
  const name = `elio-brief-${(d.businessName || "business").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
