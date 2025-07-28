import axios from 'axios';
import { AnalysisResponse, CompanyRequest, Company } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const analyzeCompany = async (request: CompanyRequest): Promise<AnalysisResponse> => {
  try {
    const response = await api.post('/api/analyze', request);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || '분석 중 오류가 발생했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

export const searchCompanies = async (query: string, limit: number = 10): Promise<Company[]> => {
  try {
    const response = await api.get('/api/companies/search', {
      params: { query, limit }
    });
    return response.data.companies;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || '검색 중 오류가 발생했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'healthy';
  } catch {
    return false;
  }
}; 