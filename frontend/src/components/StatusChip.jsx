import PropTypes from 'prop-types'

function StatusChip({ status }) {

  const statusColorMap = {
    'active': 'bg-green-500/20 text-green-900',
    'blocked' : 'bg-red-500/20 text-red-900',
    'pending':'bg-yellow-500/20 text-yellow-900',
    'success': 'bg-green-500/20 text-green-900'
  }

  return (
    <div className={`px-2 py-1 ${statusColorMap[status]} font-semibold select-none whitespace-nowrap uppercase w-fit rounded-full text-xs`} >
      {status}
    </div>
  )
}

StatusChip.propTypes = {
  status: PropTypes.string
}

export default StatusChip