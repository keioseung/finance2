import requests
import xml.etree.ElementTree as ET
import pandas as pd
import numpy as np
import zipfile
import os
from typing import Dict, List, Tuple, Optional
from config import settings

class DartService:
    def __init__(self):
        self.api_key = settings.DART_API_KEY
        self.corp_code_file = "CORPCODE.xml"
        
    def download_and_extract_corp_code(self) -> bool:
        """corpCode.zip 다운로드 및 압축 해제"""
        url = f"https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key={self.api_key}"
        res = requests.get(url)
        if res.status_code == 200:
            with open("corpCode.zip", "wb") as f:
                f.write(res.content)
            
            with zipfile.ZipFile("corpCode.zip", "r") as zip_ref:
                zip_ref.extractall()
            
            # 임시 파일 정리
            if os.path.exists("corpCode.zip"):
                os.remove("corpCode.zip")
            if os.path.exists("corpCode.xml"):
                os.remove("corpCode.xml")
                
            return True
        else:
            return False
    
    def get_corp_code(self, company_name: str) -> Optional[str]:
        """회사명으로 corp_code 검색"""
        if not os.path.exists(self.corp_code_file):
            if not self.download_and_extract_corp_code():
                return None
        
        tree = ET.parse(self.corp_code_file)
        root = tree.getroot()
        
        exact_match = None
        partial_matches = []
        
        for item in root.iter("list"):
            name = item.find("corp_name").text
            code = item.find("corp_code").text
            if name == company_name:
                exact_match = code
                break
            elif company_name in name:
                partial_matches.append((name, code))
        
        if exact_match:
            return exact_match
        elif partial_matches:
            # 부분 일치하는 경우 첫 번째 결과 반환
            return partial_matches[0][1]
        else:
            return None
    
    def get_index_data(self, corp_code: str, year: str, reprt_code: str, idx_cl_code: str) -> pd.DataFrame:
        """주요 재무지표 요청"""
        url = "https://opendart.fss.or.kr/api/fnlttSinglIndx.json"
        params = {
            "crtfc_key": self.api_key,
            "corp_code": corp_code,
            "bsns_year": year,
            "reprt_code": reprt_code,
            "idx_cl_code": idx_cl_code
        }
        
        res = requests.get(url, params=params)
        data = res.json()
        
        if data["status"] != "000":
            return pd.DataFrame()
        
        df = pd.DataFrame(data["list"])
        df["idx_val"] = pd.to_numeric(df["idx_val"], errors="coerce")
        return df[["idx_cl_nm", "idx_nm", "idx_val"]]
    
    def fetch_all_indexes(self, corp_code: str, year: str = "2023", reprt_code: str = "11014") -> pd.DataFrame:
        """모든 지표 분류 조회"""
        idx_cl_codes = {
            "M210000": "수익성",
            "M220000": "안정성", 
            "M230000": "성장성",
            "M240000": "활동성"
        }
        
        all_data = pd.DataFrame()
        for code, name in idx_cl_codes.items():
            df = self.get_index_data(corp_code, year, reprt_code, code)
            if not df.empty:
                all_data = pd.concat([all_data, df], ignore_index=True)
        
        return all_data
    
    def get_interpretation(self, category: str, metric_name: str, value: float) -> Tuple[str, str]:
        """지표값에 대한 해석 제공"""
        interpretations = {
            "수익성": {
                "excellent": (15, "💰 매우 우수", "#1f77b4"),
                "good": (10, "👍 양호", "#2ca02c"), 
                "average": (5, "⚖️ 보통", "#ff7f0e"),
                "poor": (0, "⚠️ 개선필요", "#d62728")
            },
            "안정성": {
                "excellent": (200, "🛡️ 매우 안정", "#1f77b4"),
                "good": (150, "✅ 안정", "#2ca02c"),
                "average": (100, "⚖️ 보통", "#ff7f0e"), 
                "poor": (0, "⚠️ 불안정", "#d62728")
            },
            "성장성": {
                "excellent": (20, "🚀 고성장", "#1f77b4"),
                "good": (10, "📈 성장", "#2ca02c"),
                "average": (0, "⚖️ 보통", "#ff7f0e"),
                "poor": (-10, "📉 감소", "#d62728")
            },
            "활동성": {
                "excellent": (5, "⚡ 매우 활발", "#1f77b4"),
                "good": (3, "🔄 활발", "#2ca02c"),
                "average": (1, "⚖️ 보통", "#ff7f0e"),
                "poor": (0, "🐌 저조", "#d62728")
            }
        }
        
        criteria = interpretations.get(category, interpretations["수익성"])
        
        for level, (threshold, label, color) in criteria.items():
            if value >= threshold:
                return label, color
        
        return criteria["poor"][1], criteria["poor"][2]
    
    def calculate_radar_data(self, df: pd.DataFrame) -> Dict:
        """레이더 차트 데이터 계산"""
        category_scores = {}
        
        for category in df["idx_cl_nm"].unique():
            sub_df = df[df["idx_cl_nm"] == category]
            avg_score = sub_df['idx_val'].mean()
            
            # 카테고리별 점수 정규화
            if category == "수익성":
                normalized_score = min(100, max(0, avg_score * 5))
            elif category == "안정성":
                normalized_score = min(100, max(0, avg_score / 2))
            elif category == "성장성":
                normalized_score = min(100, max(0, (avg_score + 20) * 2.5))
            else:  # 활동성
                normalized_score = min(100, max(0, avg_score * 20))
                
            category_scores[category] = normalized_score
        
        categories = list(category_scores.keys())
        values = list(category_scores.values())
        overall_score = np.mean(values)
        
        if overall_score >= 80:
            grade = "A+ (매우우수)"
        elif overall_score >= 70:
            grade = "A (우수)"
        elif overall_score >= 60:
            grade = "B (양호)"
        elif overall_score >= 50:
            grade = "C (보통)"
        else:
            grade = "D (개선필요)"
        
        return {
            "categories": categories,
            "values": values,
            "overall_score": overall_score,
            "grade": grade
        } 