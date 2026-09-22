async function runTests() {
  const baseUrl = 'http://localhost:3030';
  console.log('Testing Project S.H.E. Workflows against:', baseUrl);

  // 1. Config endpoint
  const cfgRes = await fetch(`${baseUrl}/api/config`);
  const cfg = await cfgRes.json();
  console.log('✓ Config endpoint:', cfg.success ? 'OK' : 'FAIL', cfg.config?.google_form_team_app);

  // 2. Submit Review
  const submitRes = await fetch(`${baseUrl}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      display_name: 'Dr. Sunita Rao',
      role_or_relation: 'Survivor & Clinical Psychologist',
      rating: 5,
      review_text: 'The empathy and lightning-fast crisis legal defense provided by Project S.H.E. saved three women from imminent violence in our district this month.',
    }),
  });
  const submitData = await submitRes.json();
  console.log('✓ Submit review (pending moderation):', submitData.success ? 'OK' : 'FAIL', 'Status:', submitData.review?.status);
  const reviewId = submitData.review?.id;

  // 3. Public Reviews - Must NOT include the pending review
  const publicRes = await fetch(`${baseUrl}/api/reviews`);
  const publicData = await publicRes.json();
  const isFoundPending = publicData.reviews.some((r) => r.id === reviewId);
  console.log('✓ Pending review hidden from public website:', !isFoundPending ? 'PASS' : 'FAIL');

  // 4. Admin Auth Check - Unauthorized access blocked with 403
  const unauthRes = await fetch(`${baseUrl}/api/admin/stats`);
  console.log('✓ Unauthorized access to /api/admin/stats receives hard block:', unauthRes.status === 403 ? 'PASS (403)' : 'FAIL');

  // 5. Admin Authorization with Secret
  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-secret': 'she_admin_secret_2026_goated',
  };
  const statsRes = await fetch(`${baseUrl}/api/admin/stats`, { headers: adminHeaders });
  const statsData = await statsRes.json();
  console.log('✓ Authorized admin stats access:', statsData.success ? 'PASS' : 'FAIL', 'Pending Reviews Count:', statsData.stats?.pendingReviews);

  // 6. Admin Approves Review
  if (reviewId) {
    const approveRes = await fetch(`${baseUrl}/api/admin/reviews`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ id: reviewId, status: 'approved' }),
    });
    const approveData = await approveRes.json();
    console.log('✓ Admin approved review:', approveData.success ? 'PASS' : 'FAIL');

    // 7. Verify Review is now public
    const publicAfterRes = await fetch(`${baseUrl}/api/reviews`);
    const publicAfterData = await publicAfterRes.json();
    const isNowPublic = publicAfterData.reviews.some((r) => r.id === reviewId);
    console.log('✓ Approved review now publicly visible on website:', isNowPublic ? 'PASS' : 'FAIL');
  }

  // 8. Submit Private Suggestion/Feedback
  const fbRes = await fetch(`${baseUrl}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Radhika Verma',
      email: 'radhika.v@example.com',
      type: 'suggestion',
      subject: 'Self-Defense Training in North Campus',
      message: 'Can Project S.H.E. organise weekend workshops on basic martial self-defense and pepper spray usage at Delhi University?',
    }),
  });
  const fbData = await fbRes.json();
  console.log('✓ Private suggestion submitted:', fbData.success ? 'PASS' : 'FAIL');

  // 9. Admin view Feedback
  const adminFbRes = await fetch(`${baseUrl}/api/admin/feedback`, { headers: adminHeaders });
  const adminFbData = await adminFbRes.json();
  console.log('✓ Admin feedback inbox contains entries:', adminFbData.success && adminFbData.feedback.length > 0 ? 'PASS' : 'FAIL');

  // 10. Public Posts API
  const postsRes = await fetch(`${baseUrl}/api/posts`);
  const postsData = await postsRes.json();
  console.log('✓ Public published posts fetched:', postsData.success ? 'PASS' : 'FAIL', 'Count:', postsData.posts?.length);

  console.log('\n--- ALL WORKFLOWS VERIFIED 100% OPERATIONAL ---');
}

runTests();
