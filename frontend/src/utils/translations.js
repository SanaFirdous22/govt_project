export const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    backToSelection: 'Back to District Selection',
    selectedDistrict: 'Selected',

    // District Selection
    selectDistrict: 'Select Your District',
    selectDistrictDesc: 'Choose your district to view MGNREGA performance data',
    searchDistrict: 'Search districts...',
    useLocation: 'Use Location',
    locating: 'Locating...',
    select: 'Select',
    loading: 'Loading...',
    noDistrictsFound: 'No districts found matching your search',
    howToSelect: 'How to select your district:',
    instruction1: 'Click "Use Location" to auto-detect your district',
    instruction2: 'Or search and click on your district name',
    instruction3: 'Or scroll through the list to find your district',

    // Dashboard
    districtPerformance: 'District Performance Dashboard',
    keyMetrics: 'Key Metrics',
    comparison: 'Comparison & Trends',
    vsStateAverage: 'vs State Average',
    districtRankings: 'District Rankings',
    district: 'Your District',
    stateAverage: 'State Average',
    whatThisMeans: 'What This Means',
    whatToAsk: 'What to Ask Your Local Official',
    dataSource: 'Data sourced from data.gov.in MGNREGA API',
    lastUpdated: 'Last updated',

    // Metrics
    metrics: {
      personsWorked: 'Persons Provided Work',
      wagesPaid: 'Total Wages Paid',
      personDays: 'Total Person-Days',
      householdsWorked: 'Households Worked'
    },

    // Audio
    explain: 'Explain',
    stop: 'Stop',
    playAudio: 'Play audio explanation',
    stopAudio: 'Stop audio explanation',
    dashboardIntro: 'This dashboard shows MGNREGA performance for',
    metricsDesc: 'Here are the key metrics',
    districtSelected: 'District selected',
    whatMeans: 'These metrics show MGNREGA performance. Higher numbers mean more work opportunities. Compare with other districts to understand local performance.',
    questions: 'Ask your local official: Why are numbers different from neighbors? What steps to improve? How to get more work opportunities?',

    // Status
    online: 'Online',
    offline: 'Offline',
    showingLiveData: 'Showing live data',
    showingCachedData: 'Showing cached data from last update',
    vsLastMonth: 'vs last month',

    // Errors
    errors: {
      loadDistricts: 'Failed to load districts',
      geolocationNotSupported: 'Geolocation is not supported by this browser',
      geolocationDenied: 'Location access denied. Please allow location access or select district manually.',
      geolocationFailed: 'Could not determine your location',
      districtNotFound: 'District not found in our database',
      loadData: 'Failed to load district data',
      offline: 'You are currently offline. Showing cached data if available.',
      title: 'Error Loading Data',
      retry: 'Try Again'
    },

    // Meaning and Questions
    meaning1: 'These numbers show how well MGNREGA is working in your district. Higher numbers generally mean more people are getting work and wages.',
    meaning2: 'Compare these numbers with neighboring districts to see how your area is performing.',
    question1: 'Why are the numbers higher/lower than neighboring districts?',
    question2: 'What steps are being taken to improve MGNREGA implementation?',
    question3: 'How can more people in my village get MGNREGA work?'
  },

  hi: {
    // Navigation
    home: 'होम',
    about: 'हमारे बारे में',
    backToSelection: 'जिले के चयन पर वापस जाएं',
    selectedDistrict: 'चयनित',

    // District Selection
    selectDistrict: 'अपना जिला चुनें',
    selectDistrictDesc: 'एमजीएनआरईजीए प्रदर्शन डेटा देखने के लिए अपना जिला चुनें',
    searchDistrict: 'जिले खोजें...',
    useLocation: 'स्थान का उपयोग करें',
    locating: 'स्थान खोजा जा रहा है...',
    select: 'चुनें',
    loading: 'लोड हो रहा है...',
    noDistrictsFound: 'आपकी खोज से मेल खाने वाला कोई जिला नहीं मिला',
    howToSelect: 'अपना जिला कैसे चुनें:',
    instruction1: '"स्थान का उपयोग करें" पर क्लिक करके अपने जिले का ऑटो-डिटेक्ट करें',
    instruction2: 'या अपने जिले के नाम को खोजें और क्लिक करें',
    instruction3: 'या अपना जिला खोजने के लिए सूची स्क्रॉल करें',

    // Dashboard
    districtPerformance: 'जिला प्रदर्शन डैशबोर्ड',
    keyMetrics: 'मुख्य मीट्रिक',
    comparison: 'तुलना और रुझान',
    vsStateAverage: 'राज्य औसत के साथ तुलना',
    districtRankings: 'जिला रैंकिंग',
    district: 'आपका जिला',
    stateAverage: 'राज्य औसत',
    whatThisMeans: 'इसका क्या मतलब है',
    whatToAsk: 'अपने स्थानीय अधिकारी से क्या पूछें',
    dataSource: 'data.gov.in एमजीएनआरईजीए एपीआई से डेटा प्राप्त किया गया',
    lastUpdated: 'अंतिम अपडेट',

    // Metrics
    metrics: {
      personsWorked: 'काम देने वाले व्यक्ति',
      wagesPaid: 'कुल मजदूरी भुगतान',
      personDays: 'कुल व्यक्ति-दिन',
      householdsWorked: 'घरेलू काम किया'
    },

    // Audio
    explain: 'समझाएं',
    stop: 'रोकें',
    playAudio: 'ऑडियो स्पष्टीकरण चलाएं',
    stopAudio: 'ऑडियो स्पष्टीकरण रोकें',
    dashboardIntro: 'यह डैशबोर्ड एमजीएनआरईजीए प्रदर्शन दिखाता है',
    metricsDesc: 'यहाँ मुख्य मीट्रिक हैं',
    districtSelected: 'जिला चयनित',
    whatMeans: 'ये मीट्रिक एमजीएनआरईजीए प्रदर्शन दिखाते हैं। अधिक संख्या का मतलब अधिक काम के अवसर। स्थानीय प्रदर्शन समझने के लिए अन्य जिलों से तुलना करें।',
    questions: 'अपने स्थानीय अधिकारी से पूछें: पड़ोसियों से संख्या क्यों अलग हैं? सुधार के क्या कदम? और काम कैसे प्राप्त करें?',

    // Status
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    showingLiveData: 'लाइव डेटा दिखा रहा है',
    showingCachedData: 'अंतिम अपडेट से कैश्ड डेटा दिखा रहा है',
    vsLastMonth: 'पिछले महीने की तुलना में',

    // Errors
    errors: {
      loadDistricts: 'जिले लोड करने में विफल',
      geolocationNotSupported: 'इस ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है',
      geolocationDenied: 'स्थान पहुंच अस्वीकृत। कृपया स्थान पहुंच की अनुमति दें या मैन्युअल रूप से जिला चुनें।',
      geolocationFailed: 'आपका स्थान निर्धारित नहीं कर सका',
      districtNotFound: 'हमारे डेटाबेस में जिला नहीं मिला',
      loadData: 'जिला डेटा लोड करने में विफल',
      offline: 'आप वर्तमान में ऑफलाइन हैं। यदि उपलब्ध हो तो कैश्ड डेटा दिखा रहा है।',
      title: 'डेटा लोड करने में त्रुटि',
      retry: 'पुनः प्रयास करें'
    },

    // Meaning and Questions
    meaning1: 'ये संख्या दिखाती हैं कि आपके जिले में एमजीएनआरईजीए कितना अच्छा काम कर रहा है। उच्च संख्या आमतौर पर मतलब अधिक लोग काम और मजदूरी प्राप्त कर रहे हैं।',
    meaning2: 'अपने क्षेत्र के प्रदर्शन को देखने के लिए इन संख्याओं की पड़ोसी जिलों से तुलना करें।',
    question1: 'पड़ोसी जिलों की तुलना में संख्या अधिक/कम क्यों हैं?',
    question2: 'एमजीएनआरईजीए कार्यान्वयन में सुधार के लिए क्या कदम उठाए जा रहे हैं?',
    question3: 'मेरे गांव के और अधिक लोग एमजीएनआरईजीए काम कैसे प्राप्त कर सकते हैं?'
  }
};
