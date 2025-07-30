import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxios } from "../../services/UseAxios";

export default function ShowIndividualAdvocate() {
  const { id } = useParams();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    async function fetchAdvocate() {
      const res = await useAxios(`/advocate/profile/advocate/${id}`);
      console.log(res);
      if (res.ok) {
        console.log(res.data);
        setAdvocate(res.data.advocate || res.data);
      } else {
        setError(res.data?.message || "Failed to fetch advocate");
      }
      setLoading(false);
    }
    fetchAdvocate();
  }, [id]);

  if (loading) return <div>Loading advocate...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!advocate) return <div>No advocate found.</div>;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this advocate?"))
      return;
    const res = await useAxios(`/advocate/profile/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Advocate deleted successfully.");
      window.location.href = "/admin/advocates";
    } else {
      alert(res.data?.message || "Failed to delete advocate.");
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-8 border border-gray-200 rounded-xl bg-white shadow">
      <img
        src={
          `${BASE_URL}${advocate.profile_photo_url}` || "/default-profile.png"
        }
        alt={advocate.user_id?.full_name || "Advocate"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <h2>{advocate.user_id?.full_name}</h2>
      <p>
        <strong>Designation:</strong> {advocate.designation}
      </p>
      <p>
        <strong>Email:</strong> {advocate.user_id?.email}
      </p>
      <p>
        <strong>Phone:</strong> {advocate.contact?.phone}
      </p>
      <p>
        <strong>Office:</strong> {advocate.office_address}
      </p>
      <p>
        <strong>Experience:</strong> {advocate.experience_years} yrs
      </p>
      <p>
        <strong>Bio:</strong> {advocate.bio}
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => (window.location.href = `/admin/advocates/${id}/edit`)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Edit Advocate
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete Advocate
        </button>
      </div>

      {/* Education */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Education</h3>
        {Array.isArray(advocate.education_ids) &&
        advocate.education_ids.length > 0 ? (
          <ul>
            {advocate.education_ids.map((edu) => (
              <li key={edu._id}>
                <strong>{edu.degree_title}</strong> from {edu.institution} (
                {edu.passing_year})
              </li>
            ))}
          </ul>
        ) : (
          <p>No education records found.</p>
        )}
      </div>

      {/* Documents */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Documents</h3>
        {Array.isArray(advocate.document_ids) &&
        advocate.document_ids.length > 0 ? (
          <ul>
            {advocate.document_ids.map((doc) => (
              <li key={doc._id}>
                <strong>{doc.file_name}</strong> ({doc.document_type}) -
                {doc.verified ? " Verified" : " Not Verified"}
                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "8px" }}
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents found.</p>
        )}
      </div>

      {/* Bar Memberships */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Bar Memberships</h3>
        {Array.isArray(advocate.bar_memberships) &&
        advocate.bar_memberships.length > 0 ? (
          <ul>
            {advocate.bar_memberships.map((bar) => (
              <li key={bar._id}>
                <strong>{bar.bar_name}</strong> (Membership #:{" "}
                {bar.membership_number})
              </li>
            ))}
          </ul>
        ) : (
          <p>No bar memberships found.</p>
        )}
      </div>

      {/* Available Hours */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Available Hours</h3>
        <ul>
          {Object.entries(advocate.available_hours || {}).map(
            ([day, hours]) => (
              <li key={day}>
                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                {hours}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Fee Structure */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Fee Structure</h3>
        <p>
          <strong>Base Fee:</strong> {advocate.fee_structure?.base_fee}
        </p>
        <p>
          <strong>Show Publicly:</strong>{" "}
          {advocate.fee_structure?.show_publicly ? "Yes" : "No"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Stats</h3>
        <p>
          <strong>Total Consultations:</strong>{" "}
          {advocate.stats?.total_consultations}
        </p>
        <p>
          <strong>Weekly Bookings:</strong> {advocate.stats?.weekly_bookings}
        </p>
        {advocate.stats?.last_consultation && (
          <p>
            <strong>Last Consultation:</strong>{" "}
            {new Date(advocate.stats.last_consultation).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
