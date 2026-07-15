import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  icon,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type

  return (
    <div className="mb-4">

      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">

        {/* Left Icon */}

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
          {icon}
        </div>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 
          bg-slate-900/60 py-3 pl-12 pr-12 text-white outline-none 
          backdrop-blur-md transition-all duration-300 
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
        />

        {/* Password Toggle */}

        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        )}

      </div>

    </div>
  )
}

export default AuthInput