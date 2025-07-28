'use client';

import { useState } from 'react';
import { Search, Building2, Calendar, FileText } from 'lucide-react';
import { Company } from '@/types';

interface SearchFormProps {
  onAnalyze: (companyName: string, year: string, reprtCode: string) => void;
  onSearchCompanies: (query: string) => Promise<Company[]>;
  isLoading: boolean;
}

export default function SearchForm({ onAnalyze, onSearchCompanies, isLoading }: SearchFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [year, setYear] = useState('2023');
  const [reprtCode, setReprtCode] = useState('11014');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (companyName.trim().length < 2) return;
    
    try {
      const results = await onSearchCompanies(companyName);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };

  const handleCompanySelect = (company: Company) => {
    setCompanyName(company.name);
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onAnalyze(companyName, year, reprtCode);
    }
  };

  const reportOptions = [
    { value: '11014', label: '3분기보고서' },
    { value: '11013', label: '반기보고서' },
    { value: '11012', label: '사업보고서' },
    { value: '11011', label: '1분기보고서' },
  ];

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 기업 재무 분석
        </h2>
        <p className="text-gray-600">
          DART API를 활용한 기업 재무지표 분석 대시보드
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            회사명
          </label>
          <div className="relative">
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (e.target.value.trim().length >= 2) {
                  handleSearch();
                } else {
                  setShowResults(false);
                }
              }}
              placeholder="예: 삼성전자, SK하이닉스..."
              className="input-field pr-10"
              required
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((company, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCompanySelect(company)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium text-gray-800">{company.name}</div>
                  <div className="text-sm text-gray-500">코드: {company.code}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              연도
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field"
            >
              {Array.from({ length: 5 }, (_, i) => 2023 - i).map(y => (
                <option key={y} value={y.toString()}>{y}년</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              보고서 유형
            </label>
            <select
              value={reprtCode}
              onChange={(e) => setReprtCode(e.target.value)}
              className="input-field"
            >
              {reportOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !companyName.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              분석 중...
            </div>
          ) : (
            '재무 분석 시작'
          )}
        </button>
      </form>
    </div>
  );
} 