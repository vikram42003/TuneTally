interface StatsPageErrorComponentProps {
  componentName?: string;
  errorText?: string
}

const StatsPageErrorComponent = ({ componentName = "this component", errorText = "Something went wrong, please try logging in again" }: StatsPageErrorComponentProps) => {
  return (
    <div>
      <div>
        Could not load {componentName + " :("}
      </div>
      {errorText}
    </div>
  )
}

export default StatsPageErrorComponent