// /api/send-report — Phase 1 placeholder
//
// 자리만 마련. 실제 이메일 발송 연동은 다음 라운드에서:
//   - PDF 생성 (정적 v2.1 샘플 → 동적 react-pdf 단계로 확장)
//   - 메일 게이트웨이 연결 (Resend / SendGrid / Postmark 중 택1)
//   - rate-limit + 봇 차단
//   - 사용자 점수 토큰화하여 보고서 링크에 포함
//
// 현재는 요청을 검증하고 200을 돌려주는 수준. 실제 발송은 일어나지 않으며,
// 성공 응답은 "접수되었습니다" 메시지의 자리만 보장합니다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  // Phase 1: 발송 없이 접수만 인정.
  // (다음 라운드에서 실제 발송 + 영구 저장으로 교체)
  return res.status(200).json({
    ok: true,
    queued: true,
    phase: 1,
    message: 'queued (phase 1 placeholder — no email actually sent)'
  });
}
