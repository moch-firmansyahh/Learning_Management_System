export class DashboardController {
constructor(dashboardMahasiswaUseCase) {
    this.dashboardMahasiswaUseCase = dashboardMahasiswaUseCase;
}

async getMahasiswaDashboard(req, res) {
    try {
        const nomorInduk = req.user.nomorInduk;
        const hariDariClient = req.query.hari || null;
        const data = await this.dashboardMahasiswaUseCase.getDashboardData(nomorInduk, hariDariClient);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        console.error('DashboardController error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
    }
}