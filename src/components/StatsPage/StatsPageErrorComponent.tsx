interface StatsPageErrorComponentProps {
  errorText?: string
}

const StatsPageErrorComponent = ({ errorText = "Something went wrong, please try logging in again" }: StatsPageErrorComponentProps) => {
  return (
    <div>{errorText}</div>
  )
}

export default StatsPageErrorComponent