from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import CompanyRequest, AnalysisResponse, FinancialData, RadarChartData, FinancialIndex
from dart_service import DartService
import pandas as pd
from typing import List

app = FastAPI(
    title="Financial Analysis API",
    description="DART API를 활용한 기업 재무 분석 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DART 서비스 인스턴스
dart_service = DartService()

@app.get("/")
async def root():
    return {"message": "Financial Analysis API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_company(request: CompanyRequest):
    """기업 재무 분석 API"""
    try:
        # 1. 회사 코드 조회
        corp_code = dart_service.get_corp_code(request.company_name)
        if not corp_code:
            raise HTTPException(status_code=404, detail=f"회사 '{request.company_name}'를 찾을 수 없습니다.")
        
        # 2. 재무 지표 데이터 수집
        df = dart_service.fetch_all_indexes(corp_code, request.year, request.reprt_code)
        if df.empty:
            raise HTTPException(status_code=404, detail="해당 연도의 재무 데이터를 찾을 수 없습니다.")
        
        # 3. 데이터 변환
        financial_data = []
        for _, row in df.iterrows():
            financial_data.append(FinancialIndex(
                idx_cl_nm=row['idx_cl_nm'],
                idx_nm=row['idx_nm'],
                idx_val=float(row['idx_val'])
            ))
        
        # 4. 레이더 차트 데이터 계산
        radar_data = dart_service.calculate_radar_data(df)
        
        return AnalysisResponse(
            success=True,
            message=f"{request.company_name}의 {request.year}년 재무 분석이 완료되었습니다.",
            data=FinancialData(
                company_name=request.company_name,
                year=request.year,
                data=financial_data
            ),
            radar_data=RadarChartData(
                categories=radar_data["categories"],
                values=radar_data["values"],
                overall_score=radar_data["overall_score"],
                grade=radar_data["grade"]
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 중 오류가 발생했습니다: {str(e)}")

@app.get("/api/companies/search")
async def search_companies(query: str, limit: int = 10):
    """회사명 검색 API"""
    try:
        if not dart_service.download_and_extract_corp_code():
            raise HTTPException(status_code=500, detail="회사 코드 다운로드에 실패했습니다.")
        
        import xml.etree.ElementTree as ET
        tree = ET.parse("CORPCODE.xml")
        root = tree.getroot()
        
        matches = []
        for item in root.iter("list"):
            name = item.find("corp_name").text
            code = item.find("corp_code").text
            if query.lower() in name.lower():
                matches.append({"name": name, "code": code})
                if len(matches) >= limit:
                    break
        
        return {"companies": matches}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 