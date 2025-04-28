// Define Liveblocks types for your application

import { LiveMap } from "@liveblocks/client";
import { ReactionEvent } from "./types/type";
export type ThreadMetadata = {
  x: number;
  y: number;
  resolved: boolean;
  zIndex: number;
};

export type Presence = {
  cursor: { x: number; y: number } | null;
  message: string | null;
};

type RoomEvent = ReactionEvent;

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: Presence;

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
      canvasObjects: LiveMap<string, any>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
        name: string;
        avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: RoomEvent;
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: ThreadMetadata;
    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
