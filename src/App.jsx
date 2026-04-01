import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

function App() {
  const [allData, setAllData] = useState([]); // 存放所有抓到的 JSON 內容
  const [currentChapter, setCurrentChapter] = useState('ch1'); // 目前選擇的章節
  const [displayList, setDisplayList] = useState([]); // 目前顯示的題目清單
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);

  // 1. 載入不同章節的資料
  useEffect(() => {
    fetch(`/${currentChapter}.json`)
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        // 初始化顯示清單
        if (isRandom) {
          setDisplayList([...data].sort(() => Math.random() - 0.5));
        } else {
          setDisplayList(data);
        }
        setCurrentIndex(0);
      })
      .catch(err => console.log("讀取章節失敗", err));
  }, [currentChapter]);

  // 2. 處理隨機/順序切換
  const toggleMode = () => {
    const nextMode = !isRandom;
    setIsRandom(nextMode);
    setCurrentIndex(0);
    if (nextMode) {
      setDisplayList([...allData].sort(() => Math.random() - 0.5));
    } else {
      setDisplayList(allData);
    }
  };

  const nextQ = () => { if (currentIndex < displayList.length - 1) setCurrentIndex(c => c + 1); };
  const prevQ = () => { if (currentIndex > 0) setCurrentIndex(c => c - 1); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* 標題 */}
      <h1 className="text-4xl font-black text-gray-900 mb-8">ESG 永續題庫練習</h1>

      {/* 章節選擇與模式控制 */}
      <div className="w-full max-w-4xl mb-6 space-y-4">
        <div className="flex justify-center gap-4">
          {['ch1', 'ch2', 'ch3', 'ch4', ].map(ch => (
            <button
              key={ch}
              onClick={() => setCurrentChapter(ch)}
              className={`px-6 py-2 rounded-lg font-bold border-2 transition-all ${
                currentChapter === ch ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
              }`}
            >
              第{ch.replace('ch', '')}章
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 px-8">
          <div className="text-gray-500 font-bold text-lg">
            進度：<span className="text-blue-600">{currentIndex + 1}</span> / {displayList.length}
          </div>
          <button 
            onClick={toggleMode}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
          >
            {isRandom ? '切換為順序模式' : '切換為隨機模式'}
          </button>
        </div>
      </div>

      {/* 題目區塊 */}
      <div className="w-full max-w-4xl">
        {displayList[currentIndex] && (
          <QuestionCard 
            key={`${currentChapter}-${displayList[currentIndex].id}-${isRandom}`} 
            data={displayList[currentIndex]} 
          />
        )}
      </div>

      {/* 底部按鈕 */}
      <div className="w-full max-w-4xl flex justify-between gap-6 mt-8">
        <button onClick={prevQ} disabled={currentIndex === 0}
          className="flex-1 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black text-xl disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"
        >
          上一題
        </button>
        <button onClick={nextQ} disabled={currentIndex === displayList.length - 1}
          className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl disabled:opacity-20 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          下一題
        </button>
      </div>

      {/* 跳題功能 */}
      <div className="mt-10 flex items-center gap-3 text-gray-400 text-lg">
        前往第 
        <input 
          type="number" 
          className="w-20 border-2 rounded-lg px-3 py-1 text-center font-bold text-gray-700 focus:border-blue-500 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt(e.target.value) - 1;
              if (val >= 0 && val < displayList.length) setCurrentIndex(val);
            }
          }}
        /> 
        題
      </div>
    </div>
  );
}

export default App;