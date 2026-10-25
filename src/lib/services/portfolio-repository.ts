import { PortfolioData, PortfolioDataSchema } from "@/lib/schema/portfolio";
import fs from "fs/promises";
import path from "path";

export interface PortfolioRepository {
  getById(id: string): Promise<PortfolioData | null>;
  getBySlug(slug: string): Promise<PortfolioData | null>;
  save(portfolio: PortfolioData): Promise<PortfolioData>;
  delete(id: string): Promise<boolean>;
  listByUser(userId: string): Promise<PortfolioData[]>;
}

const DATA_DIR = path.resolve(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "portfolios.json");

/**
 * File-backed persistence repository for local development and drafts.
 * Adheres strictly to server-side persistence principles.
 */
class LocalFilePortfolioRepository implements PortfolioRepository {
  private async ensureStorage(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(DATA_FILE);
      } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
      }
    } catch (err) {
      console.error("[Storage] Failed to initialize storage:", err);
    }
  }

  private async readAll(): Promise<PortfolioData[]> {
    await this.ensureStorage();
    try {
      const content = await fs.readFile(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => {
          const res = PortfolioDataSchema.safeParse(item);
          return res.success ? res.data : null;
        })
        .filter((item): item is PortfolioData => item !== null);
    } catch {
      return [];
    }
  }

  private async writeAll(portfolios: PortfolioData[]): Promise<void> {
    await this.ensureStorage();
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(portfolios, null, 2), "utf-8");
    await fs.rename(tempFile, DATA_FILE);
  }

  async getById(id: string): Promise<PortfolioData | null> {
    const all = await this.readAll();
    return all.find((p) => p.id === id) || null;
  }

  async getBySlug(slug: string): Promise<PortfolioData | null> {
    const all = await this.readAll();
    return all.find((p) => p.slug === slug) || null;
  }

  async save(portfolio: PortfolioData): Promise<PortfolioData> {
    const validated = PortfolioDataSchema.parse({
      ...portfolio,
      updatedAt: new Date().toISOString(),
    });

    const all = await this.readAll();
    const existingIndex = all.findIndex((p) => p.id === validated.id);

    if (existingIndex >= 0) {
      all[existingIndex] = validated;
    } else {
      all.push(validated);
    }

    await this.writeAll(all);
    return validated;
  }

  async delete(id: string): Promise<boolean> {
    const all = await this.readAll();
    const initialLen = all.length;
    const filtered = all.filter((p) => p.id !== id);
    if (filtered.length !== initialLen) {
      await this.writeAll(filtered);
      return true;
    }
    return false;
  }

  async listByUser(userId: string): Promise<PortfolioData[]> {
    const all = await this.readAll();
    return all.filter((p) => p.userId === userId);
  }
}

export const portfolioRepository: PortfolioRepository = new LocalFilePortfolioRepository();
