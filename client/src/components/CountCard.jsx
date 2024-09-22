import PropTypes from 'prop-types'

function CountCard({ title, count, Icon }) {
    return (
        <div className="px-10 py-4 rounded-lg border border-neutral-200 bg-neutral-100 shadow-lg">
            <div className="flex items-center gap-4">
                <Icon size={30} />
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold">{count}</p>
                </div>
            </div>
        </div>
    )
}

CountCard.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    Icon: PropTypes.elementType
}
export default CountCard