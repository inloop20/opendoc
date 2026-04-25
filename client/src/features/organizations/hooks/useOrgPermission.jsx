import { useEffect, useState } from "react";
import { orgApi } from "../services/orgApi";

export const useOrgPermissions = (orgId) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await orgApi.getOrgPermissions(orgId);
        setPermissions(res.data);
      }
       finally {
        setLoading(false);
      }
    };

    if (orgId) load();
  }, [orgId]);

  return { permissions, loading };
};