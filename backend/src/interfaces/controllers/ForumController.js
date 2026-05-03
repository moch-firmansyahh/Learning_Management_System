export class ForumController {
    constructor(forumUseCase) {
        this.forumUseCase = forumUseCase;
    }

async getThreads(req, res) {
    try {
        const { idMataKuliah } = req.params;
        const data = await this.forumUseCase.getThreads(parseInt(idMataKuliah));
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

async createThread(req, res) {
    try {
        const nomorInduk = req.user.nomorInduk; // Dari middleware JWT
        const { idMataKuliah, judul, isiForum } = req.body;

        const newThread = await this.forumUseCase.createThread(
        parseInt(idMataKuliah), nomorInduk, judul, isiForum
    );
        res.status(201).json({ status: 'success', data: newThread });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

async addComment(req, res) {
    try {
        const { idForum } = req.params;
        const { isiKomentar } = req.body;
        const nomorInduk = req.user.nomorInduk;

        const comment = await this.forumUseCase.addComment(
            parseInt(idForum), nomorInduk, isiKomentar
        );
        res.status(201).json({ status: 'success', data: comment });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}
}