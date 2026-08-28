const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set');

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConn() {
  try {
    const client = await pool.connect();
    console.log('PG Pool connected successfully');
    client.release();
  } catch (e) {
    console.error('PG Pool connection failed:', e);
  }
}
testConn();

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
