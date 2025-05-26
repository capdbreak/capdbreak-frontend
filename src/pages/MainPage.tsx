import React, { useEffect, useState } from 'react';
import NewsByDate from '../components/NewsByDate';
import NewsViewer from '../components/NewsViewer';
import TradingViewWidget from '../components/TradingViewWidget';

interface TickerOption {
  ticker: string;
  name: string;
}

interface User {
  email: string;
  email_opt_in: boolean;
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
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


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

  const handleEmailOptInToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsUpdating(true);
    try {
      const response = await fetch('https://api.capdbreak-finance-flow.uk/settings/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_token: token,
          email_opt_in: !emailOptIn,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEmailOptIn(result.email_opt_in);
        setUser(prev => prev ? { ...prev, email_opt_in: result.email_opt_in } : null);
      } else {
        console.error('Failed to update email preference');
      }
    } catch (error) {
      console.error('Error updating email preference:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
          
          <div className="flex items-center space-x-3">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium flex items-center gap-2 border border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              설정
            </button>
            
            {/* Logout Button */}
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

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">설정</h3>
            
            {user && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">이메일 주소</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">뉴스레터 구독</h4>
                    <p className="text-sm text-gray-400">
                      중요한 뉴스와 업데이트를 이메일로 받아보세요
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleEmailOptInToggle}
                      disabled={isUpdating}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                        emailOptIn ? 'bg-blue-600' : 'bg-gray-600'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailOptIn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    {isUpdating && (
                      <div className="ml-2">
                        <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    {emailOptIn ? '뉴스레터가 활성화되었습니다.' : '뉴스레터가 비활성화되었습니다.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
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

            {/* News Section */}
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
