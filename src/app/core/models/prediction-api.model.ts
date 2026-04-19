import { RegisterMedicalIn, RegisterProfileIn } from './register-request.model';

/** Literales `GeneralHealth` del OpenAPI. */
export type GeneralHealth = 'Excellent' | 'Very good' | 'Good' | 'Fair' | 'Poor';

/** Literales `LastCheckupTime` del OpenAPI. */
export type LastCheckupTime =
  | 'Within past year (anytime less than 12 months ago)'
  | 'Within past 2 years (1 year but less than 2 years ago)'
  | 'Within past 5 years (2 years but less than 5 years ago)'
  | '5 or more years ago'
  | 'Never';

/** Literales `SmokerStatus` del OpenAPI. */
export type SmokerStatus =
  | 'Never smoked'
  | 'Former smoker'
  | 'Current smoker - now smokes some days'
  | 'Current smoker - now smokes every day';

/** Literales `EcigaretteUsage` del OpenAPI. */
export type EcigaretteUsage =
  | 'Never used e-cigarettes in my entire life'
  | 'Not at all (right now)'
  | 'Use them some days'
  | 'Use them every day';

/** Literales `TetanusLast10Tdap` del OpenAPI. */
export type TetanusLast10Tdap =
  | 'Yes, received Tdap'
  | 'Yes, received tetanus shot but not sure what type'
  | 'Yes, received tetanus shot, but not Tdap'
  | 'No, did not receive any tetanus shot in the past 10 years';

/** Literales `CovidPos` del OpenAPI. */
export type CovidPos =
  | 'Yes'
  | 'No'
  | 'Tested positive using home test without a health professional';

/** Cuerpo `AnonymousPredictionRequest` (OpenAPI). */
export interface AnonymousPredictionRequest {
  session_id: string;
  profile: RegisterProfileIn;
  medical_conditions: RegisterMedicalIn;
  weight_kilograms: number;
  general_health?: GeneralHealth | null;
  physical_health_days?: number | null;
  mental_health_days?: number | null;
  last_checkup_time?: LastCheckupTime | null;
  physical_activities?: boolean | null;
  sleep_hours?: number | null;
  smoker_status?: SmokerStatus | null;
  ecigarette_usage?: EcigaretteUsage | null;
  alcohol_drinkers?: boolean | null;
  chest_scan?: boolean | null;
  hiv_testing?: boolean | null;
  flu_vax_last_12?: boolean | null;
  pneumo_vax_ever?: boolean | null;
  tetanus_last_10_tdap?: TetanusLast10Tdap | null;
  high_risk_last_year?: boolean | null;
  covid_pos?: CovidPos | null;
}

/** Cuerpo `AuthenticatedPredictionRequest` (OpenAPI). */
export interface AuthenticatedPredictionRequest {
  weight_kilograms: number;
  general_health?: GeneralHealth | null;
  physical_health_days?: number | null;
  mental_health_days?: number | null;
  last_checkup_time?: LastCheckupTime | null;
  physical_activities?: boolean | null;
  sleep_hours?: number | null;
  smoker_status?: SmokerStatus | null;
  ecigarette_usage?: EcigaretteUsage | null;
  alcohol_drinkers?: boolean | null;
  chest_scan?: boolean | null;
  hiv_testing?: boolean | null;
  flu_vax_last_12?: boolean | null;
  pneumo_vax_ever?: boolean | null;
  tetanus_last_10_tdap?: TetanusLast10Tdap | null;
  high_risk_last_year?: boolean | null;
  covid_pos?: CovidPos | null;
}
