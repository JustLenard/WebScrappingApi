import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CardData } from '../utils/types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface Props {
	scrappedData: CardData[] | null
}

const JsonViewer: React.FC<Props> = ({ scrappedData }) => {
	if (!scrappedData) return null
	return (
		<div className="flex justify-center mt-5 max-h-[80%] overflow-scroll mx-2">
			<SyntaxHighlighter style={dark} language="json" showLineNumbers>
				{JSON.stringify(scrappedData, null, 2)}
			</SyntaxHighlighter>
		</div>
	)
}

export default JsonViewer
