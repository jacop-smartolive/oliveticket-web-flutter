import { useState, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { toast, Toaster } from "sonner";

// ─── Design Tokens ───────────────────────────────────────────
const colors = {
  primary: "#EE2B2F",
  black: "#1C1C1E",
  textRead: "#8E8E93",
  grayLight: "#F3F3F3",
  grayMid: "#C8C8C8",
  border: "#F0F0F0",
  bg: "#F2F2F2",
  white: "#FFFFFF",
};

const fontFamily = "'Pretendard', 'Noto Sans KR', sans-serif";

// ─── Mock Data ───────────────────────────────────────────────
interface Notification {
  id: number;
  type: string;
  amount: string;
  time: string;
  initialRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "결제 알림", amount: "7,000", time: "3분 전", initialRead: false },
  { id: 2, type: "결제 알림", amount: "6,500", time: "1시간 전", initialRead: false },
  { id: 3, type: "결제 알림", amount: "8,500", time: "어제", initialRead: false },
  { id: 4, type: "결제 알림", amount: "5,500", time: "3일 전", initialRead: true },
  { id: 5, type: "충전 알림", amount: "50,000", time: "1주 전", initialRead: true },
  { id: 6, type: "결제 알림", amount: "7,500", time: "2주 전", initialRead: true },
];

// ─── CSS for transitions (injected once) ─────────────────────
// ⚠️ Flutter-08: CSS class 기반 애니메이션 → AnimatedOpacity, AnimatedScale
const TRANSITION_CSS = `
  .notif-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0; margin-top: 5px;
  }
  .notif-dot-unread {
    background: #EE2B2F; opacity: 1; transform: scale(1);
  }
  .notif-dot-read {
    background: #EE2B2F; opacity: 0; transform: scale(0.4);
  }
  .notif-dot-placeholder {
    background: transparent; opacity: 0;
  }
`;

interface NotificationPageProps {
  onBack: () => void;
}

export default function NotificationPage({ onBack }: NotificationPageProps) {
  const [readSet, setReadSet] = useState<Set<number>>(() => {
    const s = new Set<number>();
    NOTIFICATIONS.forEach((n) => {
      if (n.initialRead) s.add(n.id);
    });
    return s;
  });
  const [allMarked, setAllMarked] = useState(false);
  const staggerRef = useRef(false);

  const markOne = useCallback((id: number) => {
    setReadSet((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleMarkAll = useCallback(() => {
    if (staggerRef.current || allMarked) return;
    staggerRef.current = true;

    const unreadItems = NOTIFICATIONS.filter((n) => !readSet.has(n.id));
    if (unreadItems.length === 0) {
      setAllMarked(true);
      staggerRef.current = false;
      return;
    }

    unreadItems.forEach((item, i) => {
      setTimeout(() => {
        markOne(item.id);
        if (i === unreadItems.length - 1) {
          setAllMarked(true);
          staggerRef.current = false;
          toast("모든 알림을 확인하였습니다.", {
            duration: 2000,
            style: {
              fontFamily,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 12,
            },
          });
        }
      }, i * 80);
    });
  }, [readSet, allMarked, markOne]);

  const hasUnread = NOTIFICATIONS.some((n) => !readSet.has(n.id));

  return (
    <div style={styles.screen}>
      <style>{TRANSITION_CSS}</style>
      <Toaster position="bottom-center" />

      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeftGroup}>
            <button onClick={onBack} style={styles.backBtn}>
              <ChevronLeft size={26} strokeWidth={2.2} color={colors.black} />
            </button>
            <span style={styles.headerTitle}>알림</span>
          </div>
          <button
            style={{
              ...styles.markAllBtn,
              backgroundColor: !hasUnread ? colors.grayLight : colors.primary,
            }}
            onClick={handleMarkAll}
          >
            <Check
              size={13}
              strokeWidth={2.5}
              color={!hasUnread ? colors.grayMid : colors.white}
            />
            <span
              style={{
                ...styles.markAllText,
                color: !hasUnread ? colors.grayMid : colors.white,
              }}
            >
              모두 확인
            </span>
          </button>
        </div>
      </div>

      {/* ── Notification List ── */}
      <div style={styles.scrollArea}>
        {NOTIFICATIONS.map((item) => {
          const isRead = readSet.has(item.id);
          const textColor = isRead ? colors.textRead : colors.black;

          return (
            <div
              key={item.id}
              className="notif-row"
              style={styles.notificationItem}
              onClick={() => markOne(item.id)}
            >
              {/* Dot (left side) */}
              <div
                className={`notif-dot ${
                  item.initialRead
                    ? "notif-dot-placeholder"
                    : isRead
                    ? "notif-dot-read"
                    : "notif-dot-unread"
                }`}
              />

              {/* Content */}
              <div style={styles.notificationContent}>
                <p
                  className="notif-text-transition"
                  style={{ ...styles.notificationText, color: textColor }}
                >
                  <span
                    className="notif-text-transition"
                    style={{ fontWeight: 700, color: textColor }}
                  >
                    [{item.type}]
                  </span>
                  <span
                    className="notif-text-transition"
                    style={{ fontWeight: 400, color: textColor }}
                  >
                    {" "}{item.amount} 결제가 완료되었습니다.
                  </span>
                </p>
                <p style={styles.notificationTime}>{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles: Record<string, CSSProperties> = {
  screen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.bg,
    fontFamily,
    zIndex: 100,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.white,
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${colors.border}`,
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
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: colors.black,
    letterSpacing: -0.4,
  },
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 100,
    border: "none",
  },
  markAllText: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: -0.1,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },
  notificationItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
  },
  notificationContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },
  notificationText: {
    fontSize: 14,
    letterSpacing: -0.2,
    lineHeight: 1.5,
    margin: 0,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.textRead,
    margin: 0,
  },
};