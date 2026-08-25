import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Crown,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Search,
} from 'lucide-react';
import { modules } from '@/config/menu.config';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setOpenMenu((prev) => (prev === id ? null : id));
    };

    const filteredModules = useMemo(() => {
        if (!searchTerm.trim()) return modules;

        const search = searchTerm.toLowerCase();

        const filterItems = (items: any[]): any[] => {
            return items
                .map((item) => {
                    const labelMatch = t(item.label)
                        .toLowerCase()
                        .includes(search);

                    if (item.children) {
                        const filteredChildren = filterItems(item.children);

                        if (labelMatch || filteredChildren.length > 0) {
                            return {
                                ...item,
                                children: filteredChildren,
                            };
                        }

                        return null;
                    }

                    return labelMatch ? item : null;
                })
                .filter(Boolean);
        };

        return modules
            .map((section) => ({
                ...section,
                items: filterItems(section.items),
            }))
            .filter((section) => section.items.length > 0);

    }, [searchTerm, t]);


    useEffect(() => {
        modules.forEach((section) => {
            section.items.forEach((item) => {
                if (item.children?.some(child => child.path === location.pathname)) {
                    setOpenMenu(item.id);
                }
            });
        });
    }, [location.pathname]);

    return (
        <aside
            className={`flex flex-col fixed top-0 start-0 h-screen bg-gradient-to-b from-purple-900 via-purple-900 to-purple-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'
                } overflow-y-auto z-50`}
        >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg blur-md opacity-75" />
                                <div className="relative bg-gradient-to-r from-purple-500 to-purple-800 p-2 rounded-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-lg">{t("sidebar.title")}</h1>
                                <p className="text-xs text-purple-200">{t("sidebar.providerConsole")}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {!collapsed && (
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300"
                        />
                        <input
                            type="text"
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                            placeholder={t("sidebar.search")}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-6 flex-1">
                {filteredModules.map((section, idx) => (
                    <div key={idx}>
                        {!collapsed && (
                            <h3 className="text-xs text-purple-300 uppercase tracking-wider mb-2 px-3">
                                {t(section.section)}
                            </h3>
                        )}
                        <div className="space-y-2">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                const isDropdown = item.children && item.children.length > 0;
                                const isOpen = openMenu === item.id;
                                const isActive =
                                    item.path === location.pathname ||
                                    item.children?.some((child: any) => child.path.includes(location.pathname));
                                return (
                                    <div key={itemIdx}>
                                        {/* Parent Item */}
                                        <div
                                            onClick={() => isDropdown && toggleMenu(item.id)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all
                                                    ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-purple-100 hover:bg-white/5 hover:text-white'} 
                                                    ${collapsed ? 'justify-center' : ''}
                                                `}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            {!collapsed && (
                                                <>
                                                    <span className="text-sm flex-1">
                                                        {t(item.label)}
                                                    </span>
                                                    {isDropdown && (
                                                        <ChevronRight
                                                            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : 'rtl:rotate-180'
                                                                }`}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Children */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && !collapsed ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="ms-8 space-y-1 pb-1">
                                                {item.children!.map((child, childIdx) => {
                                                    const ChildIcon = child.icon;
                                                    const isChildActive = location.pathname.includes(child.path);

                                                    return (
                                                        <Link key={childIdx} to={child.path!} className='block'>
                                                            <div
                                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isChildActive
                                                                        ? 'bg-white/20'
                                                                        : 'hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <ChildIcon className="w-4 h-4" />
                                                                {t(child.label)}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 mt-auto">
                <Link to="/auth/login">
                    <Button
                        onClick={() => {
                            localStorage.clear();
                            navigate('/auth/login');
                        }}
                        variant="ghost"
                        className={`w-full text-purple-200 hover:text-white hover:bg-white/10 ${collapsed ? 'px-2' : ''
                            }`}
                    >
                        <LogOut className="w-4 h-4" />
                        {!collapsed && <span className="ml-2">{t("sidebar.logout")}</span>}
                    </Button>
                </Link>
            </div>
        </aside>
    );
}