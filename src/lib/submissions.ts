import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isReadOnlyHost, redis, storageMissingMessage } from './kv';

export type SubmissionKind = 'contact' | 'internship';
export type SubmissionStatus = 'new' | 'progress' | 'done' | 'archived';

export type ContactData = {
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  serviceNeeded: string[];
  serviceTypes?: string[];
  message: string;
};

export type InternshipData = {
  name: string;
  email: string;
  mobile: string;
  college: string;
  course: string;
  yearOfStudy: string;
  domain: string;
  mode: string;
  duration: string;
  message: string;
};

type SubmissionBase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: SubmissionStatus;
  starred: boolean;
  notes: string;
};

export type ContactSubmission = SubmissionBase & { kind: 'contact'; data: ContactData };
export type InternshipSubmission = SubmissionBase & { kind: 'internship'; data: InternshipData };
export type Submission = ContactSubmission | InternshipSubmission;

export type SubmissionPatch = Partial<Pick<SubmissionBase, 'status' | 'starred' | 'notes'>>;

const dataDir = process.env.SUBMISSIONS_DIR || path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'submissions.json');

// Serialize every read-modify-write so concurrent form posts can't clobber each other.
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeAll(submissions: Submission[]) {
  await fs.mkdir(dataDir, { recursive: true });
  const tempFile = `${dataFile}.${process.pid}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(submissions, null, 2), 'utf8');
  await fs.rename(tempFile, dataFile);
}

const REDIS_KEY = 'craftlanee:submissions';

function assertWritable() {
  if (!redis && isReadOnlyHost) throw new Error(storageMissingMessage());
}

export async function listSubmissions(): Promise<Submission[]> {
  const submissions = redis ? Object.values((await redis.hgetall<Submission>(REDIS_KEY)) ?? {}) : await readAll();
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listContacts() {
  return (await listSubmissions()).filter((item): item is ContactSubmission => item.kind === 'contact');
}

export async function listInternships() {
  return (await listSubmissions()).filter((item): item is InternshipSubmission => item.kind === 'internship');
}

export function saveSubmission(kind: 'contact', data: ContactData): Promise<ContactSubmission>;
export function saveSubmission(kind: 'internship', data: InternshipData): Promise<InternshipSubmission>;
export function saveSubmission(kind: SubmissionKind, data: ContactData | InternshipData): Promise<Submission> {
  return withLock(async () => {
    const now = new Date().toISOString();
    const submission = {
      id: randomUUID(),
      kind,
      createdAt: now,
      updatedAt: now,
      status: 'new',
      starred: false,
      notes: '',
      data,
    } as Submission;

    assertWritable();
    if (redis) {
      await redis.hset(REDIS_KEY, { [submission.id]: submission });
      return submission;
    }
    const submissions = await readAll();
    submissions.push(submission);
    await writeAll(submissions);
    return submission;
  });
}

export function updateSubmission(id: string, patch: SubmissionPatch) {
  return withLock(async () => {
    assertWritable();
    const submissions = redis ? [] : await readAll();
    const target = redis ? await redis.hget<Submission>(REDIS_KEY, id) : submissions.find((item) => item.id === id);
    if (!target) return null;

    if (patch.status !== undefined) target.status = patch.status;
    if (patch.starred !== undefined) target.starred = patch.starred;
    if (patch.notes !== undefined) target.notes = patch.notes;
    target.updatedAt = new Date().toISOString();

    if (redis) await redis.hset(REDIS_KEY, { [id]: target });
    else await writeAll(submissions);
    return target;
  });
}

export function deleteSubmission(id: string) {
  return withLock(async () => {
    assertWritable();
    if (redis) return (await redis.hdel(REDIS_KEY, id)) > 0;
    const submissions = await readAll();
    const remaining = submissions.filter((item) => item.id !== id);
    if (remaining.length === submissions.length) return false;
    await writeAll(remaining);
    return true;
  });
}
