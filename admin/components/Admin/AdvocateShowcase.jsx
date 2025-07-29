import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../services/useAxios";

export default function AdvocateShowcase() {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdvocates() {
      const res = await useAxios("/advocate/all");
      if (res.ok) {
        setAdvocates(res.data);
      } else {
        setError(res.data?.message || "Failed to fetch advocates");
      }
      setLoading(false);
    }
    fetchAdvocates();
  }, []);

  if (loading) return <div>Loading advocates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {advocates.map((adv) => (
        <div
          key={adv._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            width: "250px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onClick={() => navigate(`/admin/advocates/${adv._id}`)}
        >
          <img
            src={adv.profile_photo_url?.includes("null") ? "/default-profile.png" : adv.profile_photo_url}
            alt={adv.user_id?.full_name || "Advocate"}
            style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
          />
          <h3 style={{ margin: "0.5rem 0 0.2rem" }}>{adv.user_id?.full_name}</h3>
          <p style={{ margin: 0, fontWeight: "bold" }}>{adv.designation}</p>
          <p style={{ margin: 0 }}>{adv.office_address}</p>
          <p style={{ margin: 0, color: "#555" }}>Experience: {adv.experience_years} yrs</p>
        </div>
      ))}
    </div>
  );
}
