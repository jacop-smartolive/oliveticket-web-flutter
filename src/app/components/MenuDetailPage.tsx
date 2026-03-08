/**
 * 메뉴 안내 — 메뉴 카드 클릭 시 상세 페이지
 * 피그마 디자인 기반 + 비주얼 강화 레이아웃
 *
 * ⚠️ Flutter-01: @keyframes → implicit animation / AnimatedContainer
 * ⚠️ Flutter-05: position:fixed overlay → Navigator.push full-screen route
 * ⚠️ Flutter-06: linear-gradient → LinearGradient
 * ⚠️ Flutter-07: backdropFilter → BackdropFilter widget
 */
import { ChevronLeft, Clock, MapPin, UtensilsCrossed, FileText } from "lucide-react";
import type { CSSProperties } from "react";

// ─── Design Tokens ───────────────────────────────────────────
const colors = {
  primary: "#EE2B2F",
  primaryDark: "#C91020",
  black: "#191A1C",
  gray1: "#6E6F70",
  gray2: "#A3A3A3",
  gray3: "#C1C1C1",
  gray5: "#EAEAEA",
  gray6: "#F0F0F0",
  bg: "#F2F2F2",
  white: "#FFFFFF",
  blue: "#1D8AFF",
};

export interface MenuDetailData {
  corner: string;
  name: string;
  desc: string;
  img: string;
  kcal: string;
  price: string;
  mealTime?: string;
  noPhoto?: boolean;
}

interface MenuDetailPageProps {
  menu: MenuDetailData;
  onBack: () => void;
}

export default function MenuDetailPage({ menu, onBack }: MenuDetailPageProps) {
  const originInfo = [
    "*위 식단은 시장 상황과 식자재 수급 사정에 따라 변동될 수 있음을 알려드립니다.",
    "*돼지고기,쌀,고등어 : 국내산",
    "*닭고기 : 국내산,브라질산",
    "*대두 : 수입산, *소고기:호주산",
    "*오징어 : 페루산,중국산 *동태-러시아산",
    "*배추김치 : 배추-중국산,고추가루-중국산",
    "겉절이 : 배추:국내산,고추가루-중국산",
  ];

  const sideMenus = menu.desc.split(",").map((s) => s.trim()).filter(Boolean);
  const mealTimeText = menu.mealTime ?? "점심";
  const mealTimeDetail =
    mealTimeText === "아침"
      ? "07:00 ~ 09:00"
      : mealTimeText === "점심"
      ? "11:30 ~ 13:00"
      : mealTimeText === "저녁"
      ? "17:30 ~ 19:00"
      : mealTimeText;

  return (
    <div style={s.overlay}>
      <style>{keyframes}</style>

      {/* ── 스크롤 영역 ── */}
      <div style={s.scroll}>
        {/* ── 히어로 이미지 ── */}
        <div style={{
          ...s.hero,
          backgroundColor: menu.noPhoto ? colors.gray6 : undefined,
        }}>
          {!menu.noPhoto ? (
            <img src={menu.img} alt={menu.name} style={s.heroImg} />
          ) : (
            <div style={s.heroPlaceholder}>
              <svg width="80" height="66" viewBox="0 0 80 66" fill="none">
                <ellipse cx="40" cy="56" rx="36" ry="8" fill="#D9D9D9" />
                <path d="M8 50 C8 22, 72 22, 72 50" fill="#E0E0E0" />
                <path d="M8 50 L72 50" stroke="#D0D0D0" strokeWidth="1.5" />
                <rect x="36" y="16" width="8" height="8" rx="4" fill="#CDCDCD" />
              </svg>
            </div>
          )}
          <div style={s.heroGradient} />
          {/* 뒤로가기 */}
          <button style={s.backBtn} onClick={onBack} aria-label="뒤로가기">
            <ChevronLeft size={22} strokeWidth={2.2} color={colors.white} />
          </button>
          {/* 히어로 하단 정보 */}
          <div style={s.heroInfo}>
            <span style={s.cornerBadge}>본푸드 구내식당</span>
            <h1 style={s.heroTitle}>{menu.name}</h1>
            <div style={s.heroMeta}>
              <Clock size={13} strokeWidth={2.2} color="rgba(255,255,255,0.7)" />
              <span style={s.heroMetaText}>{mealTimeText}식사</span>
            </div>
          </div>
        </div>

        {/* ── 가격 바 ── */}
        <div style={s.priceBar}>
          <div>
            <span style={s.priceLabel}>가격</span>
            <div style={s.priceRow}>
              <span style={s.priceValue}>{menu.price}</span>
              <span style={s.priceUnit}>원</span>
            </div>
          </div>
        </div>

        {/* ── 정보 카드들 ── */}
        <div style={s.cardArea}>
          {/* 코너 + 위치 */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <MapPin size={16} strokeWidth={2.2} color={colors.gray2} />
              <span style={s.cardHeaderText}>식당 정보</span>
            </div>
            <div style={s.divider} />
            <InfoRow label="코너" value={menu.corner.replace(" 코너", "") + " 구내식당 01"} />
            <InfoRow label="식사시간" value={mealTimeDetail} />
          </div>

          {/* 식단 구성 */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <UtensilsCrossed size={16} strokeWidth={2.2} color={colors.gray2} />
              <span style={s.cardHeaderText}>오늘의 식단</span>
            </div>
            <div style={s.divider} />
            <div style={s.infoRow}>
              <span style={s.infoLabel}>구성</span>
              <span style={s.infoValue}>{sideMenus.join(", ")}</span>
            </div>
          </div>

          {/* 원산지 정보 */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <FileText size={16} strokeWidth={2.2} color={colors.gray2} />
              <span style={s.cardHeaderText}>원산지 정보</span>
            </div>
            <div style={s.divider} />
            <div style={s.originBox}>
              {originInfo.map((line, i) => (
                <p key={i} style={{
                  ...s.originLine,
                  color: i === 0 ? colors.primary : colors.gray1,
                  fontWeight: i === 0 ? 500 : 400,
                }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단 결제 버튼 ── */}
      <div style={s.bottomBar}>
        <button style={s.orderBtn} onClick={onBack}>
          <span style={s.orderBtnText}>QR 결제하기</span>
          <span style={s.orderBtnPrice}>{menu.price}원</span>
        </button>
      </div>
    </div>
  );
}

// ─── Sub ──────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  );
}

// ─── Keyframes ───────────────────────────────────────────────
const keyframes = `
@keyframes slideUpDetail {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
`;

// ─── Styles ──────────────────────────────────────────────────
const s: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.bg,
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
    animation: "slideUpDetail 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  /* ── Scroll ── */
  scroll: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },

  /* ── Hero ── */
  hero: {
    position: "relative",
    height: 280,
    flexShrink: 0,
    overflow: "hidden",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  heroGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.25) 100%)",
  },
  backBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    border: "none",
    borderRadius: 999,
    zIndex: 2,
  },
  heroInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "0 20px 20px",
    zIndex: 2,
  },
  cornerBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(6px)",
    fontSize: 11,
    fontWeight: 600,
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: -0.8,
    margin: 0,
    lineHeight: "1.2",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  heroMeta: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  heroMetaText: {
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: -0.3,
    lineHeight: "13px",
    display: "inline-flex",
    alignItems: "center",
    height: 13,
  },

  /* ── Price Bar ── */
  priceBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.gray6}`,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.gray2,
    letterSpacing: -0.3,
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 2,
    marginTop: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.black,
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.black,
    letterSpacing: -0.3,
  },

  /* ── Card Area ── */
  cardArea: {
    padding: "12px 16px 100px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: "16px 18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray6,
    margin: "12px 0",
  },

  /* ── Info Rows ── */
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.gray2,
    letterSpacing: -0.3,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.black,
    letterSpacing: -0.2,
  },

  /* ── Origin Info ── */
  originBox: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  originLine: {
    fontSize: 11.5,
    fontWeight: 400,
    color: colors.gray1,
    letterSpacing: -0.4,
    lineHeight: "1.6",
    margin: 0,
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: "relative",
    zIndex: 10,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: "0 -1px 8px rgba(163,163,163,0.6)",
    padding: 16,
    paddingBottom: 20,
    flexShrink: 0,
  },
  orderBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    border: "none",
    color: colors.white,
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: -0.16,
    gap: 6,
  },
  orderBtnText: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.white,
    letterSpacing: -0.3,
  },
  orderBtnPrice: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: -0.3,
    opacity: 0.85,
  },

  /* ── Hero Placeholder ── */
  heroPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: colors.gray3,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: -0.3,
  },
  heroPlaceholderText: {
    marginTop: 12,
  },

  /* ── Image Placeholder ── */
  imgPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    borderRadius: 10,
    backgroundColor: colors.gray6,
    color: colors.gray3,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: -0.3,
  },
  imgPlaceholderText: {
    marginTop: 10,
    color: colors.gray2,
  },
};