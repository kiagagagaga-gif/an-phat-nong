import React from 'react';

interface CardPreviewProps {
  imageData: string | null;
  senderName: string;
  wishText: string;
  isLoading: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ imageData, senderName, wishText, isLoading }) => {
  if (isLoading) {
    return (
      <div className="aspect-[9/16] w-full bg-red-50 rounded-xl shadow-inner flex flex-col items-center justify-center border-2 border-dashed border-red-200 p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
        <p className="text-red-800 font-serif animate-pulse">Đang vẽ ngựa vàng...</p>
        <p className="text-xs text-red-500 mt-2 text-center">Quá trình này có thể mất vài giây</p>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="aspect-[9/16] w-full bg-red-100 rounded-xl shadow-inner flex flex-col items-center justify-center border-4 border-double border-red-200 text-center p-6">
        <div className="text-6xl mb-4">🐴</div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Chưa có ảnh</h3>
        <p className="text-red-600/70">Nhập thông tin và bấm nút tạo để bắt đầu năm mới rực rỡ!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full shadow-2xl rounded-lg overflow-hidden group">
      {/* Background Image */}
      <img
        src={imageData}
        alt="Tet Card Background"
        className="w-full h-auto object-cover block"
      />
      
      {/* Text Overlay Layer */}
      <div className="absolute inset-0 flex flex-col items-center p-6 text-center z-10">
        {/* We place text in the top half usually, or center, depending on the prompt logic. 
            We use a safe area container that grows to fill available space but centers content */}
        <div className="mt-12 flex-1 flex flex-col items-center justify-start w-full">
            <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40 max-w-[90%] transform transition-all hover:scale-105 duration-500">
                <h2 className="text-2xl md:text-4xl text-yellow-300 font-bold mb-4 drop-shadow-[0_2px_2px_rgba(180,0,0,0.8)]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Chúc Mừng Năm Mới
                </h2>
                <h3 className="text-xl md:text-3xl text-white font-bold mb-6 drop-shadow-[0_2px_2px_rgba(180,0,0,0.8)] tracking-widest uppercase" style={{ fontFamily: '"Noto Serif JP", serif' }}>
                2026 • Bính Ngọ
                </h3>
                
                {wishText && (
                <p className="text-lg md:text-xl text-red-900 font-bold leading-relaxed mb-6 drop-shadow-sm whitespace-pre-wrap" style={{ fontFamily: '"Dancing Script", cursive' }}>
                    {wishText}
                </p>
                )}
                
                {senderName && (
                <div className="mt-2 pt-4 border-t border-red-800/20 w-full">
                    <p className="text-sm md:text-base text-red-900 font-semibold italic" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Người gửi: {senderName}
                    </p>
                </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-2 right-2 opacity-50 text-[10px] text-white mix-blend-overlay">
        AI Generated • Tet 2026
      </div>
    </div>
  );
};

export default CardPreview;