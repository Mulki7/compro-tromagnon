"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnPrimary,
  btnSecondary,
  formErrorClass,
  formSectionClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { createLiveEvent } from "@/lib/api/admin/live";
import { Artist } from "@/types/models";

export default function CreateLivePage() {
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [ticketUrl, setTicketUrl] = useState("");
  const [status, setStatus] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminArtists()
      .then((list) => {
        setArtists(list);
        if (list[0]) setArtistId(list[0].id);
      })
      .catch(() => setError("Failed to load artists"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createLiveEvent({
        artist_id: artistId || undefined,
        event_date: eventDate,
        city,
        venue,
        country,
        ticket_url: ticketUrl,
        status,
      });
      if (res.success) router.push("/admin/live");
      else setError(res.message || "Failed to create event");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create event"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Schedule Live"
        subtitle="Add tour date"
        onMenuClick={onMenuClick}
        actions={
          <Link href="/admin/live" className={btnSecondary}>
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-5 pb-12 pt-5 sm:px-7">
        {error && (
          <div role="alert" className={formErrorClass}>
            {error}
          </div>
        )}

        <div className={formSectionClass}>
          <div>
            <label htmlFor="live-artist" className={labelClass}>Artist</label>
            <select
              id="live-artist"
              className={inputClass}
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
            >
              <option value="">Select artist…</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="live-date" className={labelClass}>Event Date</label>
            <input
              id="live-date"
              type="date"
              required
              className={inputClass}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="live-city" className={labelClass}>City</label>
              <input
                id="live-city"
                required
                className={inputClass}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="live-country" className={labelClass}>Country</label>
              <input
                id="live-country"
                required
                className={inputClass}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="live-venue" className={labelClass}>Venue</label>
            <input
              id="live-venue"
              required
              className={inputClass}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="live-ticket" className={labelClass}>Ticket URL</label>
            <input
              id="live-ticket"
              type="url"
              className={inputClass}
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              placeholder="https://"
            />
          </div>

          <div>
            <label htmlFor="live-status" className={labelClass}>Status</label>
            <select
              id="live-status"
              className={inputClass}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "upcoming" | "past" | "cancelled")
              }
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5">
          <Link href="/admin/live" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
