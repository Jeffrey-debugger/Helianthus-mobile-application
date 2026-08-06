import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Battery,
  Bell,
  DollarSign,
  Download,
  FileText,
  Leaf,
  Sun,
  TrendingUp,
  Users
} from 'lucide-react';

const tabs = [
  { id: 'overview', name: '대시보드', icon: BarChart3 },
  { id: 'prediction', name: 'AI 예측', icon: TrendingUp },
  { id: 'ess', name: 'ESS 제어', icon: Battery },
  { id: 'dr', name: '수요반응', icon: Activity },
  { id: 'trading', name: '전력중개', icon: DollarSign },
  { id: 're100', name: 'RE100', icon: Leaf },
  { id: 'carbon', name: '탄소배출', icon: Leaf },
  { id: 'reports', name: '리포트', icon: FileText }
];

const statCards = [
  { title: '현재 발전량', value: '1,247', unit: 'kW', badge: '+12.5%', tone: 'yellow', icon: Sun, trendUp: true },
  { title: '예상 발전량 (1h)', value: '1,580', unit: 'kW', badge: 'AI 예측', tone: 'blue', icon: TrendingUp },
  { title: 'ESS 충전률', value: '2.5', unit: 'MWh', badge: '78%', tone: 'green', icon: Battery },
  { title: 'DR 절감량', value: '320', unit: 'kW', badge: '-8.2%', tone: 'purple', icon: Activity, trendUp: false }
];

const vehicles = [
  { id: 1, location: '원주시', battery: 85, status: '대기' },
  { id: 2, location: '횡성군', battery: 92, status: '충전중' },
  { id: 3, location: '강릉시', battery: 67, status: '이동중' },
  { id: 4, location: '춘천시', battery: 78, status: '대기' }
];

const reportList = [
  { name: '월간 에너지 리포트', date: '2026-03', size: '2.5MB' },
  { name: 'RE100 달성 보고서', date: '2026-03', size: '1.8MB' },
  { name: '탄소배출 인벤토리', date: '2026-03', size: '3.2MB' },
  { name: 'DR 참여 실적', date: '2026-03', size: '1.2MB' },
  { name: '전력거래 수익 분석', date: '2026-03', size: '2.1MB' }
];

function ToneBadge({ tone, children }) {
  const classes = {
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700'
  };

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${classes[tone] || classes.gray}`}>{children}</span>;
}

function TabPanel({ activeTab }) {
  if (activeTab !== 'overview') {
    return (
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="mb-3 text-xl font-bold text-gray-900">{tabs.find((tab) => tab.id === activeTab)?.name}</h2>
        <p className="text-sm text-gray-600">선택한 메뉴의 상세 제어 화면입니다. 현재 데모에서는 대시보드 화면 중심으로 표시됩니다.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const toneStyle = {
            yellow: 'bg-yellow-100 text-yellow-600',
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600'
          };

          return (
            <article key={card.title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-3 ${toneStyle[card.tone]}`}>
                  <Icon size={22} />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                  {card.trendUp === true && <ArrowUpRight size={14} className="text-green-600" />}
                  {card.trendUp === false && <ArrowDownRight size={14} className="text-red-600" />}
                  {card.badge}
                </span>
              </div>
              <h3 className="mb-1 text-sm text-gray-500">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">
                {card.value} <span className="text-lg text-gray-500">{card.unit}</span>
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-gray-900">실시간 발전량 추이</h3>
          <div className="flex h-64 items-end gap-2">
            {[65, 78, 82, 75, 88, 92, 85, 90, 95, 88, 92, 100].map((height, idx) => (
              <div key={idx} className="flex-1 rounded-t bg-gradient-to-t from-yellow-400 to-orange-500" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">이동형 충전차량 현황</h3>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-xl border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-gray-800">차량 #{vehicle.id}</p>
                  <ToneBadge
                    tone={vehicle.status === '충전중' ? 'green' : vehicle.status === '이동중' ? 'blue' : 'gray'}
                  >
                    {vehicle.status}
                  </ToneBadge>
                </div>
                <div className="text-sm text-gray-600">위치: {vehicle.location}</div>
                <div className="mt-1 text-sm text-gray-600">배터리: {vehicle.battery}%</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">탄소배출권 시장 단가</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
              <span>🇰🇷 한국 K-ETS</span>
              <strong>18,500원/톤</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
              <span>🇪🇺 유럽 EU-ETS</span>
              <strong>€85.20/톤</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
              <span>🇺🇸 미국 CCA</span>
              <strong>$36.50/톤</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3">
              <span>🇨🇳 중국 CETS</span>
              <strong>¥72.00/톤</strong>
            </div>
          </div>
          <div className="mt-4 flex gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            유럽 ETS 단가가 가장 높습니다. 글로벌 거래 전략 비교가 필요합니다.
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">최근 리포트</h3>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">
              <Download size={16} /> 전체 다운로드
            </button>
          </div>
          <div className="space-y-2">
            {reportList.map((report) => (
              <div key={report.name} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{report.name}</p>
                  <p className="text-gray-500">
                    {report.date} · {report.size}
                  </p>
                </div>
                <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200">다운로드</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default function VPPDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const updateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 p-2">
              <Sun className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Solar Mobility VPP/EMS</h1>
              <p className="text-sm text-gray-500">통합 에너지 관리 시스템</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">실시간 업데이트</p>
              <p className="text-sm font-semibold text-gray-700">{updateLabel}</p>
            </div>
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
              <Users size={18} className="text-gray-600" />
              <span className="text-sm font-medium">관리자</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    active ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={17} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <TabPanel activeTab={activeTab} />
      </main>
    </div>
  );
}
