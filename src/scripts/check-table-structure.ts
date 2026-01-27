import dotenv from 'dotenv';
import path from 'path';
import { Kysely } from 'kysely';
import { PostgresDialect } from 'kysely';
import pg from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const dialect = new PostgresDialect({ 
        pool: new pg.Pool({ 
            connectionString: process.env.DATABASE_URL 
        }) 
    });
    const db = new Kysely<any>({ dialect });

    try {
        // Execute raw SQL using the database connection directly
        const result = await db.executeQuery({
            sql: `
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'user' 
                ORDER BY ordinal_position
            `,
            parameters: []
        } as any); // Cast to any to bypass type checking

        console.log('User table columns in DB:');
        result.rows.forEach((row: any) => {
            console.log(`  - ${row.column_name}: ${row.data_type}`);
        });
    } catch (error) {
        console.error('Error checking table structure:', error);
    } finally {
        await db.destroy(); // Close the database connection
    }
}

check();