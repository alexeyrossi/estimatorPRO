import type { EstimateInputs, EstimateResult } from "@/lib/types/estimator";

type GenerateEstimatePdfOptions = {
  clientName: string;
  estimate: EstimateResult;
  inputs: EstimateInputs;
  rawInventoryVolume: number;
};

export async function generateEstimatePdf({
  clientName,
  estimate,
  inputs,
  rawInventoryVolume,
}: GenerateEstimatePdfOptions) {
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF("p", "mm", "a4");
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 16;
  let y = M;

  const addText = (text: string, x: number, size: number, color: [number, number, number], weight = "normal") => {
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont("helvetica", weight);
    pdf.text(text, x, y);
  };

  const drawLine = (y1: number) => {
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.3);
    pdf.line(M, y1, W - M, y1);
  };

  const checkPage = (needed: number) => {
    if (y + needed > H - 40) {
      pdf.addPage();
      y = M;
    }
  };

  addText("MOVING ESTIMATE", M, 22, [30, 30, 30], "bold");
  y += 7;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  addText(today, M, 9, [160, 160, 160]);

  if (clientName) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 30, 30);
    pdf.text(clientName, W - M, y - 7, { align: "right" });
  }

  const homeSizeLabel = inputs.homeSize === "Commercial" ? "Commercial" : inputs.homeSize === "1" ? "1 BDR / Less" : `${inputs.homeSize} BDR`;
  const paramLine = [homeSizeLabel, `${inputs.distance} mi`, inputs.moveType].filter(Boolean).join(" · ");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(160, 160, 160);
  pdf.text(paramLine, W - M, y, { align: "right" });

  y += 4;
  pdf.setDrawColor(30);
  pdf.setLineWidth(0.6);
  pdf.line(M, y, W - M, y);
  y += 10;

  const metrics = [
    { label: inputs.moveType === "LD" ? "SHIPMENT SIZE" : "VOLUME", value: `${(inputs.moveType === "LD" && estimate.billableCF ? estimate.billableCF : estimate.finalVolume || 0).toLocaleString()} cf` },
    { label: "TIME EST.", value: `${estimate.timeMin || 0}\u2013${estimate.timeMax || 0}h` },
    { label: "TRUCKS", value: `${estimate.trucksFinal || 0}` },
    { label: "CREW", value: `${estimate.crew || 0} movers` },
  ];
  const colW = (W - M * 2) / 4;
  metrics.forEach((metric, index) => {
    const x = M + index * colW;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(160, 160, 160);
    pdf.text(metric.label, x, y);
    pdf.setFontSize(18);
    pdf.setTextColor(30, 30, 30);
    pdf.text(metric.value, x, y + 8);
  });
  y += 16;
  drawLine(y);
  y += 8;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(16, 185, 129);
  pdf.text(`${estimate.confidence?.score || 0}%`, M, y);
  pdf.setFontSize(10);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Confidence", M + 18, y);

  if (estimate.heavyItemNames?.length) {
    const heavyText = `HEAVY: ${estimate.heavyItemNames.join(", ")}`;
    const textWidth = pdf.getTextWidth(heavyText);
    const badgeW = textWidth + 10;
    const badgeX = W - M - badgeW;
    const badgeY = y - 4;
    pdf.setFillColor(254, 242, 242);
    pdf.roundedRect(badgeX, badgeY, badgeW, 6, 3, 3, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(220, 50, 50);
    pdf.text(heavyText, badgeX + 5, y);
  }
  y += 6;

  if (estimate.auditSummary?.length) {
    y += 2;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(140, 140, 140);
    estimate.auditSummary.forEach((tip) => {
      checkPage(6);
      pdf.text(tip, M, y);
      y += 5;
    });
  }
  y += 2;
  drawLine(y);
  y += 8;

  if (inputs.moveType === "LD" && estimate.billableCF != null && estimate.billableCF > 0) {
    checkPage(30);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("LONG DISTANCE BREAKDOWN", M, y);
    y += 7;
    const ldData = [
      { label: "Inventory Volume", value: `${rawInventoryVolume.toLocaleString()} cf` },
      { label: "Truck Load", value: `~${(estimate.truckSpaceCF || 0).toLocaleString()} cf` },
      { label: "Est. Weight", value: `${(estimate.weight || 0).toLocaleString()} lbs` },
    ];
    const ldColW = (W - M * 2) / 3;
    ldData.forEach((data, index) => {
      const x = M + index * ldColW;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(160, 160, 160);
      pdf.text(data.label, x, y);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 30);
      pdf.text(data.value, x, y + 6);
    });
    y += 14;
    drawLine(y);
    y += 8;
  } else if (inputs.moveType === "Local") {
    checkPage(10);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(160, 160, 160);
    pdf.text(`Local Service · ${inputs.distance} miles · ${inputs.accessOrigin || "ground"} access`, M, y);
    y += 4;
    drawLine(y);
    y += 8;
  }

  checkPage(20);
  const matData = [
    { label: "Blankets", value: `${estimate.materials?.blankets || 0}` },
    { label: "Boxes", value: `~${estimate.materials?.boxes || 0}` },
    { label: "Wardrobes", value: `${estimate.materials?.wardrobes || 0}` },
  ];
  const matColW = (W - M * 2) / 3;
  matData.forEach((data, index) => {
    const x = M + index * matColW;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(160, 160, 160);
    pdf.text(data.label.toUpperCase(), x, y);
    pdf.setFontSize(16);
    pdf.setTextColor(30, 30, 30);
    pdf.text(data.value, x, y + 7);
  });
  y += 14;
  drawLine(y);
  y += 8;

  if (estimate.parsedItems?.length) {
    checkPage(15);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(160, 160, 160);
    pdf.text(`DETECTED ITEMS (${estimate.detectedQtyTotal || estimate.parsedItems.length})`, M, y);
    y += 6;

    const half = Math.ceil(estimate.parsedItems.length / 2);
    const col1 = estimate.parsedItems.slice(0, half);
    const col2 = estimate.parsedItems.slice(half);
    const tableW = (W - M * 2 - 8) / 2;
    const xLeft = M;
    const xRight = M + tableW + 8;
    const rowCount = Math.max(col1.length, col2.length);

    const drawItem = (item: { qty?: number; name?: string; cf?: number }, xBase: number) => {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 30);
      pdf.text(`x${item.qty}`, xBase, y);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text(item.name || "", xBase + 14, y);
      pdf.setTextColor(140, 140, 140);
      pdf.text(`${item.cf || 0} cf`, xBase + tableW - 2, y, { align: "right" });
    };

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      checkPage(5);
      if (col1[rowIndex]) drawItem(col1[rowIndex], xLeft);
      if (col2[rowIndex]) drawItem(col2[rowIndex], xRight);
      y += 5;
    }

    y += 2;
    drawLine(y);
    y += 8;
  }

  const allNotes = [
    ...(estimate.advice || []),
    ...(estimate.risks || []).filter((risk) => risk.text).map((risk) => risk.text),
  ];

  if (allNotes.length > 0) {
    checkPage(10);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(160, 160, 160);
    pdf.text("NOTES & RECOMMENDATIONS", M, y);
    y += 6;

    allNotes.forEach((note) => {
      if (!note) return;
      checkPage(6);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      const lines = pdf.splitTextToSize(note, W - M * 2);
      lines.forEach((line: string) => {
        pdf.text(line, M, y);
        y += 4.5;
      });
    });
  }

  const pageCount = pdf.getNumberOfPages();
  for (let index = 1; index <= pageCount; index += 1) {
    pdf.setPage(index);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    const pageLabel = `Page ${index} of ${pageCount}`;
    const pageLabelW = pdf.getTextWidth(pageLabel);
    pdf.text(pageLabel, (W / 2) - (pageLabelW / 2), H - 10);

    if (index === pageCount) {
      const stamp = `Generated ${today} | Estimator V11.59 PRO`;
      const stampW = pdf.getTextWidth(stamp);
      pdf.text(stamp, (W / 2) - (stampW / 2), H - 15);
    }
  }

  const filename = clientName
    ? `Estimate_${clientName.replace(/\s+/g, "_")}.pdf`
    : "Moving_Estimate.pdf";
  pdf.save(filename);
}
