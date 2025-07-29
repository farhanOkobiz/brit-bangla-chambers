import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../services/useAxios";

export default function EditAdvocateGeneralInfo( {id} ) {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    designation: "",
    bar_council_enroll_num: "",
    experience_years: "",
    profile_photo_url: "",
    bio: "",
    // slug: "",
    office_address: "",
    available_hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    contact: {
      phone: "",
      facebook: "",
      linkedin: "",
    },
    languages: [],
    bar_memberships: [{ bar_name: "", membership_number: "" }],
    avg_rating: 0,
    total_reviews: 0,
    consultation_available: false,
    fee_structure: { base_fee: 0, show_publicly: false },
    stats: { total_consultations: 0, weekly_bookings: 0, last_consultation: "" },
    status: "pending",
    featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    async function fetchAdvocate() {
      const res = await useAxios(`/advocate/profile/advocate/${id}`);
      if (res.ok) {
        const adv = res.data.advocate || res.data;
        setForm({
          designation: adv.designation || "",
          bar_council_enroll_num: adv.bar_council_enroll_num || "",
          experience_years: adv.experience_years || "",
          profile_photo_url: adv.profile_photo_url || "",
          bio: adv.bio || "",
        //   slug: adv.slug || "",
          office_address: adv.office_address || "",
          available_hours: adv.available_hours || {
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: "",
          },
          contact: adv.contact || {
            phone: "",
            facebook: "",
            linkedin: "",
          },
          languages: adv.languages || [],
          bar_memberships: adv.bar_memberships?.length ? adv.bar_memberships : [{ bar_name: "", membership_number: "" }],
          avg_rating: adv.avg_rating || 0,
          total_reviews: adv.total_reviews || 0,
          consultation_available: adv.consultation_available || false,
          fee_structure: adv.fee_structure || { base_fee: 0, show_publicly: false },
          stats: adv.stats || { total_consultations: 0, weekly_bookings: 0, last_consultation: "" },
          status: adv.status || "pending",
          featured: adv.featured || false,
        });
      } else {
        setError(res.data?.message || "Failed to fetch advocate");
      }
      setLoading(false);
    }
    fetchAdvocate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // For nested fields (available_hours, contact, fee_structure, stats)
  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  // For bar_memberships array
  const handleBarMembershipChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      bar_memberships: prev.bar_memberships.map((bm, i) =>
        i === idx ? { ...bm, [field]: value } : bm
      ),
    }));
  };

  const addBarMembership = () => {
    setForm((prev) => ({
      ...prev,
      bar_memberships: [...prev.bar_memberships, { bar_name: "", membership_number: "" }],
    }));
  };

  const removeBarMembership = (idx) => {
    setForm((prev) => ({
      ...prev,
      bar_memberships: prev.bar_memberships.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Validation
    if (!form.designation || !form.bar_council_enroll_num || !form.experience_years || !form.office_address) {
      setError("Please fill all required fields: Designation, Bar Council Enroll Number, Experience Years, Office Address.");
      return;
    }
    if (!form.contact.phone) {
      setError("Contact phone is required.");
      return;
    }

    let res;
    if (profilePhoto) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("profilePhoto", profilePhoto);
      res = await useAxios(`/advocate/update/${id}`, {
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      res = await useAxios(`/advocate/update/${id}`, {
        method: "PUT",
        data: form,
      });
    }
    if (res.ok) {
      setSuccess("Advocate info updated successfully.");
      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } else {
      setError(res.data?.message || "Failed to update info.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <form className="max-w-2xl mx-auto p-8 border border-gray-200 rounded-xl bg-white shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Edit Advocate General Information</h2>
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Designation</label>
        <input name="designation" value={form.designation} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Bar Council Enroll Number</label>
        <input name="bar_council_enroll_num" value={form.bar_council_enroll_num} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Experience Years</label>
        <input name="experience_years" type="number" value={form.experience_years} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      {/* <div className="mb-4">
        <label className="block font-semibold mb-1">Slug</label>
        <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div> */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Office Address</label>
        <input name="office_address" value={form.office_address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      {/* Available Hours */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Available Hours</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(form.available_hours).map(([day, value]) => (
            <div key={day} className="flex items-center gap-2 mb-2">
              <label className="block text-sm w-24">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
              <input
                name={day}
                value={value || ""}
                onChange={(e) => handleNestedChange(e, "available_hours")}
                className="w-full border rounded px-2 py-1"
                placeholder="e.g. 10am-6pm or blank"
              />
              <button type="button" className="text-red-600" onClick={() => {
                setForm(prev => {
                  const updated = { ...prev.available_hours };
                  delete updated[day];
                  return { ...prev, available_hours: updated };
                });
              }}>Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <select id="add-day" className="border rounded px-2 py-1 mr-2" defaultValue="" onChange={e => {
            const newDay = e.target.value;
            if (newDay && !(newDay in form.available_hours)) {
              setForm(prev => ({ ...prev, available_hours: { ...prev.available_hours, [newDay]: "" } }));
            }
            e.target.value = "";
          }}>
            <option value="">Add Day</option>
            {['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].filter(day => !(day in form.available_hours)).map(day => (
              <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Contact</label>
        <input name="phone" value={form.contact.phone} onChange={(e) => handleNestedChange(e, "contact")} placeholder="Phone" className="w-full border rounded px-3 py-2 mb-2" />
        <input name="facebook" value={form.contact.facebook} onChange={(e) => handleNestedChange(e, "contact")} placeholder="Facebook" className="w-full border rounded px-3 py-2 mb-2" />
        <input name="linkedin" value={form.contact.linkedin} onChange={(e) => handleNestedChange(e, "contact")} placeholder="LinkedIn" className="w-full border rounded px-3 py-2" />
      </div>

      {/* Languages */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Languages (comma separated)</label>
        <input
          name="languages"
          value={Array.isArray(form.languages) && form.languages.length > 0 ? form.languages.join(", ") : ""}
          onChange={(e) => setForm((prev) => ({ ...prev, languages: e.target.value.split(",").map(l => l.trim()).filter(Boolean) }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Bar Memberships */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Bar Memberships</label>
        {form.bar_memberships.map((bm, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              value={bm.bar_name}
              onChange={(e) => handleBarMembershipChange(idx, "bar_name", e.target.value)}
              placeholder="Bar Name"
              className="border rounded px-2 py-1"
            />
            <input
              value={bm.membership_number}
              onChange={(e) => handleBarMembershipChange(idx, "membership_number", e.target.value)}
              placeholder="Membership Number"
              className="border rounded px-2 py-1"
            />
            <button type="button" onClick={() => removeBarMembership(idx)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addBarMembership} className="text-blue-600">Add Bar Membership</button>
      </div>

      {/* Ratings & Reviews */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Average Rating</label>
        <input name="avg_rating" type="number" value={form.avg_rating} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Total Reviews</label>
        <input name="total_reviews" type="number" value={form.total_reviews} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      {/* Consultation Available */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Consultation Available</label>
        <input name="consultation_available" type="checkbox" checked={form.consultation_available} onChange={handleChange} />
      </div>

      {/* Fee Structure */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Fee Structure</label>
        <input name="base_fee" type="number" value={form.fee_structure.base_fee} onChange={(e) => handleNestedChange(e, "fee_structure") } placeholder="Base Fee" className="w-full border rounded px-3 py-2 mb-2" />
        <label className="block font-semibold mb-1">Show Publicly</label>
        <input name="show_publicly" type="checkbox" checked={form.fee_structure.show_publicly} onChange={(e) => setForm((prev) => ({ ...prev, fee_structure: { ...prev.fee_structure, show_publicly: e.target.checked } }))} />
      </div>

      {/* Stats */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Stats</label>
        <input name="total_consultations" type="number" value={form.stats.total_consultations} onChange={(e) => handleNestedChange(e, "stats") } placeholder="Total Consultations" className="w-full border rounded px-3 py-2 mb-2" />
        <input name="weekly_bookings" type="number" value={form.stats.weekly_bookings} onChange={(e) => handleNestedChange(e, "stats") } placeholder="Weekly Bookings" className="w-full border rounded px-3 py-2 mb-2" />
        <input name="last_consultation" type="datetime-local" value={form.stats.last_consultation ? new Date(form.stats.last_consultation).toISOString().slice(0,16) : ""} onChange={(e) => handleNestedChange(e, "stats") } placeholder="Last Consultation" className="w-full border rounded px-3 py-2" />
      </div>

      {/* Status & Featured */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Featured</label>
        <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Profile Photo</label>
        <input type="file" accept="image/*" onChange={e => setProfilePhoto(e.target.files[0])} />
        {form.profile_photo_url && (
          <div className="mt-2">
            <img src={form.profile_photo_url} alt="Profile" className="h-24 w-24 object-cover rounded" />
          </div>
        )}
      </div>

      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Save Changes</button>
    </form>
  );
}
