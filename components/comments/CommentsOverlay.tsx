"use client";

import React, { useCallback, useRef } from "react";
import { Thread } from "@liveblocks/react-ui"; // Thread UI component :contentReference[oaicite:0]{index=0}
import {
  useMarkThreadAsResolved,
  useThreads,
} from "@liveblocks/react/suspense"; // Suspense hook for threads :contentReference[oaicite:1]{index=1}
import { useUser } from "@liveblocks/react/suspense"; // Suspense hook for user info :contentReference[oaicite:2]{index=2}
import { useEditThreadMetadata } from "@liveblocks/react/suspense"; // Mutation hook for thread metadata :contentReference[oaicite:3]{index=3}

import { useMaxZIndex } from "@/lib/useMaxZIndex";
import { ThreadData } from "@liveblocks/client";
import { PinnedThread } from "./PinnedThread";
import { ThreadMetadata } from "@/liveblocks.config";
// Inline declaration of your custom thread metadata

type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
  maxZIndex: number;
};

export const CommentsOverlay = () => {
  /**
   * We're using the useThreads hook to get the list of threads
   * in the room.
   *
   * useThreads: https://liveblocks.io/docs/api-reference/liveblocks-react#useThreads
   */
  const { threads } = useThreads();

  // get the max z-index of a thread
  const maxZIndex = useMaxZIndex();

  return (
    <div>
      {threads
        .filter((thread) => !thread.resolved)
        .map((thread) => (
          <OverlayThread
            key={thread.id}
            thread={thread}
            maxZIndex={maxZIndex}
          />
        ))}
    </div>
  );
};

const OverlayThread = ({ thread, maxZIndex }: OverlayThreadProps) => {
  /**
   * We're using the useEditThreadMetadata hook to edit the metadata
   * of a thread.
   *
   * useEditThreadMetadata: https://liveblocks.io/docs/api-reference/liveblocks-react#useEditThreadMetadata
   */

  const markThreadAsResolved = useMarkThreadAsResolved();
  // const editThreadMetadata = useEditThreadMetadata();

  /**
   * We're using the useUser hook to get the user of the thread.
   *
   * useUser: https://liveblocks.io/docs/api-reference/liveblocks-react#useUser
   */
  const { isLoading } = useUser(thread.comments[0].userId);

  // We're using a ref to get the thread element to position it
  const threadRef = useRef<HTMLDivElement>(null);

  const handleResolvedChange = () => {
    markThreadAsResolved(thread.id);
  };
  console.log({ thread });
  // If other thread(s) above, increase z-index on last element updated
  const handleIncreaseZIndex = useCallback(() => {
    if (maxZIndex === thread.metadata.zIndex) {
      return;
    }

    // Update the z-index of the thread in the room
    // editThreadMetadata({
    //   threadId: thread.id,
    //   metadata: {
    //     zIndex: maxZIndex + 1,
    //   },
    // });
  }, [thread, maxZIndex]);

  if (isLoading) {
    return null;
  }

  return (
    <div
      ref={threadRef}
      id={`thread-${thread.id}`}
      className="absolute left-0 top-0 flex gap-5"
      style={{
        transform: `translate(${thread.metadata.x}px, ${thread.metadata.y}px)`,
      }}
    >
      {/* render the thread */}
      <PinnedThread
        key={thread.id}
        thread={thread}
        onFocus={handleIncreaseZIndex}
        onResolvedChange={handleResolvedChange}
      />
    </div>
  );
};
