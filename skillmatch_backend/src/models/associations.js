const User = require('./user.model');
const Skill = require('./skill.model');
const Job = require('./job.model');
const Application = require('./application.model');
const Portfolio = require('./portfolio.model');

// User-Skill (Many-to-Many)
User.belongsToMany(Skill, {
  through: 'UserSkills',
  as: 'skills',
  foreignKey: 'userId'
});
Skill.belongsToMany(User, {
  through: 'UserSkills',
  as: 'users',
  foreignKey: 'skillId'
});

// User-Job (One-to-Many)
User.hasMany(Job, {
  foreignKey: 'employerId',
  as: 'postedJobs'
});
Job.belongsTo(User, {
  foreignKey: 'employerId',
  as: 'employer'
});

// User-Application (One-to-Many)
User.hasMany(Application, {
  foreignKey: 'applicantId',
  as: 'applications'
});
Application.belongsTo(User, {
  foreignKey: 'applicantId',
  as: 'applicant'
});

// Job-Application (One-to-Many)
Job.hasMany(Application, {
  foreignKey: 'jobId',
  as: 'applications'
});
Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

// User-Portfolio (One-to-Many)
User.hasMany(Portfolio, {
  foreignKey: 'userId',
  as: 'portfolios'
});
Portfolio.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Job-Skill (Many-to-Many)
Job.belongsToMany(Skill, {
  through: 'JobSkills',
  as: 'requiredSkills',
  foreignKey: 'jobId'
});
Skill.belongsToMany(Job, {
  through: 'JobSkills',
  as: 'jobs',
  foreignKey: 'skillId'
});

module.exports = {
  User,
  Skill,
  Job,
  Application,
  Portfolio
}; 