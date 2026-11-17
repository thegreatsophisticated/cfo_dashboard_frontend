import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface IncomeSummary {
  totalCompanies: number;
  totalRevenue: number;
  totalCostOfSales: number;
  totalGrossProfit: number;
  totalOperatingExpenses: number;
  totalNetProfit: number;
  averageProfitMargin: string;
}

export interface IncomeCompany {
  companyName: string;
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  profitMargin: string;
}

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US");
const rwf = (n: number) => `RWF ${fmt(n)}`;

export function exportIncomeStatementPDF(
  year: number,
  summary: IncomeSummary,
  companies: IncomeCompany[] = [],
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IREBE GROUP", marginX, 50);

  doc.setFontSize(13);
  doc.text("Consolidated Income Statement", marginX, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Year ended Dec 31, ${year}  |  ${summary.totalCompanies} ${
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
      ["Total Revenue", rwf(summary.totalRevenue)],
      ["Cost of Sales", rwf(summary.totalCostOfSales)],
      ["Gross Profit", rwf(summary.totalGrossProfit)],
      ["Operating Expenses", rwf(summary.totalOperatingExpenses)],
      [
        `Net Group Profit (${summary.averageProfitMargin})`,
        rwf(summary.totalNetProfit),
      ],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [30, 64, 175] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 4) {
        data.cell.styles.fillColor = [220, 252, 231];
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
          "Revenue",
          "Cost of Sales",
          "Gross Profit",
          "Op. Expenses",
          "Net Profit",
          "Margin",
        ],
      ],
      body: companies.map((c) => [
        c.companyName,
        fmt(c.revenue),
        fmt(c.costOfSales),
        fmt(c.grossProfit),
        fmt(c.operatingExpenses),
        fmt(c.netProfit),
        c.profitMargin,
      ]),
      foot: [
        [
          "Total",
          fmt(summary.totalRevenue),
          fmt(summary.totalCostOfSales),
          fmt(summary.totalGrossProfit),
          fmt(summary.totalOperatingExpenses),
          fmt(summary.totalNetProfit),
          summary.averageProfitMargin,
        ],
      ],
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 5 },
      headStyles: { fillColor: [30, 64, 175] },
      footStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: "bold" },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
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

  doc.save(`consolidated-income-statement-${year}.pdf`);
}
