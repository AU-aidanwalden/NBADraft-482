// Storing values like this allows for easy swapping later
export const jwtSecret = process.env.JWT_SECRET;
export const jwtAccessExpiration = 600; // 10 minutes in seconds
export const refreshExpiration = 18144000; // 30 days in seconds
