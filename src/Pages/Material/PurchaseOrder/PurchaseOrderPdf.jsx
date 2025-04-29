import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { useEffect } from "react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const generatePDF = (formData, companyProfile, heading, NumberKey) => {
  console.log(formData, "frrrr");
  const docNumberFieldMap = {
    PO: "poNumber",
    GRN: "grnNumber",
    GSN: "gsnNumber",
  };
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;
  const contentWidth = pageWidth - 2 * margin;

  // Set black color for headers (changed from green)
  const headerColor = [169, 169, 169]; // RGB for black color

  // Draw border around entire page (changed to black)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

  // Company logo and header (text color changed to black)
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);

  // Company address
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${companyProfile?.name || "N/A"}`, margin + 15, margin + 25);
  doc.text(
    `${companyProfile?.city || "N/A"}, ${companyProfile?.state || "N/A"}, ${
      companyProfile?.pin || "N/A"
    }`,
    margin + 15,
    margin + 30
  );
  doc.text(
    `GSTIN: ${companyProfile?.gstin || "N/A"} `,
    margin + 15,
    margin + 35
  );
  doc.text(
    `Phone: ${companyProfile?.phone || "N/A"}`,
    margin + 15,
    margin + 40
  );
  doc.text(
    `Email: ${companyProfile?.email || "N/A"}`,
    margin + 15,
    margin + 45
  );

  // Title (changed to black)
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${heading}`, pageWidth / 2, margin + 15, { align: "center" });

  // PO Details
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`DATE`, pageWidth - margin - 60, margin + 25);
  doc.text(`${NumberKey} #`, pageWidth - margin - 60, margin + 30);
  const docNumberKey = docNumberFieldMap[NumberKey];

  doc.text(`${formatDate(formData.date)}`, pageWidth - margin - 35, margin + 25);
  doc.text(`${formData[docNumberKey]}`, pageWidth - margin - 35, margin + 30);

  // Vendor Section Header (changed to black)
  const vendorY = margin + 55;
  doc.setFillColor(...headerColor);
  doc.rect(margin, vendorY, contentWidth / 2 - 5, 8, "F");
  doc.setTextColor(255, 255, 255); // Keep white text for contrast on black background
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("VENDOR", margin + 5, vendorY + 5.5);

  // Ship To Section Header (changed to black)
  doc.setFillColor(...headerColor);
  doc.rect(margin + contentWidth / 2, vendorY, contentWidth / 2, 8, "F");
  doc.setTextColor(255, 255, 255); // Keep white text for contrast on black background
  doc.text("SHIP TO", margin + contentWidth / 2 + 5, vendorY + 5.5);

  // Vendor Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  doc.text(
    `${formData?.party?.companyName || "N/A"}`,
    margin + 5,
    vendorY + 15
  );
  doc.text(`${formData?.party?.address || "N/A"}`, margin + 5, vendorY + 20);
  doc.text(
    `${formData?.party?.city || "N/A"}, ${formData?.party?.state || "N/A"}, ${
      formData?.party?.pin || "N/A"
    }`,
    margin + 5,
    vendorY + 25
  );
  doc.text("GSTIN: GSTIN Number", margin + 5, vendorY + 30);
  doc.text(
    `Phone: ${formData?.party?.mobile || "N/A"}`,
    margin + 5,
    vendorY + 35
  );

  // Ship To Details
  doc.text(
    `${formData?.partyLocation?.locationName || "N/A"}`,
    margin + contentWidth / 2 + 5,
    vendorY + 15
  );

  // Additional Order Details
  const orderDetailsY = vendorY + 23;

  // Item table headers (changed to black)
  const tableY = orderDetailsY + 15;
  doc.setFillColor(...headerColor);

  // Calculate column widths to fit within page width
  const itemColWidth = contentWidth * 0.15;
  const descColWidth = contentWidth * 0.35;
  const qtyColWidth = contentWidth * 0.1;
  const priceColWidth = contentWidth * 0.15;
  const taxColWidth = contentWidth * 0.1;
  const totalColWidth = contentWidth * 0.15;

  const startX = margin;

  // Draw table headers
  doc.rect(startX, tableY, itemColWidth, 8, "F");
  doc.rect(startX + itemColWidth, tableY, descColWidth, 8, "F");
  doc.rect(startX + itemColWidth + descColWidth, tableY, qtyColWidth, 8, "F");
  doc.rect(
    startX + itemColWidth + descColWidth + qtyColWidth,
    tableY,
    priceColWidth,
    8,
    "F"
  );
  doc.rect(
    startX + itemColWidth + descColWidth + qtyColWidth + priceColWidth,
    tableY,
    taxColWidth,
    8,
    "F"
  );
  doc.rect(
    startX +
      itemColWidth +
      descColWidth +
      qtyColWidth +
      priceColWidth +
      taxColWidth,
    tableY,
    totalColWidth,
    8,
    "F"
  );

  doc.setTextColor(255, 255, 255); // Keep white text for contrast on black background
  doc.text("ITEM #", startX + 5, tableY + 5.5);
  doc.text("DESCRIPTION", startX + itemColWidth + 5, tableY + 5.5);
  doc.text("QTY", startX + itemColWidth + descColWidth + 5, tableY + 5.5);
  doc.text(
    "UNIT PRICE",
    startX + itemColWidth + descColWidth + qtyColWidth + 5,
    tableY + 5.5
  );
  doc.text(
    "GST ",
    startX + itemColWidth + descColWidth + qtyColWidth + priceColWidth + 5,
    tableY + 5.5
  );
  doc.text(
    "TOTAL",
    startX +
      itemColWidth +
      descColWidth +
      qtyColWidth +
      priceColWidth +
      taxColWidth +
      5,
    tableY + 5.5
  );

  // Item rows
  let currentY = tableY + 8;
  const rowHeight = 8;

  // Draw table grid for item rows (changed to black)
  for (let i = 0; i < 15; i++) {
    doc.setDrawColor(0, 0, 0);
    doc.line(startX, currentY, margin + contentWidth, currentY);

    // Vertical lines
    doc.line(startX, currentY, startX, currentY + rowHeight);
    doc.line(
      startX + itemColWidth,
      currentY,
      startX + itemColWidth,
      currentY + rowHeight
    );
    doc.line(
      startX + itemColWidth + descColWidth,
      currentY,
      startX + itemColWidth + descColWidth,
      currentY + rowHeight
    );
    doc.line(
      startX + itemColWidth + descColWidth + qtyColWidth,
      currentY,
      startX + itemColWidth + descColWidth + qtyColWidth,
      currentY + rowHeight
    );
    doc.line(
      startX + itemColWidth + descColWidth + qtyColWidth + priceColWidth,
      currentY,
      startX + itemColWidth + descColWidth + qtyColWidth + priceColWidth,
      currentY + rowHeight
    );
    doc.line(
      startX +
        itemColWidth +
        descColWidth +
        qtyColWidth +
        priceColWidth +
        taxColWidth,
      currentY,
      startX +
        itemColWidth +
        descColWidth +
        qtyColWidth +
        priceColWidth +
        taxColWidth,
      currentY + rowHeight
    );
    doc.line(
      margin + contentWidth,
      currentY,
      margin + contentWidth,
      currentY + rowHeight
    );

    currentY += rowHeight;
  }
  doc.line(startX, currentY, margin + contentWidth, currentY); // Bottom line of the table

  // Add items data
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  currentY = tableY + 8;
  formData.items.forEach((item, index) => {
    if (index < 15) {
      // Only show first 15 items
      const itemY = tableY + 8 + index * rowHeight + 5;

      // Item # (using index for demo, replace with actual item number)
      const itemNumber = item.itemId?.substring(0, 10) || `${index + 1}`;
      doc.text(itemNumber, startX + 5, itemY);

      // Description
      const description = item.description || "Product";
      doc.text(description, startX + itemColWidth + 5, itemY, {
        maxWidth: descColWidth - 10,
      });

      // Quantity - center aligned
      const qtyTextWidth =
        (doc.getStringUnitWidth(item.quantity.toString()) *
          doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const qtyXPos =
        startX +
        itemColWidth +
        descColWidth +
        qtyColWidth / 2 -
        qtyTextWidth / 2;
      doc.text(item.quantity.toString(), qtyXPos, itemY);

      // Unit Price - right aligned
      const unitPrice = item.unitPrice.toString();
      doc.text(
        unitPrice,
        startX + itemColWidth + descColWidth + qtyColWidth + priceColWidth - 5,
        itemY,
        { align: "right" }
      );

      // Calculate item total with tax
      const taxRate = item.taxRate || 7;

      const itemTotal = item.quantity * item.unitPrice;
      const taxAmount = itemTotal * (taxRate / 100);
      const totalWithTax = itemTotal + taxAmount;

      // Tax % - right aligned
      doc.text(
        `${taxAmount.toFixed(2)}`,
        startX +
          itemColWidth +
          descColWidth +
          qtyColWidth +
          priceColWidth +
          taxColWidth -
          5,
        itemY,
        { align: "right" }
      );

      // Total - right aligned
      doc.text(
        totalWithTax.toFixed(2),
        startX +
          itemColWidth +
          descColWidth +
          qtyColWidth +
          priceColWidth +
          taxColWidth +
          totalColWidth -
          5,
        itemY,
        { align: "right" }
      );
    }
  });

  // Calculate totals row position
  const totalsY = tableY + 8 + 15 * rowHeight + 10;

  // Totals section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("SUBTOTAL", pageWidth - margin - 80, totalsY);
  doc.text("TAX", pageWidth - margin - 80, totalsY + 5);

  // Highlight total row (changed from gold to black)
  doc.setFillColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.text("TOTAL", pageWidth - margin - 80, totalsY + 15);

  // Add amounts - right aligned
  doc.setFont("helvetica", "normal");
  doc.text(formData.subtotal.toFixed(2), pageWidth - margin - 5, totalsY, {
    align: "right",
  });

  // Calculate total tax
  const totalTax = formData.tax ? formData.tax.toFixed(2) : "0.00";
  doc.text(totalTax, pageWidth - margin - 5, totalsY + 5, { align: "right" });

  // Total amount
  doc.setFont("helvetica", "bold");
  doc.text(
    `${formData.total.toFixed(2)}`,
    pageWidth - margin - 5,
    totalsY + 15,
    { align: "right" }
  );

  // Footer
  const footerY = pageHeight - margin - 10;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business", pageWidth / 2, footerY, {
    align: "center",
  });

  // Save the PDF
  doc.save(`${NumberKey}-${formData[docNumberKey]}.pdf`);
};
