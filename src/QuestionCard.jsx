import React, { useState, useEffect } from 'react';

const QuestionCard = ({ data }) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [data.id]);

  const parseContent = (text) => {
    const parts = text.split(/\(\d\)/);
    const questionText = parts[0].trim();
    const options = parts.slice(1).map(opt => opt.trim());
    return { questionText, options };
  };

  const { questionText, options } = parseContent(data.content);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index + 1);
  };

  return (
    /* h-full 讓卡片填滿 App.jsx 分配給它的空間，flex-col 進行內部排版 */
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col overflow-hidden animate-in">
      
      {/* 題目：固定高度，不縮放 (shrink-0) */}
      <div className="text-lg sm:text-xl font-bold text-slate-800 mb-3 shrink-0 leading-snug">
        <span className="text-blue-600 mr-2">Q{data.id}</span>
        {questionText}
      </div>

      {/* 選項區塊：填滿剩餘高度 (grow)，若選項過多則內部滾動 (overflow-y-auto) */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-2 grow min-h-0 custom-scrollbar">
        {options.map((opt, index) => {
          const optNum = index + 1;
          const isCorrect = optNum === parseInt(data.answer);
          const isSelected = optNum === selected;

          let btnStyle = "w-full p-3 sm:p-4 text-base sm:text-lg text-left border-2 rounded-xl transition-all duration-200 shrink-0 ";
          
          if (selected === null) {
            btnStyle += "border-slate-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700 shadow-sm";
          } else {
            if (isCorrect) btnStyle += "border-green-500 bg-green-50 text-green-700 font-bold";
            else if (isSelected && !isCorrect) btnStyle += "border-red-500 bg-red-50 text-red-700 font-bold";
            else btnStyle += "border-slate-50 text-slate-300 opacity-50";
          }

          return (
            <button key={index} onClick={() => handleSelect(index)} className={btnStyle}>
              <span className="inline-block w-8 font-mono">({optNum})</span> {opt}
            </button>
          );
        })}
      </div>

      {/* 解析區塊：限制最大高度 (max-h)，超過則內部滾動，不會推擠下方佈局 */}
      {selected !== null && (
        <div className="mt-3 p-3 sm:p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500 shrink-0 max-h-32 sm:max-h-40 overflow-y-auto custom-scrollbar">
          <div className="text-blue-700 font-black mb-1 text-sm sm:text-base">
            答案：({data.answer})
          </div>
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <span className="font-bold text-slate-800">解析：</span>
            {data.analysis.replace(/[\[\]]/g, '').trim()}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
