import React from 'react';

interface LayoutPage {
  children: React.ReactNode,
  params: any;
};

const Layout: React.FC<LayoutPage> = ({ children, params }) => {
  return <main className='flex over-hidden h-screen'> {children}</main>;
}

export default Layout;
