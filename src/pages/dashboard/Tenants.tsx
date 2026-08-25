import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  // Filter,
  Plus,
  Building2,
  Globe,
  CheckCircle,
  // AlertCircle,
  Pause,
  MoreVertical,
  Eye,
  Key,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Shield,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Tenants() {
  const { t } = useTranslation();
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tenants = [
    {
      id: 'TEN-001',
      name: 'STC - Saudi Telecom Company',
      status: 'active',
      plan: 'enterprise',
      region: 'mena',
      healthScore: 95,
      users: 1247,
      mrr: '$45,200',
      lastActive: 'mins2',
    },
    {
      id: 'TEN-002',
      name: 'Mobily Corporation',
      status: 'active',
      plan: 'enterprise',
      region: 'mena',
      healthScore: 88,
      users: 892,
      mrr: '$38,900',
      lastActive: 'mins15',
    },
    {
      id: 'TEN-003',
      name: 'Zain KSA',
      status: 'active',
      plan: 'professional',
      region: 'mena',
      healthScore: 82,
      users: 654,
      mrr: '$32,400',
      lastActive: 'hour1',
    },
    {
      id: 'TEN-004',
      name: 'Etisalat UAE',
      status: 'trial',
      plan: 'professional',
      region: 'mena',
      healthScore: 76,
      users: 743,
      mrr: '$28,700',
      lastActive: 'hours3',
    },
    {
      id: 'TEN-005',
      name: 'Vodafone Qatar',
      status: 'active',
      plan: 'professional',
      region: 'mena',
      healthScore: 91,
      users: 521,
      mrr: '$24,300',
      lastActive: 'hours5',
    },
    {
      id: 'TEN-006',
      name: 'Orange Egypt',
      status: 'suspended',
      plan: 'professional',
      region: 'mena',
      healthScore: 45,
      users: 387,
      mrr: '$18,900',
      lastActive: 'days2',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; icon: any }> = {
      active: { className: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
      trial: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Activity },
      suspended: { className: 'bg-red-500/10 text-red-600 border-red-500/20', icon: Pause },
    };
    const config = badges[status] || badges.active;
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {t(`tenants.status.${status}`)}
      </Badge>
    );
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t('tenants.title')}</h1>
          <p className="text-gray-600">{t('tenants.summary', { active: 247, newCount: 12 })}</p>
        </div>
        <Button className="gap-2 ">
          <Plus className="w-4 h-4" />
          {t('tenants.create')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('tenants.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
              <option>{t('tenants.allPlans')}</option>
              <option>{t('tenants.plan.enterprise')}</option>
              <option>{t('tenants.plan.professional')}</option>
              <option>{t('tenants.plan.pilot')}</option>
            </select>
          </div>
          <div>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
              <option>{t('tenants.allRegions')}</option>
              <option>{t('tenants.region.mena')}</option>
              <option>{t('tenants.region.europe')}</option>
              <option>{t('tenants.region.asiaPacific')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tenants Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.tenant')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.status')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.plan')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.region')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.healthScore')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.users')}
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.mrr')}
                </th>
                <th className="px-6 py-4 text-right text-xs text-gray-600 uppercase tracking-wider">
                  {t('tenants.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTenant(tenant.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">{tenant.name}</div>
                        <div className="text-xs text-gray-500">{tenant.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(tenant.status)}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                      {t(`tenants.plan.${tenant.plan}`)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {t(`tenants.region.${tenant.region}`)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${getHealthColor(tenant.healthScore)}`}>
                        {tenant.healthScore}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[60px]">
                        <div
                          className={`h-full ${tenant.healthScore >= 80
                              ? 'bg-green-500'
                              : tenant.healthScore >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          style={{ width: `${tenant.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tenant.users.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tenant.mrr}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tenant Detail Modal (simplified) */}
      {selectedTenant && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedTenant(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900 mb-1">
                      {tenants.find((t) => t.id === selectedTenant)?.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{selectedTenant}</span>
                      {getStatusBadge(tenants.find((t) => t.id === selectedTenant)?.status || 'active')}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedTenant(null)}>
                  {t('ui.close')}
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <Users className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="text-2xl text-gray-900">
                    {tenants.find((t) => t.id === selectedTenant)?.users.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">{t('tenants.stats.activeUsers')}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                  <div className="text-2xl text-gray-900">
                    {tenants.find((t) => t.id === selectedTenant)?.mrr}
                  </div>
                  <div className="text-xs text-gray-600">{t('tenants.stats.monthlyRevenue')}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <Activity className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-2xl text-gray-900">
                    {tenants.find((t) => t.id === selectedTenant)?.healthScore}%
                  </div>
                  <div className="text-xs text-gray-600">{t('tenants.stats.healthScore')}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <TrendingUp className="w-5 h-5 text-orange-600 mb-2" />
                  <div className="text-2xl text-gray-900">+127%</div>
                  <div className="text-xs text-gray-600">{t('tenants.stats.growthRate')}</div>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Eye className="w-4 h-4" />
                  {t('tenants.actions.viewDashboard')}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {t('tenants.actions.manageSettings')}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Key className="w-4 h-4" />
                  {t('tenants.actions.apiKeys')}
                </Button>
                <Button variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50">
                  <Pause className="w-4 h-4" />
                  {t('tenants.actions.suspend')}
                </Button>
              </div>

              {/* Profile Info */}
              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  {t('tenants.profile.title')}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">{t('tenants.profile.legalName')}</label>
                    <p className="text-sm text-gray-900">
                      {tenants.find((t) => t.id === selectedTenant)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">{t('tenants.profile.plan')}</label>
                    <p className="text-sm text-gray-900">
                      {t(`tenants.plan.${tenants.find((t) => t.id === selectedTenant)?.plan || 'professional'}`)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">{t('tenants.profile.dataRegion')}</label>
                    <p className="text-sm text-gray-900">
                      {t(`tenants.region.${tenants.find((t) => t.id === selectedTenant)?.region || 'mena'}`)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">{t('tenants.profile.lastActive')}</label>
                    <p className="text-sm text-gray-900">
                      {t(`tenants.lastActive.${tenants.find((t) => t.id === selectedTenant)?.lastActive || 'mins2'}`)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
