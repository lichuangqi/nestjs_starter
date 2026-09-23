import * as dotenv from 'dotenv';
export function getEnvs() {
  const envFilePaths = [
    `.env.${process.env.NODE_ENV || `development`}`,
    '.env',
  ];
  const parsed = dotenv.config({ path: envFilePaths }).parsed ?? {};
  return { ...parsed, ...process.env };
}
