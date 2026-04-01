import React, { useState, useEffect } from 'react';

const QuestionCard = ({ data }) => {
  const [selected, setSelected] = useState(null);

  // 當題目 id 改變時，重置選擇狀態
  useEffect(() => {
    setSelected(null);
  }, [data.id]);

  // 自動拆解選項邏輯
  const parseContent = (text) => {
    const parts = text.split(/\(\d\)/);
    const questionText = parts[0].trim();
    const options = parts.slice(1).map(opt => opt.trim());
    return { questionText, options };
  };

  const { questionText, options } = parseContent(data.content);

  const handleSelect = (index) => {
    if (selected !== null) return; // 防止重複點擊
    setSelected(index + 1);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
      {/* 題目文本：占比放大 */}
      <div className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
        Q{data.id}: {questionText}
      </div>

      {/* 選項列表：垂直排列且占比大 */}
      <div className="flex flex-col gap-4">
        {options.map((opt, index) => {
          const optNum = index + 1;
          const isCorrect = optNum === parseInt(data.answer);
          const isSelected = optNum === selected;

          // 判斷背景顏色邏輯
          let btnStyle = "w-full p-5 text-xl text-left border-2 rounded-xl transition-all ";
          
          if (selected === null) {
            // 尚未選擇
            btnStyle += "border-gray-200 hover:border-blue-500 hover:bg-blue-50";
          } else {
            // 已經選擇
            if (isCorrect) {
              // 正確答案：永遠顯示綠色
              btnStyle += "border-green-500 bg-green-100 text-green-700 font-bold";
            } else if (isSelected && !isCorrect) {
              // 選錯了：顯示紅色
              btnStyle += "border-red-500 bg-red-100 text-red-700 font-bold";
            } else {
              // 其他沒選中的錯誤選項
              btnStyle += "border-gray-100 text-gray-400 opacity-60";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={btnStyle}
            >
              ({optNum}) {opt}
            </button>
          );
        })}
      </div>

      {/* 解析區塊：選完後顯示 */}
      {selected !== null && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <div className="text-blue-700 font-bold mb-2 text-lg">答案：({data.answer})</div>
          <div className="text-gray-600 text-lg leading-relaxed">
            <span className="font-bold text-gray-800">解析：</span>
            {data.analysis.replace(/[\[\]]/g, '').trim()}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;