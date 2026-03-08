import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, X, Check, Circle } from "lucide-react";
import img from "figma:asset/5af74d6eee4a267ca2ecf406c0973d3b9d4fe038.png";
import QrIcon from "../../imports/QrIcon";

// ─── Design Tokens ───────────────────────────────────────────
const colors = {
  primary: "#EE2B2F",
  primaryAlt: "#EE2B2F",
  black: "#191A1C",
  gray1: "#6E6F70",
  gray2: "#A3A3A3",
  gray5: "#EAEAEA",
  gray6: "#F0F0F0",
  bg: "#F2F2F2",
  white: "#FFFFFF",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const radius = {
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
  full: 999,
};

interface QrPaymentPageProps {
  onBack: () => void;
}

export default function QrPaymentPage({ onBack }: QrPaymentPageProps) {
  const [timeLeft, setTimeLeft] = useState(164); // 2:44
  const [qrSeed, setQrSeed] = useState(42);
  const [spinCount, setSpinCount] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [qrSeed]);

  const handleRefresh = () => {
    setSpinCount((prev) => prev + 1);
    setQrSeed((prev) => prev + Math.floor(Math.random() * 1000) + 1);
    setTimeLeft(180); // 3분 리셋
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const isExpired = timeLeft === 0;

  return (
    <div style={pageStyles.screen}>
      {/* ── Header ── */}
      <div style={pageStyles.header}>
        <div style={pageStyles.headerInner}>
          <div style={pageStyles.headerLeftGroup}>
            <button onClick={onBack} style={pageStyles.backBtn}>
              <ChevronLeft size={26} strokeWidth={2.2} color={colors.black} />
            </button>
            <span style={pageStyles.headerTitle}>결제하기</span>
          </div>
          <button onClick={handleRefresh} style={pageStyles.refreshBtn}>
            <RefreshCw
              size={20}
              strokeWidth={2.2}
              color={colors.black}
              style={{
                transform: `rotate(${spinCount * 180}deg)`,
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Scroll Content ── */}
      <div style={pageStyles.scrollArea}>
        {/* ── Event Banner ── */}
        <div style={pageStyles.bannerSection}>
          <div style={pageStyles.bannerWrap}>
            <img
              src={img}
              alt="event banner"
              style={pageStyles.bannerImg}
            />
            <div style={pageStyles.bannerOverlay}>
              <p style={pageStyles.bannerTag}>OPEN EVENT</p>
              <p style={pageStyles.bannerSub}>올리브식권 만족도 설문</p>
              <p style={pageStyles.bannerTitle}>먹고싶은 메뉴</p>
            </div>
          </div>
        </div>

        {/* ── QR Code Card ── */}
        <div style={pageStyles.qrSection}>
          <div style={pageStyles.qrCard}>
            {showPaymentPopup ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 68,
                  height: 68,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Circle size={68} strokeWidth={1.6} color="#00C853" style={{ position: "absolute" }} />
                  <Check size={34} strokeWidth={2.5} color="#00C853" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: colors.black, letterSpacing: -0.14 }}>
                  결제완료
                </span>
              </div>
            ) : (
              <>
                <div style={{
                  ...pageStyles.qrImgWrap,
                  opacity: isExpired ? 0.25 : 1,
                }}
                  onClick={() => { if (!isExpired) setShowPaymentPopup(true); }}
                >
                  <QrCodeSvg size={150} seed={qrSeed} />
                </div>
                {isExpired ? (
                  <button onClick={handleRefresh} style={pageStyles.expiredBtn}>
                    QR 코드 갱신
                  </button>
                ) : (
                  <p style={pageStyles.timerText}>
                    유효시간{"  "}
                    <span style={pageStyles.timerValue}>
                      {minutes}:{seconds}
                    </span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Points Card ── */}
        <div style={pageStyles.pointsSection}>
          <div style={pageStyles.pointsCard}>
            <span style={pageStyles.pointsLabel}>사용가능 포인트</span>
            <div style={pageStyles.pointsRight}>
              <span style={pageStyles.pointsValue}>58,690</span>
              <ChevronRight
                size={14}
                strokeWidth={2.5}
                color={colors.gray1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Complete Popup ── */}
      {showPaymentPopup && (
        <PaymentCompletePopup
          onClose={() => setShowPaymentPopup(false)}
          onAdditionalPay={() => {
            setShowPaymentPopup(false);
            handleRefresh();
          }}
        />
      )}

      {/* ── Bottom Fixed Button ── */}
      <div style={pageStyles.bottomBar}>
        <button style={pageStyles.chargeBtn}>
          <span style={pageStyles.chargePIcon}>P</span>
          포인트 충전
        </button>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const pageStyles: Record<string, CSSProperties> = {
  screen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.bg,
    fontFamily: "'Pretendard', sans-serif",
    zIndex: 100,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.white,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm + 2,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    zIndex: 10,
  },
  headerInner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backBtn: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    padding: 0,
  },
  refreshBtn: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    padding: 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.17,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },
  bannerSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.xl,
  },
  bannerWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    height: 101,
  },
  bannerImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: spacing.xl + 10,
    paddingRight: 120,
  },
  bannerTag: {
    fontSize: 11,
    fontWeight: 400,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bannerSub: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.white,
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: -0.5,
  },
  qrSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(234,234,234,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
  },
  qrImgWrap: {
    width: 160,
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.primaryAlt,
    letterSpacing: -0.15,
    textAlign: "center",
  },
  timerValue: {
    fontWeight: 700,
  },
  expiredBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm + 2,
    backgroundColor: colors.primaryAlt,
    borderRadius: 12,
    border: "none",
    color: colors.white,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: -0.14,
  },
  pointsSection: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  pointsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(234,234,234,0.7)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.lg + 2,
    paddingBottom: spacing.lg + 2,
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.gray1,
    letterSpacing: -0.13,
  },
  pointsRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.black,
    letterSpacing: -0.16,
  },
  bottomBar: {
    position: "relative",
    zIndex: 10,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: "0 -1px 8px rgba(163,163,163,0.6)",
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  chargeBtn: {
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
  },
  chargePIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontWeight: 800,
    color: colors.white,
    marginRight: 6,
  },
};

// ─── QR Code Generator ───────────────────────────────────────
function generateQrMatrix(seed: number): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isOuter = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        matrix[r + i][c + j] = isOuter || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  const clearSep = (r: number, c: number, h: boolean) => {
    for (let i = 0; i < 8; i++) {
      if (h) {
        if (r >= 0 && r < size && c + i >= 0 && c + i < size)
          matrix[r][c + i] = false;
      } else {
        if (r + i >= 0 && r + i < size && c >= 0 && c < size)
          matrix[r + i][c] = false;
      }
    }
  };
  clearSep(7, 0, true); clearSep(0, 7, false);
  clearSep(7, size - 8, true); clearSep(0, size - 8, false);
  clearSep(size - 8, 0, true); clearSep(size - 7, 7, false);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  const drawAlignment = (r: number, c: number) => {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const isOuter = Math.abs(i) === 2 || Math.abs(j) === 2;
        const isCenter = i === 0 && j === 0;
        matrix[r + i][c + j] = isOuter || isCenter;
      }
    }
  };
  drawAlignment(size - 9, size - 9);

  let rng = seed;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8);
      const inAlignment =
        r >= size - 11 && r <= size - 7 && c >= size - 11 && c <= size - 7;
      const isTiming = r === 6 || c === 6;
      if (!inFinder && !inAlignment && !isTiming) {
        matrix[r][c] = nextRng() % 3 !== 0;
      }
    }
  }

  return matrix;
}

function QrCodeSvg({ size = 160, seed = 42 }: { size?: number; seed?: number }) {
  const matrix = useMemo(() => generateQrMatrix(seed), [seed]);
  const moduleCount = matrix.length;
  const moduleSize = size / (moduleCount + 2);
  const offset = moduleSize;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={offset + c * moduleSize}
              y={offset + r * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={colors.black}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Payment Complete Popup ───────────────────────────────────────
function PaymentCompletePopup({ onClose, onAdditionalPay }: { onClose: () => void; onAdditionalPay: () => void }) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setSlideIn(true));
  }, []);

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        ...popupStyles.overlay,
        opacity: slideIn ? 1 : 0,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          ...popupStyles.sheet,
          transform: slideIn ? "translateY(0)" : "translateY(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={popupStyles.sheetHeader}>
          <span style={popupStyles.sheetTitle}>결제완료</span>
          <button onClick={handleClose} style={popupStyles.closeBtn}>
            <X size={18} strokeWidth={2.5} color="#888" />
          </button>
        </div>

        <div style={popupStyles.amountRow}>
          <span style={popupStyles.amountValue}>4,700</span>
          <button onClick={() => {
            setSlideIn(false);
            setTimeout(onAdditionalPay, 300);
          }} style={popupStyles.additionalPayBtn}>
            <div style={{ width: 16, height: 13, flexShrink: 0 }}>
              <QrIcon />
            </div>
            추가결제
          </button>
        </div>

        <div style={popupStyles.detailSection}>
          <div style={popupStyles.detailRow}>
            <span style={popupStyles.detailLabel}>결제일시</span>
            <span style={popupStyles.detailValue}>2023.09.06 11:13</span>
          </div>
          <div style={popupStyles.detailRow}>
            <span style={popupStyles.detailLabel}>결제번호</span>
            <span style={popupStyles.detailValue}>43573942875</span>
          </div>
          <div style={popupStyles.detailRow}>
            <span style={popupStyles.detailLabel}>결제처</span>
            <span style={popupStyles.detailValue}>신세계 구내식당</span>
          </div>
        </div>

        <div style={popupStyles.bannerWrap}>
          <img src={img} alt="event banner" style={popupStyles.bannerImg} />
          <div style={popupStyles.bannerOverlay}>
            <p style={popupStyles.bannerTag}>OPEN EVENT</p>
            <p style={popupStyles.bannerSub}>올리브식권 만족도 설문</p>
            <p style={popupStyles.bannerTitle}>먹고싶은 메뉴</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const popupStyles: Record<string, CSSProperties> = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(25,26,28,0.4)",
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 24,
    paddingLeft: spacing.xl + 2,
    paddingRight: spacing.xl + 2,
    paddingBottom: 28,
    fontFamily: "'Pretendard', sans-serif",
  },
  sheetHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.18,
  },
  closeBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 999,
    border: "none",
    padding: 0,
  },
  amountRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  amountValue: {
    fontSize: 30,
    fontWeight: 800,
    color: colors.black,
    letterSpacing: -0.3,
  },
  additionalPayBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingLeft: 16,
    paddingRight: 16,
    height: 36,
    backgroundColor: colors.primaryAlt,
    borderRadius: 100,
    border: "none",
    color: colors.white,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: -0.13,
  },
  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    marginBottom: 32,
  },
  detailRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.black,
    letterSpacing: -0.14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.14,
    textAlign: "right",
  },
  bannerWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    height: 101,
  },
  bannerImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 120,
  },
  bannerTag: {
    fontSize: 11,
    fontWeight: 400,
    color: colors.white,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.white,
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: -0.5,
  },
};