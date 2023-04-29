import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const useUserId = () => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const idFromStorage = sessionStorage.getItem("userId");
    if (!idFromStorage?.length) {
      const generatedId = nanoid();
      sessionStorage.setItem("userId", generatedId);
      setId(generatedId);
    } else {
      setId(idFromStorage);
    }
  }, []);

  return id;
};
