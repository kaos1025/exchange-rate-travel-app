import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ExchangeRateCard({ pair, country, rate, diff, diffRate }) {
  const isUp = diff > 0;
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 transition hover:shadow-lg flex flex-col gap-2 min-w-[180px]">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>{pair}</span>
        <span>{country}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{rate.toLocaleString()}</div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-green-600" : "text-red-500"}`}>
        {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {diff > 0 ? "+" : ""}
        {diff.toFixed(2)} ({diffRate > 0 ? "+" : ""}
        {diffRate.toFixed(2)}%)
      </div>
    </div>
  );
} 