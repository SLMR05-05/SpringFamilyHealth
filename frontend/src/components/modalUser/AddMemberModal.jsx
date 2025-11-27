import { useState } from 'react';
import { X, Copy, Check, RefreshCw, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AddMemberModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  
  // Giả lập mã mời lấy từ Database (Table invite_code)
  const [inviteCode, setInviteCode] = useState('INVITE123A');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Giả lập call API tạo mã mới
    setTimeout(() => {
      const randomCode = 'FAMILY-' + Math.floor(1000 + Math.random() * 9000);
      setInviteCode(randomCode);
      setIsRegenerating(false);
      setCopied(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up transform scale-100 transition-all">
        
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <QrCode className="w-5 h-5" /> {t('AddMember.Title')}
          </h3>
          <button onClick={onClose} className="hover:text-gray-300 transition rounded-full p-1 hover:bg-gray-800"><X className="w-5 h-5" /></button>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-6">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
             <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center animate-pulse">
                <QrCode className="w-6 h-6 text-blue-600" />
             </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-gray-900">{t('AddMember.CodeLabel')}</h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {t('AddMember.ShareInstruction')}
            </p>
          </div>

          {/* Code Display Area */}
          <div className="relative group">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-3 relative overflow-hidden">
                <span className="text-3xl font-mono font-bold tracking-widest text-gray-800 select-all">
                    {inviteCode}
                </span>
                
                {/* Copy Button (Icon) */}
                <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-blue-600 focus:outline-none"
                    title={t('AddMember.Copy')}
                >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            {copied && <span className="absolute -top-8 right-0 text-xs bg-black text-white px-2 py-1 rounded shadow-lg animate-fade-in-up">{t('AddMember.Copied')}</span>}
          </div>
          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            
            <button 
                onClick={handleCopy}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                {copied ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
                {copied ? t('AddMember.Copied') : t('AddMember.Copy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}