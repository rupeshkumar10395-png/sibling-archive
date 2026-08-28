const { prisma } = require('../lib/prisma.js');

const slideService = {
  async createSlide(archiveId, { type, position, data }) {
    return await prisma.slide.create({
      data: {
        archiveId,
        type,
        position,
        data,
      },
    });
  },

  async getSlidesByArchive(archiveId) {
    return await prisma.slide.findMany({
      where: { archiveId },
      orderBy: { position: 'asc' },
    });
  },
};

module.exports = { slideService };
