'use client';

import { workspace } from '@/lib/supabase/supabase.types';
import React, { useEffect, useState } from 'react';
import WorkspaceDropdown from './workspace-dropdown';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase/browser';

interface SelectedWorkspaceProps {
  workspace: workspace;
  onClick?: (option: workspace) => void;
};

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({
  workspace,
  onClick
}) => {
  const supabase = createBrowserClient();
  const [workspaceLogo, setWorkspaceLogo] = useState('/cypresslogo.svg');
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from('workspace-logos')
        .getPublicUrl(workspace.logo);
      setWorkspaceLogo(path.data.publicUrl);
    }
  }, [workspace]);

  return <Link
    href={`/dashboard/${workspace.id}`}
    onClick={() => {
      if (onClick) onClick(workspace);
    }}
    className='flex
    rounded-md
    hover:bg-muted
    transition-all
    flex-row
    p-2
    gap-4
    justify-center
    cursor-pointer
    items-center
    my-2'>
    <Image src={workspaceLogo} alt='workspace logo' width={26} height={26} objectFit='cover' />
    <div className='flex flex-col'>
      <p className='text-lg
          w-[170px]
          overflow-hidden
          overflow-ellipsis
          whitespace-nowrap'>
        {workspace.title}
      </p>
    </div>
  </Link>;
}

export default SelectedWorkspace;
