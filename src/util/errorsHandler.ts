export function handleValidationErrors(errors: any[]) {
  let nError = {};
  errors.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      nError = { ...nError, [key]: obj[key] };
    });
  });
  return nError;
}
