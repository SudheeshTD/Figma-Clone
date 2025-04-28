import { useOthers, useSelf } from "@liveblocks/react";

import { generateRandomName } from "@/lib/utils";
import { useMemo } from "react";
import { Avatar } from "./Avatar";

const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  const memoizedUsers = useMemo(() => {
    return (
      <div className="flex items-center justify-center gap-1 py-2 pt-7">
        {currentUser && (
          //   <div className="relative ml-8 first:ml-0">
          <Avatar name="You" otherStyles="border-[3px] border-green" />
          //   </div>
        )}

        {users.slice(0, 3).map(({ connectionId }) => {
          return (
            <Avatar
              key={connectionId}
              name={generateRandomName()}
              otherStyles="-ml-3"
            />
          );
        })}

        {hasMoreUsers && (
          <div className="z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-black">
            {users.length - 3}
          </div>
        )}
      </div>
    );
  }, [users.length]);

  return memoizedUsers;
};

export default ActiveUsers;
