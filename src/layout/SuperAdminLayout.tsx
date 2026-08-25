import { useState, type ReactNode } from 'react';
import {
  Crown,
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import Sidebar from './components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const {user} = useSelector((state: any) => state.auth);


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ms-20' : 'ms-72'}`}>
        {/* Top Bar */}
        <header className="bg-background border-b border-gray-200 sticky top-0 z-[100000]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-primary">{t("header.title")}</h2>
              <p className="text-sm text-gray-600"> {t("header.subtitle")}</p>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />

              <ThemeToggle />

              {/* User */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-primary">{user?.firstName}</p>
                  <p className="text-xs text-gray-500">{t(`roles.${user?.role}`)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 bg-background flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}