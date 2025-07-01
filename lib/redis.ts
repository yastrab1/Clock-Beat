import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: 'https://beloved-wahoo-11487.upstash.io',
    token: process.env.UPSTASH_REDIS_TOKEN || '',
})

export function setClientToken(userId: string, token: string){
    redis.set(userId, token);
}

export function getClientToken(userId: string){
    return redis.get(userId);
}