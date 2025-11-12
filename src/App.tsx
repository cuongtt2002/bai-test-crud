import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";
import DeleteModal from "@/components/ModalDelete";
import type { IEmployee } from "@/utils/employee";
import { initialData } from "@/utils/mockData";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [employees, setEmployees] = useState<IEmployee[]>(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : initialData;
  });
  const [tableIdEdit, setTableIdEdit] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tableIdDelete, setTableIdDelete] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    field: "name" | "address";
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
    if (
      (currentPage - 1) * itemsPerPage >= employees.length &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  }, [employees]);

  const handleToggleForm = () => setIsFormOpen((prev) => !prev);

  const handleEdit = (empId: string) => {
    setTableIdEdit(empId);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    try {
      if (!tableIdDelete) return;
      setEmployees((prev) => prev.filter((e) => e.id !== tableIdDelete));
      setTableIdDelete("");
      setIsDeleteModalOpen(false);
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handleSort = (field: "name" | "address") => {
    setSortConfig((prev) => {
      const direction =
        prev?.field === field && prev.direction === "asc" ? "desc" : "asc";
      setEmployees((prevList) =>
        [...prevList].sort((a, b) =>
          direction === "asc"
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field])
        )
      );
      setCurrentPage(1);
      return { field, direction };
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const employeesOnPage = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          Employee Management
        </h1>

        <div className="w-full max-w-6xl mb-6 flex justify-end">
          <button
            onClick={handleToggleForm}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 cursor-pointer transition-shadow shadow-md"
          >
            <Plus size={18} /> Add Employee
          </button>
        </div>

        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig?.field === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date of Birth
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Gender
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center gap-1">
                    Address
                    {sortConfig?.field === "address" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {employeesOnPage.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800 font-medium border-b border-gray-200">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                    {dayjs(emp.dateOfBirth).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                    {emp.gender}
                  </td>
                  <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                    {emp.address}
                  </td>
                  <td className="px-6 py-7 md:py-4 text-gray-700 border-b border-gray-200 flex flex-col justify-center items-center md:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(emp.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg transition-shadow shadow cursor-pointer"
                    >
                      <Pencil size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => {
                        setTableIdDelete(emp.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-shadow shadow cursor-pointer"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-center gap-2 my-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center px-3 h-8 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 h-8 rounded-md border text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center px-3 h-8 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <EmployeeForm
          id={tableIdEdit}
          setId={setTableIdEdit}
          isOpen={isFormOpen}
          onClose={handleToggleForm}
          employees={employees}
          setEmployees={setEmployees}
        />

        <DeleteModal
          onConfirm={handleDelete}
          tableIdDelete={tableIdDelete}
          setTableIdDelete={setTableIdDelete}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>

      <Toaster position="top-center" />
    </>
  );
}
