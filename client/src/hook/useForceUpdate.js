import { useState } from "react";

export const useForceUpdate = () => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  return [shouldUpdate, () => setShouldUpdate((prev) => !prev)];
};
