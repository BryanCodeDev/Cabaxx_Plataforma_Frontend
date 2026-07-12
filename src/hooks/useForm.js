import { useState, useCallback } from 'react';

export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setField(name, type === 'checkbox' ? checked : value);
    },
    [setField]
  );

  const submit = useCallback(
    async (e) => {
      e?.preventDefault();
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  return { values, errors, setErrors, setField, handleChange, submit, submitting };
}
