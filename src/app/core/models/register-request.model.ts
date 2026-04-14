/** Contrato `RegisterProfileIn` del API (OpenAPI). */
export interface RegisterProfileIn {
  sex: 'Male' | 'Female';
  birth_date: string;
  height_meters: number;
  removed_teeth: 'None of them' | '1 to 5' | '6 or more, but not all' | 'All';
}

/** Contrato `RegisterMedicalIn` del API (OpenAPI). */
export interface RegisterMedicalIn {
  had_angina: boolean;
  had_stroke: boolean;
  had_asthma: boolean;
  had_copd: boolean;
  had_skin_cancer: boolean;
  had_depressive_disorder: boolean;
  had_kidney_disease: boolean;
  had_arthritis: boolean;
  had_diabetes: 'No' | 'Yes' | 'No, pre-diabetes or borderline diabetes' | 'Yes, but only during pregnancy (female)';
  deaf_or_hard_of_hearing: boolean;
  blind_or_vision_difficulty: boolean;
  difficulty_concentrating: boolean;
  difficulty_walking: boolean;
  difficulty_dressing_bathing: boolean;
  difficulty_errands: boolean;
}

/** Cuerpo `RegisterRequest` del API (OpenAPI). */
export interface RegisterRequestBody {
  email: string;
  password: string;
  profile: RegisterProfileIn;
  medical_conditions: RegisterMedicalIn;
}
