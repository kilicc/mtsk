/**
 * API utility functions with sube support
 */

/**
 * Get aktif sube ID from localStorage
 */
export function getAktifSubeId(): number | undefined {
  const savedSube = localStorage.getItem('aktifSube');
  if (savedSube) {
    try {
      const sube = JSON.parse(savedSube);
      return sube.id;
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Fetch with sube header
 */
export async function fetchWithSube(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const subeId = getAktifSubeId();
  
  const headers = {
    ...options.headers,
    ...(subeId && { 'x-sube-id': subeId.toString() }),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

