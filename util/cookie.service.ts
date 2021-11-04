export default function cookieService(cookie: string | undefined): false | any {
  if (!cookie) return false;

  const json = JSON.parse(cookie);
  if (!json) return false;

  return json;
}