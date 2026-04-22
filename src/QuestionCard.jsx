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
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col overflow-hidden animate-in">
      
      {/* 1. 題目：固定在上方，加上底線與下方內容做視覺區隔 */}
      <div className="text-lg sm:text-xl font-bold text-slate-800 mb-4 shrink-0 leading-snug border-b border-slate-100 pb-4">
        <span className="text-blue-600 mr-2">Q{data.id}</span>
        {questionText}
      </div>

      {/* 2. 可滾動內容區：讓選項與解析待在同一個空間，自然往下排列 */}
      <div className="flex flex-col flex-grow overflow-y-auto pr-2 custom-scrollbar min-h-0">
        
        {/* 選項列表 */}
        <div className="flex flex-col gap-3 shrink-0">
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

        {/* 解析區塊：緊跟在選項下方，設定 mt-6 產生適當距離 */}
        {selected !== null && (
          <div className="mt-6 mb-2 p-4 sm:p-5 bg-slate-50 rounded-xl border-l-4 border-blue-500 shrink-0 animate-in">
            <div className="text-blue-700 font-black mb-2 text-sm sm:text-base">
              正確答案：({data.answer})
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <span className="font-bold text-slate-800">解析：</span>
              {data.analysis.replace(/[\[\]]/g, '').trim()}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default QuestionCard;
