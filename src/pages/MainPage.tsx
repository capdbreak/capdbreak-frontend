import React, { useEffect, useState } from 'react';
import NewsByDate from '../components/NewsByDate';
import NewsViewer from '../components/NewsViewer';
import TradingViewWidget from '../components/TradingViewWidget';

interface TickerOption {
  ticker: string;
  name: string;
}

const tickers: TickerOption[] = [
  { ticker: 'MSFT', name: '마이크로소프트' },
  { ticker: 'NVDA', name: '엔비디아' },
  { ticker: 'AAPL', name: '애플' },
  { ticker: 'AMZN', name: '아마존' },
  { ticker: 'GOOGL', name: '구글' },
  { ticker: 'META', name: '메타' },
  { ticker: 'TSLA', name: '테슬라' },
  { ticker: 'AVGO', name: '브로드컴' },
  { ticker: 'NDX', name: 'NASDAQ 100' },
  { ticker: 'SPX', name: 'S&P 500' },
];

const getTradingViewSymbol = (ticker: string) => {
  if (ticker === 'SPX') return 'OANDA:SPX500USD';
  if (ticker === 'NDX') return 'INDEX:NDX';
  return `NASDAQ:${ticker}`;
};

const MainPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('MSFT');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedSymbol && selectedDate) {
      fetch(`/news/${selectedSymbol}/${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          setNews(data);
          setCurrentIndex(0);
        });
    }
  }, [selectedSymbol, selectedDate]);

  const total = news.length;
  const selectedTicker = tickers.find(t => t.ticker === selectedSymbol);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
<div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2">
      {tickers.map((item) => (
        <div 
          key={item.ticker} 
          className={`flex flex-col items-center cursor-pointer transition-all duration-200 px-3 py-2 rounded-lg ${
            selectedSymbol === item.ticker 
              ? 'bg-blue-600/20 shadow-md shadow-blue-500/20' 
              : 'hover:bg-gray-800'
          }`}
          onClick={() => {
            setSelectedSymbol(item.ticker);
            setSelectedDate(null);
            setNews([]);
            setCurrentIndex(0);
          }}
        >
          <img
            src={`/logos/${item.ticker}.png`}
            alt={item.name}
            className={`h-10 w-10 object-contain mb-1 ${
              selectedSymbol === item.ticker ? 'brightness-110' : 'opacity-80'
            }`}
          />
          <span className={`text-xs font-medium ${
            selectedSymbol === item.ticker ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {item.ticker}
          </span>
        </div>
      ))}
    </div>
    
    <button
      onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}
      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-sm font-medium flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      로그아웃
    </button>
  </div>
</div>


      {selectedSymbol && selectedTicker && (
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center space-x-4">
            <img src={`/logos/${selectedTicker.ticker}.png`} alt={selectedTicker.name} className="h-32 w-32 rounded" />
            <span className="text-6xl font-bold">{selectedTicker.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 h-max flex flex-col">
              <h3 className="text-xl font-bold mb-4 text-white">Chart</h3>
              <div className="flex-1 overflow-hidden">
                <TradingViewWidget symbol={getTradingViewSymbol(selectedSymbol)} />
              </div>
            </div>

            {/* News Section - Same height as chart */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 h-max flex flex-col">
              <h3 className="text-xl font-bold mb-4 text-white">News</h3>
              <div className="flex-1 overflow-y-auto">
                <NewsByDate symbol={selectedTicker.ticker} onSelect={setSelectedDate} sortDescending={true} />

                {!selectedDate && (
                  <p className="text-sm text-gray-500 mt-2">날짜를 선택하면 뉴스를 확인할 수 있습니다.</p>
                )}
                {selectedDate && news.length === 0 && (
                  <p className="text-gray-500 mt-4">해당 날짜의 뉴스가 없습니다.</p>
                )}

                {news.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-bold mb-2 text-white">
                      {selectedDate} 뉴스 ({news.length}건)
                    </h4>
                    <div className="overflow-y-auto">
                      <NewsViewer news={news} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
