"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ThreadData } from "@liveblocks/client"; // ThreadData type :contentReference[oaicite:2]{index=2}
import { Thread } from "@liveblocks/react-ui"; // Thread component :contentReference[oaicite:3]{index=3}

import { ThreadMetadata } from "@/liveblocks.config";

type Props = {
  thread: ThreadData<ThreadMetadata>;
  onFocus: (threadId: string) => void;
  onResolvedChange?: () => void;
};

export const PinnedThread = ({
  thread,
  onFocus,
  onResolvedChange,
  ...props
}: Props) => {
  // Open pinned threads that have just been created
  const { x, y, zIndex } = thread.metadata;
  const { resolved } = thread;

  if (thread.resolved) {
    return null;
  }
  const startMinimized =
    Date.now() - new Date(thread.createdAt).getTime() > 100;

  const [minimized, setMinimized] = useState(startMinimized);

  /**
   * memoize the result of this function so that it doesn't change on every render but only when the thread changes
   * Memo is used to optimize performance and avoid unnecessary re-renders.
   *
   * useMemo: https://react.dev/reference/react/useMemo
   */

  const memoizedContent = useMemo(
    () => (
      <div
        style={{ position: "absolute", left: x, top: y, zIndex }}
        className="absolute flex cursor-pointer gap-4"
        {...props}
        onClick={(e: any) => {
          onFocus(thread.id);

          // check if click is on/in the composer
          if (
            e.target &&
            e.target.classList.contains("lb-icon") &&
            e.target.classList.contains("lb-button-icon")
          ) {
            return;
          }

          setMinimized(!minimized);
        }}
      >
        <div
          className="relative flex h-9 w-9 select-none items-center justify-center rounded-bl-full rounded-br-full rounded-tl-md rounded-tr-full bg-white shadow"
          data-draggable={true}
        >
          <Image
            src={`https://liveblocks.io/avatars/avatar-${Math.floor(
              Math.random() * 30
            )}.png`}
            alt="Dummy Name"
            width={28}
            height={28}
            draggable={false}
            className="rounded-full"
          />
        </div>
        {!minimized ? (
          <div className="flex min-w-60 flex-col overflow-hidden rounded-lg bg-white text-sm shadow">
            <Thread
              thread={thread}
              indentCommentContent={false}
              showResolveAction={true}
              onResolvedChange={onResolvedChange}
              onKeyUp={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    [thread.id, thread.comments.length, minimized, x, y, zIndex]
  );

  return <>{memoizedContent}</>;
};
