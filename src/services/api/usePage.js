import { useState, useEffect } from "react";
import { axiosInstance } from "./index";
export default function usePage(url, page = 1, size = 1, name = "", revision = 0, tagId = "", categoryId = "") {
  const [result, setResult] = useState(null);
  const key = JSON.stringify([url, page, size, name, revision, tagId, categoryId]);
  useEffect(() => {
    const controller = new AbortController();
    axiosInstance.get(url, { params: { pageNumber: page, pageSize: size, name: name || undefined, tagId: tagId || undefined, categoryId: categoryId || undefined }, signal: controller.signal })
      .then(({ data }) => setResult({ key, data }))
      .catch(() => { if (!controller.signal.aborted) setResult({ key, error: true }); });
    return () => controller.abort();
  }, [url, page, size, name, key, tagId, categoryId]);
  return result?.key === key ? result : {};
}

