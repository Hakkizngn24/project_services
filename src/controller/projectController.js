import * as projectService from '../services/projectServices.js';

export const createProject = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const { name, description} = req.body;
        console.log('req.body den veri alındı !!');


        const project = await projectService.createProject({ name, description, ownerId });
        res.status(201).json(project);

    } catch (err) {
        console.error('createProject Hata:', err);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

export const getAllProject = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await projectService.getAllProject(page, limit);

        // 3. Toplam sayfa sayısını hesapla
        const totalPages = Math.ceil(result.totalItems / limit);

        res.status(200).json({
            totalItems: result.totalItems,
            totalPages: totalPages,
            currentPage: page,
            limit: limit,
            projects: result.projects // O sayfadaki projeler
        });

    } catch (error) {
        console.error('Controller Hata (getAllProject):', error.message);
        res.status(500).json({ message: 'Projeler getirilemedi: ' + error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params; // Bu satırınız zaten doğruydu
        const project = await projectService.getProjectById(id);

        // !! DURUM KODU DÜZELTMESİ: GET için 200 OK !!
        res.status(200).json(project);
    } catch (err) {
        // Hata ayıklama ve 404 kontrolü eklendi
        console.error('getProjectById Hata:', err);
        if (err.message.includes('bulunamadı')) {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Proje id getirilemedi: ' + err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        console.log('req.params OBJEsi:', req.params);

        const { id: projectId } = req.params;

        console.log('Servise gönderilen projectId (string olmalı):', projectId);

        const { id: requesterId } = req.user;

        const deleteResult = await projectService.deleteProject(projectId, requesterId);

        res.status(200).json(deleteResult);
    } catch (err) {
        console.error('Controller Hata (deleteProject):', err.message);
        if (err.message.includes('yetkiniz yok') || err.message.includes('bulunamadı')) {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId, role } = req.body;
        const { id: requesterId } = req.user;

        const member = await projectService.addMemberToProject(
            projectId,
            userId,
            requesterId,
            role
        );

        res.status(201).json(member);
    } catch (err) {
        console.error('addMember Hata:', err);
        if (err.message.includes('zaten')) {
            return res.status(409).json({ message: err.message });
        }
        if (err.message.includes('yetkiniz yok')) {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { projectId, userId: userIdToRemove } = req.params;
        const { id: requesterId } = req.user;


        const removeResult = await projectService.removeMemberProject(projectId, userIdToRemove, requesterId);

        res.status(200).json(removeResult);
    } catch (err) {
        console.error('removeMember Hata:', err);
        if (err.message.includes('bulunamadı') || err.message.includes('çıkarılamaz')) {
            return res.status(404).json({ message: err.message });
        }
        if (err.message.includes('yetkiniz yok')) {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await projectService.getMyProjects(userId, page, limit);

        const totalPages = Math.ceil(result.totalItems / limit);


        res.status(200).json({
            totalItems: result.totalItems,
            totalPages: totalPages,
            currentPage: page,
            limit: limit,
            projects: result.projects
        });

    } catch (error) {
        console.error('Controller Hata (getMyProjects):', error.message);
        res.status(500).json({ message: 'Projelerim getirilemedi: ' + error.message });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        const { role: newRole } = req.body;

        const { id: requesterId } = req.user;

        const updatedMember = await projectService.updateMemberRole(
            projectId,
            userId,
            newRole,
            requesterId
        );

        res.status(200).json(updatedMember);

    } catch (error) {
        console.error('Controller Hata (updateMemberRole):', error.message);
        if (error.message.includes('yetkiniz yok') || error.message.includes('Proje sahibi')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('bulunamadı')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Rol güncellenemedi: ' + error.message });
    }
};