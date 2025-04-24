import React from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useOthers } from "@liveblocks/react";

const Live = () => {
  const others = useOthers();

  return (
    <div>
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
