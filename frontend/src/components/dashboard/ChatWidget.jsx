import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';

export default function ChatWidget({ onClose }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, text: t('Dashboard.Chat.Welcome'), sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  };
  
  useEffect(() => { 
    scrollToBottom(); 
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    // add temporary typing indicator
    const typingId = 'typing-' + Date.now();
    setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'bot', typing: true }]);

    // call backend chat endpoint
    (async () => {
      try {
        const resp = await axiosClient.post('/chat', { message: inputText });
        const reply = resp?.data?.reply || '...';
        // remove typing indicator and append reply
        setMessages(prev => prev.filter(m => m.id !== typingId).concat([{ id: Date.now()+1, text: reply, sender: 'bot' }]));
      } catch (err) {
        console.error('Chat error', err);
        setMessages(prev => prev.filter(m => m.id !== typingId).concat([{ id: Date.now()+2, text: 'Không thể kết nối tới dịch vụ chat.', sender: 'bot' }]));
      }
    })();
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40 h-[500px] overflow-hidden">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <h3 className="font-bold">{t('Dashboard.Chat.Title')}</h3>
        </div>
        <button onClick={onClose} className="hover:text-gray-300"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t('Dashboard.Chat.Placeholder')} className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm" />
          <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"><Send className="w-4 h-4" /></button>
        </div>
      </form>
    </div>
  );
}
