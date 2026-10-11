// Render the user card with a toggleable details panel.
import { useEffect, useState, type ReactNode } from 'react'
import { fetchUser, type User } from './types'

/**
 * Card that loads a user and shows their name.
 * @param {number} id - User identifier.
 * @deprecated Use `ProfileCard` instead.
 */
interface Props {
  id: number
  title?: string
  children?: ReactNode
}

const MAX_RETRIES = 3
const pattern = /^user-(\d+)$/g

export function UserCard({ id, title = 'User', children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchUser(id, { retries: MAX_RETRIES }).then((result) => {
      if (!cancelled) setUser(result)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  const label = `${title} #${id}: ${user?.name ?? 'loading…'}\n`

  return (
    <section className="card" data-open={open} onClick={() => setOpen(!open)}>
      <h2>{label}</h2>
      {open && <Details user={user} count={42} />}
      {children}
    </section>
  )
}

function Details({ user, count }: { user: User | null; count: number }) {
  if (typeof user === 'undefined' || user === null) return null
  return (
    <ul>
      {user.roles.map((role, index) => (
        <li key={role}>
          {index + 1}. {role.toUpperCase()} of {count}
        </li>
      ))}
    </ul>
  )
}
