import PropTypes from 'prop-types'

function StatusChip({ status }) {

  const statusColorMap = {
    'active': 'bg-green-500/20 text-green-900',
    'blocked': 'bg-red-500/20 text-red-900',
    'pending': 'bg-yellow-500/20 text-yellow-900',
    'success': 'bg-green-600/20 text-green-800',
    'failed': 'bg-red-600/20 text-red-800',
    'confirmed': 'bg-yellow-600/20 text-yellow-800',
    'delivered': 'bg-green-500/20 text-green-900',
    'cancelled': 'bg-gray-700/20 text-gray-800'
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