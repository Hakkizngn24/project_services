import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProjectMember = sequelize.define('ProjectMember', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'id',
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member',
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['projectId', 'userId']
        }
    ]
});

export default ProjectMember;