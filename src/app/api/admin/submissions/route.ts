import { NextResponse } from 'next/server';
import { isAdminSession } from '../../../../lib/admin-session';
import { listSubmissions, type Submission, type SubmissionKind, type SubmissionStatus } from '../../../../lib/submissions';

function searchableText(item: Submission) {
  return Object.values(item.data).flat().join(' ').concat(' ', item.notes).toLowerCase();
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind') as SubmissionKind | null;
  const filter = searchParams.get('filter') || 'active'; // 'active' | SubmissionStatus | 'starred'
  const query = searchParams.get('query')?.trim().toLowerCase() || '';
  const facet = searchParams.get('facet')?.trim() || '';

  let all = await listSubmissions();
  if (kind) {
    all = all.filter((item) => item.kind === kind);
  }

  const facetValues = all.flatMap((item) => (item.kind === 'contact' ? item.data.serviceNeeded : [item.data.domain]));
  const facets = Array.from(new Set(facetValues)).sort();

  const counts = {
    active: all.filter((item) => item.status !== 'archived').length,
    new: all.filter((item) => item.status === 'new').length,
    progress: all.filter((item) => item.status === 'progress').length,
    done: all.filter((item) => item.status === 'done').length,
    starred: all.filter((item) => item.starred).length,
    archived: all.filter((item) => item.status === 'archived').length,
  };

  let filtered = all.filter((item) => {
    if (facet) {
      const values = item.kind === 'contact' ? item.data.serviceNeeded : [item.data.domain];
      if (!values.includes(facet)) return false;
    }
    return !query || searchableText(item).includes(query);
  });

  filtered = filtered.filter((item) => {
    if (filter === 'active') return item.status !== 'archived';
    if (filter === 'starred') return item.starred;
    return item.status === filter;
  });

  return NextResponse.json({
    items: filtered,
    total: filtered.length,
    counts,
    facets,
  });
}
