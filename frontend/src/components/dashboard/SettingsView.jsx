import { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Lock, Mail, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { message as antdMessage } from 'antd';
import userApi from '../../api/userApi';
import memberApi from '../../api/memberApi';

export default function SettingsView({ onBack }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.userId || user.id;
        
        // Fetch user data from API
        const response = await userApi.getById(userId);
        const userData = response?.data || response?.result || response;
        
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || ''
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        antdMessage.error('Đang dùng thông tin từ bộ nhớ local');
        // Fallback to localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || ''
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password if changing
    if (showPasswordChange) {
      if (!newPassword || newPassword.length < 6) {
        antdMessage.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (newPassword !== confirmPassword) {
        antdMessage.error('Mật khẩu xác nhận không khớp');
        return;
      }
      // Call API to change password
      try {
        await userApi.changePassword({ currentPassword, newPassword });
        antdMessage.success('Đã đổi mật khẩu');
        setShowPasswordChange(false);
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      } catch (error) {
        console.error('Failed to change password:', error);
        const msg = (error?.response?.data?.message) || error.message || 'Không thể đổi mật khẩu';
        antdMessage.error(msg);
      }
      return;
    }
    
    // Update user profile
    try {
      await userApi.updateMe({
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });
      
      // Update localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = formData.name;
        user.phone = formData.phone;
        user.email = formData.email;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setIsSaved(true);
      antdMessage.success('Đã cập nhật thông tin tài khoản');
      setTimeout(() => setIsSaved(false), 3000);
      // Đồng bộ phone/email vào bảng Member (nếu tồn tại). Giả định memberId == userId
      try {
        const userStr2 = localStorage.getItem('user');
        const userObj = userStr2 ? JSON.parse(userStr2) : null;
        const userId = userObj?.userId || userObj?.id;
        if (userId) {
          // Lấy thông tin member hiện tại để biết familyId và các trường cần giữ lại
          const mresp = await memberApi.getById(Number(userId));
          const mdata = mresp?.data || mresp?.result || mresp || null;
          if (mdata) {
            const payload = {
              userId: Number(userId),
              familyId: mdata.familyId || mdata.family?.familyId || null,
              // preserve other fields if available
              age: mdata.age || null,
              dayOfBirth: mdata.dayOfBirth || null,
              gender: mdata.gender || null,
              weight: mdata.weight || null,
              height: mdata.height || null,
              relationship: mdata.relationship || null,
              roleInFamily: mdata.roleInFamily || null,
              phone: formData.phone || mdata.phone || null,
              email: formData.email || mdata.email || null,
              address: mdata.address || null
            };

            // Only attempt update if familyId is present (MemberUpdateRequest requires it)
            if (payload.familyId) {
              try {
                await memberApi.update(Number(userId), payload);
                console.debug('Member record updated with email/phone for userId', userId);
              } catch (err) {
                console.warn('Failed to update member record for userId', userId, err);
              }
            } else {
              console.warn('Skipping member update: familyId missing for member', userId);
            }
          }
        }
      } catch (err) {
        console.warn('Member sync error', err);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      antdMessage.error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handleForgotPassword = () => {
    setShowPasswordChange(!showPasswordChange);
    if (!showPasswordChange) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-500 mt-3">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('Settings.Title')}</h2>
          <p className="text-sm text-gray-500">{t('Settings.Subtitle')}</p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> {t('Settings.PersonalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.FullName')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.Phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> {t('Settings.Security')}
            </h3>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.Email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full"><Lock className="w-4 h-4 text-blue-600" /></div>
                      <div>
                          <p className="font-medium text-gray-900">{t('Settings.Password')}</p>
                          <p className="text-xs text-gray-500">{t('Settings.LastChanged')}: 3 months ago</p>
                      </div>
                  </div>
                  <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-blue-700 hover:text-blue-800 underline">
                      {showPasswordChange ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}
                  </button>
                </div>
                
                {showPasswordChange && (
                  <div className="space-y-3 pt-2 border-t border-blue-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
             {isSaved && <span className="text-green-600 text-sm font-medium animate-pulse">{t('Settings.SavedMsg')}</span>}
             <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
               {t('Settings.Cancel')}
             </button>
             <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2">
               <Save className="w-4 h-4" /> {t('Settings.Save')}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
