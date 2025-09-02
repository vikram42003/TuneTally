interface StatsPageErrorComponentProps {
  componentName?: string;
  errorText?: string
}

const StatsPageErrorComponent = ({ componentName = "this component", errorText = "Something went wrong, please try logging in again" }: StatsPageErrorComponentProps) => {
  return (
    <div className="bg-gray-800 rounded text-center p-10 my-5">
      <span className="text-spotify-green font-semibold">
        Could not load {componentName + " :("}
      </span>

      <br />
      {errorText}
    </div>
  )
}

export default StatsPageErrorComponent