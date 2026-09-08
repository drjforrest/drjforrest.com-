"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EnvironmentalHypocrisyComparison = () => {
  const data = [
    {
      name: "Heavy ChatGPT Use",
      value: 29,
      detail: "50 queries/day × 365 days",
      color: "#E31B23"
    },
    {
      name: "Daily Streaming",
      value: 26,
      detail: "2 hours Netflix/day × 365 days",
      color: "#666666"
    },
    {
      name: "Modest Fast Fashion",
      value: 30,
      detail: "1 item/month × 12 months",
      color: "#666666"
    },
    {
      name: "2 Domestic Flights",
      value: 180,
      detail: "2 round trips/year",
      color: "#666666"
    },
    {
      name: "2 International Flights",
      value: 1970,
      detail: "e.g., 2 × Vancouver-London",
      color: "#003688"
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.detail}</p>
          <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.color }}>
            {payload[0].value} kg CO₂/year
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2" style={{ borderColor: '#E31B23' }}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#003688' }}>
          A Typical "Concerned Professional's" Annual Carbon Footprint
        </h3>
        <p className="text-gray-600 text-sm">
          Discretionary activities only - housing, food, and transportation base not included
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            label={{ value: 'kg CO₂ per year', position: 'bottom' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={110}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border-l-4" style={{ borderColor: '#E31B23' }}>
          <p className="font-semibold mb-2">What Gets All The Attention</p>
          <p className="text-2xl font-bold" style={{ color: '#E31B23' }}>29 kg CO₂</p>
          <p className="text-sm text-gray-600 mt-1">Heavy daily ChatGPT use</p>
          <p className="text-xs text-gray-500 mt-2">1.3% of activities shown</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border-l-4" style={{ borderColor: '#003688' }}>
          <p className="font-semibold mb-2">What Gets Normalized</p>
          <p className="text-2xl font-bold" style={{ color: '#003688' }}>1,970 kg CO₂</p>
          <p className="text-sm text-gray-600 mt-1">Just 2 international flights</p>
          <p className="text-xs text-gray-500 mt-2">88% of activities shown</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold mb-2">Perspective Check:</p>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• <span className="font-medium">68 years</span> of heavy ChatGPT use = 1 round-trip to London</li>
          <li>• <span className="font-medium">6 years</span> of daily ChatGPT = 2 domestic flights</li>
          <li>• ChatGPT emissions = <span className="font-medium">2.3%</span> of just the flight emissions shown</li>
        </ul>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#003688', color: 'white' }}>
        <p className="text-sm italic">
          "The moral outrage is inversely proportional to the actual impact."
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Sources:</p>
        <p>MIT environmental impact research • Hannah Ritchie/Epoch AI • Our World in Data • ICCT aviation emissions data</p>
      </div>
    </div>
  );
};

export default EnvironmentalHypocrisyComparison;
