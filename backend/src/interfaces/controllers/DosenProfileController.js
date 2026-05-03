export class DosenProfileController {
constructor(dosenProfileUseCase) {
    this.dosenProfileUseCase = dosenProfileUseCase;
}

async getProfile(req, res) {
    try {
        const nomorInduk = req.user.nomorInduk; // Diasumsikan dari authMiddleware
        const data = await this.dosenProfileUseCase.getDosenProfile(nomorInduk);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

async updateProfile(req, res) {
    try {
        const nomorInduk = req.user.nomorInduk;
        const data = req.body; // { email, telepon, bidang, officeRoom }
        const updated = await this.dosenProfileUseCase.updateDosenProfile(nomorInduk, data);
        res.status(200).json({ success: true, message: "Profil berhasil diperbarui", data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

async changePassword(req, res) {
    try {
        const nomorInduk = req.user.nomorInduk;
        const { old, newPw } = req.body;
        const result = await this.dosenProfileUseCase.changePassword(nomorInduk, old, newPw);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        }
    }
}