import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import { format, parseISO } from "date-fns";

export interface CashFlowSummary {
  totalCashIn: number;
  totalCashOut: number;
  netCashFlow: number;
}

export interface CashFlowCompany {
  companyId: string | number;
  companyName: string;
  transactionCount: number;
  totalCashIn: number;
  totalCashOut: number;
  netCashFlow: number;
}

export interface CashFlowStatementLine {
  id: number;
  date: string;
  description: string;
  counterparty?: string | null;
  referenceNumber?: string | null;
  category?: string;
  companyName?: string;
  amount: number;
}

export interface CashFlowStatement {
  cashIn: CashFlowStatementLine[];
  cashOut: CashFlowStatementLine[];
}

type RGB = [number, number, number];

const GREEN: RGB = [22, 163, 74];
const RED: RGB = [220, 38, 38];
const BLUE: RGB = [30, 64, 175];
const MUTED: RGB = [100, 116, 139];
const LIGHT_BG: RGB = [241, 245, 249];
const SECTION_BG: RGB = [226, 232, 240];

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US");
const rwf = (n: number) => `RWF ${fmt(n)}`;
const signed = (n: number) => `${n >= 0 ? "+" : ""}${rwf(n)}`;
const signedNum = (n: number) => `${n >= 0 ? "+" : ""}${fmt(n)}`;
const flowColor = (n: number): RGB => (n >= 0 ? GREEN : RED);

const dateLabel = (d: Date) => format(d, "dd MMM yyyy");

const fileDate = (d: Date) => format(d, "yyyy-MM-dd");

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } };
const lastY = (doc: jsPDF) => (doc as DocWithTable).lastAutoTable?.finalY ?? 0;

export function exportCashFlowPDF(
  startDate: Date,
  endDate: Date,
  summary: CashFlowSummary,
  companies: CashFlowCompany[] = [],
  statement?: CashFlowStatement,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 40;

  const periodRange = `${dateLabel(startDate)} - ${dateLabel(endDate)}`;
  const totalTransactions = companies.reduce((s, c) => s + c.transactionCount, 0);
  const totalAbsoluteFlow = companies.reduce((s, c) => s + Math.abs(c.netCashFlow), 0);
  const avgOf = (inflow: number, outflow: number, count: number) =>
    count > 0 ? (inflow + outflow) / count : 0;

  const byFlow = [...companies].sort(
    (a, b) => Math.abs(b.netCashFlow) - Math.abs(a.netCashFlow),
  );
  const byVolume = [...companies].sort(
    (a, b) => b.transactionCount - a.transactionCount,
  );

  // Starts a new page if the next block would not fit
  const ensureSpace = (y: number, needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      return 50;
    }
    return y;
  };

  const sectionTitle = (text: string, x: number, y: number, sub?: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(text, x, y);
    if (sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(sub, x, y + 11);
      doc.setTextColor(0);
    }
  };

  // ───────────── Header ─────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IREBE GROUP", marginX, 50);

  doc.setFontSize(13);
  doc.text("Global Cash Book", marginX, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `${periodRange}  |  ${companies.length} ${
      companies.length === 1 ? "Company" : "Companies"
    }`,
    marginX,
    90,
  );
  doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, pageWidth - marginX, 50, {
    align: "right",
  });
  doc.setTextColor(0);

  // ───────────── Summary cards (Cash In / Cash Out / Net Flow) ─────────────
  const cardY = 106;
  const cardH = 54;
  const cardGap = 12;
  const cardW = (contentWidth - cardGap * 2) / 3;

  const drawCard = (
    index: number,
    label: string,
    value: string,
    color: RGB,
  ) => {
    const x = marginX + index * (cardW + cardGap);
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(x, cardY, cardW, cardH, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x + 12, cardY + 18);
    doc.setFontSize(15);
    doc.setTextColor(...color);
    doc.text(value, x + 12, cardY + 40);
    doc.setTextColor(0);
  };

  drawCard(0, "Cash In", rwf(summary.totalCashIn), GREEN);
  drawCard(1, "Cash Out", rwf(summary.totalCashOut), RED);
  drawCard(2, "Net Flow", signed(summary.netCashFlow), flowColor(summary.netCashFlow));

  let y = cardY + cardH + 28;

  // ───────────── Company Performance ─────────────
  if (companies.length > 0) {
    y = ensureSpace(y, 80);
    sectionTitle("Company Performance", marginX, y);

    autoTable(doc, {
      startY: y + 8,
      margin: { left: marginX, right: marginX },
      head: [
        ["Company", "Transactions", "Cash In", "Cash Out", "Net Flow", "Avg/Trans"],
      ],
      body: byFlow.map((c) => [
        c.companyName,
        String(c.transactionCount),
        fmt(c.totalCashIn),
        fmt(c.totalCashOut),
        signedNum(c.netCashFlow),
        fmt(avgOf(c.totalCashIn, c.totalCashOut, c.transactionCount)),
      ]),
      foot: [
        [
          "Total",
          String(totalTransactions),
          fmt(summary.totalCashIn),
          fmt(summary.totalCashOut),
          signedNum(summary.netCashFlow),
          fmt(avgOf(summary.totalCashIn, summary.totalCashOut, totalTransactions)),
        ],
      ],
      showFoot: "lastPage",
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: BLUE },
      footStyles: { fillColor: SECTION_BG, textColor: 0, fontStyle: "bold" },
      columnStyles: {
        1: { halign: "right", textColor: MUTED },
        2: { halign: "right", textColor: GREEN },
        3: { halign: "right", textColor: RED },
        4: { halign: "right", fontStyle: "bold" },
        5: { halign: "right", textColor: MUTED },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 4) {
          data.cell.styles.textColor = flowColor(byFlow[data.row.index].netCashFlow);
        }
        if (data.section === "foot" && data.column.index === 4) {
          data.cell.styles.textColor = flowColor(summary.netCashFlow);
        }
        if (data.section === "foot" && data.column.index === 2) {
          data.cell.styles.textColor = GREEN;
        }
        if (data.section === "foot" && data.column.index === 3) {
          data.cell.styles.textColor = RED;
        }
        if (data.section === "head" && data.column.index > 0) {
          data.cell.styles.halign = "right";
        }
        if (data.section === "foot" && data.column.index > 0) {
          data.cell.styles.halign = "right";
        }
      },
    });

    y = lastY(doc) + 26;

    // ───────────── Contribution + Activity (side by side) ─────────────
    const gap = 16;
    const colW = (contentWidth - gap) / 2;
    const sideBySide = companies.length <= 10;
    const needed = 50 + (companies.length + 1) * 20;

    const contributionTable = (startY: number, left: number, right: number) =>
      autoTable(doc, {
        startY,
        margin: { left, right },
        head: [["Company", "Net Flow", "% of Total"]],
        body: byFlow.map((c) => [
          c.companyName,
          signedNum(c.netCashFlow),
          `${
            totalAbsoluteFlow > 0
              ? ((Math.abs(c.netCashFlow) / totalAbsoluteFlow) * 100).toFixed(1)
              : "0.0"
          }%`,
        ]),
        theme: "striped",
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: BLUE },
        columnStyles: {
          1: { halign: "right", fontStyle: "bold" },
          2: { halign: "right", fontStyle: "bold" },
        },
        didParseCell: (data) => {
          if (data.section === "head" && data.column.index > 0) {
            data.cell.styles.halign = "right";
          }
          if (data.section === "body" && data.column.index === 1) {
            data.cell.styles.textColor = flowColor(byFlow[data.row.index].netCashFlow);
          }
        },
      });

    const activityTable = (startY: number, left: number, right: number) =>
      autoTable(doc, {
        startY,
        margin: { left, right },
        head: [["Company", "Transactions", "Avg/Trans"]],
        body: byVolume.map((c) => [
          c.companyName,
          `${c.transactionCount} trans`,
          fmt(avgOf(c.totalCashIn, c.totalCashOut, c.transactionCount)),
        ]),
        theme: "striped",
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: BLUE },
        columnStyles: {
          1: { halign: "right", textColor: MUTED },
          2: { halign: "right", fontStyle: "bold" },
        },
        didParseCell: (data) => {
          if (data.section === "head" && data.column.index > 0) {
            data.cell.styles.halign = "right";
          }
        },
      });

    if (sideBySide) {
      y = ensureSpace(y, needed);
      sectionTitle("Cash Flow Contribution", marginX, y, "% of total cash movement");
      sectionTitle("Transaction Activity", marginX + colW + gap, y, "Sorted by volume");

      contributionTable(y + 20, marginX, pageWidth - marginX - colW);
      const leftEnd = lastY(doc);
      activityTable(y + 20, marginX + colW + gap, marginX);
      y = Math.max(leftEnd, lastY(doc)) + 26;
    } else {
      // Too many companies to sit side by side — stack them full width
      y = ensureSpace(y, 80);
      sectionTitle("Cash Flow Contribution", marginX, y, "% of total cash movement");
      contributionTable(y + 20, marginX, marginX);
      y = lastY(doc) + 26;

      y = ensureSpace(y, 80);
      sectionTitle("Transaction Activity", marginX, y, "Sorted by volume");
      activityTable(y + 20, marginX, marginX);
      y = lastY(doc) + 26;
    }
  }

  // ───────────── Consolidated Cash Flow Statement ─────────────
  y = ensureSpace(y, 120);
  sectionTitle("Consolidated Cash Flow Statement", marginX, y, `For the period ${periodRange}`);
  y += 22;

  const renderStatementSection = (
    title: string,
    totalLabel: string,
    lines: CashFlowStatementLine[] | undefined,
    total: number,
    tone: RGB,
  ) => {
    const countLabel = lines
      ? `${lines.length} ${lines.length === 1 ? "transaction" : "transactions"}`
      : "";

    const body: RowInput[] = lines
      ? lines.length > 0
        ? lines.map((l) => [
            format(parseISO(l.date), "dd MMM yyyy"),
            l.description,
            [l.companyName, l.counterparty, l.referenceNumber]
              .filter(Boolean)
              .join(" | "),
            fmt(l.amount),
          ])
        : [
            [
              {
                content: "No transactions in this period",
                colSpan: 4,
                styles: { textColor: MUTED, fontStyle: "italic" },
              },
            ],
          ]
      : [];

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [
        [
          {
            content: title,
            colSpan: 3,
            styles: { halign: "left", fillColor: SECTION_BG, textColor: BLUE },
          },
          {
            content: countLabel,
            styles: {
              halign: "right",
              fillColor: SECTION_BG,
              textColor: MUTED,
              fontStyle: "normal",
              fontSize: 8,
            },
          },
        ],
        ...(lines && lines.length > 0
          ? [["Date", "Description", "Details", "Amount"]]
          : []),
      ],
      body,
      foot: [
        [
          { content: totalLabel, colSpan: 3 },
          { content: rwf(total), styles: { halign: "right", textColor: tone } },
        ],
      ],
      showFoot: "lastPage",
      theme: "plain",
      styles: { fontSize: 8.5, cellPadding: 4, lineColor: [226, 232, 240], lineWidth: 0 },
      headStyles: { fontStyle: "bold", textColor: MUTED, fillColor: [255, 255, 255] },
      footStyles: {
        fillColor: LIGHT_BG,
        textColor: 0,
        fontStyle: "bold",
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 70, textColor: MUTED },
        1: { cellWidth: "auto" },
        2: { cellWidth: 260, textColor: MUTED, fontSize: 8 },
        3: { cellWidth: 100, halign: "right", fontStyle: "bold", textColor: tone },
      },
      didParseCell: (data) => {
        // Right-align the "Amount" column label in the column-title row
        if (data.section === "head" && data.row.index === 1 && data.column.index === 3) {
          data.cell.styles.halign = "right";
        }
        // Thin divider under body rows
        if (data.section === "body") {
          data.cell.styles.lineWidth = { bottom: 0.4 };
        }
      },
    });

    y = lastY(doc) + 14;
  };

  renderStatementSection(
    "Cash Inflows",
    "Total Cash Inflows",
    statement?.cashIn,
    summary.totalCashIn,
    GREEN,
  );
  y = ensureSpace(y, 80);
  renderStatementSection(
    "Cash Outflows",
    "Total Cash Outflows",
    statement?.cashOut,
    summary.totalCashOut,
    RED,
  );

  // Net Cash Flow (grand total bar)
  y = ensureSpace(y, 50);
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    body: [
      [
        {
          content: `Net Cash Flow\n${periodRange}`,
          styles: { halign: "left" },
        },
        { content: signed(summary.netCashFlow), styles: { halign: "right" } },
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 12,
      fontStyle: "bold",
      cellPadding: 10,
      fillColor: BLUE,
      textColor: 255,
    },
    columnStyles: { 1: { cellWidth: 220 } },
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

  doc.save(`cash-flow-analysis-${fileDate(startDate)}_to_${fileDate(endDate)}.pdf`);
}
