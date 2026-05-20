function BaseIcon({ children, className = "", viewBox = "0 0 24 24" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

export function BrandIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="52" height="52" rx="16" fill="white" />
      <path d="M12 24L28 16L44 24L28 32L12 24Z" fill="#2453D4" />
      <path d="M18 28V34C18 36.5 22.5 39 28 39C33.5 39 38 36.5 38 34V28" stroke="#2453D4" strokeWidth="2.4" />
      <path d="M44 24V31" stroke="#2453D4" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="44" cy="33.5" r="2.2" fill="#52C878" />
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M4 12.5L12 5L20 12.5" />
      <path d="M6.5 10.5V19H17.5V10.5" />
    </BaseIcon>
  );
}

export function FacultyIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19C4.5 15.8 7.2 14 9.9 14C12.6 14 14.9 15.5 16 18.3" />
      <circle cx="17" cy="8.5" r="2.2" />
      <path d="M15.2 12.8C17.4 13 19.5 14.4 20.4 16.6" />
    </BaseIcon>
  );
}

export function AttendanceIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="5" y="4.5" width="14" height="15" rx="2.5" />
      <path d="M8 3V6" />
      <path d="M16 3V6" />
      <path d="M8 10H16" />
      <path d="M9 14L10.7 15.7L15 11.4" />
    </BaseIcon>
  );
}

export function TemplateIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="5" y="4.5" width="12" height="15" rx="2.2" />
      <path d="M9 9H13" />
      <path d="M9 13H13" />
      <path d="M17 10L20 13L17 16" />
    </BaseIcon>
  );
}

export function PhoneIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="7" y="3.5" width="10" height="17" rx="2.5" />
      <path d="M10.5 6H13.5" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function ReportsIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 18.5H19.5" />
      <path d="M7.5 16V11" />
      <path d="M12 16V7.5" />
      <path d="M16.5 16V9.5" />
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
    </BaseIcon>
  );
}

export function SettingsIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15A1 1 0 0 0 19.6 16.1L19.7 16.2A2 2 0 0 1 16.9 19L16.8 18.9A1 1 0 0 0 15.7 18.7A1 1 0 0 0 15 19.6V19.9A2 2 0 0 1 11 19.9V19.7A1 1 0 0 0 10.3 18.8A1 1 0 0 0 9.2 19L9.1 19.1A2 2 0 0 1 6.3 16.3L6.4 16.2A1 1 0 0 0 6.6 15.1A1 1 0 0 0 5.7 14.4H5.4A2 2 0 0 1 5.4 10.4H5.6A1 1 0 0 0 6.5 9.7A1 1 0 0 0 6.3 8.6L6.2 8.5A2 2 0 0 1 9 5.7L9.1 5.8A1 1 0 0 0 10.2 6A1 1 0 0 0 10.9 5.1V4.9A2 2 0 0 1 14.9 4.9V5.1A1 1 0 0 0 15.6 6A1 1 0 0 0 16.7 5.8L16.8 5.7A2 2 0 0 1 19.6 8.5L19.5 8.6A1 1 0 0 0 19.3 9.7A1 1 0 0 0 20.2 10.4H20.5A2 2 0 0 1 20.5 14.4H20.3A1 1 0 0 0 19.4 15Z" />
    </BaseIcon>
  );
}

export function LogOutIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M13 5H7.5C6.4 5 5.5 5.9 5.5 7V17C5.5 18.1 6.4 19 7.5 19H13" />
      <path d="M15 8L18.5 11.5L15 15" />
      <path d="M10.5 11.5H18.2" />
    </BaseIcon>
  );
}

export function MenuIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 7.5H19.5" />
      <path d="M4.5 12H19.5" />
      <path d="M4.5 16.5H19.5" />
    </BaseIcon>
  );
}

export function BellIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M8 17H16" />
      <path d="M10 19C10.4 19.8 11.1 20.2 12 20.2C12.9 20.2 13.6 19.8 14 19" />
      <path d="M6.8 15.8C7.6 14.8 8 13.6 8 12.4V10.7C8 8.4 9.7 6.5 12 6.5C14.3 6.5 16 8.4 16 10.7V12.4C16 13.6 16.4 14.8 17.2 15.8L17.7 16.5H6.3L6.8 15.8Z" />
    </BaseIcon>
  );
}

export function CalendarIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="4.5" y="5.5" width="15" height="13.5" rx="2.5" />
      <path d="M8 3.5V7" />
      <path d="M16 3.5V7" />
      <path d="M4.5 9.5H19.5" />
    </BaseIcon>
  );
}

export function ChevronDownIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M7.5 10L12 14.5L16.5 10" />
    </BaseIcon>
  );
}

export function CheckIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M6 12.5L10 16.5L18 8.5" />
    </BaseIcon>
  );
}

export function CloseIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M7.5 7.5L16.5 16.5" />
      <path d="M16.5 7.5L7.5 16.5" />
    </BaseIcon>
  );
}

export function ClockIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8V12.5L15 14.2" />
    </BaseIcon>
  );
}

export function WhatsAppIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12.2 4.2C8.1 4.2 4.7 7.5 4.7 11.6C4.7 13 5.1 14.4 5.8 15.6L4.7 19.3L8.5 18.3C9.6 18.9 10.9 19.2 12.2 19.2C16.3 19.2 19.7 15.9 19.7 11.8C19.7 7.6 16.3 4.2 12.2 4.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.6 8.8C9.4 8.4 9.1 8.4 8.8 8.4C8.6 8.4 8.4 8.4 8.2 8.5C8 8.6 7.6 8.9 7.5 9.5C7.4 10 7.7 10.8 8.4 11.8C9.1 12.8 10.1 13.7 11.7 14.5C12.3 14.8 12.7 14.9 13.1 14.8C13.4 14.8 14 14.4 14.2 13.9C14.3 13.5 14.3 13.1 14.1 12.9C13.9 12.8 13 12.4 12.7 12.3C12.4 12.2 12.2 12.1 12 12.4C11.8 12.7 11.4 13.1 11.2 13.2C11 13.4 10.7 13.3 10.5 13.2C10.2 13 9.4 12.6 8.7 11.7C8.1 10.9 7.8 10.3 7.7 10C7.6 9.8 7.7 9.6 7.9 9.4C8 9.3 8.1 9.1 8.3 8.9C8.4 8.7 8.5 8.5 8.6 8.3C8.7 8.1 8.6 7.8 8.5 7.7L7.9 6.3"
        fill="currentColor"
      />
    </svg>
  );
}

export function InfoIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10.5V15.5" />
      <circle cx="12" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}
