import { useRef, useState, useEffect } from 'react';
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

	const languages = [
		{ value: 'english', label: 'English' },
		{ value: 'hindi', label: 'Hindi' },
		{ value: 'kannada', label: 'Kannada' },
		{ value: 'tamil', label: 'Tamil' },
		{ value: 'malayalam', label: 'Malayalam' },
	];

	// Pre-translated knowledge base for all supported languages
	const translatedKnowledgeBase = {
		english: {
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
		},
		hindi: {
			general: [
				'स्नेहज्योति चिल्ड्रन होम चैरिटेबल ट्रस्ट, कुम्बलगोडू में आपका स्वागत है।',
				'हम जरूरतमंद बच्चों को देखभाल, शिक्षा और समर्थन प्रदान करते हैं।',
			],
			children: [
				'यहां वर्तमान में लगभग 30 बच्चे रहते हैं।',
				'यहां रहने वाले अधिकांश बच्चों के कम से कम एक माता-पिता हैं।',
				'उम्र समूह 5-18 वर्ष के हैं।',
			],
			branches: [
				'इस चैरिटेबल ट्रस्ट की लगभग 3 शाखाएं हैं।',
				'यहां कुम्बलगोडू में अनाथालय केवल लड़कियों के लिए है।',
				'अन्य दो शाखाएं केवल लड़कों के लिए हैं।',
			],
			management: [
				'इस चैरिटेबल ट्रस्ट के सभी 3 शाखाओं के मालिक श्री टी.जी. मूर्ति हैं।',
				'लीलम्मा यहां कुम्बलगोडू में लड़कियों के लिए अनाथालय की समन्वयक हैं।',
			],
		},
		kannada: {
			general: [
				'ಸ್ನೇಹಜ್ಯೋತಿ ಮಕ್ಕಳ ಹೋಮ್ ಚಾರಿಟೆಬಲ್ ಟ್ರಸ್ಟ್, ಕುಂಬಳಗೋಡುಗೆ ಸ್ವಾಗತ.',
				'ನಾವು ಅಗತ್ಯವಿರುವ ಮಕ್ಕಳಿಗೆ ಕಾಳಜಿ, ಶಿಕ್ಷಣ ಮತ್ತು ಬೆಂಬಲವನ್ನು ನೀಡುತ್ತೇವೆ.',
			],
			children: [
				'ಇದು ಪ್ರಸ್ತುತ ಸುಮಾರು 30 ಮಕ್ಕಳಿಗೆ ಮನೆಯಾಗಿದೆ.',
				'ಇಲ್ಲಿ ವಾಸಿಸುವ ಹೆಚ್ಚಿನ ಮಕ್ಕಳಿಗೆ ಕನಿಷ್ಠ ಒಬ್ಬ ಪೋಷಕರಿದ್ದಾರೆ.',
				'ವಯಸ್ಸಿನ ಗುಂಪುಗಳು 5-18 ವರ್ಷದವರೆಗೆ ಇವೆ.',
			],
			branches: [
				'ಈ ಚಾರಿಟೆಬಲ್ ಟ್ರಸ್ಟ್ನ ಸುಮಾರು 3 ಶಾಖೆಗಳಿವೆ.',
				'ಇಲ್ಲಿ ಕುಂಬಳಗೋಡುನಲ್ಲಿ ಅನಾಥಾಶ್ರಮ ಕೇವಲ ಹುಡುಗಿಯರಿಗೆ ಮಾತ್ರ.',
				'ಇತರ ಎರಡು ಶಾಖೆಗಳು ಕೇವಲ ಹುಡುಗರಿಗೆ ಮಾತ್ರ.',
			],
			management: [
				'ಈ ಚಾರಿಟೆಬಲ್ ಟ್ರಸ್ಟ್ನ ಎಲ್ಲಾ 3 ಶಾಖೆಗಳ ಮಾಲೀಕರು ಶ್ರೀ ಟಿ.ಜಿ. ಮೂರ್ತಿ.',
				'ಲೀಲಮ್ಮ ಇಲ್ಲಿ ಕುಂಬಳಗೋಡುನಲ್ಲಿ ಹುಡುಗಿಯರಿಗೆ ಅನಾಥಾಶ್ರಮದ ಸಂಯೋಜಕರು.',
			],
		},
		tamil: {
			general: [
				'ஸ்னேஹஜ்யோதி குழந்தைகள் இல்லம் சரித்திர நம்பிக்கை, கும்பல்கோடு வரவேற்கிறோம்.',
				'நாங்கள் தேவைப்படும் குழந்தைகளுக்கு பராமரிப்பு, கல்வி மற்றும் ஆதரவை வழங்குகிறோம்.',
			],
			children: [
				'இது தற்போது சுமார் 30 குழந்தைகளுக்கு ஒரு வீடு.',
				'இங்கு வசிக்கும் பெரும்பாலான குழந்தைகளுக்கு குறைந்தது ஒரு பெற்றோர் இருக்கிறார்கள்.',
				'வயது குழுக்கள் 5-18 வரை உள்ளன.',
			],
			branches: [
				'இந்த சரித்திர நம்பிக்கையின் சுமார் 3 கிளைகள் உள்ளன.',
				'இங்கு கும்பல்கோடுவில் அனாதை இல்லம் பெண்களுக்கு மட்டுமே.',
				'மற்ற இரண்டு கிளைகள் சிறுவர்களுக்கு மட்டுமே.',
			],
			management: [
				'இந்த சரித்திர நம்பிக்கையின் அனைத்து 3 கிளைகளின் உரிமையாளர் திரு டி.ஜி. மூர்த்தி.',
				'லீலம்மா இங்கு கும்பல்கோடுவில் பெண்களுக்கான அனாதை இல்லத்தின் ஒருங்கிணைப்பாளர்.',
			],
		},
		malayalam: {
			general: [
				'സ്നേഹജ്യോതി ചിൽഡ്രൻസ് ഹോം ചാരിറ്റബിൾ ട്രസ്റ്റ്, കുംബളഗോഡുവിലേക്ക് സ്വാഗതം.',
				'ഞങ്ങൾ ആവശ്യമുള്ള കുട്ടികൾക്ക് പരിചരണം, വിദ്യാഭ്യാസം, പിന്തുണ എന്നിവ നൽകുന്നു.',
			],
			children: [
				'ഇത് ഇപ്പോൾ ഏകദേശം 30 കുട്ടികൾക്ക് ഒരു വീടാണ്.',
				'ഇവിടെ താമസിക്കുന്ന മിക്ക കുട്ടികൾക്കും ഒരു രക്ഷിതാവെങ്കിലും ഉണ്ട്.',
				'പ്രായം 5-18 വയസ്സ് വരെയാണ്.',
			],
			branches: [
				'ഈ ചാരിറ്റബിൾ ട്രസ്റ്റിന് ഏകദേശം 3 ശാഖകളുണ്ട്.',
				'ഇവിടെ കുംബളഗോഡുവിൽ അനാഥാലയം പെൺകുട്ടികൾക്ക് മാത്രം.',
				'മറ്റ് രണ്ട് ശാഖകൾ ആൺകുട്ടികൾക്ക് മാത്രം.',
			],
			management: [
				'ഈ ചാരിറ്റബിൾ ട്രസ്റ്റിന്റെ മൂന്ന് ശാഖകളുടെ ഉടമ ശ്രീ ടി.ജി. മൂർത്തി.',
				'ലീലമ്മ ഇവിടെ കുംബളഗോഡുവിൽ പെൺകുട്ടികൾക്കുള്ള അനാഥാലയത്തിന്റെ ഏകോപകരണക്കാരിയാണ്.',
			],
		},
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
	const getRelevantAnswer = (question, language) => {
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
			return translatedKnowledgeBase[language].general.join(' ');
		}

		// Remove duplicates and prepare response
		relevantSections = [...new Set(relevantSections)];
		let response = [];

		// Add relevant information from each matched category
		relevantSections.forEach((section) => {
			response = [...response, ...translatedKnowledgeBase[language][section]];
		});

		// If response is getting too long, limit it
		if (response.length > 3) {
			response = response.slice(0, 3);
		}

		return response.join(' ');
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
			text: 'Processing...',
			isUser: false,
			isTranslating: false,
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		setMessages((prev) => [...prev, initialBotMessage]);

		try {
			// Get relevant answer from knowledge base in the user's preferred language
			const response = getRelevantAnswer(inputText, toLanguage);

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
