import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { MainPostData, SmallPostData } from '../content.config';

export type PostEntry = CollectionEntry<'posts'>;

export interface RelatedItem {
  entry: PostEntry;
  parent?: PostEntry;
}

export interface SmallWithParent {
  entry: PostEntry;
  parent?: PostEntry;
}

export interface RelationshipEntry {
  small: PostEntry;
  parent: PostEntry;
  prev?: PostEntry;
  next?: PostEntry;
}

/* ------------------------------------------------------------------ */
/*  ID helpers                                                        */
/* ------------------------------------------------------------------ */

/** Extract the small-collection directory name from a small post's ID. */
export function extractSmallDirFromId(id: string): string | undefined {
  const parts = id.split('/');
  if (parts.length >= 3 && parts[0] === 'small') return parts[1];
  if (parts.length >= 2) return parts[0];
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Core data fetching                                                */
/* ------------------------------------------------------------------ */

export async function getAllPosts(): Promise<PostEntry[]> {
  return getCollection('posts', ({ data }) => !data.draft);
}

export async function getNonDraftPosts(): Promise<PostEntry[]> {
  return getAllPosts();
}

/* ------------------------------------------------------------------ */
/*  Relationship resolution                                           */
/* ------------------------------------------------------------------ */

let _smallToMainCache: Map<string, PostEntry> | null = null;

async function getSmallToMainMap(): Promise<Map<string, PostEntry>> {
  if (_smallToMainCache) return _smallToMainCache;

  const allPosts = await getAllPosts();
  const map = new Map<string, PostEntry>();

  for (const post of allPosts) {
    if (post.data.type !== 'main') continue;
    const small = (post.data as MainPostData).small;
    if (!small) continue;

    if (map.has(small)) {
      const existing = map.get(small)!;
      console.error(
        `[articles] Duplicate small reference "${small}": "${existing.id}" and "${post.id}"`,
      );
    } else {
      map.set(small, post);
    }
  }

  _smallToMainCache = map;
  return map;
}

export async function resolveParentForSmallPost(
  entry: PostEntry,
): Promise<PostEntry | undefined> {
  if (entry.data.type !== 'small') return undefined;
  const dir = extractSmallDirFromId(entry.id);
  if (!dir) return undefined;
  return (await getSmallToMainMap()).get(dir);
}

export async function getRelatedItems(entry: PostEntry): Promise<RelatedItem[]> {
  if (entry.data.type !== 'main') return [];
  const mainData = entry.data as MainPostData;
  if (!mainData.small) return [];

  const allPosts = await getAllPosts();
  return allPosts
    .filter((p) => {
      if (p.data.type !== 'small') return false;
      return extractSmallDirFromId(p.id) === mainData.small;
    })
    .sort((a, b) => (a.data as SmallPostData).order - (b.data as SmallPostData).order)
    .map((p) => ({ entry: p, parent: entry }));
}

export async function resolveSmallPosts(
  smallPosts: PostEntry[],
): Promise<SmallWithParent[]> {
  const smallToMain = await getSmallToMainMap();
  const resolved: SmallWithParent[] = [];

  for (const entry of smallPosts) {
    const dir = extractSmallDirFromId(entry.id);
    if (!dir) continue;
    const parent = smallToMain.get(dir);
    if (parent && !parent.data.draft) {
      resolved.push({ entry, parent });
    }
  }

  return resolved;
}

/* ------------------------------------------------------------------ */
/*  Relationship map (prev/next navigation)                           */
/* ------------------------------------------------------------------ */

export async function buildRelationshipMap(): Promise<Map<string, RelationshipEntry>> {
  const allPosts = await getAllPosts();
  const smallToMain = await getSmallToMainMap();

  const smallPosts = allPosts.filter((p) => p.data.type === 'small');
  const byParent = new Map<string, PostEntry[]>();

  for (const entry of smallPosts) {
    const smallData = entry.data as SmallPostData;
    const parentSlug = extractSmallDirFromId(entry.id);

    if (!parentSlug) {
      console.error(
        `[articles] Small post "${entry.id}" has unexpected ID format – cannot determine parent directory.`,
      );
      continue;
    }

    if (typeof smallData.order !== 'number' || !Number.isFinite(smallData.order)) {
      console.error(
        `[articles] Small post "${entry.id}" has missing or invalid "order": ${JSON.stringify(smallData.order)}.`,
      );
      continue;
    }

    if (smallData.order < 0) {
      console.error(
        `[articles] Small post "${entry.id}" has negative "order": ${smallData.order}.`,
      );
      continue;
    }

    const parent = smallToMain.get(parentSlug);
    if (!parent || parent.data.type !== 'main') {
      console.error(
        `[articles] Small post "${entry.id}" has no main article with small="${parentSlug}".`,
      );
      continue;
    }

    const list = byParent.get(parentSlug) ?? [];
    list.push(entry);
    byParent.set(parentSlug, list);
  }

  /* Validate duplicate orders */
  for (const [parentSlug, children] of byParent) {
    const seen = new Map<number, string>();
    for (const child of children) {
      const o = (child.data as SmallPostData).order;
      if (seen.has(o)) {
        console.error(
          `[articles] Duplicate order ${o} in "${parentSlug}": "${seen.get(o)}" and "${child.id}".`,
        );
      } else {
        seen.set(o, child.id);
      }
    }
  }

  /* Validate main-article small references */
  for (const post of allPosts) {
    if (post.data.type !== 'main') continue;
    const small = (post.data as MainPostData).small;
    if (!small) continue;
    const hasChildren = smallPosts.some(
      (p) => extractSmallDirFromId(p.id) === small,
    );
    if (!hasChildren) {
      console.error(
        `[articles] Main post "${post.id}" references small collection "${small}" but no small posts found.`,
      );
    }
  }

  /* Build relationship map with prev/next */
  const result = new Map<string, RelationshipEntry>();

  for (const [, children] of byParent) {
    const sorted = children.sort(
      (a, b) => (a.data as SmallPostData).order - (b.data as SmallPostData).order,
    );
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const parentSlug = extractSmallDirFromId(entry.id)!;
      result.set(entry.id, {
        small: entry,
        parent: smallToMain.get(parentSlug)!,
        prev: i > 0 ? sorted[i - 1] : undefined,
        next: i < sorted.length - 1 ? sorted[i + 1] : undefined,
      });
    }
  }

  return result;
}
