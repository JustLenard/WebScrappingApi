import { Spinner } from '@material-tailwind/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface Props {
	scrappedData: string | null
	loading: boolean
}

const JsonViewer: React.FC<Props> = ({ loading, scrappedData }) => {
	if (loading)
		return (
			<div className="flex justify-center mt-5 max-h-[80%] overflow-scroll mx-2">
				<Spinner className="h-12 w-12" />
			</div>
		)
	if (!scrappedData) return null
	return (
		<div className="flex justify-center mt-5 max-h-[80%] overflow-scroll mx-2">
			<SyntaxHighlighter style={dark} language="json" showLineNumbers>
				{scrappedData}
			</SyntaxHighlighter>
		</div>
	)
}

export default JsonViewer
