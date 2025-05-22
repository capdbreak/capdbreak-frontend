import React from 'react';

// badgeColor function for sentiment indicators
const badgeColor = (value: string | null) => {
  switch (value) {
    case '긍정': return 'bg-green-100 text-green-800';
    case '부정': return 'bg-red-100 text-red-800';
    case '중립': return 'bg-gray-100 text-gray-800';
    case '높음': return 'bg-orange-100 text-orange-800';
    case '낮음': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// News item interface
interface NewsItem {
  title: string;
  real_url: string;
  valence: string | null;
  arousal: string | null;
  importance: string | null;
  summary: string | null;
}

const NewsViewer = ({ news }: { news: NewsItem[] }) => {
  if (!news || news.length === 0) return null;

  return (
    <div className="space-y-6">
      {news.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Summary first - highlighted with a gradient background */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
            <div className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
              {item.summary || '요약이 없습니다.'}
            </div>
          </div>

          {/* Title and metadata in a cleaner layout */}
          <div className="p-5 flex flex-col space-y-3">
            <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
            
            {/* Sentiment badges in a sleek horizontal layout */}
            <div className="flex flex-wrap gap-2 text-sm">
              {item.valence && (
                <span className={`px-3 py-1 rounded-full font-medium ${badgeColor(item.valence)}`}>
                  Balance: {item.valence}
                </span>
              )}
              {item.arousal && (
                <span className={`px-3 py-1 rounded-full font-medium ${badgeColor(item.arousal)}`}>
                  Arousal: {item.arousal}
                </span>
              )}
              {item.importance && (
                <span className={`px-3 py-1 rounded-full font-medium ${badgeColor(item.importance)}`}>
                  Importance: {item.importance}
                </span>
              )}
            </div>
            
            {/* Source link as a button */}
            <div className="mt-2">
              <a
                href={item.real_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <span className="mr-1">뉴스 원문 확인</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                  <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsViewer;