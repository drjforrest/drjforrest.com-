"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ConsultingTransformationViz = () => {
  const [activeTab, setActiveTab] = useState('pyramid');

  // Data for pyramid vs obelisk comparison
  const pyramidData = [
    { level: 'Partners', traditional: 5, obelisk: 8 },
    { level: 'Senior', traditional: 15, obelisk: 25 },
    { level: 'Manager', traditional: 30, obelisk: 35 },
    { level: 'Senior Analyst', traditional: 35, obelisk: 20 },
    { level: 'Junior Analyst', traditional: 15, obelisk: 12 }
  ];

  // AI investment data
  const investmentData = [
    { firm: 'Deloitte', investment: 3.0, description: 'Zora AI platform' },
    { firm: 'PwC', investment: 1.0, description: 'Agent OS platform' },
    { firm: 'KPMG', investment: 0.5, description: 'Google Cloud partnership' },
    { firm: 'EY', investment: 0.3, description: 'Internal AI chatbots' }
  ];

  // Market growth projection
  const marketGrowthData = [
    { year: 2025, market: 11.07 },
    { year: 2027, market: 22.5 },
    { year: 2029, market: 35.8 },
    { year: 2031, market: 54.2 },
    { year: 2033, market: 73.1 },
    { year: 2035, market: 90.99 }
  ];

  // AI adoption impact data
  const adoptionData = [
    { metric: 'Research Time Reduction', percentage: 30, firm: 'McKinsey (Lilli)' },
    { metric: 'Task Completion Speed', percentage: 25.1, firm: 'Independent Consultants' },
    { metric: 'Quality Improvement', percentage: 40, firm: 'Independent Consultants' },
    { metric: 'Workforce Using AI', percentage: 72, firm: 'McKinsey' }
  ];


  const TabButton = ({ id, label, active, onClick }: {
    id: string;
    label: string;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground border-b-2 border-primary' 
          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-card rounded-lg border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          The AI Transformation of Consulting: Data Behind the Revolution
        </h2>
        <p className="text-muted-foreground">
          Interactive visualization of how artificial intelligence is reshaping the consulting industry structure and economics
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b">
        <TabButton 
          id="pyramid" 
          label="Pyramid → Obelisk" 
          active={activeTab === 'pyramid'} 
          onClick={setActiveTab} 
        />
        <TabButton 
          id="investment" 
          label="AI Investments" 
          active={activeTab === 'investment'} 
          onClick={setActiveTab} 
        />
        <TabButton 
          id="growth" 
          label="Market Growth" 
          active={activeTab === 'growth'} 
          onClick={setActiveTab} 
        />
        <TabButton 
          id="impact" 
          label="Performance Impact" 
          active={activeTab === 'impact'} 
          onClick={setActiveTab} 
        />
      </div>

      {/* Content Panels */}
      <div className="bg-muted/30 p-6 rounded-lg">
        {activeTab === 'pyramid' && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Traditional Pyramid vs. AI-Native Obelisk Structure</h3>
            <p className="text-muted-foreground mb-4">
              Comparison of staffing distribution across hierarchy levels (percentage of total workforce)
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={pyramidData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis label={{ value: 'Percentage of Workforce', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Bar dataKey="traditional" fill="hsl(var(--chart-4))" name="Traditional Pyramid" />
                <Bar dataKey="obelisk" fill="hsl(var(--chart-1))" name="AI-Native Obelisk" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Key Insight:</strong> The obelisk model shows significantly fewer junior analysts and more senior-level staff, 
              reflecting AI's automation of entry-level analytical tasks.</p>
            </div>
          </div>
        )}

        {activeTab === 'investment' && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Big Four AI Investment Commitments</h3>
            <p className="text-muted-foreground mb-4">
              Total AI-related investments and partnerships (billions USD)
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={investmentData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="firm" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis label={{ value: 'Investment (Billions USD)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, _, props) => [
                    `$${value}B`, 
                    `Investment: ${props.payload.description}`
                  ]} 
                />
                <Bar dataKey="investment" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Total Investment:</strong> Over $4.8 billion committed across the Big Four consulting firms</p>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">AI Consulting Services Market Projection</h3>
            <p className="text-muted-foreground mb-4">
              Global market size forecast showing 26.2% compound annual growth rate
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={marketGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Market Size (Billions USD)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`$${value}B`, 'Market Size']} />
                <Area type="monotone" dataKey="market" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Growth Driver:</strong> Increasing enterprise demand for AI strategy, implementation, and governance consulting</p>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">AI Performance Impact on Consulting</h3>
            <p className="text-muted-foreground mb-4">
              Measurable improvements in efficiency and quality from AI adoption
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={adoptionData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="metric" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis label={{ value: 'Performance Improvement (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, _, props) => [
                    `${value}%`, 
                    `Source: ${props.payload.firm}`
                  ]} 
                />
                <Bar dataKey="percentage" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Key Finding:</strong> AI tools show significant impact across speed, quality, and adoption metrics, 
              validating the industry transformation.</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-chart-1/10 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-foreground">72%</div>
          <div className="text-sm text-muted-foreground">of McKinsey workforce using AI assistant Lilli</div>
        </div>
        <div className="bg-chart-2/10 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-foreground">30%</div>
          <div className="text-sm text-muted-foreground">reduction in research and synthesis time</div>
        </div>
        <div className="bg-chart-5/10 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-foreground">$4.8B</div>
          <div className="text-sm text-muted-foreground">total AI investment by Big Four firms</div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingTransformationViz;