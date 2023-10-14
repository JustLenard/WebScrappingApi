import { useState } from 'react'
import { appAxios } from './axios/axios'
import JsonViewer from './components/JsonViewer'
import MenuWithCheckbox from './components/Menu'
import { useCheckboxesContext } from './hooks/customHooks'
import { SCRAPE_ROUTE } from './utils/constants'
import { PostData } from './utils/types'

const App: React.FC = () => {
	const [inputValue, setInputValue] = useState(SCRAPE_ROUTE)
	const { checkedBoxes } = useCheckboxesContext()
	const [scrappedData, setScrappedData] = useState<null | string>(null)
	const [loading, setLoading] = useState(false)

	const postData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// Prevent user from submitting multiple forms
		if (loading) return

		const postData: PostData = {
			dataPointsToScrape: Array.from(checkedBoxes),
			linkToScrape: inputValue,
		}
		try {
			setLoading(true)
			const res = await appAxios.post('/scrape', postData)

			console.log('This is res', res)
			setScrappedData(JSON.stringify(res.data, null, 2))
			setLoading(false)
		} catch (e) {
			setScrappedData('Hmmm, something went wrong. Try again later')
			setLoading(false)
		}
	}

	return (
		<div className="w-full h-[100vh]">
			<div className="flex justify-center h-[15%] ">
				<div className="flex gap-1 items-end">
					<form onSubmit={postData} className="h-[fill-content]">
						<div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem] lg:w-[500px]">
							<input
								type="text"
								className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 "
								placeholder=""
								required
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
							<button
								className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
								type="submit"
								data-ripple-light="true"
							>
								Scrape!
							</button>

							<label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
								Website link
							</label>
						</div>
					</form>
					<MenuWithCheckbox />
				</div>
			</div>
			<JsonViewer scrappedData={scrappedData} loading={loading} />
		</div>
	)
}

export default App
