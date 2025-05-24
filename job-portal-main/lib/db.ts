// import {PrismaClient} from '@prisma/client'

// declare global {
//     var prisma : PrismaClient | undefined
// }

// export const db = globalThis.prisma || new PrismaClient();

// if(process.env.NODE_ENV !== 'production'){
//     globalThis.prisma = db
// }

import { PrismaClient } from '@prisma/client'

// Extend the NodeJS.Global interface
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db
}