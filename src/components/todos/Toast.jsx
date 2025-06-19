export const Toast = ({ toast, onClose }) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <AlertCircle className="w-5 h-5 text-red-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />
    };
  
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
  
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${colors[toast.type]} animate-slide-in`}>
        <div className="flex items-center gap-3">
          {icons[toast.type]}
          <span className="font-medium">{toast.message}</span>
          <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };