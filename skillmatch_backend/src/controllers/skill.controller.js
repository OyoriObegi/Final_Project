const { Skill, User } = require('../models/associations');

class SkillController {
  async createSkill(req, res) {
    try {
      const { name, category, description } = req.body;

      // Check if skill already exists
      const existingSkill = await Skill.findOne({ where: { name } });
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill already exists'
        });
      }

      const skill = await Skill.create({
        name,
        category,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: skill
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating skill',
        error: error.message
      });
    }
  }

  async getSkills(req, res) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;

      const where = {};
      if (category) where.category = category;
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }

      const { count, rows: skills } = await Skill.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['popularity', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          skills,
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
        message: 'Error fetching skills',
        error: error.message
      });
    }
  }

  async updateUserSkills(req, res) {
    try {
      const { skills } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user's skills
      await user.setSkills(skills);

      // Update skill popularity
      await Promise.all(skills.map(async (skillId) => {
        const skill = await Skill.findByPk(skillId);
        if (skill) {
          skill.popularity += 1;
          await skill.save();
        }
      }));

      res.json({
        success: true,
        message: 'Skills updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating skills',
        error: error.message
      });
    }
  }

  async getPopularSkills(req, res) {
    try {
      const skills = await Skill.findAll({
        order: [['popularity', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: skills
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching popular skills',
        error: error.message
      });
    }
  }
}

module.exports = new SkillController(); 