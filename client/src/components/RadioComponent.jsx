import PropTypes from "prop-types"

function RadioComponent({ options, name, value, onChange }) {
    return (
        <div>
            <div className="pt-2 flex justify-between w-full">{name}</div>
            <div role="group" className="pl-4 pt-2 text-base font-normal">
                {
                    options.map((option, i) => (
                        <div key={i}>
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={String(option.value) === value}
                                onChange={onChange}
                            />
                            <label className="pl-2">{option.label}</label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

RadioComponent.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default RadioComponent