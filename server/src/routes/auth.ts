import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const router = Router()

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string

// Helper to generate both tokens for a user
function generateTokens(userId: number) {
    const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}

// POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
    }

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        res.status(400).json({ message: 'Email already in use' })
        return
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: { email, password: hashedPassword }
    })

    const { accessToken, refreshToken } = generateTokens(user.id)

    // Save refresh token on the user record
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    })

    res.status(201).json({ accessToken, refreshToken })
})

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
    }

    const { accessToken, refreshToken } = generateTokens(user.id)

    // Update the stored refresh token
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    })

    res.json({ accessToken, refreshToken })
})

// POST /auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' })
        return
    }

    // Verify the token is valid
    let payload: any
    try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET)
    } catch {
        res.status(401).json({ message: 'Invalid or expired refresh token' })
        return
    }

    // Check the token matches what we have stored
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Refresh token not recognised' })
        return
    }

    // Issue a fresh pair of tokens
    const tokens = generateTokens(user.id)

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken }
    })

    res.json(tokens)
})

// POST /auth/logout
router.post('/logout', async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' })
        return
    }

    // Find user by refresh token and clear it
    const user = await prisma.user.findFirst({ where: { refreshToken } })
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: null }
        })
    }

    res.json({ message: 'Logged out successfully' })
})

export default router