import crypto from 'crypto';
import { ResponseCache } from './types';
import { responseCacheRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class ResponseCacheManager {
  private static instance: ResponseCacheManager;
  private inMemoryCache: Map<string, ResponseCache> = new Map();

  private constructor() {}

  public static getInstance(): ResponseCacheManager {
    if (!ResponseCacheManager.instance) {
      ResponseCacheManager.instance = new ResponseCacheManager();
    }
    return ResponseCacheManager.instance;
  }

  /**
   * Generates a unique SHA-256 hash representing a request signature.
   */
  public hashRequest(promptId: string, variables: Record<string, any>): string {
    const serialized = JSON.stringify({ promptId, variables });
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Retrieves a cached generation payload if valid and not expired.
   */
  public async get(cacheKey: string): Promise<ResponseCache | null> {
    const now = new Date();

    // 1. In-memory check (under <5ms)
    const memEntry = this.inMemoryCache.get(cacheKey);
    if (memEntry) {
      if (new Date(memEntry.expiresAt) > now) {
        memEntry.hits++;
        // Async update of hits count in Firestore
        this.updateHits(memEntry).catch((err) =>
          logger.warn('Failed to update cache hit stats:', err),
        );
        return memEntry;
      } else {
        // Expired in-memory
        this.inMemoryCache.delete(cacheKey);
      }
    }

    // 2. Database lookup fallback
    try {
      const records = await responseCacheRepository.list([
        { field: 'cacheKey', operator: '==' as const, value: cacheKey },
      ]);
      if (records.length > 0) {
        const dbEntry = records[0];
        if (new Date(dbEntry.expiresAt) > now) {
          dbEntry.hits++;
          this.inMemoryCache.set(cacheKey, dbEntry);
          this.updateHits(dbEntry).catch((err) =>
            logger.warn('Failed to update cache hit stats:', err),
          );
          return dbEntry;
        } else {
          // Expired database cache
          responseCacheRepository.delete(dbEntry.id!).catch(() => {});
        }
      }
    } catch (err) {
      logger.error('Failed to lookup response cache record from Firestore:', err);
    }

    return null;
  }

  /**
   * Caches a generation result.
   * Default expiration is 24 hours.
   */
  public async set(cacheKey: string, text: string, ttlHours = 24): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString();

    const cacheEntry: ResponseCache = {
      cacheKey,
      text,
      hits: 0,
      expiresAt,
      createdAt: now.toISOString(),
    };

    // Store in-memory
    this.inMemoryCache.set(cacheKey, cacheEntry);

    // Save to Firestore
    try {
      const existing = await responseCacheRepository.list([
        { field: 'cacheKey', operator: '==' as const, value: cacheKey },
      ]);
      if (existing.length > 0) {
        await responseCacheRepository.update(existing[0].id!, {
          text,
          expiresAt,
          hits: 0,
        });
      } else {
        await responseCacheRepository.add(cacheEntry);
      }
    } catch (err) {
      logger.error('Failed to persist cache entry in database:', err);
    }
  }

  /**
   * Helper that updates the cache hit counter inside Firestore.
   */
  private async updateHits(entry: ResponseCache): Promise<void> {
    if (entry.id) {
      await responseCacheRepository.update(entry.id, {
        hits: entry.hits,
      });
    }
  }

  /**
   * Clears the cache entries (mainly useful for testing triggers).
   */
  public clear(): void {
    this.inMemoryCache.clear();
  }
}
