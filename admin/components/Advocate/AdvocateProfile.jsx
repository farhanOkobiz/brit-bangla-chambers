import React, { useEffect, useState } from "react";
import { useAxios } from "../../services/useAxios";

const AdvocateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const res = await useAxios("/advocate/profile");
      console.log(res);
      if (res.ok) {
        setProfile(res.data);
      } else {
        setError(res.data?.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile || !profile.advocate) return <div>No profile found.</div>;

  const { user, advocate } = profile;
  const availableHours = advocate.available_hours || {};
  const contact = advocate.contact || {};
  const fee = advocate.fee_structure || {};
  const stats = advocate.stats || {};

  return (
    <div className="advocate-profile">
      <h2>{user?.full_name || "Advocate"}</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Phone:</strong> {user?.phone}</p>
      <p><strong>Designation:</strong> {advocate.designation}</p>
      <p><strong>Bar Council Enroll No:</strong> {advocate.bar_council_enroll_num}</p>
      <p><strong>Experience (years):</strong> {advocate.experience_years}</p>
      <p><strong>Bio:</strong> {advocate.bio}</p>
      <p><strong>Office Address:</strong> {advocate.office_address}</p>
      <p><strong>Status:</strong> {advocate.status}</p>
      <p><strong>Featured:</strong> {advocate.featured ? "Yes" : "No"}</p>
      <p><strong>Consultation Available:</strong> {advocate.consultation_available ? "Yes" : "No"}</p>
      <p><strong>Slug:</strong> {advocate.slug}</p>
      <p><strong>Available Hours:</strong></p>
      <ul>
        {Object.entries(availableHours).map(([day, hours]) => (
          <li key={day}><strong>{day}:</strong> {hours || "-"}</li>
        ))}
      </ul>
      <p><strong>Contact:</strong></p>
      <ul>
        <li><strong>Phone:</strong> {contact.phone}</li>
        <li><strong>Facebook:</strong> <a href={contact.facebook} target="_blank" rel="noopener noreferrer">{contact.facebook}</a></li>
        <li><strong>LinkedIn:</strong> <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">{contact.linkedin}</a></li>
      </ul>
      <p><strong>Fee Structure:</strong></p>
      <ul>
        <li><strong>Base Fee:</strong> {fee.base_fee}</li>
        <li><strong>Show Publicly:</strong> {fee.show_publicly ? "Yes" : "No"}</li>
      </ul>
      <p><strong>Stats:</strong></p>
      <ul>
        <li><strong>Total Consultations:</strong> {stats.total_consultations}</li>
        <li><strong>Weekly Bookings:</strong> {stats.weekly_bookings}</li>
        <li><strong>Last Consultation:</strong> {stats.last_consultation ? new Date(stats.last_consultation).toLocaleString() : "-"}</li>
      </ul>
      <p><strong>Ratings:</strong> {advocate.avg_rating} ({advocate.total_reviews} reviews)</p>
      {/* Add more fields as needed, e.g. education, certifications, etc. */}
    </div>
  );
};

export default AdvocateProfile;
