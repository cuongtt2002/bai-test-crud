import type { IEmployee } from "./employee";

const requiredFields = [
  "name",
  "dateOfBirth",
  "gender",
  "email",
  "address",
] as const;

export const validateEmployeeForm = (form: Partial<IEmployee>) => {
  return requiredFields.reduce((acc, field) => {
    if (!form[field]) {
      acc[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
    return acc;
  }, {} as Partial<Record<keyof IEmployee, string>>);
};
