interface StatsPageErrorComponentPropTypes {
  errorText?: string
}

const StatsPageErrorComponent = ({ errorText = "Something went wrong, please try logging in again" }: StatsPageErrorComponentPropTypes) => {
  return (
    <div>{errorText}</div>
  )
}

export default StatsPageErrorComponent