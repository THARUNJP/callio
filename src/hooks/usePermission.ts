import { useEffect, useState } from "react";

export default function UsePermission(perm: PermissionName) {
  const [state, setState] = useState<PermissionState>("prompt");

  useEffect(() => {
    navigator.permissions.query({ name: perm }).then((result) => {
      setState(result.state);

      result.onchange = () => {
        setState(result.state);
      };
    });
  }, []);

  return state;
}
