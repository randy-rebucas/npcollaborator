import { logtoFetch } from "@/utils/logto-fetch";

/**
 * Interface for metrics that include a count and delta
 */
interface MetricWithDelta {
  count: number;
  delta: number;
}

/**
 * Interface for daily active user data point
 */
interface DauDataPoint {
  date: string;
  count: number;
}

/**
 * Interface for active user metrics
 */
interface ActiveUserMetrics {
  dauCurve: DauDataPoint[];
  dau: MetricWithDelta;
  wau: MetricWithDelta;
  mau: MetricWithDelta;
}

/**
 * Retrieves the total number of users in the system
 * @returns Promise containing the total user count
 * @throws {Error} If the API request fails
 */
export async function getTotalUserCount(): Promise<{ count: number }> {
  const data = await logtoFetch(`dashboard/users/total`);
  return { count: data.totalUserCount as number };
}

/**
 * Retrieves the count of new users and their change rate
 * @returns Promise containing today's and weekly new user metrics
 * @throws {Error} If the API request fails
 */
export async function getNewUserCount(): Promise<{
  today: MetricWithDelta;
  last7Days: MetricWithDelta;
}> {
  const data = await logtoFetch(`dashboard/users/new`);
  return {
    today: data.today as MetricWithDelta,
    last7Days: data.last7Days as MetricWithDelta,
  };
}

/**
 * Retrieves active user metrics including daily, weekly, and monthly statistics
 * @returns Promise containing active user metrics and historical data
 * @throws {Error} If the API request fails
 */
export async function getActiveUserCount(): Promise<ActiveUserMetrics> {
  const data = await logtoFetch(`dashboard/users/active`);
  return {
    dauCurve: data.dauCurve as DauDataPoint[],
    dau: data.dau as MetricWithDelta,
    wau: data.wau as MetricWithDelta,
    mau: data.mau as MetricWithDelta,
  };
}


