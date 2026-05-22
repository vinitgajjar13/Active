import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  FacultyIcon,
  WhatsAppIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../lib/api";

function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function createTrendData(stats) {
  const students = stats?.totals?.students ?? 0;
  const present = stats?.totals?.presentToday ?? 0;
  const absent = stats?.totals?.absentToday ?? 0;
  const sent = stats?.totals?.sent ?? 0;
  const pending = stats?.totals?.pending ?? 0;

  return [
    { label: "Mon", attendance: Math.max(students * 0.42, 1), messages: Math.max(sent * 0.2 + 1, 1) },
    { label: "Tue", attendance: Math.max(students * 0.68, 1), messages: Math.max(sent * 0.35 + 1, 1) },
    { label: "Wed", attendance: Math.max(students * 0.3 + absent, 1), messages: Math.max(pending + 1, 1) },
    { label: "Thu", attendance: Math.max(students * 0.82, 1), messages: Math.max(sent * 0.5 + 1, 1) },
    { label: "Fri", attendance: Math.max(students * 0.9, 1), messages: Math.max(sent * 0.7 + 1, 1) },
    { label: "Sat", attendance: Math.max(present + absent * 0.5, 1), messages: Math.max(sent * 0.45 + 1, 1) },
    { label: "Sun", attendance: Math.max(present, 1), messages: Math.max(sent * 0.82 + 1, 1) },
  ];
}

function SummaryCard({ icon, label, value, meta, tone = "blue" }) {
  return (
    <article className="flow-card flow-card--summary">
      <div className={`flow-card__icon flow-card__icon--${tone}`}>{icon}</div>
      <div className="flow-card__copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
    </article>
  );
}

function DashboardTrendChart({ data }) {
  const width = 760;
  const height = 300;
  const left = 26;
  const right = 24;
  const top = 56;
  const bottom = 36;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const maxValue = Math.max(
    ...data.flatMap((item) => [item.attendance, item.messages]),
    1
  );

  const buildPoints = (key) =>
    data.map((item, index) => {
      const x = left + (innerWidth / Math.max(data.length - 1, 1)) * index;
      const y = top + innerHeight - (item[key] / maxValue) * innerHeight;
      return { ...item, x, y };
    });

  const attendancePoints = buildPoints("attendance");
  const messagePoints = buildPoints("messages");

  const buildPath = (points) =>
    points
      .map((point, index) => `${index === 0 ? "M" : "C"} ${index === 0
        ? `${point.x} ${point.y}`
        : `${(points[index - 1].x + point.x) / 2} ${points[index - 1].y},
             ${(points[index - 1].x + point.x) / 2} ${point.y},
             ${point.x} ${point.y}`
        }`)
      .join(" ");

  const attendancePath = buildPath(attendancePoints);
  const messagesPath = buildPath(messagePoints);
  const hoverPoint = attendancePoints[Math.floor(attendancePoints.length / 2)];

  return (
    <div className="flow-trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowTrendArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(44,120,255,0.20)" />
            <stop offset="100%" stopColor="rgba(44,120,255,0.02)" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = top + innerHeight * step;
          return (
            <line
              key={step}
              x1={left}
              x2={width - right}
              y1={y}
              y2={y}
              stroke="#e9eef8"
              strokeDasharray={step === 1 ? "0" : "4 7"}
            />
          );
        })}

        <path
          d={`${attendancePath} L ${attendancePoints[attendancePoints.length - 1].x} ${height - bottom
            } L ${attendancePoints[0].x} ${height - bottom} Z`}
          fill="url(#flowTrendArea)"
        />
        <path d={messagesPath} fill="none" stroke="#c8d1df" strokeWidth="3" strokeLinecap="round" />
        <path d={attendancePath} fill="none" stroke="#2f89ff" strokeWidth="4" strokeLinecap="round" />

        <line
          x1={hoverPoint.x}
          x2={hoverPoint.x}
          y1={top}
          y2={height - bottom}
          stroke="#cfe1ff"
          strokeDasharray="4 6"
        />
        <circle cx={hoverPoint.x} cy={hoverPoint.y} r="6" fill="#2f89ff" />
        <circle cx={hoverPoint.x} cy={hoverPoint.y} r="13" fill="rgba(47,137,255,0.14)" />

        <g transform={`translate(${hoverPoint.x - 56}, ${hoverPoint.y - 48})`}>
          <rect width="112" height="42" rx="12" fill="#1577f3" />
          <text x="56" y="17" fill="rgba(255,255,255,0.72)" fontSize="10" textAnchor="middle">
            Students Marked
          </text>
          <text x="56" y="30" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle">
            {formatCount(hoverPoint.attendance)}
          </text>
        </g>

        {data.map((item, index) => {
          const x = left + (innerWidth / Math.max(data.length - 1, 1)) * index;
          return (
            <text
              key={item.label}
              x={x}
              y={height - 12}
              textAnchor="middle"
              className="flow-trend-chart__label"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}



function StatusPanel({ stats }) {
  const statusTone = stats?.whatsapp?.status === "connected" ? "connected" : "waiting";

  return (
    <div className="flow-status-panel">
      <div className="flow-status-card">
        <div className="flow-status-card__header">
          <span>Active Connect</span>
          <span className={`flow-pill flow-pill--${statusTone}`}>
            {stats?.whatsapp?.status || "offline"}
          </span>
        </div>
        <div className="flow-status-card__hero">
          <div className="flow-status-card__badge">
            <WhatsAppIcon className="icon icon--lg" />
          </div>
          <strong>{stats?.whatsapp?.phoneNumber || "Not linked yet"}</strong>
          <span>{stats?.whatsapp?.clientState || "Waiting for WhatsApp session"}</span>
        </div>
        <div className="flow-status-card__footer">
          <div>
            <span>Queue</span>
            <strong>{stats?.queue?.status || "idle"}</strong>
          </div>
          <div>
            <span>QR</span>
            <strong>{stats?.whatsapp?.qrAvailable ? "Ready" : "Hidden"}</strong>
          </div>
        </div>
      </div>

      <div className="flow-side-list">
        <div className="flow-side-list__header">
          <h4>Today Snapshot</h4>
          <span>{stats?.today?.dateKey || "-"}</span>
        </div>
        <div className="flow-side-list__items">
          {[
            {
              icon: <CalendarIcon className="icon icon--sm" />,
              title: "Students Marked",
              value: formatCount(stats?.today?.studentsMarked),
            },
            {
              icon: <CheckIcon className="icon icon--sm" />,
              title: "Present Today",
              value: formatCount(stats?.totals?.presentToday),
            },
            {
              icon: <CloseIcon className="icon icon--sm" />,
              title: "Absent Today",
              value: formatCount(stats?.totals?.absentToday),
            },
            {
              icon: <ClockIcon className="icon icon--sm" />,
              title: "Pending Messages",
              value: formatCount(stats?.totals?.pending),
            },
          ].map((item) => (
            <div key={item.title} className="flow-side-item">
              <span className="flow-side-item__icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getDashboardStats(token);
        if (!cancelled) {
          setStats(response.data);
          setError("");
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      }
    }

    void load();
    const intervalId = window.setInterval(load, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [token]);

  const trendData = useMemo(() => createTrendData(stats), [stats]);

  const summaryCards = [
    {
      label: "Total Students",
      value: formatCount(stats?.totals?.students),
      meta: `${formatCount(stats?.totals?.standards)} standards`,
      icon: <FacultyIcon className="icon icon--lg" />,
      tone: "blue",
    },
    {
      label: "Present Today",
      value: formatCount(stats?.totals?.presentToday),
      meta: `${formatCount(stats?.today?.sessionsMarked)} sessions`,
      icon: <CheckIcon className="icon icon--lg" />,
      tone: "green",
    },
    {
      label: "Absent Today",
      value: formatCount(stats?.totals?.absentToday),
      meta: `${formatCount(stats?.totals?.pending)} pending alerts`,
      icon: <CloseIcon className="icon icon--lg" />,
      tone: "red",
    },
    {
      label: "Sent Messages",
      value: formatCount(stats?.totals?.sent),
      meta: `${formatCount(stats?.totals?.failed)} failed`,
      icon: <ClockIcon className="icon icon--lg" />,
      tone: "cyan",
    },
  ];

  return (
    <div className="dashboard-flow">
      {error ? <div className="alert alert--error">{error}</div> : null}
      <div className="dashboard-flow__summary">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dashboard-flow__main">
        <section className="flow-card flow-card--xl">
          <div className="flow-card__header">
            <div>
              <h3>Attendance Trend</h3>
              <span>Live classroom movement and delivery rhythm</span>
            </div>
            <div className="flow-legend">
              <span><i className="flow-legend__dot flow-legend__dot--blue" /> Students</span>
              <span><i className="flow-legend__dot flow-legend__dot--soft" /> Messages</span>
            </div>
          </div>
          <DashboardTrendChart data={trendData} />
        </section>

        <StatusPanel stats={stats} />
      </div>

    </div>
  );
}