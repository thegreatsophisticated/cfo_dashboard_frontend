import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US");
const rwf = (n: number) => `RWF ${fmt(n)}`;
const signed = (n: number) => `${n >= 0 ? "+" : ""}${rwf(n)}`;

const dateLabel = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

const fileDate = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

export function exportCashFlowPDF(
  startDate: Date,
  endDate: Date,
  summary: CashFlowSummary,
  companies: CashFlowCompany[] = [],
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;

  const totalTransactions = companies.reduce((s, c) => s + c.transactionCount, 0);
  const totalAbsoluteFlow = companies.reduce((s, c) => s + Math.abs(c.netCashFlow), 0);
  const avgOf = (inflow: number, outflow: number, count: number) =>
    count > 0 ? (inflow + outflow) / count : 0;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IREBE GROUP", marginX, 50);

  doc.setFontSize(13);
  doc.text("Global Cash Book / Cash Flow Analysis", marginX, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `${dateLabel(startDate)} - ${dateLabel(endDate)}  |  ${companies.length} ${
      companies.length === 1 ? "company" : "companies"
    }`,
    marginX,
    90,
  );
  doc.text(
    `Generated: ${new Date().toLocaleString("en-US")}`,
    pageWidth - marginX,
    50,
    { align: "right" },
  );
  doc.setTextColor(0);

  // Consolidated summary
  autoTable(doc, {
    startY: 110,
    margin: { left: marginX, right: marginX },
    head: [["Consolidated Cash Flow Statement", "Amount"]],
    body: [
      ["Total Cash Inflows", rwf(summary.totalCashIn)],
      ["Total Cash Outflows", rwf(summary.totalCashOut)],
      ["Net Cash Flow", signed(summary.netCashFlow)],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [30, 64, 175] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      if (data.row.index === 0 && data.column.index === 1) {
        data.cell.styles.textColor = [22, 163, 74];
      }
      if (data.row.index === 1 && data.column.index === 1) {
        data.cell.styles.textColor = [220, 38, 38];
      }
      if (data.row.index === 2) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor =
          summary.netCashFlow >= 0 ? [220, 252, 231] : [254, 226, 226];
      }
    },
  });

  // Company performance
  if (companies.length > 0) {
    const sorted = [...companies].sort(
      (a, b) => Math.abs(b.netCashFlow) - Math.abs(a.netCashFlow),
    );

    const startY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Company Performance", marginX, startY);

    autoTable(doc, {
      startY: startY + 8,
      margin: { left: marginX, right: marginX },
      head: [
        [
          "Company",
          "Transactions",
          "Cash In",
          "Cash Out",
          "Net Flow",
          "Avg/Trans",
          "Contribution",
        ],
      ],
      body: sorted.map((c) => [
        c.companyName,
        String(c.transactionCount),
        fmt(c.totalCashIn),
        fmt(c.totalCashOut),
        `${c.netCashFlow >= 0 ? "+" : ""}${fmt(c.netCashFlow)}`,
        fmt(avgOf(c.totalCashIn, c.totalCashOut, c.transactionCount)),
        `${
          totalAbsoluteFlow > 0
            ? ((Math.abs(c.netCashFlow) / totalAbsoluteFlow) * 100).toFixed(1)
            : "0.0"
        }%`,
      ]),
      foot: [
        [
          "Total",
          String(totalTransactions),
          fmt(summary.totalCashIn),
          fmt(summary.totalCashOut),
          `${summary.netCashFlow >= 0 ? "+" : ""}${fmt(summary.netCashFlow)}`,
          fmt(avgOf(summary.totalCashIn, summary.totalCashOut, totalTransactions)),
          "100%",
        ],
      ],
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 64, 175] },
      footStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: "bold" },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right", textColor: [22, 163, 74] },
        3: { halign: "right", textColor: [220, 38, 38] },
        4: { halign: "right", fontStyle: "bold" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      didParseCell: (data) => {
        // Color the net flow column by sign (body rows only)
        if (data.section === "body" && data.column.index === 4) {
          const company = sorted[data.row.index];
          data.cell.styles.textColor =
            company.netCashFlow >= 0 ? [22, 163, 74] : [220, 38, 38];
        }
      },
    });
  }

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" },
    );
  }

  doc.save(
    `cash-flow-analysis-${fileDate(startDate)}_to_${fileDate(endDate)}.pdf`,
  );
}
