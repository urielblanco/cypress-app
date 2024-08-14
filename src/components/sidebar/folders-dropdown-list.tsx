"use client";
import { useAppState } from '@/lib/providers/state-provider';
import { Folder } from '@/lib/supabase/supabase.types';
import { PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TooltipComponent from '../global/tooltip-component';
import { v4 } from 'uuid';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { createFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';

interface FoldersDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
};

const FolderDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId
}) => {
  // local state folder
  // set real time updates
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const [folders, setFolders] = useState(workspaceFolders);
  const { subscription } = useSupabaseUser();

  // efect set initial serve app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: 'SET_FOLDERS',
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  // state
  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [state, workspaceId]);


  // add folder
  const addFolderHandler = async () => {

    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📄',
      inTrash: null,
      workspaceId,
      bannerUrl: '',
    };

    dispatch({
      type: 'ADD_FOLDER',
      payload: {
        workspaceId, folder: {
          ...newFolder, files: []
        }
      }
    });

    const { data, error } = await createFolder(newFolder);

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create the folder',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Created folder.'
      });
    }

  };


  return (
    <>
      <div className='flex
        sticky
        z-20
        top-0
        bg-background
        w-full
        h-10
        group/title
        justify-between
        items-center
        pr-4
        text-Neutrals/neutrals-8'>
        <span className='text-Neutrals/Neutrals-8
          font-bold
          text-xs'>
          FOLDERS
        </span>
        <TooltipComponent message='Create Folder'>
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className='group-hover/title:inline-block
          hidden
          cursor-pointer
          hover:dark:text-white'
          />
        </TooltipComponent>
      </div>
    </>
  );
};

export default FolderDropdownList;
