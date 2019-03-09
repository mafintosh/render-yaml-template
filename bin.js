#!/usr/bin/env node

const yaml = require('yaml')
const tar = require('tar-fs')
const tree = require('fs-tree-iterator')
const fs = require('fs')
const path = require('path')
const format = require('streaming-format')

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) {
  console.error('Usage: render-yaml-template <input-dir> <output-dir>')
  process.exit(1)
}

const ite = tree(input)

ite.next(function loop (err, node) {
  if (err) throw err
  if (!node) throw new Error('config.yml not found')

  if (node.path.endsWith('config.yml')) {
    const { variables } = yaml.parse(fs.readFileSync(node.path, 'utf-8'))
    const perms = permutations(variables)
    perms.forEach(render)
    return
  }

  ite.next(loop)
})

function render (vars, i) {
  const out = path.join(output, '' + i)
  console.log('Outputting variable permutation ' + i + ' to ' + out)
  tar.pack(input).pipe(tar.extract(out, { mapStream, map }))

  function mapStream (stream, header) {
    if (/(^|\\|\/)\.git($|\\|\/)/.test(header.name)) return stream
    return stream.pipe(format((name) => vars[name] || `{{${name}}}`))
  }

  function map (header) {
    header.name = header.name.replace(/\{\{([^}]+)\}\}/, (input, name) => vars[name] || input)
    return header
  }
}

function permutations (vars) {
  const names = Object.keys(vars)
  if (!names.length) return []

  const res = [ ]
  const cnt = vars[names[0]].args.length

  for (let i = 0; i < cnt; i++) {
    const entry = {}

    for (const name of names) {
      entry[name] = vars[name].args[i]
    }

    res.push(entry)
  }

  return res
}
