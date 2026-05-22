import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { getMessageLogs } from "../lib/api";

export default function WhatsAppLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getMessageLogs(token, {
          page: pagination.page,
          status: filters.status,
          search: filters.search,
        });

        if (!cancelled) {
          setLogs(response.data.items);
          setPagination((current) => ({
            ...current,
            totalPages: response.data.pagination.totalPages,
          }));
          setError("");
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.status, pagination.page, token]);

  return (
    <div className="page-stack">
      <SectionCard
        title="Recent WhatsApp Activity"
        action={
          <div className="toolbar">
            <input
              className="toolbar__search"
              type="text"
              placeholder="Search student, parent, standard, or phone"
              value={filters.search}
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, search: event.target.value }));
              }}
            />
            <select
              className="toolbar__select"
              value={filters.status}
              onChange={(event) => {
                setPagination((current) => ({ ...current, page: 1 }));
                setFilters((current) => ({ ...current, status: event.target.value }));
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="retrying">Retrying</option>
              <option value="processing">Processing</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        }
      >
        {/* Desktop View */}
        <div className="simple-table simple-table--desktop">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Standard</th>
                <th>Parent</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Status</th>
                <th>Retries</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {logs.length ? (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.studentName}</td>
                    <td>{log.standard || log.className || "-"}</td>
                    <td>{log.parentName || "-"}</td>
                    <td>{log.phoneNumber}</td>
                    <td>{log.messageType || "result"}</td>
                    <td>
                      <span className={`badge badge--${log.status.replaceAll("_", "-")}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>{log.retryCount}</td>
                    <td>{new Date(log.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="table-empty-cell" colSpan="8">
                    No message logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="simple-table--mobile log-mobile-list">
          {logs.length ? (
            logs.map((log) => (
              <div key={log._id} className="log-mobile-card">
                <div className="log-mobile-card__header">
                  <div>
                    <strong className="log-mobile-card__student">{log.studentName}</strong>
                    <span className="log-mobile-card__class">{log.standard || log.className || "-"}</span>
                  </div>
                  <span className={`badge badge--${log.status.replaceAll("_", "-")}`}>
                    {log.status}
                  </span>
                </div>
                <div className="log-mobile-card__details">
                  <div>
                    <span>Parent</span>
                    <strong>{log.parentName || "-"}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{log.phoneNumber}</strong>
                  </div>
                  <div>
                    <span>Type</span>
                    <strong>{log.messageType || "result"}</strong>
                  </div>
                  <div>
                    <span>Retries</span>
                    <strong>{log.retryCount}</strong>
                  </div>
                </div>
                <div className="log-mobile-card__footer">
                  <span>Updated</span>
                  <strong>{new Date(log.updatedAt).toLocaleString()}</strong>
                </div>
              </div>
            ))
          ) : (
            <div className="table-empty-cell">No message logs found</div>
          )}
        </div>

        <div className="pager">
          <button
            className="btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination((current) => ({ ...current, page: current.page - 1 }))
            }
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() =>
              setPagination((current) => ({ ...current, page: current.page + 1 }))
            }
          >
            Next
          </button>
        </div>

        {error ? <div className="alert alert--error">{error}</div> : null}
      </SectionCard>
    </div>
  );
}
