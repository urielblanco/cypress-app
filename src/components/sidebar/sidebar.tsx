import { getCollaboratingWorkspaces, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspace-dropdown';
import PlanUsage from './plan-usage';
import NativeNavigation from './native-navigation';
import { ScrollArea } from '../ui/scroll-area';
import FoldersDropdownList from './folders-dropdown-list';

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { data: subscriptionData, error: subscriptionError } = await getUserSubscriptionStatus(user.id);

  const { data: workspaceFolderData, error: foldersError } = await getFolders(params.workspaceId);

  if (subscriptionError || foldersError) redirect('/dashboard');

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = await
    Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id)
    ]);
  // get all the different workspaces private collaborating shared

  return (
    <aside
      className={twMerge(
        'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces
          ].find((workspace) => workspace.id === params.workspaceId)} />
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <ScrollArea className='overflow-y-auto relative h-[450px]'>
          <div className='pointer-events-none
            w-full
            absolute
            bottom-0
            h-20
            bg-gradient-to-t
            from-background
            to-transparent
            z-40'
          />
          <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
    </aside>
  )
};

export default Sidebar;
