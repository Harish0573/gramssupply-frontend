import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axiosConfig";
import "./Enquiries.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all enquiries from Spring Boot
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/enquiries");

      console.log("Enquiries API response:", response.data);

      // Support both array and wrapped API responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content;

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Enquiry API error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load enquiries. Check your backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Load enquiries when page opens
  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Update enquiry status
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status });

      alert("Enquiry status updated successfully!");

      await fetchEnquiries();
    } catch (err) {
      console.error("Status update error:", err);

      alert(err.response?.data?.message || "Unable to update enquiry status.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <>
      <Navbar />

      <main className="admin-enquiries">
        <div className="enquiry-heading">
          <div>
            <p>GRAMSUPPLY ADMINISTRATION</p>
            <h1>Customer Enquiries</h1>
            <span>Manage institutional procurement requests.</span>
          </div>

          <button onClick={fetchEnquiries}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="enquiry-summary">
          <div>
            <span>Total Enquiries</span>
            <h2>{enquiries.length}</h2>
          </div>

          <div>
            <span>New Enquiries</span>
            <h2>{enquiries.filter((e) => e.status === "NEW").length}</h2>
          </div>

          <div>
            <span>Reviewed</span>
            <h2>{enquiries.filter((e) => e.status === "REVIEWED").length}</h2>
          </div>
        </div>

        {loading ? (
          <p>Loading enquiries...</p>
        ) : error ? (
          <div className="enquiry-error">
            {error}
            <button onClick={fetchEnquiries}>Try Again</button>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="no-enquiries">
            <h2>No enquiries received yet</h2>
            <p>Customer enquiries will appear here.</p>
          </div>
        ) : (
          <div className="enquiry-table-wrapper">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Organisation</th>
                  <th>Requirements</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>#{enquiry.id}</td>

                    <td>
                      <strong>{enquiry.customerName}</strong>
                    </td>

                    <td>
                      <div>{enquiry.email}</div>
                      <small>{enquiry.phone}</small>
                    </td>

                    <td>{enquiry.organization || "-"}</td>

                    <td className="requirement-cell">{enquiry.message}</td>

                    <td>{formatDate(enquiry.createdAt)}</td>

                    <td>
                      <span
                        className={`status ${(
                          enquiry.status || "NEW"
                        ).toLowerCase()}`}
                      >
                        {enquiry.status || "NEW"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={enquiry.status || "NEW"}
                        onChange={(e) =>
                          updateStatus(enquiry.id, e.target.value)
                        }
                      >
                        <option value="NEW">New</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

export default Enquiries;
