import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const databaseHost = process.env.DB_HOST
const databasePort = Number(process.env.DB_PORT)
const databaseUser = process.env.DB_USER
const databasePassword = process.env.DB_PASSWORD
const databaseName = process.env.DB_NAME

if (
  !databaseHost ||
  !databasePort ||
  !databaseUser ||
  !databasePassword ||
  !databaseName
) {
  throw new Error(
    'DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME are required',
  )
}

const client = postgres({
  host: databaseHost,
  port: databasePort,
  username: databaseUser,
  password: databasePassword,
  database: databaseName,
  ssl: 'require',
})

export const db = drizzle(client)
