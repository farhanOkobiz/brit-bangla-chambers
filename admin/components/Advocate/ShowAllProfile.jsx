import React, { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";

const ShowProfile = ({ advocateId }) => {
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvocate = async () => {
      setLoading(true);
      setError(null);
      const res = await UseAxios(`/advocate/${advocateId}`);
      if (res.ok) {
        setAdvocate(res.data.advocate || res.data);
      } else {
        setError(res.data?.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    if (advocateId) fetchAdvocate();
  }, [advocateId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!advocate) return <div>No profile found.</div>;

  return (
    <div className="advocate-profile">
      <h2>{advocate.user_id?.full_name || "Advocate"}</h2>
      {advocate.profile_photo_url && (
        <img
          src={advocate.profile_photo_url}
          alt="Profile"
          style={{ width: 120, height: 120, borderRadius: "50%" }}
        />
      )}
      <p><strong>Designation:</strong> {advocate.designation}</p>
      <p><strong>Bar Council Enroll No:</strong> {advocate.bar_council_enroll_num}</p>
      <p><strong>Experience (years):</strong> {advocate.experience_years}</p>
      <p><strong>Bio:</strong> {advocate.bio}</p>
      <p><strong>Status:</strong> {advocate.status}</p>
      <p><strong>Featured:</strong> {advocate.featured ? "Yes" : "No"}</p>
      <p><strong>Consultation Available:</strong> {advocate.consultation_available ? "Yes" : "No"}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default ShowProfile;
