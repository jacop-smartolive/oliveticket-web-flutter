/**
 * 올리브식권 - Figma Make 미리보기용
 * Flutter 변환 참조: oliveticket-flutter-app 저장소
 *
 * ──────────────────────────────────────────────────────────────
 * Flutter 변환 워크플로우
 * ──────────────────────────────────────────────────────────────
 * 1차: oliveticket-flutter-web  — Figma Make (React 웹 디자인)
 * 2차: oliveticket-flutter-app  — Flutter Dart 실제 앱 코드
 * ──────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback } from "react";
import type { ReactNode, CSSProperties } from "react";
import {
  ShoppingCart,
  Home,
  ScrollText,
  UserRound,
  ChevronRight,
  Bell,
} from "lucide-react";
import svgPaths from "../imports/svg-apf66xr4az";
import QrIcon from "../imports/QrIcon";
import QrPaymentPage from "./components/QrPaymentPage";
import NotificationPage from "./components/NotificationPage";

// ─── Keyframes for day tap animation ─────────────────────────
const animationKeyframes = `
@keyframes dayTapBounce {
  0% { transform: scale(1); }
  50% { transform: scale(0.92); }
  100% { transform: scale(1); }
}
@keyframes spinLoader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// ─── Design Tokens ───────────────────────────────────────────
const colors = {
  primary: "#EE2B2F",
  blue: "#1D8AFF",
  black: "#191A1C",
  gray1: "#8C96A8",
  gray2: "#A3A3A3",
  gray3: "#C1C1C1",
  gray4: "#ADAFBB",
  gray5: "#EAEAEA",
  gray6: "#F0F0F0",
  gray7: "#EFEFEF",
  bg: "#F7F8FA",
  white: "#FFFFFF",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

// ─── StyleSheet ──────────────────────────────────────────────
const styles: Record<string, CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.white,
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: colors.white,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.sm + 4,
    paddingBottom: spacing.sm + 4,
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.gray6}`,
    zIndex: 10,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.5,
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconBtn: {
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    top: 8,
    right: 8,
    border: "1.5px solid white",
  },
  pointsSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bg,
  },
  pointsCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing.xl,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  pointsLabel: {
    fontSize: 13,
    color: colors.gray1,
    fontWeight: 500,
    marginBottom: spacing.xs,
  },
  pointsRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.black,
    letterSpacing: -0.5,
  },
  tabsSection: {
    backgroundColor: colors.bg,
    borderBottom: `1px solid ${colors.gray7}`,
  },
  tabsRow: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: spacing.xl,
  },
  tabBtn: {
    position: "relative",
    paddingTop: 14,
    paddingBottom: 14,
    marginRight: spacing.xxl,
    background: "none",
    border: "none",
    cursor: "pointer",
    letterSpacing: -0.3,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.black,
    borderRadius: radius.full,
  },
  calendarSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bg,
    borderBottom: `1px solid ${colors.gray6}`,
  },
  calendarRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  dayCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    minWidth: 28,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.gray2,
  },
  todayCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52,
    height: 58,
    border: `2.5px solid ${colors.black}`,
    borderRadius: radius.md,
    padding: "6px 14px",
    backgroundColor: colors.bg,
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.black,
  },
  todayDate: {
    fontSize: 15,
    fontWeight: 800,
    color: colors.black,
  },
  bannerSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.white,
  },
  bannerWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    background:
      "linear-gradient(135deg, #FF4B50 0%, #E8182E 60%, #C91020 100%)",
    height: 100,
  },
  bannerCircle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: radius.full,
    background: "rgba(255,255,255,0.08)",
    right: -20,
    top: -30,
  },
  bannerCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: radius.full,
    background: "rgba(255,255,255,0.06)",
    right: 60,
    bottom: -20,
  },
  bannerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: spacing.xl,
    paddingRight: 128,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: 500,
    color: "rgba(255,255,255,0.75)",
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  bannerSub: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: -0.5,
  },
  bannerImg: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 120,
    height: 100,
    objectFit: "cover",
  },
  mealTabsSection: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  menuGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.white,
  },
  menuCard: {
    flexBasis: "calc(50% - 6px)",
    maxWidth: "calc(50% - 6px)",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  },
  menuImgWrap: {
    position: "relative",
    height: 140,
  },
  menuImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  kcalBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.45)",
    fontSize: 10,
    fontWeight: 600,
    color: colors.white,
    backdropFilter: "blur(4px)",
  },
  menuBody: {
    padding: spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  menuCorner: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.blue,
    letterSpacing: -0.3,
  },
  menuName: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.4,
    lineHeight: 1.3,
  },
  menuDesc: {
    fontSize: 11,
    color: colors.gray1,
    lineHeight: 1.5,
    letterSpacing: -0.3,
  },
  menuPriceRow: {
    marginTop: 2,
    paddingTop: spacing.sm,
    borderTop: "1px solid #F5F5F5",
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: 800,
    color: colors.black,
  },
  bottomNav: {
    backgroundColor: colors.white,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTop: `1px solid ${colors.gray6}`,
    position: "relative",
    zIndex: 10,
  },
  navBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 12px",
    minWidth: 60,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: -0.1,
  },
  floatingQR: {
    position: "absolute",
    right: spacing.xl,
    bottom: 82,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    boxShadow: "0 4px 16px rgba(238,43,47,0.4)",
    color: colors.white,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: -0.2,
    cursor: "pointer",
    zIndex: 20,
    border: "none",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: colors.bg,
    zIndex: 10,
  },
  pullRefresh: {
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    zIndex: 10,
  },
  pullRefreshIcon: {
    width: 24,
    height: 24,
    animation: "spinLoader 1s linear infinite",
  },
};

// ─── Data ─────────────────────────────────────────────────────
const DAYS = [
  { day: "월", date: "23", color: colors.black },
  { day: "화", date: "24", color: colors.black },
  { day: "수", date: "25", color: colors.black },
  {
    day: "오늘",
    date: "26",
    color: colors.black,
    isToday: true,
  },
  { day: "금", date: "27", color: colors.black },
  { day: "토", date: "28", color: colors.blue },
  { day: "일", date: "29", color: colors.primary },
];

const MENUS = {
  아침: [
    {
      id: 1,
      corner: "한식 코너",
      name: "된장국 정식",
      desc: "된장국, 공기밥, 계란후라이, 김치, 나물 2종",
      img: "https://images.unsplash.com/photo-1573470571028-a0ca7a723959?w=600",
      kcal: "480 kcal",
      price: "5,500",
    },
    {
      id: 2,
      corner: "양식 코너",
      name: "토스트 세트",
      desc: "에그 토스트, 베이컨, 샐러드, 오렌지 주스",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
      kcal: "420 kcal",
      price: "5,000",
    },
    {
      id: 7,
      corner: "죽 코너",
      name: "전복죽 세트",
      desc: "전복죽, 계란찜, 깍두기, 배추김치",
      img: "https://images.unsplash.com/photo-1724158311225-24875cacdea7?w=600",
      kcal: "380 kcal",
      price: "6,000",
    },
    {
      id: 8,
      corner: "한식 코너",
      name: "해장국 정식",
      desc: "소고기해장국, 공기밥, 김치, 젓갈, 나물",
      img: "https://images.unsplash.com/photo-1752826892253-d89531507b1d?w=600",
      kcal: "510 kcal",
      price: "6,500",
    },
  ],
  점심: [
    {
      id: 3,
      corner: "분식 코너",
      name: "떡볶이 세트",
      desc: "치즈 떡볶이, 전통 순대, 고구마튀김, 야채튀김",
      img: "https://images.unsplash.com/photo-1544530047-bb7fd03a8a6f?w=600",
      kcal: "620 kcal",
      price: "6,500",
    },
    {
      id: 4,
      corner: "한식 코너",
      name: "비빔밥 세트",
      desc: "돌솥 비빔밥, 된장국, 김치, 계절 나물 3종",
      img: "https://images.unsplash.com/photo-1741295017668-c8132acd6fc0?w=600",
      kcal: "560 kcal",
      price: "7,000",
    },
    {
      id: 9,
      corner: "양식 코너",
      name: "우동 세트",
      desc: "가쓰오 우동, 유부초밥 2p, 단무지",
      img: "https://images.unsplash.com/photo-1725121463846-b23056f190df?w=600",
      kcal: "530 kcal",
      price: "6,000",
    },
    {
      id: 10,
      corner: "한식 코너",
      name: "닭볶음탕 정식",
      desc: "닭볶음탕, 공기밥, 김치, 계절 반찬 2종",
      img: "https://images.unsplash.com/photo-1723242017392-6adddc9ffda1?w=600",
      kcal: "640 kcal",
      price: "7,500",
    },
  ],
  저녁: [
    {
      id: 5,
      corner: "양식 코너",
      name: "파스타 세트",
      desc: "까르보나라 파스타, 샐러드, 마늘빵, 음료",
      img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
      kcal: "680 kcal",
      price: "8,500",
    },
    {
      id: 6,
      corner: "한식 코너",
      name: "갈비탕 정식",
      desc: "갈비탕, 공기밥, 깍두기, 나물, 계절 반찬",
      img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600",
      kcal: "720 kcal",
      price: "9,000",
    },
    {
      id: 11,
      corner: "양식 코너",
      name: "돈까스 세트",
      desc: "등심 돈까스, 샐러드, 밥, 미소된장국",
      img: "https://images.unsplash.com/photo-1677050205812-1fbf1a832efa?w=600",
      kcal: "750 kcal",
      price: "8,000",
    },
    {
      id: 12,
      corner: "한식 코너",
      name: "잡채밥 정식",
      desc: "잡채밥, 미역국, 김치, 계절 나물 2종",
      img: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=600",
      kcal: "590 kcal",
      price: "7,500",
    },
  ],
};

type MealTime = "아침" | "점심" | "저녁";
type Tab = "구내식당" | "간편식";

const PULL_THRESHOLD = 60;

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("구내식당");
  const [mealTime, setMealTime] = useState<MealTime>("점심");
  const [activeNav, setActiveNav] = useState<
    "home" | "receipt" | "my"
  >("home");
  const [selectedDate, setSelectedDate] = useState("26");
  const [tappedDate, setTappedDate] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showQrPayment, setShowQrPayment] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const handleScroll = () => {
      const stickyEl = stickyRef.current;
      if (!stickyEl) return;
      const rect = stickyEl.getBoundingClientRect();
      const headerEl = scrollEl.previousElementSibling;
      const headerBottom = headerEl
        ? headerEl.getBoundingClientRect().bottom
        : 0;
      setIsSticky(rect.top <= headerBottom + 1);
    };
    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollEl = scrollRef.current;
    if (scrollEl && scrollEl.scrollTop <= 0 && !isRefreshing) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    const scrollEl = scrollRef.current;
    if (scrollEl && scrollEl.scrollTop > 0) {
      isPulling.current = false;
      setPullDistance(0);
      return;
    }
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      const dampened = Math.min(diff * 0.4, 120);
      setPullDistance(dampened);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling.current) return;
    isPulling.current = false;
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1500);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance]);

  const menus = MENUS[mealTime];

  return (
    <div style={styles.screen}>
      {/* ── Injected Keyframes ── */}
      <style>{animationKeyframes}</style>
      {/* ── Header ── */}
      <header style={{
        ...styles.header,
        borderBottom: isSticky ? "none" : `1px solid ${colors.gray6}`,
        boxShadow: isSticky ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={styles.headerLeft}>
          <div style={{ width: 28, height: 28, flexShrink: 0 }}>
            <svg
              viewBox="0 0 466.474 466.337"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient
                  id="logoGrad"
                  x1="233.237"
                  x2="233.237"
                  y1="0"
                  y2="466.337"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF4048" />
                  <stop offset="0.5" stopColor="#ED1B24" />
                  <stop offset="1" stopColor="#FF4048" />
                </linearGradient>
              </defs>
              <path
                d={svgPaths.p1734a880}
                fill="url(#logoGrad)"
              />
              <ellipse
                cx="233.284"
                cy="233.165"
                fill="white"
                rx="147.259"
                ry="144.845"
              />
              <path d={svgPaths.pcd2280} fill="#EE2B2F" />
            </svg>
          </div>
          <span style={styles.headerTitle}>올리브식권</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.iconBtn}>
            <ShoppingCart
              size={24}
              strokeWidth={2.2}
              color={colors.black}
            />
          </button>
          <button style={styles.iconBtn} onClick={() => setShowNotification(true)}>
            <Bell
              size={24}
              strokeWidth={2}
              color={colors.black}
            />
            <span style={styles.bellDot} />
          </button>
        </div>
      </header>

      {/* ── Scroll Area ── */}
      <div
        style={{
          ...styles.scrollArea,
          backgroundColor: pullDistance > 0 || isRefreshing ? colors.bg : colors.white,
        }}
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Pull to Refresh Indicator ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: pullDistance > 0 || isRefreshing ? pullDistance : 0,
            overflow: "hidden",
            backgroundColor: colors.bg,
            transition: isRefreshing ? "none" : (isPulling.current ? "none" : "height 0.3s ease"),
          }}
        >
          {(pullDistance > 0 || isRefreshing) && (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: radius.full,
                border: `2.5px solid ${colors.gray5}`,
                borderTopColor: colors.gray2,
                animation: isRefreshing
                  ? "spinLoader 0.8s linear infinite"
                  : "none",
                transform: isRefreshing
                  ? undefined
                  : `rotate(${(pullDistance / PULL_THRESHOLD) * 270}deg)`,
              }}
            />
          )}
        </div>

        {/* ── Points Card ── */}
        <div style={styles.pointsSection}>
          <div style={styles.pointsCard}>
            <p style={styles.pointsLabel}>사용가능 포인트</p>
            <div style={styles.pointsRight}>
              <p style={styles.pointsValue}>58,690</p>
              <ChevronRight
                size={18}
                strokeWidth={2.5}
                color={colors.gray2}
              />
            </div>
          </div>
        </div>

        {/* ── Sticky: Tabs + Calendar ── */}
        <div
          ref={stickyRef}
          style={{
            ...styles.stickyHeader,
            backgroundColor: isSticky ? colors.white : colors.bg,
          }}
        >
          {/* ── Main Tabs ── */}
          <div
            style={{
              ...styles.tabsSection,
              backgroundColor: isSticky ? colors.white : colors.bg,
            }}
          >
            <div style={styles.tabsRow}>
              {(["구내식당", "간편식"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tabBtn,
                    fontSize: 15,
                    fontWeight: activeTab === tab ? 700 : 500,
                    color:
                      activeTab === tab
                        ? colors.black
                        : colors.gray3,
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <span style={styles.tabIndicator} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Week Calendar ── */}
          <div
            style={{
              ...styles.calendarSection,
              backgroundColor: isSticky ? colors.white : colors.bg,
              borderBottom: isSticky
                ? "none"
                : `1px solid ${colors.gray6}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={styles.calendarRow}>
              {DAYS.map(({ day, date, color, isToday }) => {
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setTappedDate(null);
                      requestAnimationFrame(() => setTappedDate(date));
                    }}
                    onAnimationEnd={() => setTappedDate(null)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      flex: 1,
                      minWidth: 0,
                      height: 58,
                      borderRadius: radius.md,
                      border: isSelected
                        ? `2.5px solid ${colors.black}`
                        : "2.5px solid transparent",
                      backgroundColor: isSelected
                        ? colors.bg
                        : "transparent",
                      boxShadow: isSelected
                        ? "0 2px 10px rgba(0,0,0,0.10)"
                        : "none",
                      cursor: "pointer",
                      padding: "6px 4px",
                      background: "none",
                      animation:
                        tappedDate === date ? "dayTapBounce 0.3s ease-in-out" : "none",
                      animationFillMode: "forwards",
                    }}
                  >
                    <span
                      style={{
                        fontSize: isToday ? 10 : 11,
                        fontWeight: isToday ? 700 : 500,
                        color: isSelected
                          ? colors.black
                          : colors.gray2,
                      }}
                    >
                      {isToday ? "오늘" : day}
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? colors.black : color,
                      }}
                    >
                      {date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Event Banner ── */}
        <div style={styles.bannerSection}>
          <div style={styles.bannerWrap}>
            <div style={styles.bannerCircle1} />
            <div style={styles.bannerCircle2} />
            <div style={styles.bannerContent}>
              <p style={styles.bannerTag}>OPEN EVENT</p>
              <p style={styles.bannerSub}>
                올리브식권 만족도 설문
              </p>
              <p style={styles.bannerTitle}>먹고싶은 메뉴</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1760020890915-ca605575b93b?w=300"
              alt="event"
              style={styles.bannerImg}
            />
          </div>
        </div>

        {/* ── Meal Time Selector ── */}
        <div style={styles.mealTabsSection}>
          {(["아침", "점심", "저녁"] as MealTime[]).map((t) => (
            <button
              key={t}
              onClick={() => setMealTime(t)}
              style={{
                fontSize: 13,
                fontWeight: mealTime === t ? 700 : 500,
                color:
                  mealTime === t ? colors.white : colors.gray2,
                backgroundColor:
                  mealTime === t ? colors.black : colors.white,
                border:
                  mealTime === t
                    ? "none"
                    : `1px solid ${colors.gray5}`,
                borderRadius: radius.full,
                paddingLeft: spacing.xl,
                paddingRight: spacing.xl,
                paddingTop: spacing.sm,
                paddingBottom: spacing.sm,
                cursor: "pointer",
                letterSpacing: -0.3,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Menu Cards ── */}
        <div style={styles.menuGrid}>
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div style={styles.bottomNav}>
        <NavBtn
          icon={
            <Home
              size={22}
              strokeWidth={activeNav === "home" ? 2.2 : 1.8}
              color={
                activeNav === "home"
                  ? colors.primary
                  : colors.gray4
              }
            />
          }
          label="홈"
          active={activeNav === "home"}
          onClick={() => setActiveNav("home")}
        />
        <NavBtn
          icon={
            <ScrollText
              size={22}
              strokeWidth={activeNav === "receipt" ? 2.2 : 1.8}
              color={
                activeNav === "receipt"
                  ? colors.primary
                  : colors.gray4
              }
            />
          }
          label="결제내역"
          active={activeNav === "receipt"}
          onClick={() => setActiveNav("receipt")}
        />
        <NavBtn
          icon={
            <UserRound
              size={22}
              strokeWidth={activeNav === "my" ? 2.2 : 1.8}
              color={
                activeNav === "my"
                  ? colors.primary
                  : colors.gray4
              }
            />
          }
          label="My올리브"
          active={activeNav === "my"}
          onClick={() => setActiveNav("my")}
        />
      </div>

      {/* ── Floating QR Button ── */}
      <button style={styles.floatingQR} onClick={() => setShowQrPayment(true)}>
        <div style={{ width: 20, height: 17, flexShrink: 0 }}>
          <QrIcon />
        </div>
        결제
      </button>

      {/* ── QR Payment Page ── */}
      {showQrPayment && (
        <QrPaymentPage onBack={() => setShowQrPayment(false)} />
      )}

      {/* ── Notification Page ── */}
      {showNotification && (
        <NotificationPage onBack={() => setShowNotification(false)} />
      )}
    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────────

function NavBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={styles.navBtn}>
      {icon}
      <span
        style={{
          ...styles.navLabel,
          color: active ? colors.primary : colors.gray4,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function MenuCard({
  menu,
}: {
  menu: {
    corner: string;
    name: string;
    desc: string;
    img: string;
    kcal: string;
    price: string;
  };
}) {
  return (
    <div style={styles.menuCard}>
      <div style={styles.menuImgWrap}>
        <img
          src={menu.img}
          alt={menu.name}
          style={styles.menuImg}
        />
        <span style={styles.kcalBadge}>{menu.kcal}</span>
      </div>
      <div style={styles.menuBody}>
        <span style={styles.menuCorner}>{menu.corner}</span>
        <span style={styles.menuName}>{menu.name}</span>
        <span style={styles.menuDesc}>{menu.desc}</span>
        <div style={styles.menuPriceRow}>
          <span style={styles.menuPrice}>{menu.price}</span>
        </div>
      </div>
    </div>
  );
}
