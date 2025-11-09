import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { IEmployee } from "@/utils/employee";
import InputField from "./InputField";
import { validateEmployeeForm } from "@/utils/validate";

type EmployeeFormProps = {
  id: string;
  setId: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  employees: IEmployee[];
  setEmployees: React.Dispatch<React.SetStateAction<IEmployee[]>>;
};

const defaultFormValues: IEmployee = {
  id: "",
  name: "",
  dateOfBirth: "",
  gender: "Male",
  email: "",
  address: "",
};

export default function EmployeeForm({
  id,
  setId,
  isOpen,
  onClose,
  employees,
  setEmployees,
}: EmployeeFormProps) {
  const [form, setForm] = useState<IEmployee>(defaultFormValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof IEmployee, string>>
  >({});
  const [formState, setFormState] = useState({ isDirty: false });
  const [initialFormValues, setInitialFormValues] =
    useState<IEmployee>(defaultFormValues);

  useEffect(() => {
    if (id !== "") {
      const existing = employees.find((e) => e.id === id) || defaultFormValues;
      setForm(existing);
      setInitialFormValues(existing);
    } else {
      setForm(defaultFormValues);
      setInitialFormValues(defaultFormValues);
    }
    setErrors({});
    setFormState({ isDirty: false });
  }, [id, employees]);

  useEffect(() => {
    const dirty = (Object.keys(form) as (keyof IEmployee)[]).some(
      (key) => form[key] !== initialFormValues[key]
    );
    setFormState({ isDirty: dirty });
  }, [form, initialFormValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValue(name as keyof IEmployee, value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setValue = (field: keyof IEmployee, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(defaultFormValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateEmployeeForm(form);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const employee: IEmployee = {
      ...form,
      id:
        id !== ""
          ? id
          : employees.length
          ? (Math.max(...employees.map((e) => Number(e.id))) + 1).toString()
          : "1",
    };

    setEmployees((prev) =>
      id !== ""
        ? prev.map((e) => (e.id === id ? employee : e))
        : [employee, ...prev]
    );

    handleCloseModal();
  };

  const handleCloseModal = () => {
    resetForm();
    setErrors({});
    setId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl p-6 relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          {id !== "" ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter Name"
          />

          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <InputField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            error={errors.gender}
            options={["Male", "Female"]}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter Email"
          />

          <InputField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Enter Address"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={id ? !formState.isDirty : false}
              className="bg-blue-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {id !== "" ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
