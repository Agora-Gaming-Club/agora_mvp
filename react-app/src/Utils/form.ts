// Define interfaces for the original and transformed error structures
interface OriginalError {
  [key: string]: Array<{ message: string; code: string }>;
}

export interface TransformedErrors {
  errors: { [key: string]: string };
}

// Function to transform the errors
export function transformErrors(originalErrors: any): TransformedErrors {
  const transformedErrors: TransformedErrors = { errors: {} };

  Object.keys(originalErrors).forEach((key) => {
    const message = originalErrors[key][0].message; // Assuming the structure remains the same
    transformedErrors.errors[key] = message;
  });

  return transformedErrors;
}
