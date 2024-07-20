import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient() //conectar com o prisma



function generateUniqueDatabaseURL(schemaId: string) {
    if(!process.env.DATABASE_URL) {
        throw new Error('Please provider a DATABASE_URL environment variable.')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)
    //estamos pegando essa variavel: postgresql://postgres:docker@localhost:5432/nest-clean?schema=public
    //e alterando o schema, fazendo assim, criando uma nova variação de banco de dados:

    return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
    //Criar uma base de dados para os testes
    const databaseURL = generateUniqueDatabaseURL(schemaId)

    process.env.DATABASE_URL = databaseURL //sobrescrevendo o env para a base de dados ser essa base de dados de teste

    console.log(databaseURL)

    execSync('npx prisma migrate deploy') //rodas as migrations
})

afterAll(async () => {
    //Remover a base de dados dos testes
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
})