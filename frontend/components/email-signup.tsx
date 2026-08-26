'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <form className="signup-form" onSubmit={subscribe}>
      <label htmlFor="email">Get the first edition</label>
      <div className="input-row">
        <input id="email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="button button-primary" type="submit">{submitted ? 'You&apos;re on the list' : 'Join Lexep'} <ArrowRight size={16} /></button>
      </div>
      <small>{submitted ? 'We&apos;ll be in touch when the doors open.' : 'No noise. Just meaningful updates.'}</small>
    </form>
  )
}
