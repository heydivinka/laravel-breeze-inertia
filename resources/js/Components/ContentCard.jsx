// resources/js/Components/ContentCard.jsx

import React from 'react';

export default function ContentCard({ title, children, className = '' }) {
    return (
        // The card container: a subtle dark background with soft borders and a light shadow
        <div
            className={`bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-slate-950/50 p-6 transition-all duration-300 ${className}`}
        >
            {/* Optional Title/Header */}
            {title && (
                <div className="pb-4 mb-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-emerald-400">
                        {title}
                    </h2>
                </div>
            )}
            
            {/* Content Area */}
            <div className="text-slate-200">
                {children}
            </div>
        </div>
    );
}