import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

function App() {
  const [allData, setAllData] = useState([]);
  const [currentChapter, setCurrentChapter] = useState('ch1');
  const [displayList, setDisplayList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  
  // 新增狀態：控制側邊選單是否開啟
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* 頂部導覽列：只保留標題與選單按鈕 */}
      <header className="w-full h-14 bg-white border-b border-slate-200 flex justify-between items-center px-4 sm:px-6 shrink-0 shadow-sm z-10">
        <h1 className="text-xl font-black text-slate-800">ESG 永續題庫</h1>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-2"
        >
          <span className="text-sm font-bold text-slate-600 hidden sm:block">設定與進度</span>
          {/* 漢堡選單 Icon */}
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* 側邊抽屜選單 (Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* 黑色半透明背景 (點擊背景關閉選單) */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* 右側滑出面板 */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* 選單頭部 */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-black text-lg text-slate-800">設定與進度</h2>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-600"
              >
                {/* 關閉 Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 選單內容 */}
            <div className="p-6 flex flex-col gap-8 overflow-y-auto">
              
              {/* 區塊 1：進度與跳題 */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">目前進度</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-700 mb-3">
                    第 <span className="text-blue-600 text-2xl">{currentIndex + 1}</span> / {displayList.length} 題
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 border-t border-slate-200 pt-3">
                    跳至第
                    <input 
                      type="number" 
                      className="w-16 border rounded-lg border-slate-300 px-2 py-1 text-center text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(e.target.value) - 1;
                          if (val >= 0 && val < displayList.length) {
                            setCurrentIndex(val);
                            setIsMenuOpen(false); // 跳題後自動關閉選單
                          }
                          e.target.value = ''; 
                        }
                      }}
                    />
                    題
                  </div>
                </div>
              </div>

              {/* 區塊 2：章節選擇 */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">章節選擇</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['ch1', 'ch2', 'ch3', 'ch4'].map(ch => (
                    <button
                      key={ch}
                      onClick={() => {
                        setCurrentChapter(ch);
                        setIsMenuOpen(false); // 切換章節後自動關閉選單
                      }}
                      className={`py-2 rounded-lg font-bold border transition-all text-sm ${
                        currentChapter === ch 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400'
                      }`}
                    >
                      第{ch.replace('ch', '')}章
                    </button>
                  ))}
                </div>
              </div>

              {/* 區塊 3：測驗模式 */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">測驗模式</h3>
                <button 
                  onClick={() => {
                    toggleMode();
                    setIsMenuOpen(false); // 切換模式後自動關閉選單
                  }}
                  className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold text-base hover:bg-slate-700 transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  切換為 {isRandom ? '順序模式' : '隨機模式'}
                </button>
                <p className="mt-2 text-xs text-slate-400 text-center">目前為：{isRandom ? '隨機打亂' : '依序排列'}</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 中間主要內容區：極大化空間 */}
      <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col p-3 sm:p-5 overflow-hidden">
        
        {/* 題目卡片區塊 */}
        <div className="w-full flex-grow overflow-hidden min-h-0 mb-3">
          {displayList[currentIndex] && (
            <QuestionCard 
              key={`${currentChapter}-${displayList[currentIndex].id}-${isRandom}`} 
              data={displayList[currentIndex]} 
            />
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="w-full flex gap-3 shrink-0 pb-1 sm:pb-0">
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
      </main>

    </div>
  );
}

export default App;
