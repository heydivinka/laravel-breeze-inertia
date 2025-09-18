import React from 'react';
import { Head } from '@inertiajs/react';

export default function DashboardAdmin({ user }) {
    return (
        <div>
            <Head title="Dashboard Admin" />
            <h1>Welcome Admin, {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}
