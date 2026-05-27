import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PREDICTION_PDF_EXPORT_DEFAULT_FILENAME_TEMPLATE } from '../constants/prediction-pdf-export.constant';
import { PREDICTION_PDF_EXPORT_UI } from '../constants/ui/prediction-pdf-export-ui.constant';
import {
  COVID_POS_OPTIONS,
  ECIGARETTE_USAGE_OPTIONS,
  GENERAL_HEALTH_OPTIONS,
  LAST_CHECKUP_OPTIONS,
  SMOKER_STATUS_OPTIONS,
  TETANUS_OPTIONS
} from '../constants/data/prediction-survey-options.constant';
import { SHAP_DISPLAY_UI } from '../constants/shap-display.constant';
import type { PredictionResultData, ShapExplanation } from '../models/prediction-response.model';
import {
  formatPdfBoolean,
  formatPdfNumber,
  formatPdfTimestamp,
  labelForSurveyOption
} from '../utils/prediction-pdf-format.util';
import { predictionRiskDisplayLabel } from '../utils/prediction-risk-display.util';
import {
  buildShapExplanationUserView,
  buildShapFactorUserView,
  filterShapFactorsForDisplay,
  maxAbsShapContribution,
  type ShapExplanationUserView,
  type ShapFactorUserView
} from '../utils/shap-display.util';

interface PdfLayout {
  marginX: number;
  marginTop: number;
  marginBottom: number;
  contentWidth: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionPdfExportService {
  private readonly ui = PREDICTION_PDF_EXPORT_UI;

  buildFilename(predictionId: string): string {
    return PREDICTION_PDF_EXPORT_DEFAULT_FILENAME_TEMPLATE.replace('{predictionId}', predictionId);
  }

  buildPdfBlob(detail: PredictionResultData): Blob {
    const doc = new jsPDF({ unit: 'mm', format: 'letter', compress: true });
    const layout: PdfLayout = {
      marginX: 18,
      marginTop: 18,
      marginBottom: 18,
      contentWidth: 177,
      y: 18
    };

    this.writeTitle(doc, layout, this.ui.title);
    this.writeSectionHeading(doc, layout, this.ui.sections.summary);
    this.writeBodyLine(
      doc,
      layout,
      `${this.ui.labels.probability}: ${formatPdfNumber(detail.prediction_probability, this.ui.values.notAvailable)}${this.ui.values.probabilitySuffix}`
    );
    this.writeBodyLine(
      doc,
      layout,
      `${this.ui.labels.riskLevel}: ${predictionRiskDisplayLabel(detail.risk_level)}`
    );
    this.writeBodyLine(
      doc,
      layout,
      `${this.ui.labels.timestamp}: ${formatPdfTimestamp(detail.prediction_timestamp, this.ui.values.notAvailable)}`
    );
    this.writeGap(doc, layout, 4);

    this.writeSectionHeading(doc, layout, this.ui.sections.inputData);
    for (const line of this.buildInputLines(detail)) {
      this.writeBodyLine(doc, layout, line);
    }
    this.writeGap(doc, layout, 4);

    this.writeShapSections(doc, layout, detail);
    this.writeGap(doc, layout, 4);

    this.writeSectionHeading(doc, layout, this.ui.sections.recommendations);
    const recs = detail.recommendations ?? [];
    if (recs.length) {
      recs.forEach((rec, index) => this.writeBodyLine(doc, layout, `${index + 1}. ${rec}`));
    } else {
      this.writeBodyLine(doc, layout, this.ui.recommendationsEmpty);
    }
    this.writeGap(doc, layout, 4);

    this.writeSectionHeading(doc, layout, this.ui.sections.disclaimer);
    for (const para of this.ui.disclaimerParagraphs) {
      this.writeSmallParagraph(doc, layout, para);
    }

    return doc.output('blob');
  }

  private buildInputLines(detail: PredictionResultData): string[] {
    const na = this.ui.values.notAvailable;
    const yes = this.ui.values.yes;
    const no = this.ui.values.no;
    const f = this.ui.inputFields;

    return [
      `${f.weightKilograms}: ${formatPdfNumber(detail.weight_kilograms, na, 1)}`,
      `${f.bmi}: ${formatPdfNumber(detail.bmi, na, 2)}`,
      `${f.generalHealth}: ${labelForSurveyOption(GENERAL_HEALTH_OPTIONS, detail.general_health ?? undefined) || na}`,
      `${f.physicalHealthDays}: ${formatPdfNumber(detail.physical_health_days, na, 0)}`,
      `${f.mentalHealthDays}: ${formatPdfNumber(detail.mental_health_days, na, 0)}`,
      `${f.lastCheckup}: ${labelForSurveyOption(LAST_CHECKUP_OPTIONS, detail.last_checkup_time ?? undefined) || na}`,
      `${f.physicalActivities}: ${formatPdfBoolean(detail.physical_activities, yes, no, na)}`,
      `${f.sleepHours}: ${formatPdfNumber(detail.sleep_hours, na, 1)}`,
      `${f.smokerStatus}: ${labelForSurveyOption(SMOKER_STATUS_OPTIONS, detail.smoker_status ?? undefined) || na}`,
      `${f.ecigaretteUsage}: ${labelForSurveyOption(ECIGARETTE_USAGE_OPTIONS, detail.ecigarette_usage ?? undefined) || na}`,
      `${f.alcohol}: ${formatPdfBoolean(detail.alcohol_drinkers, yes, no, na)}`,
      `${f.chestScan}: ${formatPdfBoolean(detail.chest_scan, yes, no, na)}`,
      `${f.hiv}: ${formatPdfBoolean(detail.hiv_testing, yes, no, na)}`,
      `${f.fluVax}: ${formatPdfBoolean(detail.flu_vax_last_12, yes, no, na)}`,
      `${f.pneumoVax}: ${formatPdfBoolean(detail.pneumo_vax_ever, yes, no, na)}`,
      `${f.tetanus}: ${labelForSurveyOption(TETANUS_OPTIONS, detail.tetanus_last_10_tdap ?? undefined) || na}`,
      `${f.highRiskYear}: ${formatPdfBoolean(detail.high_risk_last_year, yes, no, na)}`,
      `${f.covid}: ${labelForSurveyOption(COVID_POS_OPTIONS, detail.covid_pos ?? undefined) || na}`
    ];
  }

  private writeShapSections(doc: jsPDF, layout: PdfLayout, detail: PredictionResultData): void {
    this.writeSectionHeading(doc, layout, this.ui.sections.shap);
    this.writeSmallParagraph(doc, layout, SHAP_DISPLAY_UI.sectionDisclaimer);

    const main = this.readShapExplanation(detail.shap_explanation);
    const factors = filterShapFactorsForDisplay(
      Array.isArray(detail.shap_top_factors) ? detail.shap_top_factors : []
    );

    if (!main && factors.length === 0) {
      this.writeBodyLine(doc, layout, this.ui.shapUnavailable);
      return;
    }

    if (main) {
      this.writeSubheading(doc, layout, this.ui.sections.shapMain);
      this.writeExplanationBlock(doc, layout, buildShapExplanationUserView(main));
    }

    if (factors.length) {
      this.writeSubheading(doc, layout, this.ui.sections.shapFactors);
      const batchMax = maxAbsShapContribution(factors);
      for (const factor of factors) {
        const rank = factor.rank ?? null;
        this.writeFactorBlock(doc, layout, buildShapFactorUserView(factor, batchMax), rank);
      }
    }
  }

  private readShapExplanation(raw: ShapExplanation | null | undefined): ShapExplanation | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }
    if (raw.feature_name || raw.message || raw.impact_score != null || raw.direction) {
      return raw;
    }
    return null;
  }

  private writeExplanationBlock(doc: jsPDF, layout: PdfLayout, view: ShapExplanationUserView): void {
    this.writeSubheading(doc, layout, view.friendlyTitle, 11);
    this.writeBodyLine(doc, layout, `${this.ui.labels.impact}: ${view.impactLabel}`);
    this.writeBodyParagraph(doc, layout, view.primaryExplanation);
    if (view.narrativeExtra) {
      this.writeBodyLine(doc, layout, `${this.ui.labels.moreDetail}: ${view.narrativeExtra}`);
    }
    this.writeGap(doc, layout, 3);
  }

  private writeFactorBlock(
    doc: jsPDF,
    layout: PdfLayout,
    view: ShapFactorUserView,
    rank: number | null
  ): void {
    const title =
      rank != null
        ? this.ui.factorRank.replace('{rank}', String(rank)).replace('{title}', view.friendlyTitle)
        : view.friendlyTitle;
    this.writeSubheading(doc, layout, title, 11);
    this.writeBodyLine(doc, layout, `${this.ui.labels.impact}: ${view.impactLabel}`);
    if (view.intensityLabel) {
      this.writeBodyLine(doc, layout, view.intensityLabel);
    }
    this.writeBodyParagraph(doc, layout, view.primaryExplanation);
    if (view.narrativeExtra) {
      this.writeBodyLine(doc, layout, `${this.ui.labels.moreDetail}: ${view.narrativeExtra}`);
    }
    this.writeGap(doc, layout, 3);
  }

  private ensureSpace(doc: jsPDF, layout: PdfLayout, needed: number): void {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (layout.y + needed <= pageHeight - layout.marginBottom) {
      return;
    }
    doc.addPage();
    layout.y = layout.marginTop;
  }

  private writeTitle(doc: jsPDF, layout: PdfLayout, text: string): void {
    this.ensureSpace(doc, layout, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(text, layout.marginX, layout.y);
    layout.y += 10;
  }

  private writeSectionHeading(doc: jsPDF, layout: PdfLayout, text: string): void {
    this.ensureSpace(doc, layout, 10);
    layout.y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(text, layout.marginX, layout.y);
    layout.y += 8;
  }

  private writeSubheading(doc: jsPDF, layout: PdfLayout, text: string, size = 10.5): void {
    this.ensureSpace(doc, layout, 8);
    layout.y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, layout.contentWidth) as string[];
    for (const line of lines) {
      this.ensureSpace(doc, layout, 6);
      doc.text(line, layout.marginX, layout.y);
      layout.y += 5.5;
    }
  }

  private writeBodyLine(doc: jsPDF, layout: PdfLayout, text: string): void {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, layout.contentWidth) as string[];
    for (const line of lines) {
      this.ensureSpace(doc, layout, 6);
      doc.text(line, layout.marginX, layout.y);
      layout.y += 5.8;
    }
  }

  private writeBodyParagraph(doc: jsPDF, layout: PdfLayout, text: string): void {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, layout.contentWidth) as string[];
    for (const line of lines) {
      this.ensureSpace(doc, layout, 6);
      doc.text(line, layout.marginX, layout.y);
      layout.y += 5.8;
    }
  }

  private writeSmallParagraph(doc: jsPDF, layout: PdfLayout, text: string): void {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(text, layout.contentWidth) as string[];
    for (const line of lines) {
      this.ensureSpace(doc, layout, 5);
      doc.text(line, layout.marginX, layout.y);
      layout.y += 5.2;
    }
    layout.y += 2;
  }

  private writeGap(_doc: jsPDF, layout: PdfLayout, mm: number): void {
    layout.y += mm;
  }
}
