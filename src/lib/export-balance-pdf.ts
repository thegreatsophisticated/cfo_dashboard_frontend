import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US");
const rwf = (n: number) => `RWF ${fmt(n)}`;

export function exportBalanceSheetPDF(
  asAtDate: Date,
  summary: BalanceSummary,
  companies: BalanceCompany[] = [],
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;

  const dateLabel = asAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const fileDate = [
    asAtDate.getFullYear(),
    String(asAtDate.getMonth() + 1).padStart(2, "0"),
    String(asAtDate.getDate()).padStart(2, "0"),
  ].join("-");

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IREBE GROUP", marginX, 50);

  doc.setFontSize(13);
  doc.text("Consolidated Balance Sheet", marginX, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `As at ${dateLabel}  |  ${summary.totalCompanies} ${
      summary.totalCompanies === 1 ? "company" : "companies"
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

  // Group summary
  autoTable(doc, {
    startY: 110,
    margin: { left: marginX, right: marginX },
    head: [["Group Summary", "Amount"]],
    body: [
      ["Total Assets", rwf(summary.totalAssets)],
      ["Total Liabilities", rwf(summary.totalLiabilities)],
      ["Total Equity", rwf(summary.totalEquity)],
      [
        "Total Liabilities & Equity",
        rwf(summary.totalLiabilities + summary.totalEquity),
      ],
      ["Balance Check", summary.balanceCheck],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [30, 64, 175] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 3) {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = "bold";
      }
      if (data.section === "body" && data.row.index === 4) {
        const balanced = summary.balanceCheck === "BALANCED";
        data.cell.styles.fillColor = balanced ? [220, 252, 231] : [254, 243, 199];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Company breakdown
  if (companies.length > 0) {
    const afterSummaryY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Company Breakdown", marginX, afterSummaryY);

    autoTable(doc, {
      startY: afterSummaryY + 8,
      margin: { left: marginX, right: marginX },
      head: [
        [
          "Company",
          "Total Assets",
          "Total Liabilities",
          "Total Equity",
          "Retained Earnings",
        ],
      ],
      body: companies.map((c) => [
        c.companyName,
        fmt(c.totalAssets),
        fmt(c.totalLiabilities),
        fmt(c.totalEquity),
        c.retainedEarnings ? fmt(c.retainedEarnings) : "-",
      ]),
      foot: [
        [
          "Total",
          fmt(summary.totalAssets),
          fmt(summary.totalLiabilities),
          fmt(summary.totalEquity),
          "",
        ],
      ],
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [30, 64, 175] },
      footStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: "bold" },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
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

  doc.save(`consolidated-balance-sheet-${fileDate}.pdf`);
}
