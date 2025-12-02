import React, { useState, useEffect, useCallback } from 'react';
import { ArtStyle } from './types';
import { checkApiKey, generateTetBackground } from './services/geminiService';
import ApiKeyModal from './components/ApiKeyModal';
import CardPreview from './components/CardPreview';

const DEFAULT_WISHES = [
  "Vạn sự như ý\nTỷ sự như mơ",
  "Tiền vào như nước\nTiền ra nhỏ giọt",
  "Năm mới bình an\nGia đạo hạnh phúc",
  "Mã đáo thành công\nSự nghiệp thăng tiến",
  "Tấn tài tấn lộc\nTấn bình an"
];

function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(true);
  
  // Form State
  const [name, setName] = useState('');
  const [wish, setWish] = useState(DEFAULT_WISHES[0]);
  const [style, setStyle] = useState<ArtStyle>(ArtStyle.TRADITIONAL);
  
  // Generation State
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial Check
  useEffect(() => {
    const verifyKey = async () => {
      try {
        const isValid = await checkApiKey();
        setHasKey(isValid);
        if (isValid) setShowKeyModal(false);
      } catch (e) {
        console.error("Key check failed", e);
      }
    };
    verifyKey();
  }, []);

  const handleKeySuccess = () => {
    setHasKey(true);
    setShowKeyModal(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!hasKey) {
      setShowKeyModal(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null); // Clear previous to show loading state cleanly

    try {
      const imageBase64 = await generateTetBackground(style);
      setGeneratedImage(imageBase64);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.");
      // If unauthorized, prompt for key again
      if (err.message?.includes("403") || err.message?.includes("API key")) {
        setHasKey(false);
        setShowKeyModal(true);
      }
    } finally {
      setLoading(false);
    }
  }, [hasKey, style]);

  const randomizeWish = () => {
    const random = DEFAULT_WISHES[Math.floor(Math.random() * DEFAULT_WISHES.length)];
    setWish(random);
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/red-paper.png')] bg-red-50 text-gray-800 font-sans selection:bg-red-200">
      {!hasKey && showKeyModal && <ApiKeyModal onSuccess={handleKeySuccess} />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-red-900/95 backdrop-blur shadow-lg border-b border-yellow-500">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐴</span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-yellow-400 font-serif leading-none">
                Tết Bính Ngọ 2026
              </h1>
              <p className="text-xs text-red-200">AI Card Creator</p>
            </div>
          </div>
          {hasKey && (
             <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded-full border border-green-700">
               Connected
             </span>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Column: Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-600">
              <h2 className="text-lg font-bold text-red-800 mb-4 border-b pb-2">Thông tin thiệp</h2>
              
              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên người gửi</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Gia đình Hùng"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-none"
                  maxLength={30}
                />
              </div>

              {/* Wish Input */}
              <div className="mb-4 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">Lời chúc</label>
                  <button 
                    onClick={randomizeWish}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                  >
                    🎲 Gợi ý
                  </button>
                </div>
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Nhập lời chúc..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-none resize-none"
                  maxLength={100}
                />
              </div>

              {/* Style Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phong cách ảnh nền</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(ArtStyle).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`text-left px-4 py-3 rounded-lg border transition flex items-center justify-between ${
                        style === s 
                          ? 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm font-medium truncate">{s}</span>
                      {style === s && <span className="text-red-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all flex items-center justify-center gap-2 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 hover:shadow-red-500/30 hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang tạo ảnh...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Tạo Thiệp Mới</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="w-full lg:w-1/3 lg:max-w-[400px]">
             <div className="sticky top-24">
                <CardPreview 
                    imageData={generatedImage}
                    senderName={name}
                    wishText={wish}
                    isLoading={loading}
                />
                
                {generatedImage && !loading && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">Chụp màn hình hoặc nhấn giữ ảnh để lưu</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>© 2026 Tet Binh Ngo App. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;