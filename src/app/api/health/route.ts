import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    api: 'ok' | 'error';
    memory: 'ok' | 'warning' | 'critical';
  };
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const memUsage = process.memoryUsage();
  const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
  const heapTotalMb = memUsage.heapTotal / 1024 / 1024;
  const rssMb = memUsage.rss / 1024 / 1024;
  const memoryRatio = heapUsedMb / heapTotalMb;
  const memoryLimitMb = Number(process.env.MEMORY_LIMIT_MB ?? 2048);
  const rssRatio = rssMb / memoryLimitMb;

  const memoryStatus: HealthStatus['checks']['memory'] =
    rssRatio > 0.95 || heapUsedMb > memoryLimitMb
      ? 'critical'
      : rssRatio > 0.8 || memoryRatio > 0.85
        ? 'warning'
        : 'ok';

  const status: HealthStatus['status'] =
    memoryStatus === 'critical' ? 'unhealthy' : memoryStatus === 'warning' ? 'degraded' : 'healthy';

  const body: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
    environment: process.env.NODE_ENV ?? 'development',
    uptime: process.uptime(),
    checks: {
      api: 'ok',
      memory: memoryStatus,
    },
  };

  const httpStatus = status === 'unhealthy' ? 503 : 200;
  return NextResponse.json(body, { status: httpStatus });
}
