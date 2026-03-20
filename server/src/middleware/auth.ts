import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string

// Extend Request so we can attach the userId to it
export interface AuthRequest extends Request {
    userId?: number
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    // Expect header: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, ACCESS_SECRET) as { userId: number }
        req.userId = payload.userId
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}