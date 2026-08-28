const { prisma } = require('../lib/prisma.js');

const archiveService = {
  async createArchive({ title }) {
    // Simple slug generation
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return await prisma.archive.create({
      data: {
        title,
        slug: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
  },

  async getArchiveBySlug(slug) {
    return await prisma.archive.findUnique({
      where: { slug },
    });
  },

  async getArchiveById(id) {
    return await prisma.archive.findUnique({
      where: { id },
    });
  },
};

module.exports = { archiveService };
