import { useState } from 'react';
import { z } from 'zod';

interface UseFormValidationResult<T> {
  errors: Record<string, string>;
  validateForm: (data: T) => boolean;
  validateField: (field: keyof T, value: any) => boolean;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
}

export function useFormValidation<T extends z.ZodTypeAny>(schema: T): UseFormValidationResult<z.infer<T>> {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (data: z.infer<T>): boolean => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        const field = error.path.join('.');
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const validateField = (field: keyof z.infer<T>, value: any): boolean => {
    try {
      const fieldSchema = (schema as any)._def?.shape?.[field as string];
      if (!fieldSchema) return true;

      fieldSchema.parse(value);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.issues[0].message,
        }));
        return false;
      }
      return true;
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field: keyof z.infer<T>) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
  };
} 