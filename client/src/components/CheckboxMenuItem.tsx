import { Checkbox, MenuItem } from '@material-tailwind/react'
import { CheckboxMenuItemType } from '../utils/types'
import { useState } from 'react'
import { useCheckboxesContext } from '../hooks/customHooks'

const CheckboxMenuItem: React.FC<CheckboxMenuItemType> = ({ label, value }) => {
	const { checkedBoxes, checkBox, uncheckBox } = useCheckboxesContext()

	const [checked, handleChecked] = useState(checkedBoxes.has(value))

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.checked ? checkBox(value) : uncheckBox(value)
		handleChecked(e.target.checked)
	}

	return (
		<MenuItem className="p-0">
			<label htmlFor="item-1" className="flex cursor-pointer items-center gap-2 p-2">
				<Checkbox
					ripple={false}
					id="item-1"
					containerProps={{ className: 'p-0' }}
					className="hover:before:content-none"
					crossOrigin={undefined}
					checked={checked}
					onChange={handleChange}
				/>
				{label}
			</label>
		</MenuItem>
	)
}

export default CheckboxMenuItem
