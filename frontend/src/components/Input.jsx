export default function Input({ label, ...rest }) {
  return (
    <div className="flex flex-col mb-3">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
        {...rest}
      />
    </div>
  );
}
    