import PropTypes from 'prop-types'

function StatusChip({ status }) {

  const statusColorMap = {
    'active': 'bg-green-300'
  }

  return (
    <div className={`px-2 py-1 ${statusColorMap[status]} w-fit text-black rounded-lg bg-opacity-50 text-sm`} >
      {status}
    </div>
  )
}

StatusChip.propTypes = {
  status: PropTypes.string
}

export default StatusChip