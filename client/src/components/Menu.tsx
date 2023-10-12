import { Button, Menu, MenuHandler, MenuList } from '@material-tailwind/react'
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
				<Button>Open Menu</Button>
			</MenuHandler>
			<MenuList>
				{menuItems.map((item) => (
					<CheckboxMenuItem key={item.value} {...item} />
				))}
			</MenuList>
		</Menu>
	)
}

export default MenuWithCheckbox
