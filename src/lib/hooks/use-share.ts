export function useShare() {
  const share = ({ text, url }: { text: string; url: string }) => {
    const full = `${text}\n${url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(full)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return { share }
}
