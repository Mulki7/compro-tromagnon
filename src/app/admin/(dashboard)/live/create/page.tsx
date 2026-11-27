"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import FormSummaryCard from "@/components/admin/FormSummaryCard";
import { SegmentedToggle } from "@/components/admin/ListControls";
import { useAdminShell } from "@/components/admin/AdminShellContext";
import {
  btnSecondary,
  formErrorClass,
  formSectionClass,
  formSectionTitleClass,
  getErrorMessage,
  inputClass,
  labelClass,
} from "@/components/admin/formStyles";
import { getAdminArtists } from "@/lib/api/admin/artists";
import { createLiveEvent } from "@/lib/api/admin/live";
import { Artist } from "@/types/models";
import { formatDate } from "@/lib/utils";

export default function CreateLivePage() {
  const router = useRouter();
  const { refreshShellData } = useAdminShell();
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

  const selectedArtist = artists.find((a) => a.id === artistId);

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
      if (res.success) {
        refreshShellData();
        router.push("/admin/live");
      } else {
        setError(res.message || "Failed to create event");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create event"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12">
      <AdminHeader
        backHref="/admin/live"
        backLabel="Live Shows"
        eyebrow="New tour / showcase booking"
        title={venue.trim() ? `${selectedArtist?.name || "Show"} @ ${venue}` : "Schedule Live Show"}
        badge={<StatusBadge status={status} />}
        actions={
          <Link href="/admin/live" className={btnSecondary}>
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-7"
      >
        <div className="space-y-5 lg:col-span-8">
          {error && (
            <div role="alert" className={formErrorClass}>
              {error}
            </div>
          )}

          <div className={formSectionClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={formSectionTitleClass}>Show details & routing</h2>
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
                  Performing Artist
                </label>
                <select
                  id="live-artist"
                  className={inputClass}
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                >
                  <option value="">Label Showcase / Various</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="live-date" className={labelClass}>
                  Event Date
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
                Venue Name
              </label>
              <input
                id="live-venue"
                required
                placeholder="e.g. M Bloc Live House"
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
                  placeholder="Jakarta"
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
                  placeholder="Indonesia"
                  className={inputClass}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="live-ticket" className={labelClass}>
                Ticket / RSVP Link
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
            title="Show summary"
            subtitle="Live calendar listing"
            rows={[
              { label: "Bill", value: selectedArtist?.name || "Label Showcase" },
              { label: "Venue", value: venue || "TBD" },
              {
                label: "Location",
                value: [city, country].filter(Boolean).join(", ") || "TBD",
              },
              { label: "Tickets", value: ticketUrl ? "Online link set" : "At door / free" },
            ]}
            highlightLabel="Scheduled date"
            highlightValue={eventDate ? formatDate(eventDate) : "Pick date"}
            submitLabel={saving ? "Scheduling..." : "Schedule Show"}
            saving={saving}
            checks={[
              { label: "Event date chosen", done: Boolean(eventDate) },
              { label: "Venue & city entered", done: Boolean(venue.trim() && city.trim()) },
              { label: "Ticket / RSVP URL added", done: Boolean(ticketUrl.trim()) },
            ]}
          />
        </div>
      </form>
    </div>
  );
}
