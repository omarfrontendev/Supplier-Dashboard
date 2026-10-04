/**
 * Handing the browser a file it can save.
 *
 * Every "Download" in the portal - a remittance advice, a statement, the
 * version of a detail you once sent - ends here. A real PDF is a server's
 * job; what a browser can honestly produce on its own is the same content
 * as text, which is still the thing the supplier came for.
 */
export function downloadText(name: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
