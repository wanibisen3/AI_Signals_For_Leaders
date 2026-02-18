function hasSupabase(supabase) {
    return Boolean(supabase);
}

async function saveRawItems(supabase, rawItems) {
    if (!hasSupabase(supabase) || !rawItems.length) return;
    const rows = rawItems.map((item) => ({
        source: item.source,
        source_tier: item.source_tier,
        url: item.link || '',
        title: item.title || '',
        published_at: item.pubDate,
        content_snippet: item.contentSnippet || '',
        full_text: item.content || '',
        author: item.author || 'Unknown'
    }));
    const { error } = await supabase.from('raw_items').insert(rows);
    if (error) console.error('saveRawItems failed:', error.message);
}

async function saveEnrichedItems(supabase, enrichedItems) {
    if (!hasSupabase(supabase) || !enrichedItems.length) return;
    const rows = enrichedItems.map((item) => ({
        item_id: item.id,
        source: item.source,
        source_tier: item.source_tier,
        source_trust: item.source_trust,
        url: item.url,
        canonical_url: item.canonical_url,
        clean_title: item.clean_title,
        clean_text: item.clean_text,
        entities: item.entities || [],
        category_tags: item.category_tags || [],
        event_type: item.event_type,
        time_horizon_fit: item.time_horizon_fit,
        evidence_strength: item.evidence_strength,
        published_at: item.published_at
    }));
    const { error } = await supabase.from('enriched_items').upsert(rows, { onConflict: 'canonical_url' });
    if (error) console.error('saveEnrichedItems failed:', error.message);
}

async function saveClusters(supabase, clusters) {
    if (!hasSupabase(supabase) || !clusters.length) return;
    const rows = clusters.map((cluster) => ({
        cluster_id: cluster.cluster_id,
        cluster_key: cluster.key,
        event_type: cluster.event_type,
        entity: cluster.entity,
        category: cluster.category,
        representative_url: cluster.representative?.canonical_url || cluster.representative?.url || '',
        representative_title: cluster.representative?.clean_title || '',
        source_tier: cluster.representative?.source_tier || 'C',
        first_seen_at: cluster.first_seen_at,
        last_updated_at: cluster.last_updated_at,
        peak_relevance_window: cluster.peak_relevance_window,
        supporting_source_count: cluster.supporting_source_count || 1,
        ranking_payload: cluster.ranking || null
    }));
    const { error } = await supabase.from('clusters').upsert(rows, { onConflict: 'cluster_id' });
    if (error) console.error('saveClusters failed:', error.message);
}

async function saveClusterItems(supabase, clusters) {
    if (!hasSupabase(supabase) || !clusters.length) return;
    const rows = clusters.flatMap((cluster) =>
        (cluster.items || []).map((item) => ({
            cluster_id: cluster.cluster_id,
            item_id: item.id,
            canonical_url: item.canonical_url || item.url || '',
            source: item.source
        }))
    );
    if (!rows.length) return;
    const { error } = await supabase.from('cluster_items').upsert(rows, { onConflict: 'cluster_id,item_id' });
    if (error) console.error('saveClusterItems failed:', error.message);
}

async function saveBriefs(supabase, briefs) {
    if (!hasSupabase(supabase) || !briefs.length) return;
    const rows = briefs.map((brief) => ({
        brief_id: brief.id,
        cluster_id: brief.clusterId || null,
        headline: brief.headline,
        summary: brief.summary,
        what_happened: brief.whatHappened,
        why_it_matters: brief.whyItMatters,
        leader_takeaway: brief.leaderTakeaway,
        source: brief.source,
        date: brief.date,
        category: brief.category,
        review_status: brief.reviewStatus || 'pending_review',
        approved_at: brief.approvedAt || null,
        approved_by: brief.approvedBy || null,
        payload: brief
    }));
    const { error } = await supabase.from('briefs').upsert(rows, { onConflict: 'brief_id' });
    if (error) console.error('saveBriefs failed:', error.message);
}

async function setBriefReviewStatus(supabase, briefId, reviewStatus, approvedBy = null) {
    if (!hasSupabase(supabase)) return { ok: false, error: 'Supabase not configured' };

    const patch = {
        review_status: reviewStatus,
        approved_at: reviewStatus === 'approved' ? new Date().toISOString() : null,
        approved_by: reviewStatus === 'approved' ? (approvedBy || 'unknown') : null
    };

    const { error } = await supabase.from('briefs').update(patch).eq('brief_id', briefId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

async function listBriefsByReviewStatus(supabase, reviewStatus, limit = 20) {
    if (!hasSupabase(supabase)) return [];
    const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('review_status', reviewStatus)
        .order('date', { ascending: false })
        .limit(limit);
    if (error) {
        console.error('listBriefsByReviewStatus failed:', error.message);
        return [];
    }
    return data || [];
}

module.exports = {
    saveRawItems,
    saveEnrichedItems,
    saveClusters,
    saveClusterItems,
    saveBriefs,
    setBriefReviewStatus,
    listBriefsByReviewStatus
};
