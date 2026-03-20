import { PrismaClient } from '@prisma/client'

// Create one Prisma instance and reuse it everywhere
const prisma = new PrismaClient()

export default prisma