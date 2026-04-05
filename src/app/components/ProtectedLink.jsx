'use client'

import Link from 'next/link'

export default function ProtectedLink({ href, isAuth, children }) {
    const handleClick = (e) => {
        if (!isAuth) {
            e.preventDefault()
            alert('⚠️ login required to access this page')
        }
    }
    return (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    )
}
