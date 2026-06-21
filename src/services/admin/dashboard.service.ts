import { dashboardRepository } from '../../repositories/dashboard.repository';

export class DashboardService {
  async getDashboard() {
    return dashboardRepository.getStats();
  }
}

export const dashboardService = new DashboardService();
