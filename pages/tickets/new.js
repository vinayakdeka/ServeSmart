import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { getCurrentUser } from '../../lib/auth'
import { CATEGORIES, PRIORITIES, MIN_DESCRIPTION_LENGTH } from '../../lib/store'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  location: '',
  priority: 'P3',
}

export default function NewTicket() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      router.push('/')
      return
    }
    if (u.role !== 'student') {
      if (u.role === 'technician') router.push('/technician/dashboard')
      else if (u.role === 'admin') router.push('/admin/assign')
      else router.push('/')
      return
    }
    setUser(u)
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    // Clear error when user edits
    if (error) setError(null)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setError(null)

    // Required-field validations
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    if (!form.description.trim()) {
      setError('Description is required.')
      return
    }

    if (form.description.trim().length < MIN_DESCRIPTION_LENGTH) {
      setError(
        `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters (currently ${form.description.trim().length}).`,
      )
      return
    }

    if (!form.category || !CATEGORIES.includes(form.category)) {
      setError('Please select a valid category.')
      return
    }

    if (!form.priority || !PRIORITIES.includes(form.priority)) {
      setError('Priority must be P1, P2, P3, or P4.')
      return
    }

    if (!form.location.trim()) {
      setError('Location is required.')
      return
    }

    if (!user || user.role !== 'student') {
      setError('Only students can submit tickets. Please log in as a student.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          location: form.location.trim(),
          priority: form.priority,
          studentId: user.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not submit the ticket.')
      }

      setSuccess(true)
      setForm(EMPTY_FORM)
      setTimeout(() => router.push('/tickets'), 600)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="new-ticket-page">
      <Navbar user={user} title="New Ticket" />
      <div className="container" style={{ maxWidth: 620 }}>
        <h1>Create a Ticket</h1>
        <p className="subtitle">
          Submit a campus service request — it'll be routed to a technician
          shortly after review.
        </p>

        {success && (
          <div className="banner banner-success">
            Ticket submitted successfully. Taking you to your ticket list…
          </div>
        )}
        {error && <div className="banner banner-error">{error}</div>}

        <form className="panel panel-pad new-ticket-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Projector not turning on"
              maxLength={80}
              required
            />
          </div>

          <div className="field">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What's happening, and anything a technician should know before arriving."
              rows={4}
              required
            />
            <div className="field-hint">
              Minimum {MIN_DESCRIPTION_LENGTH} characters{' '}
              {form.description.trim().length > 0 &&
                `(${form.description.trim().length}/${MIN_DESCRIPTION_LENGTH})`}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Priority *</label>
              <select
                value={form.priority}
                onChange={(e) => update('priority', e.target.value)}
                required
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="field-hint">
                P1 is urgent/safety, P4 is minor.
              </div>
            </div>
          </div>

          <div className="field">
            <label>Location *</label>
            <input
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Hall A - Room 101"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || success}
          >
            {submitting ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  )
}
