import React from 'react';
import { Head } from '@inertiajs/react';

export default function DashboardUser({ user }) {
    return (
        <div>
            <Head title="Dashboard User" />
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}
