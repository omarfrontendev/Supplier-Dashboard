import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Server,
  Globe,
  ArrowUp,
  ArrowDown,
  Plus,
  Flag,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Overview() {
  const { t } = useTranslation();

  const kpis = [
    {
      icon: Users,
      label: t('overview.kpis.activeTenants'),
      value: '247',
      change: '+12',
      changeLabel: t('overview.kpis.thisMonth'),
      trend: 'up',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: DollarSign,
      label: t('overview.kpis.mrr'),
      value: '$487K',
      change: '+18%',
      changeLabel: t('overview.kpis.vsLastMonth'),
      trend: 'up',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      label: t('overview.kpis.arr'),
      value: '$5.8M',
      change: '+24%',
      changeLabel: t('overview.kpis.yoyGrowth'),
      trend: 'up',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Activity,
      label: t('overview.kpis.churnRate'),
      value: '2.3%',
      change: '-0.5%',
      changeLabel: t('overview.kpis.vsLastMonth'),
      trend: 'down',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const usageMetrics = [
    { label: t('overview.usage.cvComputeHours'), value: '1,247,593', unit: t('overview.usage.hoursUnit'), change: '+15%' },
    { label: t('overview.usage.eventsProcessed'), value: '52.3M', unit: t('overview.usage.eventsUnit'), change: '+22%' },
    { label: t('overview.usage.storageConsumption'), value: '847', unit: t('overview.usage.terabytesUnit'), change: '+8%' },
    { label: t('overview.usage.apiRequests'), value: '3.2B', unit: t('overview.usage.requestsUnit'), change: '+19%' },
  ];

  const uptime = [
    { period: t('overview.uptime.last24h'), value: '99.98%', status: 'good' },
    { period: t('overview.uptime.last7d'), value: '99.95%', status: 'good' },
    { period: t('overview.uptime.last30d'), value: '99.92%', status: 'good' },
    { period: t('overview.uptime.last90d'), value: '99.87%', status: 'warning' },
  ];

  const topGrowthTenants = [
    { name: 'STC - Saudi Telecom', mrr: '$45,200', growth: '+127%', plan: t('tenants.plan.enterprise'), users: 1247 },
    { name: 'Mobily Corporation', mrr: '$38,900', growth: '+98%', plan: t('tenants.plan.enterprise'), users: 892 },
    { name: 'Zain KSA', mrr: '$32,400', growth: '+85%', plan: t('tenants.plan.professional'), users: 654 },
    { name: 'Etisalat UAE', mrr: '$28,700', growth: '+72%', plan: t('tenants.plan.enterprise'), users: 743 },
    { name: 'Vodafone Qatar', mrr: '$24,300', growth: '+68%', plan: t('tenants.plan.professional'), users: 521 },
  ];

  const criticalIncidents = [
    {
      id: 'INC-2847',
      title: t('overview.incidents.azureLatencyTitle'),
      priority: 'P1',
      status: t('overview.incidents.statusInProgress'),
      owner: 'SRE Team',
      impacted: 43,
      time: t('overview.incidents.time23mAgo'),
    },
    {
      id: 'INC-2846',
      title: t('overview.incidents.webhookDelaysTitle'),
      priority: 'P2',
      status: t('overview.incidents.statusInvestigating'),
      owner: 'Platform Ops',
      impacted: 12,
      time: t('overview.incidents.time1hAgo'),
    },
  ];

  const releases = [
    { feature: t('overview.releases.featureHeatmap'), rollout: 75, tenants: 185 },
    { feature: t('overview.releases.featureRealtime'), rollout: 45, tenants: 111 },
    { feature: t('overview.releases.featureCvModel'), rollout: 25, tenants: 62 },
  ];

  const regionalFootprint = [
    { region: t('overview.regional.mena'), tenants: 127, percentage: 51, color: 'bg-purple-500' },
    { region: t('overview.regional.europe'), tenants: 68, percentage: 28, color: 'bg-blue-500' },
    { region: t('overview.regional.asiaPacific'), tenants: 42, percentage: 17, color: 'bg-green-500' },
    { region: t('overview.regional.northAmerica'), tenants: 10, percentage: 4, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary mb-2 ">{t('overview.title')}</h1>
          <p className="text-gray-600">{t('overview.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            {t('overview.createTenant')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Flag className="w-4 h-4" />
            {t('overview.publishFeatureFlag')}
          </Button>
          <Button className="gap-2 ">
            <AlertTriangle className="w-4 h-4" />
            {t('overview.openIncident')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="text-3xl text-primary mb-1">{kpi.value}</div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
                <div className="text-xs text-gray-500 mt-1">{kpi.changeLabel}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage Metrics */}
      <Card className="p-6">
        <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-purple-600" />
          {t('overview.usage.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usageMetrics.map((metric, idx) => (
            <div key={idx} className="border-l-4 border-purple-500 pl-4">
              <div className="text-2xl text-primary mb-1">
                {metric.value}
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                {metric.change} {t('overview.kpis.thisMonth')}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Uptime & SLA */}
      <Card className="p-6">
        <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          {t('overview.uptime.title')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {uptime.map((period, idx) => (
            <div key={idx} className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${period.status === 'good' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                }`}>
                {period.status === 'good' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
                <span className={`text-xl ${period.status === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {period.value}
                </span>
              </div>
              <div className="text-sm text-gray-600">{period.period}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Growth Tenants */}
        <Card className="p-6">
          <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            {t('overview.topGrowth.title')}
          </h3>
          <div className="space-y-4">
            {topGrowthTenants.map((tenant, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-primary">{tenant.name}</span>
                    <Badge className="bg-purple-500/10 text-purple-600 border-0 text-xs">
                      {tenant.plan}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">{tenant.users.toLocaleString()} {t('overview.topGrowth.usersSuffix')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-primary mb-1">{tenant.mrr}</div>
                  <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">
                    {tenant.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Critical Incidents */}
        <Card className="p-6">
          <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            {t('overview.incidents.title')}
          </h3>
          <div className="space-y-4">
            {criticalIncidents.map((incident, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${incident.priority === 'P1' ? 'bg-red-500' : 'bg-orange-500'
                      } text-white border-0`}>
                      {incident.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{incident.id}</span>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-0 text-xs">
                    {incident.status}
                  </Badge>
                </div>
                <h4 className="text-sm text-primary mb-2">{incident.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('overview.incidents.ownerLabel')}: {incident.owner}</span>
                  <span>{incident.impacted} {t('overview.incidents.impactedSuffix')}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{incident.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Release Rollouts */}
      <Card className="p-6">
        <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
          <Flag className="w-5 h-5 text-blue-600" />
          {t('overview.releases.title')}
        </h3>
        <div className="space-y-4">
          {releases.map((release, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary">{release.feature}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{release.tenants} {t('overview.releases.tenantsSuffix')}</span>
                  <span className="text-sm text-purple-600">{release.rollout}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                  style={{ width: `${release.rollout}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Regional Footprint */}
      <Card className="p-6">
        <h3 className="text-lg text-primary mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          {t('overview.regional.title')}
        </h3>
        <div className="space-y-4">
          {regionalFootprint.map((region, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary">{region.region}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{region.tenants} {t('overview.releases.tenantsSuffix')}</span>
                  <span className="text-sm text-primary">{region.percentage}%</span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${region.color} transition-all`}
                  style={{ width: `${region.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
