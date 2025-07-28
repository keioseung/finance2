from pydantic import BaseModel
from typing import List, Optional

class CompanyRequest(BaseModel):
    company_name: str
    year: str = "2023"
    reprt_code: str = "11014"

class FinancialIndex(BaseModel):
    idx_cl_nm: str
    idx_nm: str
    idx_val: float

class FinancialData(BaseModel):
    company_name: str
    year: str
    data: List[FinancialIndex]

class RadarChartData(BaseModel):
    categories: List[str]
    values: List[float]
    overall_score: float
    grade: str

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: Optional[FinancialData] = None
    radar_data: Optional[RadarChartData] = None 