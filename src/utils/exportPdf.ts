import jsPDF from 'jspdf';
import { AnalysisResult } from '../types/roi';

export function exportBlueprintPdf(analysis: AnalysisResult, fileNamePrefix = 'LifeROI_30Day_Blueprint'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkBg: [number, number, number] = [15, 23, 42]; // Slate 900
  const emeraldAccent: [number, number, number] = [16, 185, 129]; // Emerald 500
  const emeraldLight: [number, number, number] = [236, 253, 245];
  const textDark: [number, number, number] = [30, 41, 59];
  const textMuted: [number, number, number] = [100, 116, 139];
  const borderGray: [number, number, number] = [226, 232, 240];

  let y = margin;

  // --- HEADER BANNER ---
  doc.setFillColor(...darkBg);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  // Brand Tag
  doc.setTextColor(...emeraldAccent);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('LIFEROI™ AUTONOMOUS TELEMETRY ENGINE', margin + 8, y + 9);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('30-DAY BEHAVIORAL WEALTH BLUEPRINT', margin + 8, y + 18);

  // Metadata subtext
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(
    `Doc ID: LR-${Date.now().toString().slice(-6)} | Methodology: 12% Annuity Decay Model | Date: ${nowStr}`,
    margin + 8,
    y + 25
  );

  // Discipline Score Stamp (Top Right)
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 38, y + 5, 30, 22, 2, 2, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('DISCIPLINE INDEX', pageWidth - margin - 36, y + 11);
  doc.setTextColor(...emeraldAccent);
  doc.setFontSize(14);
  doc.text(`${analysis.score}/100`, pageWidth - margin - 33, y + 21);

  y += 38;

  // --- SECTION 1: EXECUTIVE DIAGNOSTIC SUMMARY ---
  renderSectionHeader(doc, '1. EXECUTIVE DIAGNOSTIC SUMMARY', margin, y);
  y += 7;

  // 3-card metric strip
  const cardW = (contentWidth - 6) / 3;
  const cardH = 20;

  // Card 1: 30-Day Leak
  renderMetricCard(
    doc,
    margin,
    y,
    cardW,
    cardH,
    '30-DAY WORK CYCLE LEAK',
    analysis.leakMonthlyWaste || `${analysis.currencySymbol}0/mo`,
    '22-Day Base Run Rate'
  );

  // Card 2: Recoverable Rate
  renderMetricCard(
    doc,
    margin + cardW + 3,
    y,
    cardW,
    cardH,
    'RECOVERABLE CASH RATE',
    '72.0%',
    `${analysis.dailySaved} daily divertible`
  );

  // Card 3: 10-Year Opportunity Cost
  renderMetricCard(
    doc,
    margin + (cardW + 3) * 2,
    y,
    cardW,
    cardH,
    '10-YR WEALTH VALUE (12%)',
    analysis.tenYearCompounded || '$0',
    'Compounded Annually'
  );

  y += cardH + 4;

  // Diagnosis Headline Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, 'FD');
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Primary Diagnosis: "${analysis.headline}"`, margin + 5, y + 7);

  y += 17;

  // --- SECTION 2: ROOT LEAK ERADICATION PLAYBOOK ---
  renderSectionHeader(doc, '2. ROOT LEAK ERADICATION PLAYBOOK', margin, y);
  y += 7;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text('Identified Friction Source:', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(225, 29, 72); // Rose
  doc.text(analysis.leakName, margin + 46, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('Zero-Willpower Micro-Swap:', margin + 5, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 118, 110);
  const splitSolution = doc.splitTextToSize(analysis.leakSolution, contentWidth - 52);
  doc.text(splitSolution, margin + 48, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('Immediate Daily Recapture:', margin + 5, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text(`${analysis.dailySaved} saved per day into automated capital account`, margin + 47, y + 25);

  y += 40;

  // --- SECTION 3: 10-YEAR CAPITAL WEALTH TARGET (12.0% CAGR) ---
  renderSectionHeader(doc, '3. 10-YEAR CAPITAL WEALTH TARGET (12.0% CAGR ANNUITY DECAY MODEL)', margin, y);
  y += 7;

  // Highlight box
  doc.setFillColor(...emeraldLight);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('10-Year Compounded Opportunity Cost at 12% APY:', margin + 6, y + 8);

  doc.setTextColor(5, 150, 105);
  doc.setFontSize(16);
  doc.text(analysis.tenYearCompounded, margin + 6, y + 18);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Target Asset Allocation: ${analysis.assetTarget}`, margin + 6, y + 25);

  const directive = analysis.microRoiWealthShift?.actionDirective || 'Auto-transfer daily savings into index fund SIP.';
  doc.text(`Action Directive: ${directive}`, margin + 6, y + 29);

  y += 38;

  // --- SECTION 4: 7-DAY MOMENTUM PROTOCOL & TOMORROW QUICK WIN ---
  renderSectionHeader(doc, '4. 7-DAY MOMENTUM PROTOCOL & QUICK WIN', margin, y);
  y += 7;

  // Quick Win Pill
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOMORROW MORNING (5-MIN MICRO-TASK):', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  const splitQuickWin = doc.splitTextToSize(analysis.tomorrowQuickWin, contentWidth - 10);
  doc.text(splitQuickWin, margin + 5, y + 10.5);

  y += 18;

  // Protocol steps
  const steps = [
    { day: 'Day 1-2', task: 'Audit 100% active auto-debits; revoke 1 neglected digital subscription.' },
    { day: 'Day 3-5', task: 'Deploy physical workstation friction barriers and assemble 3-minute pantry lunch kits.' },
    { day: 'Day 6-7', task: `Automate daily ${analysis.dailySaved} auto-sweep into ${analysis.assetTarget}.` },
  ];

  steps.forEach((step) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(margin, y, contentWidth, 9, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...emeraldAccent);
    doc.text(step.day, margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(step.task, margin + 22, y + 6);

    y += 11;
  });

  // --- FOOTER ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  const footerText =
    'Confidential Behavioral Finance Telemetry · LifeROI™ Autonomous Multi-Engine Intelligence · All Rights Reserved';
  doc.text(footerText, margin, pageHeight - 8);

  const pageNumText = 'Page 1 of 1';
  doc.text(pageNumText, pageWidth - margin - 15, pageHeight - 8);

  // Trigger browser download
  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`${fileNamePrefix}_${dateStamp}.pdf`);
}

function renderSectionHeader(doc: jsPDF, title: string, x: number, y: number): void {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(title, x, y);

  // Underline bar
  doc.setDrawColor(16, 185, 129); // Emerald
  doc.setLineWidth(0.4);
  doc.line(x, y + 1.5, x + doc.getTextWidth(title), y + 1.5);
}

function renderMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  val: string,
  sub: string
): void {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(title, x + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(val, x + 4, y + 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(sub, x + 4, y + 17);
}
