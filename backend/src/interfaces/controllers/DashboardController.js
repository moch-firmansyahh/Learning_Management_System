export class DashboardController {
constructor(dashboardMahasiswaUseCase) {
    this.dashboardMahasiswaUseCase = dashboardMahasiswaUseCase;
}

async getMahasiswaDashboard(req, res) {
    try {
        const nim = req.user.nomorInduk; // Dari JWT Middleware
        const data = await this.dashboardMahasiswaUseCase.getDashboardData(nim);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
    }
}