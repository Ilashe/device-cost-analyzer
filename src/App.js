import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, XCircle, TrendingDown } from 'lucide-react';

export default function HourlyCostCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [ratePerHour, setRatePerHour] = useState('');
  const [deviceCost, setDeviceCost] = useState('');
  const [depreciationRate, setDepreciationRate] = useState('15'); // Default 15% annual depreciation
  const [reliabilityScore, setReliabilityScore] = useState('65'); // Device reliability 0-100

  // Calculate device value over time
  const calculateDepreciation = () => {
    if (!deviceCost) return {};
    
    const initialCost = parseFloat(deviceCost);
    const depRate = parseFloat(depreciationRate) / 100;
    
    const yearValues = {
      year0: initialCost,
      year1: initialCost * (1 - depRate),
      year2: initialCost * Math.pow(1 - depRate, 2),
      year3: initialCost * Math.pow(1 - depRate, 3),
      year4: initialCost * Math.pow(1 - depRate, 4),
      year5: initialCost * Math.pow(1 - depRate, 5)
    };
    
    return yearValues;
  };

  const deviceValues = calculateDepreciation();

  // Calculate average maintenance costs with AI discretion on reliability
  // Reliability score adjusts how often maintenance is actually needed
  const reliabilityFactor = parseFloat(reliabilityScore) / 100;
  
  // AI discretion: Highly reliable devices need less frequent maintenance
  // Factor ranges from 0.4 (very reliable, 90+ score) to 1.0 (needs constant maintenance)
  const maintenanceAdjustmentFactor = 1.2 - (reliabilityFactor * 0.8);
  
  const rawDaily = hoursPerDay && ratePerHour ? (parseFloat(hoursPerDay) * parseFloat(ratePerHour)) : 0;
  const averageDaily = rawDaily * maintenanceAdjustmentFactor;
  const averageWeekly = averageDaily * 5;
  const averageMonthly = averageWeekly * 4;
  const averageYearly = averageMonthly * 12;
  const averageFiveYears = averageYearly * 5;

  // AI Decision Logic with depreciation consideration
  const getRecommendation = () => {
    if (!deviceCost || !averageYearly) return null;

    const initialCost = parseFloat(deviceCost);
    const maintenanceCost = averageYearly;
    const fiveYearMaintenance = averageFiveYears;
    
    // Calculate residual value after 5 years
    const residualValue = deviceValues.year5 || 0;
    
    // Total cost = device cost - residual value + maintenance
    const netDeviceCost = initialCost - residualValue;
    const totalCost5Years = netDeviceCost + fiveYearMaintenance;

    // Calculate ratios
    const yearlyMaintenanceRatio = (maintenanceCost / initialCost) * 100;
    const fiveYearMaintenanceRatio = (fiveYearMaintenance / initialCost) * 100;
    const totalCostRatio = (totalCost5Years / initialCost) * 100;

    // Decision logic with more balanced thresholds
    let recommendation = '';
    let status = '';
    let reasoning = [];

    const avgYearlyRatio = yearlyMaintenanceRatio;

    if (avgYearlyRatio < 8) {
      status = 'excellent';
      recommendation = 'HIGHLY RECOMMENDED';
      reasoning.push('Average annual maintenance is less than 8% of device cost - excellent value');
      reasoning.push(`Device reliability score of ${reliabilityScore}% means minimal repair interventions needed`);
      reasoning.push('Very low operational expenses relative to initial investment');
    } else if (avgYearlyRatio < 15) {
      status = 'good';
      recommendation = 'RECOMMENDED';
      reasoning.push(`Average annual maintenance at ${avgYearlyRatio.toFixed(1)}% of device cost - solid investment`);
      reasoning.push(`With ${reliabilityScore}% reliability, most days will run without issues`);
      reasoning.push('Good balance between initial cost and realistic operating expenses');
    } else if (avgYearlyRatio < 25) {
      status = 'fair';
      recommendation = 'PROCEED WITH CAUTION';
      reasoning.push(`Average annual maintenance is ${avgYearlyRatio.toFixed(1)}% of device cost - moderate`);
      reasoning.push(`Device reliability at ${reliabilityScore}% suggests occasional downtime and repairs`);
      reasoning.push('Consider if the device productivity justifies this ongoing expense');
    } else if (avgYearlyRatio < 40) {
      status = 'poor';
      recommendation = 'NOT RECOMMENDED';
      reasoning.push(`Average annual maintenance is ${avgYearlyRatio.toFixed(1)}% of device cost - high`);
      reasoning.push(`Low reliability score (${reliabilityScore}%) indicates frequent maintenance needs`);
      reasoning.push('Significant operational costs relative to device value');
    } else {
      status = 'not-recommended';
      recommendation = 'STRONGLY NOT RECOMMENDED';
      reasoning.push('Annual maintenance costs are excessive relative to device value');
      reasoning.push(`Poor reliability (${reliabilityScore}%) means constant repairs and downtime`);
      reasoning.push('Consider alternatives or exploring more cost-effective solutions');
    }

    // Additional insights with 5-year perspective
    if (residualValue > initialCost * 0.2) {
      reasoning.push(`Device retains ${((residualValue / initialCost) * 100).toFixed(1)}% value after 5 years - good resale potential`);
    }

    if (fiveYearMaintenance > initialCost * 1.5) {
      reasoning.push(`Over 5 years, maintenance costs will reach ${(fiveYearMaintenance / initialCost).toFixed(1)}x the initial investment`);
    } else if (fiveYearMaintenance < initialCost * 0.5) {
      reasoning.push(`Over 5 years, total maintenance is only ${(fiveYearMaintenance / initialCost).toFixed(1)}x the device cost - very economical`);
    }

    return {
      recommendation,
      status,
      reasoning,
      yearlyMaintenanceRatio: yearlyMaintenanceRatio.toFixed(1),
      fiveYearMaintenanceRatio: fiveYearMaintenanceRatio.toFixed(1),
      totalCost5Years: totalCost5Years.toFixed(2),
      netDeviceCost: netDeviceCost.toFixed(2),
      residualValue: residualValue.toFixed(2),
      breakEvenPoint: (initialCost / averageYearly).toFixed(1),
      reliabilityMessage: reliabilityScore >= 80 ? 'Highly Reliable' : reliabilityScore >= 60 ? 'Moderately Reliable' : 'Needs Frequent Service'
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
  <div className="flex flex-col items-center mb-4">
    {/* AVW Logo */}
    <img 
      src="/avw-logo.jpg" 
      alt="AVW Logo"
      className="h-40 w-40 mb-4 object-contain"
    />
  </div>
  
  <div className="flex items-center justify-center gap-3 mb-2">
    <div className="bg-indigo-600 p-3 rounded-xl">
      <Calculator className="text-white" size={28} />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
      AVW Device Cost Analyzer
    </h1>
  </div>
  <p className="text-gray-600 text-center">
    Calculate average maintenance costs with depreciation and get AI-powered recommendations
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
                Average Hours Per Day
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  placeholder="e.g., 4"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  hours
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Average across all workdays</p>
            </div>

            {/* Rate Per Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Maintenance Cost Per Hour
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(e.target.value)}
                  placeholder="e.g., 8.50"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  USD/hr
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Average repair & service cost</p>
            </div>

            {/* Device Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Device Cost
              </label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deviceCost}
                  onChange={(e) => setDeviceCost(e.target.value)}
                  placeholder="e.g., 2000.00"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  USD
                </span>
              </div>
            </div>

            {/* Depreciation Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Depreciation Rate
              </label>
              <div className="relative">
                <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={depreciationRate}
                  onChange={(e) => setDepreciationRate(e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Typical: 10-20% for electronics</p>
            </div>

            {/* Reliability Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Reliability Score
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={reliabilityScore}
                  onChange={(e) => setReliabilityScore(e.target.value)}
                  placeholder="e.g., 65"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                  /100
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">0=Always needs repair, 100=Never breaks</p>
            </div>
          </div>
        </div>

        {/* Device Depreciation Section */}
        {deviceCost && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingDown className="text-indigo-600" size={24} />
              Device Value Over Time
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border-2 border-indigo-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Purchase Year</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(deviceValues.year0)}</p>
                <p className="text-xs text-gray-500 mt-2">Year 0</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm font-medium text-gray-600 mb-2">After 1 Year</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(deviceValues.year1)}</p>
                <p className="text-xs text-gray-500 mt-2">{((1 - ((deviceValues.year1 || 0) / (deviceValues.year0 || 1))) * 100).toFixed(0)}% depreciated</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-xl border-2 border-cyan-200">
                <p className="text-sm font-medium text-gray-600 mb-2">After 2 Years</p>
                <p className="text-2xl font-bold text-cyan-600">{formatCurrency(deviceValues.year2)}</p>
                <p className="text-xs text-gray-500 mt-2">{((1 - ((deviceValues.year2 || 0) / (deviceValues.year0 || 1))) * 100).toFixed(0)}% depreciated</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-4 rounded-xl border-2 border-teal-200">
                <p className="text-sm font-medium text-gray-600 mb-2">After 3 Years</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(deviceValues.year3)}</p>
                <p className="text-xs text-gray-500 mt-2">{((1 - ((deviceValues.year3 || 0) / (deviceValues.year0 || 1))) * 100).toFixed(0)}% depreciated</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <p className="text-sm font-medium text-gray-600 mb-2">After 4 Years</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(deviceValues.year4)}</p>
                <p className="text-xs text-gray-500 mt-2">{((1 - ((deviceValues.year4 || 0) / (deviceValues.year0 || 1))) * 100).toFixed(0)}% depreciated</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-lime-50 p-4 rounded-xl border-2 border-emerald-200">
                <p className="text-sm font-medium text-gray-600 mb-2">After 5 Years</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(deviceValues.year5)}</p>
                <p className="text-xs text-gray-500 mt-2">{((1 - ((deviceValues.year5 || 0) / (deviceValues.year0 || 1))) * 100).toFixed(0)}% depreciated</p>
              </div>
            </div>
          </div>
        )}

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
                  <p className="text-sm opacity-90">Based on average costs and depreciation analysis</p>
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white border-opacity-30">
                  <div>
                    <p className="text-sm opacity-80">Device Reliability</p>
                    <p className="text-2xl font-bold">{reliabilityScore}%</p>
                    <p className="text-xs opacity-70">{decision.reliabilityMessage}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Avg Yearly Maintenance</p>
                    <p className="text-2xl font-bold">{decision.yearlyMaintenanceRatio}%</p>
                    <p className="text-xs opacity-70">of device cost</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Residual Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(decision.residualValue)}</p>
                    <p className="text-xs opacity-70">after 5 years</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Net 5-Year Cost</p>
                    <p className="text-2xl font-bold">{formatCurrency(decision.totalCost5Years)}</p>
                    <p className="text-xs opacity-70">with depreciation</p>
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
              Average Maintenance Cost Breakdown
            </h2>

            {/* Daily */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Average Daily Maintenance</p>
                  <p className="text-4xl font-bold">{formatCurrency(averageDaily)}</p>
                  <p className="text-green-100 text-sm mt-2">
                    {hoursPerDay} hrs × {formatCurrency(ratePerHour)}/hr
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
                  <p className="text-blue-100 text-sm font-medium mb-1">Average Weekly Maintenance</p>
                  <p className="text-4xl font-bold">{formatCurrency(averageWeekly)}</p>
                  <p className="text-blue-100 text-sm mt-2">
                    5 working days
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
                  <p className="text-purple-100 text-sm font-medium mb-1">Average Monthly Maintenance</p>
                  <p className="text-4xl font-bold">{formatCurrency(averageMonthly)}</p>
                  <p className="text-purple-100 text-sm mt-2">
                    4 weeks per month
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
                  <p className="text-orange-100 text-sm font-medium mb-1">Average Yearly Maintenance</p>
                  <p className="text-4xl font-bold">{formatCurrency(averageYearly)}</p>
                  <p className="text-orange-100 text-sm mt-2">
                    12 months per year
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <Calculator size={32} />
                </div>
              </div>
            </div>

            {/* 5 Years */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300 text-sm font-medium mb-1">Average 5-Year Maintenance</p>
                  <p className="text-4xl font-bold">{formatCurrency(averageFiveYears)}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    Total maintenance expenses
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <DollarSign size={32} />
                </div>
              </div>
            </div>

            {/* Summary Table */}
<div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Average Cost Summary</h3>
  <table className="w-full">
    <thead>
      <tr className="border-b-2 border-gray-200">
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">Period</th>
        <th className="text-right py-3 px-4 text-gray-700 font-semibold">Avg Maintenance Cost</th>
        {deviceCost && (
          <th className="text-right py-3 px-4 text-gray-700 font-semibold">% of Device Cost</th>
        )}
      </tr>
    </thead>

    <tbody>
      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-gray-600">Daily</td>
        <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(averageDaily)}</td>
        {deviceCost && (
          <td className="py-3 px-4 text-right text-gray-600">
            {((averageDaily / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
        )}
      </tr>

      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-gray-600">Weekly (5 days)</td>
        <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(averageWeekly)}</td>
        {deviceCost && (
          <td className="py-3 px-4 text-right text-gray-600">
            {((averageWeekly / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
        )}
      </tr>

      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-gray-600">Monthly (4 weeks)</td>
        <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(averageMonthly)}</td>
        {deviceCost && (
          <td className="py-3 px-4 text-right text-gray-600">
            {((averageMonthly / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
        )}
      </tr>

      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-gray-600">Yearly (12 months)</td>
        <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(averageYearly)}</td>
        {deviceCost && (
          <td className="py-3 px-4 text-right text-gray-600">
            {((averageYearly / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
        )}
      </tr>

      <tr className="bg-gray-50 border-b-2 border-gray-300">
        <td className="py-3 px-4 text-gray-800 font-semibold">5 Years</td>
        <td className="py-3 px-4 text-right font-bold text-indigo-600 text-lg">
          {formatCurrency(averageFiveYears)}
        </td>
        {deviceCost && (
          <td className="py-3 px-4 text-right font-bold text-indigo-600">
            {((averageFiveYears / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
        )}
      </tr>

      {deviceCost && (
        <tr className="bg-indigo-50">
          <td className="py-3 px-4 text-gray-800 font-semibold">Initial Device Cost</td>
          <td className="py-3 px-4 text-right font-bold text-gray-800">
            {formatCurrency(parseFloat(deviceCost))}
          </td>
          <td className="py-3 px-4 text-right text-gray-600">100%</td>
        </tr>
      )}

      {deviceCost && (
        <tr className="bg-indigo-100">
          <td className="py-3 px-4 text-gray-900 font-bold">Total Cost (5 yrs with depreciation)</td>
          <td className="py-3 px-4 text-right font-bold text-indigo-700 text-xl">
            {formatCurrency(parseFloat(deviceCost) - (deviceValues.year5 || 0) + averageFiveYears)}
          </td>
          <td className="py-3 px-4 text-right font-bold text-indigo-700">
            {(((parseFloat(deviceCost) - (deviceValues.year5 || 0) + averageFiveYears) / parseFloat(deviceCost)) * 100).toFixed(2)}%
          </td>
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
              Enter average maintenance details to see cost analysis
            </p>
            <p className="text-gray-400 text-sm">
              Add device cost and depreciation rate to get AI-powered purchase recommendation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
