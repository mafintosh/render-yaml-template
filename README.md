# render-yaml-template

```
npm install -g render-yaml-template
```

## Usage

``` sh
render-yaml-template <input-dir> <output-dir>
```

Expects the input dir to contain a file, `config.yml` that has a series of template variables configures like so

```
variables:
  some-var-name:
    args:
      - "value-one"
      - "value-two"
  some-other-var:
    args:
      - "other-value-one"
      - "other-value-two"
  ...
```

For each argument specified it will render the input dir (i.e. replace `{{some-var-value}}` with the arg on each row).

For example, using the above config it will output two directories. One to `<outdir-dir>/0` and one to `<output-dir>/1`.

The first one will be rendered using `some-var-name: value-one` and `some-other-var: other-value-one` and the other
using the other two variables.

## License

MIT
