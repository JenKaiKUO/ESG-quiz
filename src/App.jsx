import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

function App() {
  const [allData, setAllData] = useState([]);
  const [currentChapter, setCurrentChapter] = useState('ch1');
  const [displayList, setDisplayList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    fetch(`/${currentChapter}.json`)
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        if (isRandom) {
          setDisplayList([...data].sort(() => Math.random() - 0.5));
        } else {
          setDisplayList(data);
        }
        setCurrentIndex(0);
      })
      .catch(err => console.log("讀取章節失敗", err));
  }, [currentChapter]);

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
    /* 鎖定視窗高度為 h-screen，禁止全域滾動 overflow-hidden */
    <div className="h-screen w-full bg-slate-50 flex flex-col items-center p-3 sm:p-5 overflow-hidden box-border">
      
      {/* 頂部：標題與資訊整合 (不縮放 shrink-0) */}
      <div className="w-full max-w-3xl shrink-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">ESG 永續題庫練習</h1>
          
          {/* 進度與跳題功能整合 */}
          <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <div>
              進度：<span className="text-blue-600">{currentIndex + 1}</span> / {displayList.length}
            </div>
            <div className="w-px h-4 bg-slate-300"></div> {/* 分隔線 */}
            <div className="flex items-center gap-1">
              跳至
              <input 
                type="number" 
                className="w-14 border rounded border-slate-300 px-1 py-0.5 text-center text-slate-800 focus:border-blue-500 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(e.target.value) - 1;
                    if (val >= 0 && val < displayList.length) setCurrentIndex(val);
                    e.target.value = ''; // 跳轉後清空輸入框
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 控制列：章節與模式 (不縮放 shrink-0) */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ch1', 'ch2', 'ch3', 'ch4'].map(ch => (
              <button
                key={ch}
                onClick={() => setCurrentChapter(ch)}
                className={`flex-none px-4 py-1.5 rounded-lg font-bold border transition-all text-sm sm:text-base ${
                  currentChapter === ch ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'
                }`}
              >
                第{ch.replace('ch', '')}章
              </button>
            ))}
          </div>
          <button 
            onClick={toggleMode}
            className="flex-none ml-2 px-4 py-1.5 bg-slate-800 text-white rounded-lg font-bold text-sm sm:text-base hover:bg-slate-700 transition-colors shadow-md"
          >
            {isRandom ? '隨機模式' : '順序模式'}
          </button>
        </div>
      </div>

      {/* 中間題目區塊：填滿剩餘高度 (flex-grow) 且內部限制高度 (min-h-0) */}
      <div className="w-full max-w-3xl flex-grow overflow-hidden min-h-0 mb-3">
        {displayList[currentIndex] && (
          <QuestionCard 
            key={`${currentChapter}-${displayList[currentIndex].id}-${isRandom}`} 
            data={displayList[currentIndex]} 
          />
        )}
      </div>

      {/* 底部按鈕：固定在最下方 (shrink-0) */}
      <div className="w-full max-w-3xl flex gap-3 shrink-0 pb-1 sm:pb-0">
        <button onClick={prevQ} disabled={currentIndex === 0}
          className="flex-1 py-3 sm:py-4 bg-white border border-slate-300 text-slate-700 rounded-xl font-black text-lg disabled:opacity-30 hover:bg-slate-100 shadow-sm transition-all"
        >
          上一題
        </button>
        <button onClick={nextQ} disabled={currentIndex === displayList.length - 1}
          className="flex-1 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-black text-lg disabled:opacity-30 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
        >
          下一題
        </button>
      </div>

    </div>
  );
}

export default App;
