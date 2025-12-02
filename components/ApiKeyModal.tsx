import React from 'react';
import { promptForKeySelection } from '../services/geminiService';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess }) => {
  const handleConnect = async () => {
    try {
      await promptForKeySelection();
      // We assume success if the dialog closes and we proceed (handling race conditions in parent)
      onSuccess();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center border-4 border-yellow-500">
        <div className="mb-6 flex justify-center">
             <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.41z"/>
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-red-800 mb-4 font-serif">Kết nối Google AI</h2>
        <p className="text-gray-600 mb-6">
          Để tạo ảnh chất lượng cao (Gemini 3 Pro), bạn cần kết nối tài khoản Google Cloud (có tính phí).
        </p>
        <button
          onClick={handleConnect}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 w-full flex items-center justify-center gap-2"
        >
          <span>🔑 Chọn API Key</span>
        </button>
        <div className="mt-4 text-xs text-gray-400">
           Tham khảo <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline text-red-400">tài liệu thanh toán</a>.
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;