import {
  PREDICTION_TRISTATE_FORM,
  PredictionTristateFormValue
} from '../../../core/constants/data/prediction-survey-options.constant';
import {
  AnonymousPredictionRequest,
  AuthenticatedPredictionRequest,
  CovidPos,
  EcigaretteUsage,
  GeneralHealth,
  LastCheckupTime,
  SmokerStatus,
  TetanusLast10Tdap
} from '../../../core/models/prediction-api.model';
import { RegisterMedicalIn, RegisterProfileIn } from '../../../core/models/register-request.model';

/** Convierte el tri-estado del formulario ('', yes, no) al booleano o null del API. */
export function surveyTriStateToBool(v: PredictionTristateFormValue): boolean | null {
  if (v === PREDICTION_TRISTATE_FORM.unset) {
    return null;
  }
  return v === PREDICTION_TRISTATE_FORM.yes;
}

function emptyToNullString<T extends string>(v: string): T | null {
  const t = v?.trim();
  return t ? (t as T) : null;
}

function optionalNumber(v: number | null | undefined): number | null {
  if (v === null || v === undefined || Number.isNaN(Number(v))) {
    return null;
  }
  return Number(v);
}

/** Valores crudos del subgrupo `survey` del formulario reactivo. */
export type SurveyFormValue = {
  general_health: string;
  physical_health_days: number | null;
  mental_health_days: number | null;
  last_checkup_time: string;
  physical_activities: PredictionTristateFormValue;
  sleep_hours: number | null;
  smoker_status: string;
  ecigarette_usage: string;
  alcohol_drinkers: PredictionTristateFormValue;
  chest_scan: PredictionTristateFormValue;
  hiv_testing: PredictionTristateFormValue;
  flu_vax_last_12: PredictionTristateFormValue;
  pneumo_vax_ever: PredictionTristateFormValue;
  tetanus_last_10_tdap: string;
  high_risk_last_year: PredictionTristateFormValue;
  covid_pos: string;
};

export function surveyPartialFromForm(s: SurveyFormValue): Omit<
  AnonymousPredictionRequest,
  'session_id' | 'profile' | 'medical_conditions' | 'weight_kilograms'
> {
  const out: Record<string, unknown> = {};

  const gh = emptyToNullString<GeneralHealth>(s.general_health);
  if (gh) {
    out['general_health'] = gh;
  }

  const phys = optionalNumber(s.physical_health_days);
  if (phys !== null) {
    out['physical_health_days'] = phys;
  }

  const ment = optionalNumber(s.mental_health_days);
  if (ment !== null) {
    out['mental_health_days'] = ment;
  }

  const ck = emptyToNullString<LastCheckupTime>(s.last_checkup_time);
  if (ck) {
    out['last_checkup_time'] = ck;
  }

  const pa = surveyTriStateToBool(s.physical_activities);
  if (pa !== null) {
    out['physical_activities'] = pa;
  }

  const sh = optionalNumber(s.sleep_hours);
  if (sh !== null) {
    out['sleep_hours'] = sh;
  }

  const ss = emptyToNullString<SmokerStatus>(s.smoker_status);
  if (ss) {
    out['smoker_status'] = ss;
  }

  const ec = emptyToNullString<EcigaretteUsage>(s.ecigarette_usage);
  if (ec) {
    out['ecigarette_usage'] = ec;
  }

  const ad = surveyTriStateToBool(s.alcohol_drinkers);
  if (ad !== null) {
    out['alcohol_drinkers'] = ad;
  }

  const cs = surveyTriStateToBool(s.chest_scan);
  if (cs !== null) {
    out['chest_scan'] = cs;
  }

  const hv = surveyTriStateToBool(s.hiv_testing);
  if (hv !== null) {
    out['hiv_testing'] = hv;
  }

  const fl = surveyTriStateToBool(s.flu_vax_last_12);
  if (fl !== null) {
    out['flu_vax_last_12'] = fl;
  }

  const pn = surveyTriStateToBool(s.pneumo_vax_ever);
  if (pn !== null) {
    out['pneumo_vax_ever'] = pn;
  }

  const tt = emptyToNullString<TetanusLast10Tdap>(s.tetanus_last_10_tdap);
  if (tt) {
    out['tetanus_last_10_tdap'] = tt;
  }

  const hr = surveyTriStateToBool(s.high_risk_last_year);
  if (hr !== null) {
    out['high_risk_last_year'] = hr;
  }

  const cv = emptyToNullString<CovidPos>(s.covid_pos);
  if (cv) {
    out['covid_pos'] = cv;
  }

  return out as Omit<
    AnonymousPredictionRequest,
    'session_id' | 'profile' | 'medical_conditions' | 'weight_kilograms'
  >;
}

export function buildAnonymousPredictionRequest(
  sessionId: string,
  profile: RegisterProfileIn,
  medical: RegisterMedicalIn,
  weightKg: number,
  survey: SurveyFormValue
): AnonymousPredictionRequest {
  return {
    session_id: sessionId,
    profile,
    medical_conditions: medical,
    weight_kilograms: weightKg,
    ...surveyPartialFromForm(survey)
  };
}

export function buildAuthenticatedPredictionRequest(
  weightKg: number,
  survey: SurveyFormValue
): AuthenticatedPredictionRequest {
  return {
    weight_kilograms: weightKg,
    ...surveyPartialFromForm(survey)
  };
}
