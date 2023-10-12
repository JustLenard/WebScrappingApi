import { PropsWithChildren, createContext, useState } from 'react'
import { ALL_OPTIONS } from '../utils/constants'
import { DesiredData, TransferListContext } from '../utils/types'

export const CheckboxMenuContext = createContext({} as TransferListContext)

const CheckboxMenuProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [checkedBoxes, setCheckedBoxes] = useState(new Set(ALL_OPTIONS))

	const checkBox = (item: DesiredData) => {
		setCheckedBoxes((prev) => prev.add(item))
	}

	const uncheckBox = (item: DesiredData) => {
		setCheckedBoxes((prev) => {
			prev.delete(item)
			return prev
		})
	}

	const values: TransferListContext = {
		checkedBoxes,
		uncheckBox,
		checkBox,
	}

	return <CheckboxMenuContext.Provider value={values}>{children}</CheckboxMenuContext.Provider>
}

export default CheckboxMenuProvider
