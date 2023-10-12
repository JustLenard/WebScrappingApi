import { useContext } from 'react'
import { CheckboxMenuContext } from '../context/CheckboxContext'

export const useCheckboxesContext = () => useContext(CheckboxMenuContext)
