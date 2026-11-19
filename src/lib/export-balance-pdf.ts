import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import { format } from "date-fns";

export interface BalanceSummary {
  totalCompanies: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  balanceCheck: string;
}

export interface BalanceCompany {
  companyName: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  retainedEarnings?: number;
}

type RGB = [number, number, number];

const GREEN: RGB = [22, 163, 74];
const GREEN_DARK: RGB = [21, 128, 61];
const GREEN_BG: RGB = [240, 253, 244];
const GREEN_BORDER: RGB = [187, 247, 208];

const RED: RGB = [220, 38, 38];
const RED_DARK: RGB = [185, 28, 28];
const RED_BG: RGB = [254, 242, 242];
const RED_BORDER: RGB = [254, 202, 202];

const BLUE: RGB = [30, 64, 175];
const BLUE_MID: RGB = [37, 99, 235];
const BLUE_DARK: RGB = [29, 78, 216];
const BLUE_BG: RGB = [239, 246, 255];
const BLUE_BORDER: RGB = [191, 219, 254];

const EMERALD_DARK: RGB = [4, 120, 87];
const EMERALD_BG: RGB = [236, 253, 245];
const EMERALD_BORDER: RGB = [110, 231, 183];
const AMBER_DARK: RGB = [180, 83, 9];
const AMBER_BG: RGB = [255, 251, 235];
const AMBER_BORDER: RGB = [252, 211, 77];

const MUTED: RGB = [100, 116, 139];
const SECTION_BG: RGB = [226, 232, 240];
const LINE: RGB = [226, 232, 240];

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US");
const rwf = (n: number) => `RWF ${fmt(n)}`;

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } };
const lastY = (doc: jsPDF) => (doc as DocWithTable).lastAutoTable?.finalY ?? 0;

export function exportBalanceSheetPDF(
  asAtDate: Date,
  summary: BalanceSummary,
  companies: BalanceCompany[] = [],
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 40;

  const dateLabel = format(asAtDate, "MMM dd, yyyy");
  const fileDate = format(asAtDate, "yyyy-MM-dd");

  // Same as the UI: assets are always shown as a positive value
  const displayTotalAssets = Math.abs(summary.totalAssets);
  const totalLiabAndEquity = summary.totalLiabilities + summary.totalEquity;
  const balanced = summary.balanceCheck === "BALANCED";
  const hasDetailedData = companies.length > 0;

  // Starts a new page if the next block would not fit
  const ensureSpace = (y: number, needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      return 50;
    }
    return y;
  };

  // ───────────── Header ─────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IREBE GROUP", marginX, 50);

  doc.setFontSize(13);
  doc.text("Consolidated Balance Sheet", marginX, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `As at ${dateLabel}  |  ${summary.totalCompanies} ${
      summary.totalCompanies === 1 ? "Company" : "Companies"
    }`,
    marginX,
    90,
  );
  doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, pageWidth - marginX, 50, {
    align: "right",
  });
  doc.setTextColor(0);

  // ───────────── Balance sheet equation cards ─────────────
  const cardsY = 106;
  const cardGap = 10;
  const cardW = (contentWidth - cardGap) / 2;
  const smallH = 44;
  const bigH = smallH * 2 + cardGap;

  const drawCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    value: string,
    bg: RGB,
    border: RGB,
    labelColor: RGB,
    valueColor: RGB,
    valueSize: number,
  ) => {
    doc.setFillColor(...bg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...labelColor);
    doc.text(label, x + 12, y + 17);
    doc.setFontSize(valueSize);
    doc.setTextColor(...valueColor);
    doc.text(value, x + 12, y + h - 14);
    doc.setTextColor(0);
  };

  drawCard(
    marginX,
    cardsY,
    cardW,
    bigH,
    "Total Assets",
    rwf(displayTotalAssets),
    GREEN_BG,
    GREEN_BORDER,
    GREEN_DARK,
    GREEN,
    16,
  );
  drawCard(
    marginX + cardW + cardGap,
    cardsY,
    cardW,
    smallH,
    "Total Liabilities",
    rwf(summary.totalLiabilities),
    RED_BG,
    RED_BORDER,
    RED_DARK,
    RED,
    12,
  );
  drawCard(
    marginX + cardW + cardGap,
    cardsY + smallH + cardGap,
    cardW,
    smallH,
    "Total Equity",
    rwf(summary.totalEquity),
    BLUE_BG,
    BLUE_BORDER,
    BLUE_DARK,
    BLUE_MID,
    12,
  );

  // ───────────── Balance check indicator ─────────────
  const checkY = cardsY + bigH + 12;
  const checkH = 40;
  doc.setFillColor(...(balanced ? EMERALD_BG : AMBER_BG));
  doc.setDrawColor(...(balanced ? EMERALD_BORDER : AMBER_BORDER));
  doc.setLineWidth(0.8);
  doc.roundedRect(marginX, checkY, contentWidth, checkH, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Balance Check:", marginX + 12, checkY + 16);

  doc.setFontSize(10);
  doc.setTextColor(...(balanced ? EMERALD_DARK : AMBER_DARK));
  doc.text(summary.balanceCheck, marginX + contentWidth - 12, checkY + 16, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Assets (${fmt(displayTotalAssets)}) = Liabilities (${fmt(
      summary.totalLiabilities,
    )}) + Equity (${fmt(summary.totalEquity)})`,
    marginX + 12,
    checkY + 31,
  );
  doc.setTextColor(0);

  let y = checkY + checkH + 28;

  // ───────────── Breakdown sections ─────────────
  type Row = { label: string; amount: number; sub?: boolean };

  const renderBreakdown = (
    title: string,
    titleColor: RGB,
    rows: Row[],
    totalLabel: string,
    total: number,
  ) => {
    y = ensureSpace(y, 90);

    // Section title with colored underline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...titleColor);
    doc.text(title, marginX, y);
    doc.setDrawColor(...titleColor);
    doc.setLineWidth(0.8);
    doc.line(marginX, y + 5, pageWidth - marginX, y + 5);
    doc.setTextColor(0);

    const body: RowInput[] = hasDetailedData
      ? rows.map((r) =>
          r.sub
            ? [
                {
                  content: r.label,
                  styles: {
                    cellPadding: { top: 3, bottom: 3, left: 36, right: 6 },
                    textColor: MUTED,
                    fontSize: 8,
                  },
                },
                {
                  content: rwf(r.amount),
                  styles: { halign: "right", textColor: MUTED, fontSize: 8 },
                },
              ]
            : [
                {
                  content: r.label,
                  styles: { cellPadding: { top: 5, bottom: 5, left: 20, right: 6 } },
                },
                { content: rwf(r.amount), styles: { halign: "right", fontStyle: "bold" } },
              ],
        )
      : [
          [
            {
              content: "No detailed breakdown available",
              colSpan: 2,
              styles: { textColor: MUTED, fontStyle: "italic" },
            },
          ],
        ];

    autoTable(doc, {
      startY: y + 10,
      margin: { left: marginX, right: marginX },
      body,
      foot: [
        [
          { content: totalLabel, styles: { halign: "left" } },
          { content: rwf(total), styles: { halign: "right" } },
        ],
      ],
      showFoot: "lastPage",
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 5, lineColor: LINE, lineWidth: 0 },
      footStyles: {
        fillColor: SECTION_BG,
        textColor: 0,
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 6,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 170, halign: "right" },
      },
      didParseCell: (data) => {
        // Thin divider under each body row
        if (data.section === "body") {
          data.cell.styles.lineWidth = { bottom: 0.4 } as never;
        }
      },
    });

    y = lastY(doc) + 24;
  };

  renderBreakdown(
    "Assets Breakdown",
    GREEN_DARK,
    companies.map((c) => ({ label: c.companyName, amount: Math.abs(c.totalAssets) })),
    "Total Assets",
    displayTotalAssets,
  );

  renderBreakdown(
    "Liabilities Breakdown",
    RED_DARK,
    companies.map((c) => ({ label: c.companyName, amount: c.totalLiabilities })),
    "Total Liabilities",
    summary.totalLiabilities,
  );

  const equityRows: Row[] = [];
  companies.forEach((c) => {
    equityRows.push({ label: c.companyName, amount: c.totalEquity });
    if (c.retainedEarnings !== undefined && c.retainedEarnings !== 0) {
      equityRows.push({
        label: "Retained Earnings",
        amount: c.retainedEarnings,
        sub: true,
      });
    }
  });

  renderBreakdown("Equity Breakdown", BLUE_DARK, equityRows, "Total Equity", summary.totalEquity);

  // ───────────── Total Liabilities & Equity (grand total bar) ─────────────
  y = ensureSpace(y, 50);
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    body: [
      [
        { content: "Total Liabilities & Equity", styles: { halign: "left" } },
        { content: rwf(totalLiabAndEquity), styles: { halign: "right" } },
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 11,
      fontStyle: "bold",
      cellPadding: 10,
      fillColor: BLUE,
      textColor: 255,
    },
    columnStyles: { 1: { cellWidth: 200 } },
  });

  // ───────────── Page numbers ─────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 20, {
      align: "center",
    });
  }

  doc.save(`consolidated-balance-sheet-${fileDate}.pdf`);
}
