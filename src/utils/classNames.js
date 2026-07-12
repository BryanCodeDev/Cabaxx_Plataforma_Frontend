// Une clases condicionalmente, filtrando valores falsy.
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
