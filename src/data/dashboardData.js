export const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Faculty", path: "/faculty", icon: "faculty" },
  { label: "Attendance", path: "/attendance", icon: "attendance" },
  { label: "Message Template", path: "/message-template", icon: "template" },
  { label: "WhatsApp Logs", path: "/whatsapp-logs", icon: "whatsapp" },
  { label: "Reports", path: "/reports", icon: "reports" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

export const statCards = [
  {
    title: "Total Faculty",
    value: 8,
    detailLabel: "Active Faculty",
    detailValue: 8,
    color: "blue",
    icon: "faculty",
  },
  {
    title: "Present Today",
    value: 5,
    detailLabel: "",
    detailValue: "62.5%",
    color: "green",
    icon: "present",
  },
  {
    title: "Absent Today",
    value: 3,
    detailLabel: "",
    detailValue: "37.5%",
    color: "red",
    icon: "absent",
  },
  {
    title: "Yet to Mark",
    value: 0,
    detailLabel: "",
    detailValue: "0%",
    color: "violet",
    icon: "pending",
  },
];

export const weeklyTrend = [
  { day: "Mon", value: 14 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 41 },
  { day: "Thu", value: 64 },
  { day: "Fri", value: 26 },
  { day: "Sat", value: 63 },
  { day: "Sun", value: 52 },
];

export const attendanceSummary = [
  { label: "Present", value: 5, percent: 62.5, color: "#52c878" },
  { label: "Absent", value: 3, percent: 37.5, color: "#ef4d57" },
  { label: "Yet to Mark", value: 0, percent: 0, color: "#e4e8f4" },
];

export const facultyAttendance = [
  {
    id: 1,
    initials: "RS",
    avatar: "blue",
    name: "Ravi Sharma",
    phone: "+91 98765 43210",
    status: "Present",
    updatedAt: "09:15 AM",
  },
  {
    id: 2,
    initials: "PS",
    avatar: "indigo",
    name: "Priya Singh",
    phone: "+91 98765 43211",
    status: "Absent",
    updatedAt: "09:10 AM",
  },
  {
    id: 3,
    initials: "AM",
    avatar: "violet",
    name: "Amit Mehta",
    phone: "+91 98765 43212",
    status: "Present",
    updatedAt: "09:05 AM",
  },
  {
    id: 4,
    initials: "NK",
    avatar: "purple",
    name: "Neha Kapoor",
    phone: "+91 98765 43213",
    status: "Present",
    updatedAt: "09:20 AM",
  },
  {
    id: 5,
    initials: "SK",
    avatar: "sky",
    name: "Suresh Kumar",
    phone: "+91 98765 43214",
    status: "Absent",
    updatedAt: "09:12 AM",
  },
  {
    id: 6,
    initials: "DP",
    avatar: "steel",
    name: "Deepa Patel",
    phone: "+91 98765 43215",
    status: "Present",
    updatedAt: "09:18 AM",
  },
  {
    id: 7,
    initials: "VG",
    avatar: "rose",
    name: "Vikram Gupta",
    phone: "+91 98765 43216",
    status: "Absent",
    updatedAt: "09:08 AM",
  },
  {
    id: 8,
    initials: "MJ",
    avatar: "pink",
    name: "Meena Joshi",
    phone: "+91 98765 43217",
    status: "Present",
    updatedAt: "09:22 AM",
  },
];

export const facultyStats = [
  { label: "Faculty Members", value: 42, trend: "+6 this month" },
  { label: "Departments", value: 6, trend: "Science, Math, Arts" },
  { label: "WhatsApp Enabled", value: 40, trend: "95% delivery ready" },
];

export const facultyDirectory = [
  {
    name: "Ananya Verma",
    role: "Physics Teacher",
    department: "Science",
    phone: "+91 98110 11223",
    joined: "Feb 2023",
  },
  {
    name: "Rohan Das",
    role: "Math Teacher",
    department: "Mathematics",
    phone: "+91 98110 11224",
    joined: "Jun 2022",
  },
  {
    name: "Sneha Iyer",
    role: "English Teacher",
    department: "Languages",
    phone: "+91 98110 11225",
    joined: "Nov 2021",
  },
  {
    name: "Harsh Malik",
    role: "Sports Coordinator",
    department: "Sports",
    phone: "+91 98110 11226",
    joined: "Jan 2024",
  },
];

export const attendanceLog = [
  { date: "22 May 2024", marked: "08:35 AM", present: 34, absent: 6, pending: 2 },
  { date: "21 May 2024", marked: "08:32 AM", present: 36, absent: 4, pending: 2 },
  { date: "20 May 2024", marked: "08:41 AM", present: 33, absent: 7, pending: 2 },
  { date: "18 May 2024", marked: "08:28 AM", present: 38, absent: 3, pending: 1 },
];

export const messageTemplates = [
  {
    title: "Attendance Reminder",
    tag: "Automation",
    content:
      "Good morning {{faculty_name}}, please mark your attendance before 9:30 AM.",
  },
  {
    title: "Absent Intimation",
    tag: "Parents",
    content:
      "Dear {{parent_name}}, {{student_name}} is marked absent today. Please confirm if this is expected.",
  },
  {
    title: "Report Ready",
    tag: "Admin",
    content:
      "The weekly attendance report is generated and ready to export from the dashboard.",
  },
];

export const whatsappLogs = [
  {
    recipient: "Ravi Sharma",
    template: "Attendance Reminder",
    status: "Delivered",
    time: "09:16 AM",
  },
  {
    recipient: "Priya Singh",
    template: "Absent Intimation",
    status: "Read",
    time: "09:14 AM",
  },
  {
    recipient: "Meena Joshi",
    template: "Attendance Reminder",
    status: "Queued",
    time: "09:12 AM",
  },
  {
    recipient: "Amit Mehta",
    template: "Report Ready",
    status: "Delivered",
    time: "08:58 AM",
  },
];

export const reportCards = [
  {
    title: "Weekly Attendance",
    value: "92.4%",
    detail: "Compared with 89.6% last week",
  },
  {
    title: "WhatsApp Delivery",
    value: "98.1%",
    detail: "431 delivered messages this week",
  },
  {
    title: "Absent Faculty Alerts",
    value: "14",
    detail: "Auto notifications sent this month",
  },
];

export const settingsGroups = [
  {
    title: "Institute Settings",
    items: [
      { label: "School Name", value: "Green Valley Public School" },
      { label: "Attendance Closing Time", value: "09:30 AM" },
      { label: "Timezone", value: "Asia/Kolkata" },
    ],
  },
  {
    title: "Notification Rules",
    items: [
      { label: "Send Absence Alerts", value: "Enabled" },
      { label: "Weekend Reports", value: "Saturday 04:00 PM" },
      { label: "Retry Failed Messages", value: "3 Attempts" },
    ],
  },
];
