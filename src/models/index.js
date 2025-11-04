import sequelize from '../config/db.js';
import Project from './Project.js';
import ProjectMember from './ProjectMember.js';

Project.hasMany(ProjectMember, {
    foreignKey: 'projectId',
    as: 'members',
    onDelete: 'CASCADE'
});

ProjectMember.belongsTo(Project, {
    foreignKey: 'projectId',
});

export {
    sequelize,
    Project,
    ProjectMember
};