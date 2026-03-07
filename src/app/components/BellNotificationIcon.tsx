/**
 * BellNotificationIcon
 *
 * 위치: /src/app/components/BellNotificationIcon.tsx
 *
 * SVG viewBox: 0 0 28 28
 * - 종(Bell) 몸통: path (중앙 x=14, y=12 기준)
 * - 손잡이 고리: 상단 호
 * - 진동 받침대: 하단 호
 * - 알림 빨간 점: cx=21 cy=7 r=4 (우상단)
 *   → 흰색 테두리 stroke 2px로 종과 분리
 *
 * ──────────────────────────────────────────────────────────────
 * ⚠️ Flutter 변환 가이드
 * ──────────────────────────────────────────────────────────────
 * Flutter-21: <svg> 태그 직접 사용 불가
 *   → flutter_svg 패키지: SvgPicture.string(svgString)
 *   → 또는 CustomPainter + Path() 로 각 path 직접 구현
 *   pubspec.yaml: flutter_svg: ^2.0.0
 * Flutter-04: stroke="white" strokeWidth="2"
 *   → Border.all(color: Colors.white, width: 2)
 * ──────────────────────────────────────────────────────────────
 */

export function BellNotificationIcon({ size = 28 }: { size?: number }) {
  return (
    // ⚠️ Flutter-21: <svg> → SvgPicture.string(...) 또는 CustomPainter로 변환
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 종 손잡이 (상단 고리) */}
      <path
        d="M14 3.5 C14 3.5 14 2 14 2"
        stroke="#191A1C"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* 종 몸통 */}
      <path
        d="M8.5 11.5
           C8.5 8.186 11.024 5.5 14 5.5
           C16.976 5.5 19.5 8.186 19.5 11.5
           L19.5 16.5
           L21 18.5
           H7
           L8.5 16.5
           Z"
        stroke="#191A1C"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* 종 하단 받침 (울림) */}
      <path
        d="M11.5 18.5 C11.5 20.157 12.619 21.5 14 21.5 C15.381 21.5 16.5 20.157 16.5 18.5"
        stroke="#191A1C"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* 알림 빨간 점: 우상단 cx=21 cy=7 */}
      {/* ⚠️ Flutter-04: stroke="white" strokeWidth="2" → Border.all(color: Colors.white, width: 2) */}
      <circle cx="21" cy="7" r="4" fill="#EE2B2F" stroke="white" strokeWidth="2" />
    </svg>
  );
}