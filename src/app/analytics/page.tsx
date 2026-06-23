import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { UsageAnalytics } from '@/components/analytics/usage-analytics';
import { PerformanceMetrics } from '@/components/analytics/performance-metrics';
import { PredictiveInsights } from '@/components/analytics/predictive-insights';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">
          Analytics Center
        </h1>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-6">
          {/* Analytics Overview */}
          <div className="flex-1">
            <AnalyticsOverview />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Usage Analytics */}
            <UsageAnalytics />

            {/* Performance Metrics and Predictive Insights */}
            <div className="grid gap-6 md:grid-cols-2">
              <PerformanceMetrics />
              <PredictiveInsights />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}