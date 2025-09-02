interface ErrorNotificationProps {
  text: string | null;
}

// We only need to show the error component in Homepage, other components have their own error handling components
// So no need to make it a custom hook with reducer/context
const ErrorNotification = ({ text }: ErrorNotificationProps) => {
  if (!text) return;

  return (
    <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-red-600 p-2 px-4 text-sm transition-all duration-500">
      {text}
    </div>
  );
};

export default ErrorNotification;
