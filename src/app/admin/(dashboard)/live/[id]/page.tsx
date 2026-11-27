"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnPrimary,
  btnSecondary,
  formErrorClass,
  formLoadingClass,
  formSectionClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminLiveEvent, updateLiveEvent } from "@/lib/api/admin/live";
import { Artist } from "@/types/models";

export default function EditLivePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { onMenuClick } = useAdminShell();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [country, setCountry] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [status, setStatus] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [list, event] = await Promise.all([
          getAdminArtists(),
          getAdminLiveEvent(id),
        ]);
        if (cancelled) return;
        setArtists(list);
        if (!event) {
          setError("Event not found");
          return;
        }
        setArtistId(event.artist_id || "");
        setEventDate(event.event_date?.slice(0, 10) || "");
        setCity(event.city || "");
        setVenue(event.venue || "");
        setCountry(event.country || "");
        setTicketUrl(event.ticket_url || "");
        setStatus(event.status);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load event"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await updateLiveEvent(id, {
        artist_id: artistId || undefined,
        event_date: eventDate,
        city,
        venue,
        country,
        ticket_url: ticketUrl,
        status,
      });
      if (res.success) router.push("/admin/live");
      else setError(res.message || "Failed to update event");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update event"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-satelit-accent" aria-hidden="true" />
        <span>Loading event…</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit Live Event"
        subtitle={[venue || "Event", city].filter(Boolean).join(" — ")}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
