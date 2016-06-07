'use babel'

export default function escape (s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
