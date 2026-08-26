import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Crown,
  ArrowLeft,
  Mail,
  Shield,
  Layers,
  Settings,
  Users,
  Database
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { requestOTP, verfiyOTP } from '@/app/store/features/auth/authThunk';
import { toast } from 'sonner';
import type { AppDispatch } from "@/app/store";
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/layout/components/LanguageToggle';

export function ForgetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestRes = await dispatch(requestOTP(email)).unwrap();
      toast.success(requestRes?.message);
      setShow2FA(true);
    } catch (error: any) {
      toast.error(
        error?.message || t("login.loginFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestRes = await dispatch(
        verfiyOTP({ email, code: twoFactorCode })
      ).unwrap();

      toast.success(requestRes?.message);
      navigate(`/auth/new-password?resetToken=${requestRes?.data?.resetToken}`);
    } catch (error: any) {
      toast.error(error || t("login.otpVerificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-50" />
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl text-white">
                    {t("login.brandTitle")}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {t("login.brandSubtitle")}
                  </p>
                </div>
              </div>

              <h2 className="text-4xl mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                {t("login.platformCenter")}
              </h2>
              <p className="text-lg text-slate-400">
                {t("login.platformCenterDesc")}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: Users, text: t("features.manageRegions") },
                { icon: Database, text: t("features.manageMalls") },
                { icon: Layers, text: t("features.manageBooths") },
                { icon: Settings, text: t("features.manageUsers") },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-purple-500/20">
                    <feature.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-slate-300">{feature.text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Side - Login Form */}
          <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-8 lg:p-10">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative">
              {/* Form Header */}
              <div className="mb-8">
                <div className='flex justify-between align-items-center mb-4'>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <Crown className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300">{t("login.adminAccess")}</span>
                  </div>
                  <LanguageToggle className='text-white' />
                </div>
                <h3 className="text-2xl text-white mb-2">
                  {show2FA ? t("login.twoFactorTitle") : t("forgetPassword.title")}
                </h3>
                <p className="text-sm text-slate-400">
                  {show2FA ? t("login.twoFactorSubtitle") : t("login.authorizedonly")}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={show2FA ? verifyOTP : handleRequestOtp} className="space-y-6">
                {show2FA ? <>
                  {/* 2FA Code Input */}
                  <div className="space-y-2">
                    <Label htmlFor="2fa" className="text-slate-300">{t("fields.otp.label")}</Label>
                    <Input
                      id="2fa"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-2xl tracking-widest bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                      required
                    />
                    <p className="text-xs text-slate-500 text-center">{t("fields.otp.text")}</p>
                  </div>

                  {/* <div className='space-y-2'>
                    <Label htmlFor="password" className="text-slate-300">{t("fields.password.label")}</Label>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t("fields.otp.placeholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div> */}

                  {/* Back Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-primary"
                    onClick={() => setShow2FA(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" />
                    {t("buttons.back")}
                  </Button>
                </> :
                  <>
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">{t("fields.email.label")}</Label>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t("fields.email.placeholder")}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="ps-10 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                          required
                        />
                      </div>
                    </div>
                    {/* Remember Me */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-slate-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                        {t("login.rememberDevice")}
                      </Label>
                    </div>
                    {/* Back Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-slate-400 hover:text-primary"
                      onClick={() => navigate('/auth/login')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" />
                      {t("buttons.backLogin")}
                    </Button>
                  </>}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {/* {isLoading ? "Processing..." : show2FA ? "Sign In" : "Next"} */}
                  {isLoading
                    ? t("login.processing")
                    : show2FA
                      ? t("login.verify")
                      : t("login.next")}
                </Button>

                {!show2FA && (
                  <>
                    {/* Warning */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-purple-300 mb-1">{t("login.securityNotice")}</p>
                          <p className="text-xs text-slate-400">
                            {t("login.securityMessage")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-slate-500">{t("login.authorizedOnly")}</span>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}