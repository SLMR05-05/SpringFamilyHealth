import { useState } from 'react';
import { 
  User, Mail, Lock, Stethoscope, Users, ArrowRight, CheckCircle, 
  Activity, CreditCard, Building2, Phone 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authApi from '../../api/authApi';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 'user' | 'doctor'
  const [userType, setUserType] = useState('HEAD'); // 'HEAD' | 'MEMBER' for regular users
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '', // Date of birth
    address: '', // Family address (for HEAD only)
    inviteCode: '', // For family members
    specialization: '', // For Doctor
    licenseNumber: '', // For Doctor
    clinicName: '',
    education: '',
    // description removed; use specialization
  });

  // Images for different roles
  const bgImages = {
    user: "https://images.unsplash.com/photo-1536625841643-44f2d399c680?q=80&w=2670&auto=format&fit=crop", 
    doctor: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2664&auto=format&fit=crop" 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    // For family members, validate invite code
    if (role === 'user' && userType === 'MEMBER' && !formData.inviteCode.trim()) {
      setErrorMessage('Vui lòng nhập mã mời');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'user') {
        // Register regular user (HEAD or MEMBER)
        const payload = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          userType: userType,
          address: userType === 'HEAD' ? formData.address : undefined,
          inviteCode: userType === 'MEMBER' ? formData.inviteCode : undefined
        };

        const response = await authApi.register(payload);
        
        setIsSuccess(true);
        // Show success message with invite code for HEAD
        if (userType === 'HEAD' && response.data) {
          alert(response.data.message);
        }
        
        // Redirect to login after success
        setTimeout(() => {
          setIsSuccess(false);
          navigate('/login');
        }, 2000);
      } else {
        // For doctor registration - send to backend
        const payload = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          userType: 'DOCTOR',
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined,
          certificateNumber: formData.licenseNumber,
          specialization: formData.specialization || undefined,
          clinicName: formData.clinicName || undefined,
          education: formData.education || undefined,
          // description removed
        };

        const response = await authApi.register(payload);
        setIsSuccess(true);
        setIsLoading(false);
        // show success message from backend if available
        if (response && response.message) {
          alert(response.message);
        }

        setTimeout(() => {
          setIsSuccess(false);
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Đã xảy ra lỗi khi đăng ký');
    }
  };

  // Switch role handler
  const switchRole = (newRole) => {
    setRole(newRole);
    // Clear role-specific fields when switching
    if (newRole === 'user') {
      setFormData(prev => ({ ...prev, specialization: '', licenseNumber: '' }));
    } else {
      setFormData(prev => ({ ...prev, inviteCode: '' }));
    }
  };

  // Switch user type handler (HEAD or MEMBER)
  const switchUserType = (newUserType) => {
    setUserType(newUserType);
    // Clear fields based on user type
    if (newUserType === 'HEAD') {
      setFormData(prev => ({ ...prev, inviteCode: '' }));
    } else {
      setFormData(prev => ({ ...prev, address: '' }));
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-slate-800">
      
      {/* LEFT SIDE - FORM AREA */}
      <div className="w-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative overflow-hidden">
        
        {/* Background blobs for decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-teal-600 font-bold text-xl mb-6">
              <Activity className="w-6 h-6" />
              <span>FamilyHealth</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {t('RegisterPage.CreateAccount')}
            </h1>
            <p className="text-slate-500">
              {t('RegisterPage.Subtitle')}
            </p>
          </div>

          {/* Role Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex mb-8 relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out transform ${role === 'doctor' ? 'translate-x-full left-0' : 'translate-x-0 left-1'}`}
            ></div>
            <button
              type="button"
              onClick={() => switchRole('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg relative z-10 transition-colors ${role === 'user' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users className="w-4 h-4" />
              {t('RegisterPage.Role.User')}
            </button>
            <button
              type="button"
              onClick={() => switchRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg relative z-10 transition-colors ${role === 'doctor' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Stethoscope className="w-4 h-4" />
              {t('RegisterPage.Role.Doctor')}
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.FullName')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.Email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                  placeholder="0909123456"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Ngày sinh</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                />
              </div>
            </div>

            {/* User Type Selector - Only for regular users */}
            {role === 'user' && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Loại tài khoản</label>
                <div className="bg-slate-100 p-1 rounded-xl flex relative">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out transform ${userType === 'MEMBER' ? 'translate-x-full left-0' : 'translate-x-0 left-1'}`}
                  ></div>
                  <button
                    type="button"
                    onClick={() => switchUserType('HEAD')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg relative z-10 transition-colors ${userType === 'HEAD' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Users className="w-4 h-4" />
                    Chủ hộ
                  </button>
                  <button
                    type="button"
                    onClick={() => switchUserType('MEMBER')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg relative z-10 transition-colors ${userType === 'MEMBER' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <User className="w-4 h-4" />
                    Người thân
                  </button>
                </div>
              </div>
            )}

            {/* Address Field - Only for household head */}
            <div className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${role === 'user' && userType === 'HEAD' ? 'max-h-[120px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {role === 'user' && userType === 'HEAD' && (
                <div className="group animate-fadeIn">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    Địa chỉ gia đình
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                      placeholder="123 Nguyễn Trãi, Quận 5, TP.HCM"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Invite Code Field - Only for family members */}
            <div className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${role === 'user' && userType === 'MEMBER' ? 'max-h-[120px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {role === 'user' && userType === 'MEMBER' && (
                <div className="group animate-fadeIn">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    Mã mời <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="inviteCode"
                      required={role === 'user' && userType === 'MEMBER'}
                      value={formData.inviteCode}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border-2 border-dashed border-teal-200 rounded-xl leading-5 bg-teal-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out"
                      placeholder="VD: FAM-A1B2C3D4"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-1">Nhập mã mời từ chủ hộ để tham gia gia đình</p>
                </div>
              )}
            </div>

            <div className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${role === 'doctor' ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {role === 'doctor' && (
                <>
                  <div className="group animate-fadeIn">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.Specialization')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <select
                        name="specialization"
                        required={role === 'doctor'}
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out shadow-sm appearance-none"
                      >
                          <option value="">{t('RegisterPage.SelectSpecialization')}</option>
                          <option value="Nội khoa">Nội khoa</option>
                          <option value="Ngoại khoa">Ngoại khoa</option>
                          <option value="Nhi khoa">Nhi khoa</option>
                          <option value="Sản khoa">Sản khoa</option>
                          <option value="Tim mạch">Tim mạch</option>
                          <option value="Hô hấp">Hô hấp</option>
                          <option value="Thần kinh">Thần kinh</option>
                          <option value="Da liễu">Da liễu</option>
                          <option value="Tiêu hóa">Tiêu hóa</option>
                          <option value="Ung bướu">Ung bướu</option>
                          <option value="Mắt">Mắt</option>
                          <option value="Răng hàm mặt">Răng hàm mặt</option>
                          <option value="Tai mũi họng">Tai mũi họng</option>
                          <option value="Y học gia đình">Y học gia đình</option>
                          <option value="Y học cổ truyền">Y học cổ truyền</option>
                      </select>
                    </div>
                  </div>
                  <div className="group animate-fadeIn">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.LicenseNumber')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="licenseNumber"
                        required={role === 'doctor'}
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-in-out shadow-sm"
                        placeholder="VD: 012345/CCHN-BYT"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Passwords */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="group flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.Password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="group flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{t('RegisterPage.ConfirmPassword')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 ease-in-out shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>  

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white transition-all duration-300 transform hover:-translate-y-0.5
                ${isSuccess 
                  ? 'bg-green-500 cursor-default shadow-green-500/30' 
                  : role === 'user' 
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-teal-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                }
                ${isLoading ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('RegisterPage.Success')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{t('RegisterPage.RegisterNow')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            {t('RegisterPage.HaveAccount')}{' '}
            <Link to="/login" className={`font-semibold hover:underline transition-colors ${role === 'user' ? 'text-teal-600' : 'text-blue-600'}`}>
              {t('RegisterPage.LoginNow')}
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE AREA */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Decorative Overlay Gradient */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent transition-opacity duration-700 ${role === 'user' ? 'opacity-80' : 'opacity-90'}`}></div>
        
        {/* Dynamic Background Image */}
        <img 
          src={bgImages.user} 
          alt="Happy Family" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 transform scale-105 ${role === 'user' ? 'opacity-100' : 'opacity-0'}`}
        />
        <img 
          src={bgImages.doctor} 
          alt="Professional Doctor" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 transform scale-105 ${role === 'doctor' ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Floating Content on Image */}
        <div className="relative z-20 m-auto px-12 text-center max-w-lg">
            <div className={`transition-all duration-700 transform ${role === 'user' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 hidden'}`}>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                 <Users className="w-8 h-8 text-teal-300" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{t('RegisterPage.User.HeroTitle')}</h2>
              <p className="text-teal-100 text-lg leading-relaxed">
                {t('RegisterPage.User.HeroDesc')}
              </p>
            </div>

            <div className={`transition-all duration-700 transform ${role === 'doctor' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 hidden'}`}>
               <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                 <Stethoscope className="w-8 h-8 text-blue-300" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{t('RegisterPage.Doctor.HeroTitle')}</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                {t('RegisterPage.Doctor.HeroDesc')}
              </p>
            </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
            <span className={`h-2 rounded-full transition-all duration-500 ${role === 'user' ? 'w-8 bg-teal-400' : 'w-2 bg-white/30'}`}></span>
            <span className={`h-2 rounded-full transition-all duration-500 ${role === 'doctor' ? 'w-8 bg-blue-400' : 'w-2 bg-white/30'}`}></span>
        </div>
      </div>

    </div>
  );
}