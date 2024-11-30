import React from 'react';

const UserLayout = ({ children }) => {
    return (
        <div>
            <header>
                <h1>User Dashboard</h1>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default UserLayout;
