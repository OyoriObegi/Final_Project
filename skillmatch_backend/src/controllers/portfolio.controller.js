const { Portfolio, User } = require('../models/associations');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);

class PortfolioController {
  async createPortfolio(req, res) {
    try {
      const {
        title,
        description,
        projectUrl,
        githubUrl,
        startDate,
        endDate,
        isCurrent,
        technologies
      } = req.body;

      const portfolio = await Portfolio.create({
        title,
        description,
        projectUrl,
        githubUrl,
        startDate,
        endDate,
        isCurrent,
        technologies,
        userId: req.user.id
      });

      // Handle file uploads if any
      if (req.files && req.files.length > 0) {
        const imageUrls = await Promise.all(req.files.map(async (file) => {
          const blob = bucket.file(`portfolios/${portfolio.id}/${file.originalname}`);
          const blobStream = blob.createWriteStream();

          return new Promise((resolve, reject) => {
            blobStream.on('error', reject);
            blobStream.on('finish', () => {
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
              resolve(publicUrl);
            });
            blobStream.end(file.buffer);
          });
        }));

        await portfolio.update({ images: imageUrls });
      }

      res.status(201).json({
        success: true,
        message: 'Portfolio created successfully',
        data: portfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating portfolio',
        error: error.message
      });
    }
  }

  async updatePortfolio(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        projectUrl,
        githubUrl,
        startDate,
        endDate,
        isCurrent,
        technologies
      } = req.body;

      const portfolio = await Portfolio.findByPk(id);
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      // Check if user is authorized to update this portfolio
      if (portfolio.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this portfolio'
        });
      }

      await portfolio.update({
        title,
        description,
        projectUrl,
        githubUrl,
        startDate,
        endDate,
        isCurrent,
        technologies
      });

      // Handle new file uploads if any
      if (req.files && req.files.length > 0) {
        const imageUrls = await Promise.all(req.files.map(async (file) => {
          const blob = bucket.file(`portfolios/${portfolio.id}/${file.originalname}`);
          const blobStream = blob.createWriteStream();

          return new Promise((resolve, reject) => {
            blobStream.on('error', reject);
            blobStream.on('finish', () => {
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
              resolve(publicUrl);
            });
            blobStream.end(file.buffer);
          });
        }));

        const updatedImages = [...(portfolio.images || []), ...imageUrls];
        await portfolio.update({ images: updatedImages });
      }

      res.json({
        success: true,
        message: 'Portfolio updated successfully',
        data: portfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating portfolio',
        error: error.message
      });
    }
  }

  async getPortfolios(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const { count, rows: portfolios } = await Portfolio.findAndCountAll({
        where: { userId: req.user.id },
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          portfolios,
          pagination: {
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching portfolios',
        error: error.message
      });
    }
  }

  async getPortfolio(req, res) {
    try {
      const { id } = req.params;

      const portfolio = await Portfolio.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        }]
      });

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      res.json({
        success: true,
        data: portfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching portfolio',
        error: error.message
      });
    }
  }

  async deletePortfolio(req, res) {
    try {
      const { id } = req.params;

      const portfolio = await Portfolio.findByPk(id);
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      // Check if user is authorized to delete this portfolio
      if (portfolio.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this portfolio'
        });
      }

      // Delete associated files from storage
      if (portfolio.images && portfolio.images.length > 0) {
        await Promise.all(portfolio.images.map(async (imageUrl) => {
          const fileName = imageUrl.split('/').pop();
          const file = bucket.file(`portfolios/${portfolio.id}/${fileName}`);
          await file.delete();
        }));
      }

      await portfolio.destroy();

      res.json({
        success: true,
        message: 'Portfolio deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting portfolio',
        error: error.message
      });
    }
  }
}

module.exports = new PortfolioController(); 