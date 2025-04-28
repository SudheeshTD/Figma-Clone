"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/Loader";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
      resolveUsers={async ({ userIds }) => {
        return userIds.map((id) => ({
          name: `User-${id.slice(-4)}`, // e.g. "User-0Ox2"
          avatar: `https://liveblocks.io/avatars/avatar-${Math.floor(
            Math.random() * 30
          )}.png`,
        }));
      }}
    >
      <RoomProvider
        id="my-room"
        initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
        initialStorage={{
          canvasObjects: new LiveMap(),
        }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
