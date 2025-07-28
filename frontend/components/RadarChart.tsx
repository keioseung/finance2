'use client';

import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { RadarChartData } from '@/types';

interface RadarChartProps {
  data: RadarChartData;
  companyName: string;
  year: string;
}

export default function RadarChart({ data, companyName, year }: RadarChartProps) {
  const chartData = data.categories.map((category, index) => ({
    category: category,
    value: data.values[index],
  }));

  const getGradeColor = (grade: string) => {
    if (grade.includes('A+') || grade.includes('A')) return '#22c55e';
    if (grade.includes('B')) return '#3b82f6';
    if (grade.includes('C')) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🎯 종합 재무건전성 평가
        </h3>
        <p className="text-gray-600">
          {companyName} ({year}년)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <Radar
                name="재무건전성"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: getGradeColor(data.grade) }}>
              {data.overall_score.toFixed(1)}점
            </div>
            <div className="text-lg font-semibold" style={{ color: getGradeColor(data.grade) }}>
              {data.grade}
            </div>
          </div>

          <div className="space-y-3">
            {data.categories.map((category, index) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {category === '수익성' && '💰'}
                    {category === '안정성' && '🛡️'}
                    {category === '성장성' && '🚀'}
                    {category === '활동성' && '⚡'}
                  </span>
                  <span className="font-medium text-gray-700">{category}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600">{data.values[index].toFixed(1)}점</div>
                  <div className="text-sm text-gray-500">/ 100점</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 