/**
 * Converts plain-text URLs in HTML content into clickable <a> tags.
 * Runs on stored post content before rendering.
 */
export function linkifyContent(html: string): string {
  if (!html) return html
  
  // URL regex - matches http/https URLs not already inside an href or tag
  const urlRegex = /(?<![="'>])(https?:\/\/[^\s<>"')\]]+)/g
  
  // Process text nodes only (not inside existing tags)
  return html.replace(/>([^<]+)</g, (match, textContent) => {
    const linked = textContent.replace(urlRegex, (url: string) => {
      // Clean trailing punctuation
      const clean = url.replace(/[.,;:!?)'"\]]+$/, '')
      const trailing = url.slice(clean.length)
      return `<a href="${clean}" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline cursor-pointer hover:text-brand-800">${clean}</a>${trailing}`
    })
    return `>${linked}<`
  })
}
