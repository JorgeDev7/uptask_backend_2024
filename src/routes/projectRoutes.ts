import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { projectExists } from '../middleware/project';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

const router = Router();

router.use(authenticate);

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
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ProjectController.deleteProject
);


// * Routes for tasks
// Validates the param on an endpoint, callback => function tha validates
router.param('projectId', projectExists);

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('Task Name is required'),

    body('description')
        .notEmpty().withMessage('Description is required'),

    handleInputErrors,

    TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectsTasks);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);
router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('name')
        .notEmpty().withMessage('Task Name is required'),

    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',

    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('status')
        .notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaskController.updateStatus
);

// Routes for teams
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid Email'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
);

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
);

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
);

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
);

// Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('Note content is required'),
    handleInputErrors,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
);

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    NoteController.deleteNote
);

export default router;