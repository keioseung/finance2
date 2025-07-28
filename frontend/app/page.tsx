'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import FinancialMetrics from '@/components/FinancialMetrics';
import RadarChart from '@/components/RadarChart';
import { AnalysisResponse, Company } from '@/types';
import { analyzeCompany, searchCompanies } from '@/lib/api';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (companyName: string, year: string, reprtCode: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeCompany({ companyName, year, reprtCode });
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchCompanies = async (query: string): Promise<Company[]> => {
    try {
      return await searchCompanies(query);
    } catch (err: any) {
      console.error('회사 검색 오류:', err);
      return [];
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            📈 Financial Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            DART API를 활용한 기업 재무지표 종합 분석 플랫폼
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm
            onAnalyze={handleAnalyze}
            onSearchCompanies={handleSearchCompanies}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-800 font-medium">재무 데이터를 분석하고 있습니다...</p>
              <p className="text-blue-600 text-sm mt-1">잠시만 기다려주세요.</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && analysisResult.success && analysisResult.data && (
          <div className="space-y-8">
            {/* Success Message */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">분석 완료</h3>
                  <p className="text-sm text-green-700 mt-1">{analysisResult.message}</p>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            {analysisResult.radar_data && (
              <RadarChart
                data={analysisResult.radar_data}
                companyName={analysisResult.data.company_name}
                year={analysisResult.data.year}
              />
            )}

            {/* Financial Metrics */}
            <FinancialMetrics
              data={analysisResult.data.data}
              companyName={analysisResult.data.company_name}
              year={analysisResult.data.year}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Powered by DART API • Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
} 