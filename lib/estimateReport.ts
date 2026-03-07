import type { EstimateInputs, EstimateResult } from "@/lib/types/estimator";

export function formatEstimateReportText(inputs: EstimateInputs, estimate: EstimateResult) {
  const isLabor = inputs.moveType === "Labor";
  const truckText = isLabor ? "N/A" : `${estimate.trucksFinal} x ${estimate.truckSizeLabel}`;
  const splitText = estimate.splitRecommended ? "(SPLIT TO 2 DAYS)" : "";
  const materials = [];

  if (estimate.materials?.blankets) materials.push(`${estimate.materials.blankets} blankets`);
  if (estimate.materials?.wardrobes) materials.push(`${estimate.materials.wardrobes} wardrobes`);
  if (estimate.materials?.boxes) materials.push(`~${estimate.materials.boxes} boxes`);

  const packingLine = `PACKING: ${materials.join(", ")}${estimate.smartEquipment?.length > 0 ? `, ${estimate.smartEquipment.join(", ")}` : ""}`;
  const ddtStr = estimate.isDDT ? "(DDT)" : "";
  const packStr = inputs.packingLevel === "None" ? "No packing" : `${inputs.packingLevel} packing`;
  const heavyStr = estimate.heavyItemNames?.length > 0 ? `\nHeavy items: ${estimate.heavyItemNames.join(", ")}` : "";
  const volText = estimate.billableCF
    ? `${estimate.billableCF} cf (billable) / ~${estimate.truckSpaceCF} cf (truck space)`
    : `${estimate.finalVolume} cf`;
  const stopsStr = (inputs.extraStops || []).length > 0
    ? ` -> ${inputs.extraStops.map((stop, index) => `Stop ${index + 1}: ${stop.access}${stop.label ? ` [${stop.label}]` : ""}`).join(" -> ")}`
    : "";
  const accessText = `${inputs.accessOrigin} (Origin)${stopsStr} -> ${inputs.accessDest} (Dest)`;

  return `${estimate.homeLabel} / ${inputs.moveType} Move / ${isLabor ? "N/A" : `${inputs.distance} miles`} ${ddtStr} / ${packStr}${heavyStr}
🚚 Trucks: ${truckText}
👥 Crew: ${estimate.crew} Movers
⏱ Time: ${estimate.timeMin} - ${estimate.timeMax} Hours ${splitText}
📦 Volume: ${volText}

${packingLine}

🛡 NOTES & RISKS
${estimate.risks?.length > 0 ? estimate.risks.map((risk) => `-${risk.text}`).join("\n") : "-Standard residential move."}
-Access: ${accessText}
${estimate.daMins > 0 ? `-Assembly: ~${estimate.daMins} min total` : ""}
-Confidence: ${estimate.confidence?.label} (${estimate.confidence?.score}%)`;
}

export async function copyEstimateReportText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
