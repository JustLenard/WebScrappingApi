import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ThemeProvider } from '@material-tailwind/react'
import CheckboxMenuProvider from './context/CheckboxContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<CheckboxMenuProvider>
				<App />
			</CheckboxMenuProvider>
		</ThemeProvider>
	</React.StrictMode>
)
