import { body, param } from 'express-validator';

export const validateCreateProject = [
    body('name')
        .trim() // Baştaki/sondaki boşlukları sil
        .notEmpty().withMessage('Proje ismi (name) boş olamaz.')
        .isLength({ min: 3 }).withMessage('Proje ismi en az 3 karakter olmalı.')
        .isLength({ max: 100 }).withMessage('Proje ismi en fazla 100 karakter olabilir.'),

    body('description')
        .optional() // Bu alan zorunlu değil
        .trim()
        .isLength({ max: 500 }).withMessage('Açıklama en fazla 500 karakter olabilir.')
];

export const validateProjectParam = [
    param('id')
        .isUUID(4).withMessage('Geçersiz Proje ID formatı (UUIDv4 bekleniyor).')
];

export const validateAddMember = [
    param('projectId')
        .isUUID(4).withMessage('Geçersiz Proje ID formatı (UUIDv4 bekleniyor).'),

    body('userId')
        .notEmpty().withMessage('userId boş olamaz.')
        .isUUID(4).withMessage('Geçersiz Kullanıcı ID formatı (UUIDv4 bekleniyor).'),

    body('role')
        .optional()
        .isIn(['admin', 'member']).withMessage('Geçersiz rol. Sadece "admin" veya "member" olabilir.')
];

export const validateRemoveMemberParams = [
    param('projectId')
        .isUUID(4).withMessage('Geçersiz Proje ID formatı.'),

    param('userId')
        .isUUID(4).withMessage('Geçersiz Kullanıcı ID formatı.')
];

export const validateUpdateRole = [
    param('projectId')
        .isUUID(4).withMessage('Geçersiz Proje ID formatı.'),
    param('userId')
        .isUUID(4).withMessage('Geçersiz Kullanıcı ID formatı.'),

    body('role')
        .notEmpty().withMessage('Rol (role) boş olamaz.')
        .isIn(['admin', 'member']).withMessage('Geçersiz rol. Sadece "admin" veya "member" olabilir.')
];