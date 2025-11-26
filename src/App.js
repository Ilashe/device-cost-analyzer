import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function HourlyCostCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');
  const [deviceCost, setDeviceCost] = useState('');

  // Calculations
  const daily = hoursPerDay && ratePerHour ? hoursPerDay * ratePerHour : 0;
  const weekly = daily * 5; // 5 working days
  const monthly = weekly * 4; // 4 weeks
  const yearly = monthly * 12; // 12 months
  const fourYears = yearly * 4; // 4 years

  // AI Decision Logic
  const getRecommendation = () => {
    if (!deviceCost || !yearly) return null;

    const cost = parseFloat(deviceCost);
    const maintenanceCost = yearly;
    const fourYearMaintenance = fourYears;
    const totalCost4Years = cost + fourYearMaintenance;

    // Calculate ratios
    const yearlyMaintenanceRatio = (maintenanceCost / cost) * 100;
    const fourYearMaintenanceRatio = (fourYearMaintenance / cost) * 100;
    const totalCostRatio = (totalCost4Years / cost) * 100;

    // Decision logic
    let recommendation = '';
    let status = ''; // 'excellent', 'good', 'fair', 'poor', 'not-recommended'
    let reasoning = [];

    if (yearlyMaintenanceRatio < 10) {
      status = 'excellent';
      recommendation = 'HIGHLY RECOMMENDED';
      reasoning.push('Annual maintenance cost is less than 10% of device cost - excellent value');
      reasoning.push('Very low operational expenses relative to initial investment');
    } else if (yearlyMaintenanceRatio < 25) {
      status = 'good';
      recommendation = 'RECOMMENDED';
      reasoning.push('Annual maintenance cost is reasonable at ' + yearlyMaintenanceRatio.toFixed(1) + '% of device cost');
      reasoning.push('Good balance between initial cost and operating expenses');
    } else if (yearlyMaintenanceRatio < 50) {
      status = 'fair';
      recommendation = 'PROCEED WITH CAUTION';
      reasoning.push('Annual maintenance cost is ' + yearlyMaintenanceRatio.toFixed(1) + '% of device cost - moderately high');
      reasoning.push('Consider if the device productivity justifies this ongoing expense');
    } else if (yearlyMaintenanceRatio < 100) {
      status = 'poor';
      recommendation = 'NOT RECOMMENDED';
      reasoning.push('Annual maintenance cost is ' + yearlyMaintenanceRatio.toFixed(1) + '% of device cost - very high');
      reasoning.push('You will spend nearly as much on maintenance as the device cost itself each year');
    } else {
      status = 'not-recommended';
      recommendation = 'STRONGLY NOT RECOMMENDED';
      reasoning.push('Annual maintenance exceeds device cost - economically unsustainable');
      reasoning.push('Consider alternatives or more efficient solutions');
    }

    // Additional insights
    if (fourYearMaintenance > cost * 2) {
      reasoning.push('Over 4 years, maintenance will cost ' + (fourYearMaintenance / cost).toFixed(1) + 'x the device price');
    }

    if (totalCost4Years > cost * 3) {
      reasoning.push('Total 4-year cost is ' + (totalCost4Years / cost).toFixed(1) + 'x the initial investment');
    }

    return {
      recommendation,
      status,
      reasoning,
      yearlyMaintenanceRatio: yearlyMaintenanceRatio.toFixed(1),
      fourYearMaintenanceRatio: fourYearMaintenanceRatio.toFixed(1),
      totalCost4Years,
      breakEvenPoint: (cost / yearly).toFixed(1) // Years to break even
    };
  };

  const decision = getRecommendation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'from-green-500 to-emerald-600';
      case 'good': return 'from-blue-500 to-indigo-600';
      case 'fair': return 'from-yellow-500 to-orange-500';
      case 'poor': return 'from-orange-600 to-red-600';
      case 'not-recommended': return 'from-red-600 to-red-800';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'excellent': return <CheckCircle size={48} />;
      case 'good': return <CheckCircle size={48} />;
      case 'fair': return <AlertCircle size={48} />;
      case 'poor': return <XCircle size={48} />;
      case 'not-recommended': return <XCircle size={48} />;
      default: return <Calculator size={48} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Calculator className="text-white" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Device Cost Analyzer
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Calculate maintenance costs and get AI-powered purchase recommendations
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="text-indigo-600" size={24} />
            Input Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hours Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours Worked Per Day
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  placeholder="e.g., 8"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  hours
                </span>
              </div>
            </div>

            {/* Rate Per Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Per Hour (Maintenance Cost)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(e.target.value)}
                  placeholder="e.g., 25.00"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  USD
                </span>
              </div>
            </div>

            {/* Device Cost - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Device/Equipment Cost
              </label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deviceCost}
                  onChange={(e) => setDeviceCost(e.target.value)}
                  placeholder="e.g., 5000.00"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  USD
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter the purchase price of the device or equipment
              </p>
            </div>
          </div>
        </div>

        {/* AI Recommendation Section */}
        {decision && (
          <div className={`bg-gradient-to-r ${getStatusColor(decision.status)} rounded-2xl shadow-2xl p-8 mb-6 text-white`}>
            <div className="flex items-start gap-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4 flex-shrink-0">
                {getStatusIcon(decision.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={24} />
                  <h2 className="text-2xl font-bold">AI Purchase Recommendation</h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
                  <p className="text-3xl font-bold mb-2">{decision.recommendation}</p>
                  <p className="text-sm opacity-90">Based on cost-benefit analysis</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-2">Analysis:</h3>
                  {decision.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-white bg-opacity-30 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="flex-1">{reason}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white border-opacity-30">
                  <div>
                    <p className="text-sm opacity-80">Yearly Maintenance</p>
                    <p className="text-2xl font-bold">{decision.yearlyMaintenanceRatio}%</p>
                    <p className="text-xs opacity-70">of device cost</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">4-Year Maintenance</p>
                    <p className="text-2xl font-bold">{decision.fourYearMaintenanceRatio}%</p>
                    <p className="text-xs opacity-70">of device cost</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total 4-Year Cost</p>
                    <p className="text-2xl font-bold">{formatCurrency(decision.totalCost4Years)}</p>
                    <p className="text-xs opacity-70">device + maintenance</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Break-Even Point</p>
                    <p className="text-2xl font-bold">{decision.breakEvenPoint}</p>
                    <p className="text-xs opacity-70">years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(hoursPerDay && ratePerHour) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 bg-white rounded-xl p-4 shadow">
              Maintenance Cost Breakdown
            </h2>

            {/* Daily */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Daily Maintenance Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(daily)}</p>
                  <p className="text-green-100 text-sm mt-2">
                    {hoursPerDay} hours × {formatCurrency(ratePerHour)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <Clock size={32} />
                </div>
              </div>
            </div>

            {/* Weekly */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Weekly Maintenance Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(weekly)}</p>
                  <p className="text-blue-100 text-sm mt-2">
                    5 working days × {formatCurrency(daily)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <Calculator size={32} />
                </div>
              </div>
            </div>

            {/* Monthly */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Monthly Maintenance Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(monthly)}</p>
                  <p className="text-purple-100 text-sm mt-2">
                    4 weeks × {formatCurrency(weekly)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <DollarSign size={32} />
                </div>
              </div>
            </div>

            {/* Yearly */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Yearly Maintenance Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(yearly)}</p>
                  <p className="text-orange-100 text-sm mt-2">
                    12 months × {formatCurrency(monthly)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <Calculator size={32} />
                </div>
              </div>
            </div>

            {/* 4 Years */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300 text-sm font-medium mb-1">4 Years Maintenance Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(fourYears)}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    4 years × {formatCurrency(yearly)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <DollarSign size={32} />
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Cost Summary</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Period</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Maintenance Cost</th>
                    {deviceCost && <th className="text-right py-3 px-4 text-gray-700 font-semibold">% of Device Cost</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Daily</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(daily)}</td>
                    {deviceCost && <td className="py-3 px-4 text-right text-gray-600">{((daily / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Weekly (5 days)</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(weekly)}</td>
                    {deviceCost && <td className="py-3 px-4 text-right text-gray-600">{((weekly / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Monthly (4 weeks)</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(monthly)}</td>
                    {deviceCost && <td className="py-3 px-4 text-right text-gray-600">{((monthly / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Yearly (12 months)</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(yearly)}</td>
                    {deviceCost && <td className="py-3 px-4 text-right text-gray-600">{((yearly / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>}
                  </tr>
                  <tr className="bg-gray-50 border-b-2 border-gray-300">
                    <td className="py-3 px-4 text-gray-800 font-semibold">4 Years</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-600 text-lg">{formatCurrency(fourYears)}</td>
                    {deviceCost && <td className="py-3 px-4 text-right font-bold text-indigo-600">{((fourYears / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>}
                  </tr>
                  {deviceCost && (
                    <tr className="bg-indigo-50">
                      <td className="py-3 px-4 text-gray-800 font-semibold">Device Cost</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-800">{formatCurrency(parseFloat(deviceCost))}</td>
                      <td className="py-3 px-4 text-right text-gray-600">100%</td>
                    </tr>
                  )}
                  {deviceCost && (
                    <tr className="bg-indigo-100">
                      <td className="py-3 px-4 text-gray-900 font-bold">Total 4-Year Cost</td>
                      <td className="py-3 px-4 text-right font-bold text-indigo-700 text-xl">{formatCurrency(parseFloat(deviceCost) + fourYears)}</td>
                      <td className="py-3 px-4 text-right font-bold text-indigo-700">{(((parseFloat(deviceCost) + fourYears) / parseFloat(deviceCost)) * 100).toFixed(2)}%</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!hoursPerDay || !ratePerHour) && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calculator className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">
              Enter maintenance details to see cost analysis
            </p>
            <p className="text-gray-400 text-sm">
              Add device cost to get AI-powered purchase recommendation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
