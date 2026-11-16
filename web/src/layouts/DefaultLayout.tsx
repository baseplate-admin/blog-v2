import type { ReactNode } from 'react';
import Navbar from '$lib/components/Navbar';
import Footer from '$lib/components/Footer';
import type { Nav, Site } from '$lib/types';

interface Props {
    children?: ReactNode;
    nav?: Nav;
    site?: Site;
}

export default function DefaultLayout({ children, nav, site }: Props) {
    return (
        <div className="page-shell min-h-svh flex flex-col bg-background text-foreground">
            {nav && <Navbar nav={nav} />}
            <main className="flex-1 flex flex-col">{children}</main>
            {nav && site && <Footer nav={nav} site={site} />}
        </div>
    );
}
