import { Router, Response } from 'express'
import prisma from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Protect all task routes — user must be logged in
router.use(requireAuth)

// GET /tasks — get all tasks for the logged in user
// Supports: ?page=1 &status=pending &q=sometitle
router.get('/', async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const status = req.query.status as string | undefined
    const search = req.query.q as string | undefined

    // Build the filter — always scope to the logged in user
    const where: any = { userId: req.userId }

    if (status) {
        where.status = status
    }

    if (search) {
        where.title = { contains: search }
    }

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.task.count({ where })
    ])

    res.json({
        tasks,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    })
})

// POST /tasks — create a new task
router.post('/', async (req: AuthRequest, res: Response) => {
    const { title, description } = req.body

    if (!title) {
        res.status(400).json({ message: 'Title is required' })
        return
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            userId: req.userId as number
        }
    })

    res.status(201).json(task)
})

// GET /tasks/:id — get a single task
router.get('/:id', async (req: AuthRequest, res: Response) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(req.params.id) }
    })

    if (!task || task.userId !== req.userId) {
        res.status(404).json({ message: 'Task not found' })
        return
    }

    res.json(task)
})

// PATCH /tasks/:id — update a task
router.patch('/:id', async (req: AuthRequest, res: Response) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(req.params.id) }
    })

    if (!task || task.userId !== req.userId) {
        res.status(404).json({ message: 'Task not found' })
        return
    }

    const { title, description, status } = req.body

    const updated = await prisma.task.update({
        where: { id: task.id },
        data: { title, description, status }
    })

    res.json(updated)
})

// DELETE /tasks/:id — delete a task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(req.params.id) }
    })

    if (!task || task.userId !== req.userId) {
        res.status(404).json({ message: 'Task not found' })
        return
    }

    await prisma.task.delete({ where: { id: task.id } })

    res.json({ message: 'Task deleted' })
})

// PATCH /tasks/:id/toggle — flip status between pending and completed
router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(req.params.id) }
    })

    if (!task || task.userId !== req.userId) {
        res.status(404).json({ message: 'Task not found' })
        return
    }

    const updated = await prisma.task.update({
        where: { id: task.id },
        data: {
            status: task.status === 'pending' ? 'completed' : 'pending'
        }
    })

    res.json(updated)
})

export default router