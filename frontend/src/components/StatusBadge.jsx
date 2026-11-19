
function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case "Pending":
        return "pending";

      case "In Progress":
        return "in-progress";

      case "Resolved":
        return "resolved";

      case "Rejected":
        return "rejected";

      default:
        return "pending";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status || "Pending"}
    </span>
  );
}

export default StatusBadge;
