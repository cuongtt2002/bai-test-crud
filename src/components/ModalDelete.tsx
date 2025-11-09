type DeleteModalProps = {
  onConfirm: () => void;
  tableIdDelete: string;
  setTableIdDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function DeleteModal({
  onConfirm,
  tableIdDelete,
  setTableIdDelete,
  isOpen,
  onClose,
}: DeleteModalProps) {
  const handleCancel = () => {
    setTableIdDelete("");
    onClose();
  };

  if (!isOpen || tableIdDelete === "") return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this employee?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
