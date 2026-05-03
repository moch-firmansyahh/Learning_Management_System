export class ForumUseCase {
    constructor(forumRepository) {
    this.forumRepository = forumRepository;
    }

  // Mengambil daftar thread berdasarkan Mata Kuliah
    async getThreads(idMataKuliah) {
        try {
          const threads = await this.forumRepository.getThreadsByMataKuliah(idMataKuliah);
      
          // Mapping format data agar sesuai dengan `INITIAL_THREADS` di React
          return threads.map(thread => ({
              id: thread.idForumDiskusi,
              authorName: thread.user?.nama || 'Unknown',
              authorRole: thread.user?.role?.nama || 'Unknown',
              time: thread.createdAt,
              title: thread.judul,
              content: thread.isiForum,
              comments: (thread.komentarForum || []).map(k => ({
              id: k.idKomentar,
              authorName: k.user?.nama || 'Unknown',
              content: k.isiKomentar,
              time: k.createdAt
              }))
              }));
        } catch (error) {
          console.error('ForumUseCase.getThreads error:', error);
          return [];
        }
    }

  // Membuat Diskusi Baru
async createThread(idMataKuliah, nomorInduk, judul, isiForum) {
    if (!judul || !isiForum) throw new Error("Judul dan isi forum tidak boleh kosong");
    
    return await this.forumRepository.createThread({
        idMataKuliah,
        nomorInduk,
        judul,
        isiForum
        });
    }

  // Menambahkan komentar/balasan pada sebuah thread
  async addComment(idForum, nomorInduk, isiKomentar) {
    if (!isiKomentar || isiKomentar.trim() === "") throw new Error("Komentar tidak boleh kosong");
    
    return await this.forumRepository.addComment({
        idForum,
        nomorInduk,
        isiKomentar
        });
    }
}