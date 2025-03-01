import { useRef, useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Loading_Img from './assets/loading.gif';
import { VscRobot } from 'react-icons/vsc';
import { IoSend } from 'react-icons/io5';

function App() {
	const [inputText, setInputText] = useState('');
	const [fromLanguage, setFromLanguage] = useState('english');
	const [toLanguage, setToLanguage] = useState('english');
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const chatEndRef = useRef(null);

	const genAI = new GoogleGenerativeAI(process.env.API_KEY);

	const languages = [
		{ value: 'english', label: 'English' },
		{ value: 'hindi', label: 'Hindi' },
		{ value: 'kannada', label: 'Kannada' },
		{ value: 'tamil', label: 'Tamil' },
		{ value: 'malayalam', label: 'Malayalam' },
	];

	// Knowledge base with structured information
	const knowledgeBase = {
		general: [
			"Welcome to Snehajyothi Children's Home Charitable Trust, Kumbalgodu.",
			'We provide care, education, and support to children in need.',
		],
		children: [
			'This is a home for around 30 children currently.',
			'Most of the children residing there have at least one parent.',
			'The age groups are from 5-18.',
		],
		branches: [
			'There are around 3 branches of this charitable trust.',
			'Here at Kumbalgodu the orphanage is only for girls.',
			'The other two branches handle only boys.',
		],
		management: [
			'The owner of this charitable trust of all the 3 branches is Sri T.G Murthy.',
			'Leelamma is coordinator of the orphanage here at Kumbalgodu for girls.',
		],
	};

	// Keywords to map to knowledge base categories
	const keywords = {
		general: [
			'welcome',
			'introduction',
			'about',
			'what is',
			'who are',
			'tell me about',
			'hello',
			'hi',
			'help',
		],
		children: [
			'children',
			'kids',
			'child',
			'how many',
			'number',
			'age',
			'old',
			'young',
			'parent',
			'orphan',
		],
		branches: [
			'branch',
			'location',
			'where',
			'place',
			'girl',
			'boy',
			'kumbalgodu',
		],
		management: [
			'owner',
			'manage',
			'run',
			'director',
			'coordinator',
			'leelamma',
			'murthy',
			'incharge',
			'who runs',
			'who manages',
		],
	};

	// Function to find relevant answers from knowledge base
	const getRelevantAnswer = (question) => {
		question = question.toLowerCase().trim();
		let relevantSections = [];

		// Check each category for relevant keywords
		for (const [category, keywordList] of Object.entries(keywords)) {
			for (const keyword of keywordList) {
				if (question.includes(keyword)) {
					relevantSections.push(category);
					break;
				}
			}
		}

		// If no matches found, return general information
		if (relevantSections.length === 0) {
			return knowledgeBase.general.join(' ');
		}

		// Remove duplicates and prepare response
		relevantSections = [...new Set(relevantSections)];
		let response = [];

		// Add relevant information from each matched category
		relevantSections.forEach((section) => {
			response = [...response, ...knowledgeBase[section]];
		});

		// If response is getting too long, limit it
		if (response.length > 3) {
			response = response.slice(0, 3);
		}

		return response.join(' ');
	};

	const translateText = async (text) => {
		try {
			if (fromLanguage === toLanguage) {
				return text; // No need to translate if languages are the same
			}

			const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
			// Clean, direct translation prompt without filler content
			const prompt = `Translate exactly this text from ${fromLanguage} to ${toLanguage} without adding any explanations, introductions, or notes: "${text}"`;

			const result = await model.generateContent(prompt);
			const response = result.response;
			return response.text().trim(); // Trim any extra whitespace
		} catch (error) {
			console.log('Translation error: ', error);
			return 'Translation failed. Please try again.';
		}
	};

	const processUserInput = async (userInput) => {
		// First, translate user input to English if not already in English
		let englishInput = userInput;
		if (fromLanguage !== 'english') {
			englishInput = await translateText(userInput);
		}

		// Get relevant answer from knowledge base
		const answer = getRelevantAnswer(englishInput);

		// Translate the answer to the target language if needed
		if (toLanguage !== 'english') {
			return await translateText(answer);
		}

		return answer;
	};

	const sendMessage = async () => {
		if (!inputText.trim()) return;

		setLoading(true);

		// Add user message to chat
		const userMessage = {
			text: inputText,
			isUser: true,
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputText('');

		// Add initial bot message with translating indicator
		const botMessageId = Date.now();
		const initialBotMessage = {
			id: botMessageId,
			text: 'Translating...',
			isUser: false,
			isTranslating: true,
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		setMessages((prev) => [...prev, initialBotMessage]);

		try {
			// Process the user input
			const response = await processUserInput(inputText);

			// Update the bot message with response
			setTimeout(() => {
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === botMessageId
							? { ...msg, text: response, isTranslating: false }
							: msg
					)
				);
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error('Error processing message:', error);

			// Update with error message
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === botMessageId
						? {
								...msg,
								text: "Sorry, I couldn't process your request. Please try again.",
								isTranslating: false,
						  }
						: msg
				)
			);

			setLoading(false);
		}
	};

	// Auto-scroll to bottom of chat
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Welcome message on first load
	useEffect(() => {
		const welcomeMsg =
			"Welcome to Snehajyothi Children's Home assistant. How can I help you today?";

		setMessages([
			{
				id: 'welcome',
				text: welcomeMsg,
				isUser: false,
				timestamp: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			},
		]);
	}, []);
	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='max-w-3xl w-full md:w-2/3 lg:w-1/2 mx-4 my-8 bg-white rounded-lg shadow-lg flex flex-col h-[80vh]'>
				<div className='p-4 bg-gray-800 text-white rounded-t-lg flex items-center justify-between'>
					<h1 className='text-xl font-bold flex items-center'>
						<VscRobot className='mr-2' size={24} />
						Snehajyothi Assistant
					</h1>
					<div className='flex items-center space-x-2'>
						<select
							className='bg-gray-700 border-none rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={toLanguage}
							onChange={(e) => setToLanguage(e.target.value)}
						>
							{languages.map((lang) => (
								<option key={`to-${lang.value}`} value={lang.value}>
									{lang.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
					{messages.map((message, index) => (
						<div
							key={index}
							className={`mb-4 flex ${
								message.isUser ? 'justify-end' : 'justify-start'
							}`}
						>
							<div
								className={`rounded-lg px-4 py-2 max-w-[70%] ${
									message.isUser
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 text-gray-800'
								}`}
							>
								{message.isTranslating ? (
									<div className='flex items-center'>
										<span className='mr-2'>Translating</span>
										<div className='w-4 h-4'>
											<img
												src={Loading_Img}
												alt='Translating'
												className='w-full h-full'
											/>
										</div>
									</div>
								) : (
									message.text
								)}
								<div
									className={`text-xs mt-1 ${
										message.isUser ? 'text-blue-100' : 'text-gray-500'
									}`}
								>
									{message.timestamp}
								</div>
							</div>
						</div>
					))}
					<div ref={chatEndRef} />
				</div>

				<div className='p-4 border-t border-gray-200 bg-white rounded-b-lg'>
					<div className='flex items-center'>
						<select
							className='border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
							value={fromLanguage}
							onChange={(e) => setFromLanguage(e.target.value)}
						>
							{languages.map((lang) => (
								<option key={`from-${lang.value}`} value={lang.value}>
									{lang.label}
								</option>
							))}
						</select>

						<input
							className='border-y border-r border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder='Type your message...'
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									sendMessage();
								}
							}}
							disabled={loading}
						/>

						<button
							className='bg-blue-500 text-white rounded-r-md p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
							onClick={sendMessage}
							disabled={loading}
						>
							{loading ? (
								<img src={Loading_Img} alt='Loading' className='w-6 h-6' />
							) : (
								<IoSend size={18} />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
