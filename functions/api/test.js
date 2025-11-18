export async function onRequestGet(event) {
  return new Response(event.request.headers);
}
