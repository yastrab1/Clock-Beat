'use server'
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: 'https://beloved-wahoo-11487.upstash.io',
    token: process.env.UPSTASH_REDIS_TOKEN || '',
})

export async function setClientToken(userId: string, token: string){
    await redis.set(userId, token);
}

export async function getClientToken(userId: string): Promise<string|null>{
    return redis.get(userId);
}