import {Project, ProjectMember, sequelize} from '../models/index.js';
import projectMember from "../models/ProjectMember.js";

const checkAdminPermission = async (projectId,userId) => {
    const project =await Project.findByPk(projectId);
    if (!project) {
        throw new Error('Proje bulunamadı');
    }
    if (project.ownerId === userId) {
        return true;
    }
    const member = await ProjectMember.findOne({
        where: {
            projectId: projectId,
            userId: userId
        }
    });
    if (member && (member.role === 'admin' || member.role === 'owner')) {
        return true;
    }
    console.error('Bu işlemi yapmak için yetkiniz yok !!');
};

export const createProject = async (projectData) => {
    console.log('Project services fonksiyonu başladı !!')
    const t =  await sequelize.transaction();
    console.log('transaction yapıldı')
    try {
        console.log('try bloğundayız')
        const project = await Project.create({
            name:projectData.name,
            description:projectData.description,
            ownerId:projectData.ownerId
        },{transaction: t});
        console.log('Proje oluşturuldu !!')
        await ProjectMember.create({
            projectId:project.id,
            userId:project.ownerId,
            role: 'owner'
        },{transaction: t});
        console.log('Role belirlendi !!')
        await t.commit()
        console.log('commit edildi')
        return project;
    } catch (err) {
        await t.rollback();
        console.error('Service CATCH Hatası:', err);
        throw new Error('Proje oluşturulamadı (Service Hatası): ' + err.message);
    }
}

export const getAllProject = async (page, limit) => {
    console.log(`Service: getAllProjects (Admin) (Sayfa: ${page}, Limit: ${limit})`);
    try {
        const offset = (page - 1) * limit;

        const result = await Project.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            distinct: true
        });

        return {
            totalItems: result.count,
            projects: result.rows
        };

    } catch (error) {
        console.error('Service Hatası (getAllProjects):', error.message);
        throw new Error('Projeler getirilemedi: ' + error.message);
    }
};

export const getProjectById = async (projectId) => {
    try {
        const project = await Project.findByPk(projectId,{
            include:[{
                model: projectMember,
                as: 'members'
            }]
        })
        if (!project) {
            throw new Error('Proje bulunamadı !!');
        }

        return project;
    } catch (err) {
        throw new Error('Proje getirilemedi: ' + err.message);
    }
};

export const deleteProject = async (projectId,requesterId)=> {
    try {
        await checkAdminPermission(projectId,requesterId);

        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Proje bulunamadı !!');
        }

        await project.destroy()
        return {message:'Proje başarıyla silindi !!'}
    } catch (err) {
        throw new Error('Proje silinemedi: ' + err);
    }
};

export const addMemberToProject = async (projectId,userId,requesterId,role) => {
    try {
        await checkAdminPermission(projectId,requesterId);

        const [member,created] = await ProjectMember.findOrCreate({
            where: {projectId:projectId,userId:userId},
            defaults:{
                role: role||'member'
            }
        })
        if (!created) {
            throw new Error('Üye eklenemedi');
        }
        return member;
    } catch (err) {
        throw new Error('Üye eklenemedi: ' + err);
    }
};

export const removeMemberProject = async (projectId,userId,requesterId) => {
    try {
        await checkAdminPermission(projectId,requesterId);

        const project = await Project.findByPk(projectId);
        if (project.ownerId === userId) {
            throw new Error('Proje sahibi projeden çıkarılamaz.');
        }

        const removeResult = await ProjectMember.destroy({
            where:{
                projectId: projectId,
                userId:userId
            }
        });

        if (removeResult === 0) {
            throw new Error('Üye bulunamadı !!');
        }
        return {message:'Üye başarıyla çıkarıldı.'}
    } catch (err) {
        throw new Error('Üye kaldırılamadı: ' + err);
    }
};

export const getMyProjects = async (userId, page, limit) => {
    console.log(`Service: getMyProjects (Kullanıcı ID: ${userId}, Sayfa: ${page}, Limit: ${limit})`);
    try {

        const offset = (page - 1) * limit;

        const memberships = await ProjectMember.findAndCountAll({
            where: { userId: userId },

            limit: limit,
            offset: offset,

            include: [{
                model: Project,
                required: true
            }],

            order: [[Project, 'createdAt', 'DESC']],

            distinct: true
        });

        const projects = memberships.rows.map(membership => membership.Project);

        return {
            totalItems: memberships.count,
            projects: projects
        };

    } catch (error) {
        console.error('Service Hatası (getMyProjects):', error.message);
        throw new Error('Projelerim getirilemedi: ' + error.message);
    }
};

export const updateMemberRole = async (projectId, userId, newRole, requesterId) => {
    console.log(`Service: updateMemberRole (Proje: ${projectId}, Üye: ${userId}, Yeni Rol: ${newRole})`);
    try {
        await checkAdminPermission(projectId, requesterId);

        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Proje bulunamadı');
        }
        if (project.ownerId === userId) {
            throw new Error('Proje sahibinin rolü değiştirilemez.');
        }

        const member = await ProjectMember.findOne({
            where: {
                projectId: projectId,
                userId: userId
            }
        });

        if (!member) {
            throw new Error('Güncellenecek üye projede bulunamadı.');
        }

        member.role = newRole;
        await member.save();
        return member;

    } catch (error) {
        console.error('Service Hatası (updateMemberRole):', error.message);
        throw new Error(error.message);
    }
};





















