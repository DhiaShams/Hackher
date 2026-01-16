import React from 'react';
import { Activity, Clock, Book, Brain } from 'lucide-react';

const ParentsTab = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header */}
            <div className="text-center mb-8 border-b border-orange-200 pb-6">
                <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Fredoka', cursive" }}>Parents Dashboard 🛡️</h2>
                <p className="text-slate-500 mt-2">Monitor progress and customize the learning experience.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Reading Time"
                    value="45m"
                    sub="Today"
                    icon={<Clock size={24} className="text-blue-500" />}
                    color="bg-blue-50"
                />
                <MetricCard
                    label="Words Learned"
                    value="12"
                    sub="+3 from yesterday"
                    icon={<Book size={24} className="text-green-500" />}
                    color="bg-green-50"
                />
                <MetricCard
                    label="Accuracy"
                    value="92%"
                    sub="Top 10%"
                    icon={<Target size={24} className="text-purple-500" />}
                    color="bg-purple-50"
                />
                <MetricCard
                    label="Focus Score"
                    value="8.5"
                    sub="High Engagement"
                    icon={<Brain size={24} className="text-orange-500" />}
                    color="bg-orange-50"
                />
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
                    <Activity size={20} />
                    Weekly Activity
                </h3>
                <div className="h-40 flex items-end justify-between gap-2">
                    {[40, 60, 30, 80, 50, 90, 75].map((h, i) => (
                        <div key={i} className="w-full bg-orange-100 rounded-t-lg relative group">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-orange-400 rounded-t-lg transition-all hover:bg-orange-500"
                                style={{ height: `${h}%` }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">
                                    {h}m
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-bold uppercase">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            {/* Quick Settings */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-lg text-amber-900 mb-4">Quick Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🔊</div>
                            <div>
                                <div className="font-bold text-slate-700">TTS Speed</div>
                                <div className="text-xs text-slate-500">Adjust narration speed</div>
                            </div>
                        </div>
                        <select className="bg-slate-100 border-none rounded-lg p-2 text-sm font-bold text-slate-600">
                            <option>Normal</option>
                            <option>Slow</option>
                            <option>Fast</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">🛡️</div>
                            <div>
                                <div className="font-bold text-slate-700">Content Filter</div>
                                <div className="text-xs text-slate-500">Strict mode enabled</div>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, sub, icon, color }) => (
    <div className={`p-4 rounded-2xl ${color} border-2 border-transparent hover:border-black/5 transition-all`}>
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
);

// Missing Target Icon helper
const Target = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

export default ParentsTab;
