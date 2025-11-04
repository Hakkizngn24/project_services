import express from 'express';
import * as projectController from '../controller/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';


import {
    validateCreateProject,
    validateProjectParam,
    validateAddMember,
    validateRemoveMemberParams,
    validateUpdateRole
} from '../middleware/validators.js';
import { handleValidationErrors } from '../middleware/validationHandler.js';

const router = express.Router();


router.post('/createProject',
    authMiddleware,
    validateCreateProject,
    handleValidationErrors,
    projectController.createProject
);

router.get('/getAllProject', projectController.getAllProject);

router.get('/getProjectId/:id',
    authMiddleware,
    validateProjectParam,
    handleValidationErrors,
    projectController.getProjectById
);

router.delete('/deleteProject/:id',
    authMiddleware,
    validateProjectParam,
    handleValidationErrors,
    projectController.deleteProject
);

router.post('/addMember/:projectId/members',
    authMiddleware,
    validateAddMember,
    handleValidationErrors,
    projectController.addMember
);

router.delete('/removeMember/:projectId/members/:userId',
    authMiddleware,
    validateRemoveMemberParams,
    handleValidationErrors,
    projectController.removeMember
);

router.get('/getMyProjects',
    authMiddleware,
    projectController.getMyProjects
);
router.put('/updateMemberRole/:projectId/members/:userId',
    authMiddleware,
    validateUpdateRole,
    handleValidationErrors,
    projectController.updateMemberRole
);

export default router;