import {
	Checkbox,
	IconButton,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
} from '@material-tailwind/react'
import CliplboardIcon from '../icons/Cliplboard'
import { ALL_OPTIONS } from '../utils/constants'
import { CheckboxMenuItemType } from '../utils/types'
import CheckboxMenuItem from './CheckboxMenuItem'

const menuItems: CheckboxMenuItemType[] = ALL_OPTIONS.map((item) => ({
	value: item,
	label: item,
}))

const MenuWithCheckbox = () => {
	return (
		<Menu
			dismiss={{
				itemPress: false,
			}}
		>
			<MenuHandler>
				<IconButton variant="gradient">
					<CliplboardIcon />
				</IconButton>
			</MenuHandler>
			<MenuList>
				{menuItems.map((item) => (
					<MenuItem className="p-0" key={item.value}>
						<CheckboxMenuItem value={item.value} label={item.label} />
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	)
}

export default MenuWithCheckbox
