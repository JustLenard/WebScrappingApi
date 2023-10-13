import { Checkbox } from '@material-tailwind/react'
import { useState } from 'react'
import { useCheckboxesContext } from '../hooks/customHooks'
import { CheckboxMenuItemType } from '../utils/types'

const CheckboxMenuItem: React.FC<CheckboxMenuItemType> = ({ label, value }) => {
	const { checkedBoxes, checkBox, uncheckBox } = useCheckboxesContext()

	const [checked, handleChecked] = useState(checkedBoxes.has(value))

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.checked ? checkBox(value) : uncheckBox(value)
		handleChecked(e.target.checked)
	}

	return (
		<label htmlFor={value} className="flex cursor-pointer items-center gap-2 p-2">
			<Checkbox
				ripple={false}
				id={value}
				containerProps={{ className: 'p-0' }}
				className="hover:before:content-none"
				crossOrigin={undefined}
				checked={checked}
				onChange={handleChange}
			/>
			{label}
		</label>
	)
}

export default CheckboxMenuItem
