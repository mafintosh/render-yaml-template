const yaml = require('yaml')

module.exports = parse

function parse (src) {
  const p = yaml.parse(src)
  const entries = [ ]
  visit('', (p && p.variables) || {}, entries, null)
  return entries.length ? entries : [ {} ]
}

function visit (prefix, v, entries, res) {
  for (const key of Object.keys(v)) {
    const next = v[key]
    if (typeof next === 'object' && next) {
      if (next.factory) {
        for (const arg of next.args) {
          visit(prefix + key + '.', arg, entries, copy(res))
        }
      } else {
        visit(prefix + key + '.', next, entries, res)
      }
    } else {
      res = alloc(entries, res)
      res[prefix + key] = '' + next
    }
  }
}

function alloc (entries, res) {
  if (res) return res
  res = {}
  entries.push(res)
  return res
}

function copy (map) {
  if (!map) return null
  const c = {}
  for (const key of Object.keys(map)) c[key] = map[key]
  return c
}
