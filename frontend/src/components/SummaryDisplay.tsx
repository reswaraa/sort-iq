import React from "react";
import {
  WasteCategory,
  WeightSummaryResponse,
  getCategoryLabel,
  getCategoryColor,
} from "../types";

interface SummaryDisplayProps {
  summary: WeightSummaryResponse;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const getTotalWeight = () => {
    return summary.total_weight;
  };

  const getPercentage = (category: WasteCategory) => {
    const totalWeight = getTotalWeight();
    const categoryWeight = summary.weights[category];

    if (totalWeight === 0 || categoryWeight === undefined) return 0;

    return (categoryWeight / totalWeight) * 100;
  };

  const getBarColorClass = (category: WasteCategory) => {
    const color = getCategoryColor(category);

    switch (color) {
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "orange":
        return "bg-orange-500";
      case "yellow":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Waste Summary</h2>
        <p className="text-gray-600">
          Total collected: {summary.total_weight.toFixed(2)} kg
        </p>
      </div>

      <div className="space-y-6">
        {Object.values(WasteCategory).map((category) => (
          <div key={category} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{getCategoryLabel(category)}</span>
              <span>
                {summary.weights[category]
                  ? summary.weights[category].toFixed(2)
                  : "0.00"}{" "}
                kg ({getPercentage(category).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColorClass(category)}`}
                style={{ width: `${getPercentage(category)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryDisplay;
