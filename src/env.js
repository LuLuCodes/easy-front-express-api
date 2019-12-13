import dotenv from 'dotenv';
import path from 'path';


/**
 * Initialize environment variables.
 */
dotenv.config({ path: path.resolve(__dirname, './.env')});