'use client';

import { FinancialIndex } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialMetricsProps {
  data: FinancialIndex[];
  companyName: string;
  year: string;
}

export default function FinancialMetrics({ data, companyName, year }: FinancialMetricsProps) {
  const categories = ['수익성', '안정성', '성장성', '활동성'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  const icons = ['💰', '🛡️', '🚀', '⚡'];

  const getInterpretation = (category: string, value: number) => {
    const interpretations = {
      '수익성': {
        excellent: { threshold: 15, label: '💰 매우 우수', color: '#22c55e' },
        good: { threshold: 10, label: '👍 양호', color: '#3b82f6' },
        average: { threshold: 5, label: '⚖️ 보통', color: '#f59e0b' },
        poor: { threshold: 0, label: '⚠️ 개선필요', color: '#ef4444' }
      },
      '안정성': {
        excellent: { threshold: 200, label: '🛡️ 매우 안정', color: '#22c55e' },
        good: { threshold: 150, label: '✅ 안정', color: '#3b82f6' },
        average: { threshold: 100, label: '⚖️ 보통', color: '#f59e0b' },
        poor: { threshold: 0, label: '⚠️ 불안정', color: '#ef4444' }
      },
      '성장성': {
        excellent: { threshold: 20, label: '🚀 고성장', color: '#22c55e' },
        good: { threshold: 10, label: '📈 성장', color: '#3b82f6' },
        average: { threshold: 0, label: '⚖️ 보통', color: '#f59e0b' },
        poor: { threshold: -10, label: '📉 감소', color: '#ef4444' }
      },
      '활동성': {
        excellent: { threshold: 5, label: '⚡ 매우 활발', color: '#22c55e' },
        good: { threshold: 3, label: '🔄 활발', color: '#3b82f6' },
        average: { threshold: 1, label: '⚖️ 보통', color: '#f59e0b' },
        poor: { threshold: 0, label: '🐌 저조', color: '#ef4444' }
      }
    };

    const criteria = interpretations[category as keyof typeof interpretations] || interpretations['수익성'];
    
    for (const [level, { threshold, label, color }] of Object.entries(criteria)) {
      if (value >= threshold) {
        return { label, color };
      }
    }
    
    return criteria.poor;
  };

  return (
    <div className="space-y-6">
      {categories.map((category, categoryIndex) => {
        const categoryData = data.filter(item => item.idx_cl_nm === category);
        if (categoryData.length === 0) return null;

        const chartData = categoryData.map(item => ({
          name: item.idx_nm.replace('(', '\n('),
          value: item.idx_val,
          interpretation: getInterpretation(category, item.idx_val)
        }));

        return (
          <div key={category} className="card">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">{icons[categoryIndex]}</span>
                <span>{category} 지표</span>
              </h3>
              <p className="text-gray-600">{companyName} ({year}년)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 10, fill: '#374151' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(2), '지표값']}
                      labelFormatter={(label) => `지표: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={colors[categoryIndex]} 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {categoryData.map((item, index) => {
                  const interpretation = getInterpretation(category, item.idx_val);
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.idx_nm}
                        </h4>
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: interpretation.color }}
                        >
                          {interpretation.label}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {item.idx_val.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 