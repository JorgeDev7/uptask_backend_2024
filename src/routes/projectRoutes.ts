import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { validateProjectExists } from '../middleware/project';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';

const router = Router();

router.post('/',

    body('projectName')
        .notEmpty().withMessage('Project Name is required'),

    body('clientName')
        .notEmpty().withMessage('Client Name is required'),

    body('description')
        .notEmpty().withMessage('Description is required'),

    handleInputErrors,

    ProjectController.createProject
);
router.get('/', ProjectController.getAllProject);
router.get('/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('projectName')
        .notEmpty().withMessage('Project Name is required'),

    body('clientName')
        .notEmpty().withMessage('Client Name is required'),

    body('description')
        .notEmpty().withMessage('Description is required'),

    handleInputErrors,
    ProjectController.updatedProject
);

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.deleteProject
);


// * Routes for tasks
router.post('/:projectId/tasks',

    validateProjectExists,

    body('name')
        .notEmpty().withMessage('Task Name is required'),

    body('description')
        .notEmpty().withMessage('Description is required'),

    handleInputErrors,

    TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectsTasks);

router.get('/:projectId/tasks/:taskId',

    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
);

export default router;