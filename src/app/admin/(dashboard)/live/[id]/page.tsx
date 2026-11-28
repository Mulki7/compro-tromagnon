"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  formErrorClass,
  formLoadingClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { getAdminLiveEvent, updateLiveEvent } from "@/lib/api/admin/live";
import { Artist } from "@/types/models";
import { formatDate } from "@/lib/utils";

export default function EditLivePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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

  const selectedArtist = artists.find((a) => a.id === artistId);

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
      if (res.success) {
        refreshShellData();
        router.push("/admin/live");
      } else {
        setError(res.message || "Failed to update event");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update event"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={formLoadingClass}>
        <Loader2 size={18} className="animate-spin text-admin-forest" aria-hidden="true" />
        <span>Loading live event…</span>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/live"
        backLabel="Shows"
        title={selectedArtist?.name ? `${selectedArtist.name} @ ${venue || "Show"}` : "Edit show"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/live" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 px-4 sm:px-5 lg:grid-cols-12 lg:px-6"
      >
        <div className="space-y-4 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Details</h2>
              <SegmentedToggle
                ariaLabel="Show status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "past", label: "Past" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="live-artist" className={labelClass}>
                  Artist
                </label>
                <select
                  id="live-artist"
                  className={inputClass}
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                >
                  <option value="">Showcase / Various</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="live-date" className={labelClass}>
                  Date
                </label>
                <input
                  id="live-date"
                  type="date"
                  required
                  className={inputClass}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="live-venue" className={labelClass}>
                Venue
              </label>
              <input
                id="live-venue"
                required
                className={inputClass}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="live-city" className={labelClass}>
                  City
                </label>
                <input
                  id="live-city"
                  required
                  className={inputClass}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="live-country" className={labelClass}>
                  Country
                </label>
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
              <label htmlFor="live-ticket" className={labelClass}>
                Ticket URL
              </label>
              <input
                id="live-ticket"
                type="url"
                className={inputClass}
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <FormSummaryCard
            title="Summary"
            rows={[
              { label: "Artist", value: selectedArtist?.name || "Showcase" },
              { label: "Venue", value: venue || "—" },
              {
                label: "Location",
                value: [city, country].filter(Boolean).join(", ") || "—",
              },
              { label: "Tickets", value: ticketUrl ? "Online" : "Door" },
            ]}
            highlightLabel="Date"
            highlightValue={eventDate ? formatDate(eventDate) : "Select date"}
            warningText={
              status === "cancelled" ? "Marked as cancelled." : undefined
            }
            submitLabel={saving ? "Saving…" : "Save changes"}
            saving={saving}
            checks={[
              { label: "Date", done: Boolean(eventDate) },
              { label: "Venue & city", done: Boolean(venue.trim() && city.trim()) },
              { label: "Ticket link", done: Boolean(ticketUrl.trim()) },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
