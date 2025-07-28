export interface FinancialIndex {
  idx_cl_nm: string;
  idx_nm: string;
  idx_val: number;
}

export interface FinancialData {
  company_name: string;
  year: string;
  data: FinancialIndex[];
}

export interface RadarChartData {
  categories: string[];
  values: number[];
  overall_score: number;
  grade: string;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data?: FinancialData;
  radar_data?: RadarChartData;
}

export interface CompanyRequest {
  company_name: string;
  year: string;
  reprt_code: string;
}

export interface Company {
  name: string;
  code: string;
} 