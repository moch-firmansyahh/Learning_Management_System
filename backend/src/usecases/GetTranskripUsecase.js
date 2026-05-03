export class GetTranskripUsecase {
constructor(nilaiRepository) {
    this.nilaiRepository = nilaiRepository;
}

async execute(nomorInduk) {
    const rawData = await this.nilaiRepository.getNilaiByNomorInduk(nomorInduk);
    
    // Logic mengelompokkan nilai per semester
    const groupedBySemester = rawData.reduce((acc, curr) => {
    const semester = curr.semester || 1;
    if (!acc[semester]) acc[semester] = [];
        acc[semester].push(curr);
        return acc;
    }, {});

    return groupedBySemester;
    }
}