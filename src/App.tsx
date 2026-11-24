import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Customization from './Customization'
import {
  BOOKING_STORAGE_KEY,
  CHIMA_OPTIONS,
  HAIR_ACCESSORIES,
  HAIRSTYLES,
  JEOGORI_OPTIONS,
  NORIGAE_OPTIONS,
  RENTAL_PACKAGES,
  createGuestSelection,
  formatTime,
  getBookingEndMinute,
  getPackageTotal,
  getPaymentAmounts,
  getTimeSlots,
  isBookingRecord,
  localDateString,
  type BookingRecord,
  type ContactDetails,
  type DurationKey,
  type GuestSelection,
  type PackageId,
  type ServiceLanguage,
  type WardrobeOption,
} from './booking'
import './App.css'

const baseMessages = {
  en: {
    navHome: 'Home',
    navExperience: 'The experience',
    navVisit: 'Visit us',
    bookNow: 'Reserve a fitting',
    eyebrow: 'HANBOK RENTAL · SEOUL',
    heroTitle: 'A little Seoul,\\nstiched with joy.',
    heroText: 'Find your favorite colors, dress in a little Korean tradition, and make a memory that feels like yours.',
    explore: 'Plan your visit',
    serviceTag: 'A day to remember',
    serviceTitle: 'Your hanbok moment, made easy.',
    serviceText: 'Choose your date, look, and little finishing touches before you arrive. We’ll have your visit ready for you.',
    stepOne: 'Choose a session',
    stepOneText: 'Pick 1.5 hours, 3 hours, or a full day.',
    stepTwo: 'Make it yours',
    stepTwoText: 'Compare packages and choose the experience that suits you.',
    stepThree: 'Customize your look',
    stepThreeText: 'Choose your outfit after selecting a package.',
    visitEyebrow: 'FIND US IN SEOUL',
    visitTitle: 'A little more time for the good parts.',
    visitText: 'Reserve ahead, skip the fitting-room wait, and spend more of your day making memories.',
    hours: 'OPEN EVERY DAY',
    hourRange: '9:00 AM – 7:00 PM',
    addressLabel: 'OUR NEIGHBORHOOD',
    address: 'Seoul, South Korea',
    addressNote: 'Exact venue address can be added here.',
    footerText: 'Hanbok rental shop · Seoul, South Korea',
    bookYourVisit: 'Book your visit',
    language: 'Language',
    bookingTitle: 'Let’s plan your visit',
    bookingIntro: 'A few thoughtful choices now, and more time to enjoy Seoul later.',
    stepLabel: ['Date & time', 'Package', 'Details & payment'],
    durationTitle: 'How long would you like to explore?',
    durations: {
      short: { title: 'Little escape', duration: '1.5 hours', note: 'A lovely first look' },
      long: { title: 'Slow afternoon', duration: '3 hours', note: 'Time to wander and explore' },
      day: { title: 'Full day', duration: 'Start before 4 PM · Return by 7 PM', note: 'Choose your start time' },
    },
    visitDate: 'Visit date',
    numberGuests: 'How many guests?',
    guests: 'guests',
    availableTimes: 'Choose a start time',
    timesHint: 'Start times are offered every 30 minutes.',
    noTimes: 'No times fit this selection. Try another date or session length.',
    spotsLeft: 'spots left',
    unavailable: 'Full',
    continue: 'Continue',
    back: 'Back',
    packageTitle: 'Choose your rental package',
    packageHint: 'Illustrative prices per guest. Your package total stays fixed while you customize.',
    packagePrice: 'per guest',
    included: 'Included',
    packageEssentialIncludes: 'Hanbok rental, outfit choices, and a keepsake bag',
    packageStyledIncludes: 'Essential package plus hairstyling, a hair accessory, and Norigae',
    packageCompleteIncludes: 'Styled package plus makeup and shoes',
    originCountry: 'Country or region of origin',
    serviceLanguage: 'Preferred service language',
    smsReminderConsent: 'Would you like a return reminder?',
    smsConsentHint: 'Set your reminder preference.',
    checkoutTitle: 'Review your visit and payment choice',
    checkoutHint: 'Choose a package and payment amount before styling your outfit.',
    continueToStyling: 'Continue to styling',
    customizationTitle: 'Customize your hanbok',
    customizationIntro: 'Your package is selected. Enter measurements and choose a look for each guest.',
    measurementsTitle: 'Measurements',
    measurementsHint: 'Enter each guest’s measurements to see available garment sizes.',
    height: 'Height',
    clothingSize: 'Clothing size',
    shoeSize: 'Korean shoe size',
    colorTitle: 'Personal-color suggestions',
    colorHint: 'Upload a clear photo and answer a couple of questions to see suggested colors.',
    colorDisclosure: 'Your answers guide curated suggestions. The photo is previewed on this device and is not saved with your booking.',
    photoUploadTitle: 'Upload a clear face photo',
    photoUploadHint: 'Use a front-facing photo in bright, natural light; avoid filters or shadows.',
    photoChoose: 'Choose a photo',
    photoRemove: 'Remove photo',
    photoError: 'Choose a JPEG, PNG, or WebP photo smaller than 10 MB.',
    jewelryQuestion: 'Which jewelry tone tends to suit you?',
    goldTone: 'Gold',
    silverTone: 'Silver',
    bothTones: 'Both / not sure',
    colorPreferenceQuestion: 'Which colors do you usually like near your face?',
    warmColorPreference: 'Warm',
    coolColorPreference: 'Cool',
    neutralColorPreference: 'Neutral',
    suggestedPalette: 'Suggested palette',
    warmPalette: 'Warm',
    coolPalette: 'Cool',
    neutralPalette: 'Neutral',
    skipColor: 'Skip',
    wardrobeTitle: 'Digital wardrobe',
    wardrobeHint: 'Combine Jeogori and Chima, then explore colors that complement your palette.',
    jeogori: 'Jeogori (upper garment)',
    chima: 'Chima (skirt)',
    hairstyle: 'Hairstyle',
    hairAccessories: 'Hair accessories',
    norigae: 'Norigae (pendant)',
    preview: 'Outfit preview',
    recommended: 'Palette suggestion',
    packageLocked: 'Hairstyling and accessories are included in Styled and Complete packages.',
    reviewTitle: 'Review your outfit',
    reviewHint: 'Check the selections and measurements before finishing your booking.',
    packageLabel: 'Package',
    measurementsError: 'Enter a valid height, clothing size, and shoe size for every guest.',
    finishCustomization: 'Finish booking',
    yourLookTitle: 'A look for every guest',
    lookHint: 'Explore styles and prices for each guest.',
    guest: 'Guest',
    chooseHanbok: 'Choose a hanbok',
    photoComing: 'Photo coming soon',
    hairTitle: 'Hairstyle',
    makeupTitle: 'Makeup',
    shoesTitle: 'Shoes',
    bagTitle: 'Bag',
    naturalHair: 'Natural hair',
    addMakeup: 'Add makeup',
    addShoes: 'Add shoes',
    chooseSize: 'Shoe size',
    selectSize: 'Choose a size',
    addBag: 'Add a bag',
    free: 'Free',
    contactTitle: 'Your contact details',
    contactHint: 'Add your contact details for this visit.',
    name: 'Full name',
    phone: 'Mobile number',
    email: 'Email address',
    countryPlaceholder: 'Enter country or region',
    paymentTitle: 'Choose a payment option',
    fullPayment: 'Full amount',
    depositPayment: '20% deposit',
    dueToday: 'Amount selected now',
    dueAtVenue: 'Remaining balance',
    orderSummary: 'Your visit',
    summaryDate: 'Date',
    summaryTime: 'Start',
    summaryDuration: 'Session',
    summaryGuests: 'Guests',
    summaryTotal: 'Total',
    confirmedTitle: 'Your Seoul visit details are ready!',
    confirmedText: 'Keep your booking code with your visit details.',
    bookingCode: 'BOOKING CODE',
    amountPaid: 'Selected amount',
    qrTitle: 'Your booking QR',
    qrHelp: 'Your booking code is embedded in this QR for reference.',
    startOver: 'Back to home',
    storageError: 'Booking details could not be read or saved in this browser. Check browser storage and try again.',
    capacityError: 'That time just filled up. Please choose another available start time.',
    dateError: 'Please choose a valid visit date that is today or later.',
    contactError: 'Please enter your name, phone number, email, and country or region.',
    shoeSizeError: 'Please choose a shoe size for each guest who added shoes.',
    guestCountError: 'Choose between 1 and 3 guests.',
    chooseTimeError: 'Please choose an available start time.',
  },
  ko: {
    navHome: '홈',
    navExperience: '이용 안내',
    navVisit: '오시는 길',
    bookNow: '예약하기',
    eyebrow: '한복 대여 · 서울',
    heroTitle: '서울의 하루를\\n한복으로 물들여요.',
    heroText: '마음에 드는 색을 고르고 한국의 멋을 입어 보세요. 오래 기억하고 싶은 하루를 만들어 드릴게요.',
    explore: '방문 예약하기',
    serviceTag: '기억에 남을 하루',
    serviceTitle: '더 여유롭게 즐기는 한복 체험.',
    serviceText: '방문 전에 날짜와 한복, 헤어와 소품을 골라 보세요. 예약에 맞춰 방문을 준비해 드립니다.',
    stepOne: '이용 시간 선택',
    stepOneText: '1시간 30분, 3시간 또는 종일 이용을 선택해요.',
    stepTwo: '나만의 스타일',
    stepTwoText: '원하는 체험 패키지를 비교하고 선택해요.',
    stepThree: '나만의 스타일',
    stepThreeText: '패키지를 선택한 뒤 나만의 한복 스타일을 꾸며 보세요.',
    visitEyebrow: '서울에서 만나요',
    visitTitle: '좋아하는 순간에 더 많은 시간을.',
    visitText: '미리 예약하고 피팅 대기 시간을 줄여 서울의 하루를 더 여유롭게 즐겨 보세요.',
    hours: '운영 시간',
    hourRange: '매일 오전 9시 – 오후 7시',
    addressLabel: '위치',
    address: '대한민국 서울',
    addressNote: '정확한 매장 주소를 여기에 추가할 수 있어요.',
    footerText: '한복 대여점 · 대한민국 서울',
    bookYourVisit: '방문 예약하기',
    language: '언어',
    bookingTitle: '방문을 준비해 볼까요?',
    bookingIntro: '미리 몇 가지만 선택하면 서울에서 더 여유롭게 즐길 수 있어요.',
    stepLabel: ['날짜와 시간', '패키지', '정보와 결제'],
    durationTitle: '얼마나 이용하고 싶으세요?',
    durations: {
      short: { title: '가벼운 나들이', duration: '1시간 30분', note: '한복을 처음 입어 보는 날' },
      long: { title: '여유로운 오후', duration: '3시간', note: '천천히 둘러보고 싶은 날' },
      day: { title: '종일 이용', duration: '오후 4시 전 시작 · 오후 7시 반납', note: '원하는 시작 시간을 선택해요' },
    },
    visitDate: '방문 날짜',
    numberGuests: '방문 인원',
    guests: '명',
    availableTimes: '시작 시간 선택',
    timesHint: '30분 간격으로 시작 시간을 선택할 수 있어요.',
    noTimes: '선택한 조건에 가능한 시간이 없어요. 날짜나 이용 시간을 바꿔 주세요.',
    spotsLeft: '자리 남음',
    unavailable: '마감',
    continue: '계속하기',
    back: '뒤로',
    packageTitle: '대여 패키지를 선택해 주세요',
    packageHint: '1인 기준 참고 가격이며, 의상 선택 후에도 패키지 금액은 그대로예요.',
    packagePrice: '1인 기준',
    included: '포함',
    packageEssentialIncludes: '한복 대여, 의상 선택, 기념 가방',
    packageStyledIncludes: '에센셜 패키지에 헤어 스타일링, 머리 장식, 노리개 추가',
    packageCompleteIncludes: '스타일링 패키지에 메이크업과 신발 추가',
    originCountry: '국적 또는 거주 국가',
    serviceLanguage: '원하는 서비스 언어',
    smsReminderConsent: '반납 알림을 원하시나요?',
    smsConsentHint: '알림 선호도를 선택해 주세요.',
    checkoutTitle: '방문 및 결제 선택을 확인해 주세요',
    checkoutHint: '한복 스타일링 전에 패키지와 결제 금액을 선택해 주세요.',
    continueToStyling: '스타일 선택 계속하기',
    customizationTitle: '나만의 한복 꾸미기',
    customizationIntro: '패키지를 선택했어요. 방문객별 사이즈를 입력하고 스타일을 골라 보세요.',
    measurementsTitle: '신체 사이즈',
    measurementsHint: '방문객별 사이즈를 입력하면 선택 가능한 한복 사이즈를 확인할 수 있어요.',
    height: '키',
    clothingSize: '의류 사이즈',
    shoeSize: '한국 신발 사이즈',
    colorTitle: '퍼스널 컬러 추천',
    colorHint: '선명한 사진을 올리고 몇 가지 질문에 답해 추천 컬러를 확인해 보세요.',
    colorDisclosure: '답변을 바탕으로 컬러를 추천해요. 사진은 이 기기에서 미리보기로만 표시되며 예약 정보에 저장되지 않아요.',
    photoUploadTitle: '얼굴이 잘 보이는 사진을 올려 주세요',
    photoUploadHint: '필터나 그림자 없이 밝은 자연광에서 정면으로 찍은 사진을 사용해 주세요.',
    photoChoose: '사진 선택',
    photoRemove: '사진 삭제',
    photoError: '10MB 이하의 JPEG, PNG 또는 WebP 사진을 선택해 주세요.',
    jewelryQuestion: '어떤 색상의 액세서리가 더 잘 어울리나요?',
    goldTone: '골드',
    silverTone: '실버',
    bothTones: '둘 다 / 잘 모르겠어요',
    colorPreferenceQuestion: '얼굴 가까이에 어떤 색상을 자주 선택하나요?',
    warmColorPreference: '웜톤',
    coolColorPreference: '쿨톤',
    neutralColorPreference: '뉴트럴',
    suggestedPalette: '추천 컬러',
    warmPalette: '웜톤',
    coolPalette: '쿨톤',
    neutralPalette: '뉴트럴',
    skipColor: '건너뛰기',
    wardrobeTitle: '디지털 한복 옷장',
    wardrobeHint: '저고리와 치마를 조합하고 추천 컬러와 어울리는 스타일을 골라 보세요.',
    jeogori: '저고리',
    chima: '치마',
    hairstyle: '헤어 스타일',
    hairAccessories: '머리 장식',
    norigae: '노리개',
    preview: '한복 미리보기',
    recommended: '컬러 추천',
    packageLocked: '헤어 스타일링과 장식은 스타일링 또는 컴플리트 패키지에 포함돼요.',
    reviewTitle: '의상 확인',
    reviewHint: '예약을 마치기 전에 의상과 사이즈를 확인해 주세요.',
    packageLabel: '패키지',
    measurementsError: '모든 방문객의 키, 의류 사이즈, 신발 사이즈를 입력해 주세요.',
    finishCustomization: '예약 완료',
    yourLookTitle: '한 분씩 스타일을 골라 주세요',
    lookHint: '방문객별 스타일과 가격을 확인해 보세요.',
    guest: '방문객',
    chooseHanbok: '한복 선택',
    photoComing: '사진 준비 중',
    hairTitle: '헤어 스타일',
    makeupTitle: '메이크업',
    shoesTitle: '신발',
    bagTitle: '가방',
    naturalHair: '기본 헤어',
    addMakeup: '메이크업 추가',
    addShoes: '신발 추가',
    chooseSize: '신발 사이즈',
    selectSize: '사이즈 선택',
    addBag: '가방 추가',
    free: '무료',
    contactTitle: '연락처 정보를 입력해 주세요',
    contactHint: '방문 준비를 위해 연락처 정보를 입력해 주세요.',
    name: '이름',
    phone: '휴대폰 번호',
    email: '이메일 주소',
    countryPlaceholder: '국가 또는 지역 입력',
    paymentTitle: '결제 방법 선택',
    fullPayment: '전체 금액',
    depositPayment: '20% 예약금',
    dueToday: '지금 선택하는 금액',
    dueAtVenue: '남은 금액',
    orderSummary: '예약 내용',
    summaryDate: '날짜',
    summaryTime: '시작 시간',
    summaryDuration: '이용 시간',
    summaryGuests: '인원',
    summaryTotal: '총 금액',
    confirmedTitle: '서울 방문 정보가 준비됐어요!',
    confirmedText: '방문 정보와 함께 예약 번호를 보관해 주세요.',
    bookingCode: '예약 번호',
    amountPaid: '선택한 금액',
    qrTitle: '예약 번호 QR',
    qrHelp: '이 QR에는 확인용 예약 번호가 포함되어 있어요.',
    startOver: '홈으로 돌아가기',
    storageError: '이 브라우저에서 예약 정보를 읽거나 저장할 수 없어요. 저장 공간을 확인해 주세요.',
    capacityError: '방금 예약이 마감됐어요. 다른 시작 시간을 선택해 주세요.',
    dateError: '오늘 이후의 올바른 방문 날짜를 선택해 주세요.',
    contactError: '이름, 휴대폰 번호, 이메일, 국가 또는 지역을 입력해 주세요.',
    shoeSizeError: '신발을 추가한 방문객의 사이즈를 선택해 주세요.',
    guestCountError: '방문 인원은 1명에서 3명까지 선택할 수 있어요.',
    chooseTimeError: '가능한 시작 시간을 선택해 주세요.',
  },
} as const

const messages = {
  ...baseMessages,
  zh: {
    ...baseMessages.en,
    navHome: '首页',
    navExperience: '体验介绍',
    navVisit: '到访信息',
    bookNow: '预约试穿',
    eyebrow: '韩服租赁 · 首尔',
    heroTitle: '在首尔，\\n穿上快乐。',
    heroText: '挑选喜欢的颜色，体验韩国传统之美，留下属于自己的美好回忆。',
    explore: '计划行程',
    serviceTag: '难忘的一天',
    serviceTitle: '轻松预约韩服体验。',
    serviceText: '提前选择日期、套餐和细节，让您到店后尽情享受首尔时光。',
    stepOne: '选择时段',
    stepOneText: '选择日期、时长和到店时间。',
    stepTwo: '选择套餐',
    stepTwoText: '比较套餐并选择适合您的体验。',
    stepThree: '定制造型',
    stepThreeText: '完成模拟付款后再搭配韩服造型。',
    visitEyebrow: '首尔见',
    visitTitle: '为美好时光多留一点时间。',
    visitText: '提前预约，减少试衣等待，在首尔享受更轻松的一天。',
    hours: '营业时间',
    hourRange: '每天 9:00 – 19:00',
    addressLabel: '地点',
    address: '韩国首尔',
    addressNote: '可在此添加具体店铺地址。',
    footerText: '韩服租赁店 · 韩国首尔',
    bookYourVisit: '预约到访',
    language: '语言',
    bookingTitle: '计划您的到访',
    bookingIntro: '提前做好选择，让您在首尔拥有更多轻松时光。',
    stepLabel: ['日期和时间', '套餐', '信息和付款'],
    durations: {
      short: { title: '轻松体验', duration: '1.5 小时', note: '初次体验的好选择' },
      long: { title: '悠闲午后', duration: '3 小时', note: '慢慢探索首尔' },
      day: { title: '全天体验', duration: '16:00 前开始 · 19:00 前归还', note: '选择您的开始时间' },
    },
    visitDate: '到访日期',
    numberGuests: '到访人数',
    guests: '位',
    availableTimes: '选择开始时间',
    timesHint: '每 30 分钟提供一个开始时段。',
    noTimes: '没有符合条件的时段，请更换日期或时长。',
    spotsLeft: '剩余名额',
    continue: '继续',
    back: '返回',
    packageTitle: '选择租赁套餐',
    packageHint: '参考单人价格；定制造型不会改变套餐总价。',
    packagePrice: '每位',
    included: '已包含',
    packageEssentialIncludes: '韩服租赁、造型选择和纪念手提袋',
    packageStyledIncludes: '基础套餐另含发型设计、发饰和韩服挂饰',
    packageCompleteIncludes: '特色造型套餐另含妆容和鞋子',
    originCountry: '国家或地区',
    serviceLanguage: '服务语言偏好',
    smsReminderConsent: '您需要归还提醒吗？',
    smsConsentHint: '设置您的提醒偏好。',
    checkoutTitle: '确认到访信息和付款选择',
    checkoutHint: '搭配造型前，请选择套餐和付款金额。',
    continueToStyling: '继续搭配造型',
    customizationTitle: '定制您的韩服造型',
    customizationIntro: '套餐已选择。请填写每位客人的尺寸并挑选造型。',
    measurementsTitle: '尺寸信息',
    measurementsHint: '填写每位客人的尺寸，以查看可选韩服尺码。',
    height: '身高',
    clothingSize: '服装尺码',
    shoeSize: '韩国鞋码',
    colorTitle: '个人色彩建议',
    colorHint: '上传清晰照片并回答几个问题，查看适合您的色彩建议。',
    colorDisclosure: '色彩建议根据您的回答生成。照片仅在此设备上预览，不会保存到预约信息中。',
    photoUploadTitle: '上传一张清晰的正脸照片',
    photoUploadHint: '请使用自然光下的正面照片，避免滤镜和阴影。',
    photoChoose: '选择照片',
    photoRemove: '移除照片',
    photoError: '请选择小于 10 MB 的 JPEG、PNG 或 WebP 照片。',
    jewelryQuestion: '哪种金属配饰通常更衬您？',
    goldTone: '金色',
    silverTone: '银色',
    bothTones: '都可以 / 不确定',
    colorPreferenceQuestion: '您通常喜欢在脸部附近搭配哪些颜色？',
    warmColorPreference: '暖色调',
    coolColorPreference: '冷色调',
    neutralColorPreference: '中性色调',
    suggestedPalette: '为您推荐的色系',
    warmPalette: '暖色调',
    coolPalette: '冷色调',
    neutralPalette: '中性色调',
    skipColor: '跳过',
    wardrobeTitle: '数字韩服衣橱',
    wardrobeHint: '搭配 Jeogori 上衣和 Chima 裙装，挑选与推荐色系相配的造型。',
    jeogori: 'Jeogori（上衣）',
    chima: 'Chima（裙装）',
    hairstyle: '发型',
    hairAccessories: '发饰',
    norigae: 'Norigae（挂饰）',
    preview: '造型预览',
    recommended: '色系建议',
    packageLocked: '发型设计和配饰仅包含在造型或完整套餐中。',
    reviewTitle: '确认您的造型',
    reviewHint: '完成预约前，请确认造型和尺寸。',
    packageLabel: '套餐',
    measurementsError: '请为每位客人填写有效身高、服装尺码和鞋码。',
    finishCustomization: '完成预约',
    guest: '客人',
    yourLookTitle: '为每位客人选择造型',
    lookHint: '查看每位客人的造型和价格。',
    chooseHanbok: '选择韩服',
    photoComing: '照片即将添加',
    hairTitle: '发型',
    makeupTitle: '妆容',
    shoesTitle: '鞋子',
    bagTitle: '手提袋',
    naturalHair: '自然发型',
    addMakeup: '添加妆容',
    addShoes: '添加鞋子',
    chooseSize: '选择鞋码',
    selectSize: '请选择尺码',
    addBag: '添加手提袋',
    free: '免费',
    contactTitle: '填写预约联系信息',
    contactHint: '请填写本次到访的联系信息。',
    name: '姓名',
    phone: '手机号码',
    email: '电子邮箱',
    countryPlaceholder: '输入国家或地区',
    paymentTitle: '选择付款方式',
    fullPayment: '全额金额',
    depositPayment: '20% 预付款',
    dueToday: '现在选择的金额',
    dueAtVenue: '剩余金额',
    orderSummary: '预约内容',
    summaryDate: '日期',
    summaryTime: '开始时间',
    summaryDuration: '时长',
    summaryGuests: '人数',
    summaryTotal: '总金额',
    confirmedTitle: '您的首尔行程信息已准备就绪！',
    confirmedText: '请与到访信息一同保存预约编号。',
    bookingCode: '预约编号',
    amountPaid: '所选金额',
    qrTitle: '预约编号二维码',
    qrHelp: '此二维码包含预约编号，供您查询时参考。',
    startOver: '返回首页',
    storageError: '无法读取或保存浏览器中的预约信息，请检查浏览器存储设置。',
    capacityError: '该时段刚刚约满，请选择其他可用时间。',
    dateError: '请选择今天或之后的有效到访日期。',
    contactError: '请填写姓名、手机号码、电子邮箱和国家或地区。',
    shoeSizeError: '请为选择鞋子的客人填写鞋码。',
    guestCountError: '请选择 1 至 3 位客人。',
    chooseTimeError: '请选择一个可用的开始时间。',
  },
} as const

type Language = keyof typeof messages

const durationKeys: DurationKey[] = ['short', 'long', 'day']

function money(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

function displayDate(date: string, language: Language): string {
  if (!date) return '—'
  const locale = language === 'ko' ? 'ko-KR' : language === 'zh' ? 'zh-CN' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  }).format(new Date(`${date}T12:00:00`))
}

function packageName(packageId: PackageId, language: Language): string {
  const rentalPackage = RENTAL_PACKAGES.find((item) => item.id === packageId)
  if (!rentalPackage) throw new Error(`Unknown rental package: ${packageId}`)
  if (language === 'ko') return rentalPackage.nameKo
  if (language === 'zh') return rentalPackage.nameZh
  return rentalPackage.nameEn
}

function wardrobeName(
  options: readonly Pick<WardrobeOption, 'id' | 'nameEn' | 'nameKo' | 'nameZh'>[],
  id: string | undefined,
  language: Language,
): string {
  const option = options.find((item) => item.id === id)
  if (!option) return '—'
  if (language === 'ko') return option.nameKo
  if (language === 'zh') return option.nameZh
  return option.nameEn
}

function readBookings(): BookingRecord[] {
  const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY)
  if (!raw) return []

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    throw new Error('Invalid saved booking data')
  }
  if (!Array.isArray(value) || !value.every(isBookingRecord)) {
    throw new Error('Unexpected saved booking data')
  }
  return value
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [page, setPage] = useState<'home' | 'booking' | 'customization' | 'confirmation'>('home')
  const [step, setStep] = useState(1)
  const [duration, setDuration] = useState<DurationKey>('short')
  const [date, setDate] = useState(localDateString())
  const [guests, setGuests] = useState<GuestSelection[]>([createGuestSelection()])
  const [startMin, setStartMin] = useState<number | null>(null)
  const [packageId, setPackageId] = useState<PackageId>('essential')
  const [contact, setContact] = useState<ContactDetails>({
    name: '',
    phone: '',
    email: '',
    countryOfOrigin: '',
    serviceLanguage: 'en',
    smsReminderConsent: false,
  })
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full')
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [storageError, setStorageError] = useState(false)
  const [formError, setFormError] = useState('')
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null)
  const t = messages[language]

  useEffect(() => {
    const refresh = () => {
      try {
        setBookings(readBookings())
        setStorageError(false)
      } catch {
        setStorageError(true)
      }
    }
    refresh()
    const onStorage = (event: StorageEvent) => {
      if (event.key === BOOKING_STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const availableSlots = useMemo(
    () => getTimeSlots(date, duration, guests.length, bookings),
    [date, duration, guests.length, bookings],
  )
  const total = getPackageTotal(packageId, guests.length)
  const payment = getPaymentAmounts(total, paymentType)
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function beginBooking() {
    setPage('booking')
    setStep(1)
    setDate(localDateString())
    setDuration('short')
    setGuests([createGuestSelection()])
    setPackageId('essential')
    setContact({
      name: '',
      phone: '',
      email: '',
      countryOfOrigin: '',
      serviceLanguage: language,
      smsReminderConsent: false,
    })
    setPaymentType('full')
    setCurrentBooking(null)
    setFormError('')
    setStartMin(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeDuration(value: DurationKey) {
    setDuration(value)
    setStartMin(null)
    setFormError('')
  }

  function changeGuestCount(value: number) {
    if (value < 1 || value > 3) {
      setFormError(t.guestCountError)
      return
    }
    setGuests((current) =>
      Array.from({ length: value }, (_, index) => current[index] ?? createGuestSelection()),
    )
    setStartMin(null)
    setFormError('')
  }

  function navigateHome(sectionId?: string) {
    setPage('home')
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${sectionId ? `#${sectionId}` : ''}`,
    )
    if (sectionId) {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function toLookStep() {
    if (guests.length < 1 || guests.length > 3) {
      setFormError(t.guestCountError)
      return
    }
    if (!date || date < localDateString()) {
      setFormError(t.dateError)
      return
    }
    if (startMin === null || !availableSlots.some((slot) => slot.startMin === startMin)) {
      setFormError(t.chooseTimeError)
      return
    }
    setFormError('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toContactStep() {
    setFormError('')
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      !contact.name.trim() ||
      !contact.phone.trim() ||
      !contact.email.trim() ||
      !contact.countryOfOrigin?.trim()
    ) {
      setFormError(t.contactError)
      return
    }
    if (!date || date < localDateString()) {
      setFormError(t.dateError)
      setStep(1)
      return
    }
    if (startMin === null) {
      setFormError(t.chooseTimeError)
      return
    }
    let latestBookings: BookingRecord[]
    try {
      latestBookings = readBookings()
    } catch {
      setStorageError(true)
      return
    }
    const stillAvailable = getTimeSlots(date, duration, guests.length, latestBookings).some(
      (slot) => slot.startMin === startMin,
    )
    if (!stillAvailable) {
      setBookings(latestBookings)
      setStartMin(null)
      setStep(1)
      setFormError(t.capacityError)
      return
    }

    const rentalPackage = RENTAL_PACKAGES.find((item) => item.id === packageId)
    if (!rentalPackage) throw new Error(`Unknown rental package: ${packageId}`)
    const totalPrice = getPackageTotal(packageId, guests.length)
    const amounts = getPaymentAmounts(totalPrice, paymentType)
    const packageGuests = guests.map((guest) => ({
      ...guest,
      hairstyleId: rentalPackage.includesHairstyling ? guest.hairstyleId : 'natural',
      makeup: rentalPackage.includesMakeup,
      shoes: rentalPackage.includesShoes,
      bag: true,
    }))
    const booking: BookingRecord = {
      id: `HG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date,
      startMin,
      endMin: getBookingEndMinute(startMin, duration),
      duration,
      guests: packageGuests,
      packageId,
      contact: { ...contact, serviceLanguage: contact.serviceLanguage ?? language },
      paymentType,
      total: totalPrice,
      amountPaid: amounts.amountDueNow,
      createdAt: new Date().toISOString(),
    }
    const updatedBookings = [...latestBookings, booking]

    try {
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updatedBookings))
    } catch {
      setStorageError(true)
      return
    }

    setBookings(updatedBookings)
    setCurrentBooking(booking)
    setGuests(packageGuests)
    setFormError('')
    setPage('customization')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeCustomization(updatedGuests: GuestSelection[]): boolean {
    if (!currentBooking) {
      setStorageError(true)
      return false
    }

    let latestBookings: BookingRecord[]
    try {
      latestBookings = readBookings()
    } catch {
      setStorageError(true)
      return false
    }
    if (!latestBookings.some((booking) => booking.id === currentBooking.id)) {
      setStorageError(true)
      return false
    }

    const updatedBooking = { ...currentBooking, guests: updatedGuests }
    const updatedBookings = latestBookings.map((booking) =>
      booking.id === updatedBooking.id ? updatedBooking : booking,
    )
    try {
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updatedBookings))
    } catch {
      setStorageError(true)
      return false
    }

    setBookings(updatedBookings)
    setGuests(updatedGuests)
    setCurrentBooking(updatedBooking)
    setPage('confirmation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  function renderHeader() {
    return (
      <header className="site-header">
        <a
          href="#home"
          className="brand"
          aria-label="Hanbok Girls home"
          onClick={(event) => {
            event.preventDefault()
            navigateHome()
          }}
        >
          <img src="/hanbokgirls-logo.png" alt="Hanbok Girls 한복소녀" />
          <span className="brand-caption">HANBOK RENTAL SHOP</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              navigateHome()
            }}
          >
            {t.navHome}
          </a>
          <a href="#experience" onClick={(event) => { event.preventDefault(); navigateHome('experience') }}>{t.navExperience}</a>
          <a href="#visit" onClick={(event) => { event.preventDefault(); navigateHome('visit') }}>{t.navVisit}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" aria-label={t.language}>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === 'ko'} onClick={() => setLanguage('ko')}>한국어</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
          </div>
          {page === 'home' && (
            <button className="button button-small button-plum" type="button" onClick={beginBooking}>
              {t.bookNow}
            </button>
          )}
        </div>
      </header>
    )
  }

  function renderHome() {
    return (
      <>
        <main id="home">
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-flower">✿</span> {t.eyebrow}</p>
              <h1>{t.heroTitle.split('\\n').map((line) => <span key={line}>{line}</span>)}</h1>
              <p className="hero-description">{t.heroText}</p>
              <div className="hero-actions">
                <button className="button button-plum" type="button" onClick={beginBooking}>
                  {t.explore}<span aria-hidden="true">↗</span>
                </button>
                <span className="hero-note">♡ &nbsp; {t.serviceTag}</span>
              </div>
              <div className="hero-stamp" aria-hidden="true">
                <span>서울</span><small>SEOUL<br />WITH LOVE</small>
              </div>
            </div>
            <div className="hero-art" aria-label="Hanbok photo placeholder">
              <div className="photo-frame photo-frame-main">
                <div className="photo-placeholder">
                  <span className="placeholder-mark">✿</span>
                  <span>HANBOK<br />MOMENTS</span>
                  <small>YOUR PHOTO HERE</small>
                </div>
              </div>
              <div className="photo-frame photo-frame-small">
                <div className="photo-placeholder photo-placeholder-sage">
                  <span>STYLE<br />YOUR DAY</span>
                  <small>YOUR PHOTO HERE</small>
                </div>
              </div>
              <div className="art-flower art-flower-one">✿</div>
              <div className="art-flower art-flower-two">✽</div>
              <span className="art-caption">a beautiful day, your way</span>
            </div>
          </section>

          <section className="experience-section" id="experience">
            <div className="section-heading">
              <p className="eyebrow">{t.serviceTag}</p>
              <h2>{t.serviceTitle}</h2>
              <p>{t.serviceText}</p>
            </div>
            <div className="experience-grid">
              {[
                { number: '01', title: t.stepOne, text: t.stepOneText, symbol: '◷' },
                { number: '02', title: t.stepTwo, text: t.stepTwoText, symbol: '✿' },
                { number: '03', title: t.stepThree, text: t.stepThreeText, symbol: '♡' },
              ].map((item) => (
                <article className="experience-card" key={item.number}>
                  <div className="experience-card-top"><span>{item.number}</span><span className="card-symbol">{item.symbol}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="visit-section" id="visit">
            <div className="visit-ornament" aria-hidden="true">❀</div>
            <div>
              <p className="eyebrow">{t.visitEyebrow}</p>
              <h2>{t.visitTitle}</h2>
              <p>{t.visitText}</p>
              <button className="text-link" type="button" onClick={beginBooking}>
                {t.bookYourVisit}<span aria-hidden="true"> ↗</span>
              </button>
            </div>
            <div className="visit-details">
              <div><span className="detail-icon">◷</span><p className="detail-label">{t.hours}</p><p>{t.hourRange}</p></div>
              <div><span className="detail-icon">⌖</span><p className="detail-label">{t.addressLabel}</p><p>{t.address}</p><small>{t.addressNote}</small></div>
            </div>
          </section>
        </main>
        <footer className="site-footer">
          <span>한복소녀 · HANBOK GIRLS</span>
          <span>{t.footerText}</span>
          <span>Seoul · Korea</span>
        </footer>
      </>
    )
  }

  function renderSummary() {
    const rentalPackage = RENTAL_PACKAGES.find((item) => item.id === packageId)
    if (!rentalPackage) throw new Error(`Unknown rental package: ${packageId}`)
    return (
      <aside className="booking-summary">
        <p className="eyebrow">{t.orderSummary}</p>
        <h2>{displayDate(date, language)}</h2>
        <dl>
          <div><dt>{t.summaryTime}</dt><dd>{startMin === null ? '—' : formatTime(startMin)}</dd></div>
          <div><dt>{t.summaryDuration}</dt><dd>{t.durations[duration].duration}</dd></div>
          <div><dt>{t.summaryGuests}</dt><dd>{guests.length}</dd></div>
        </dl>
        {step > 1 && (
          <ul className="summary-looks">
            <li><span>{t.packageLabel}</span><span>{packageName(packageId, language)}</span></li>
            <li><span>{t.packagePrice}</span><span>{money(rentalPackage.price)}</span></li>
          </ul>
        )}
        <div className="summary-total"><span>{t.summaryTotal}</span><strong>{money(total)}</strong></div>
        {step === 3 && (
          <>
            <div className="summary-total summary-due"><span>{t.dueToday}</span><strong>{money(payment.amountDueNow)}</strong></div>
            {payment.remainingBalance > 0 && <p className="balance-note">{t.dueAtVenue}: {money(payment.remainingBalance)}</p>}
          </>
        )}
      </aside>
    )
  }

  function renderBooking() {
    return (
      <main className="booking-page">
        <div className="booking-heading">
          <button className="back-link" type="button" onClick={() => setPage('home')}>← {t.back}</button>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.bookingTitle}</h1>
          <p>{t.bookingIntro}</p>
        </div>
        <div className="stepper" aria-label="Reservation steps">
          {t.stepLabel.map((label, index) => (
            <div className={`stepper-item ${step === index + 1 ? 'is-active' : ''} ${step > index + 1 ? 'is-complete' : ''}`} key={label}>
              <span className="stepper-number">{step > index + 1 ? '✓' : `0${index + 1}`}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          <section className="booking-panel">
            {step === 1 && (
              <div className="booking-step">
                <h2>{t.durationTitle}</h2>
                <div className="duration-grid">
                  {durationKeys.map((key) => (
                    <button className={`duration-card ${duration === key ? 'is-selected' : ''}`} type="button" key={key} aria-pressed={duration === key} onClick={() => changeDuration(key)}>
                      <span className="duration-card-icon">{key === 'day' ? '☼' : '◷'}</span>
                      <strong>{t.durations[key].title}</strong>
                      <span>{t.durations[key].duration}</span>
                      <small>{t.durations[key].note}</small>
                    </button>
                  ))}
                </div>

                <div className="field-row">
                  <label className="form-field">
                    <span>{t.visitDate}</span>
                    <input type="date" min={localDateString()} value={date} onChange={(event) => { setDate(event.target.value); setStartMin(null); setFormError('') }} required />
                  </label>
                  <fieldset className="guest-count-field">
                    <legend>{t.numberGuests}</legend>
                    <div className="guest-count-options">
                      {[1, 2, 3].map((count) => (
                        <button className={guests.length === count ? 'is-selected' : ''} type="button" key={count} aria-pressed={guests.length === count} onClick={() => changeGuestCount(count)}>
                          {count}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="time-section">
                  <div className="time-heading"><h3>{t.availableTimes}</h3><span>{t.timesHint}</span></div>
                  <div className="time-grid">
                    {availableSlots.map((slot) => (
                      <button className={`time-slot ${startMin === slot.startMin ? 'is-selected' : ''}`} type="button" key={slot.startMin} aria-pressed={startMin === slot.startMin} onClick={() => { setStartMin(slot.startMin); setFormError('') }}>
                        <strong>{formatTime(slot.startMin)}</strong>
                        <small>{slot.remainingCapacity} {t.spotsLeft}</small>
                      </button>
                    ))}
                    {availableSlots.length === 0 && <p className="empty-slots">{t.noTimes}</p>}
                  </div>
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions"><button className="button button-plum" type="button" onClick={toLookStep}>{t.continue}<span aria-hidden="true"> →</span></button></div>
              </div>
            )}

            {step === 2 && (
              <div className="booking-step">
                <div className="step-title-row">
                  <div><h2>{t.packageTitle}</h2><p>{t.packageHint}</p></div>
                </div>
                <div className="rental-package-grid">
                  {RENTAL_PACKAGES.map((rentalPackage) => {
                    const selected = packageId === rentalPackage.id
                    const name = language === 'ko' ? rentalPackage.nameKo : language === 'zh' ? rentalPackage.nameZh : rentalPackage.nameEn
                    const description = language === 'ko' ? rentalPackage.descriptionKo : language === 'zh' ? rentalPackage.descriptionZh : rentalPackage.descriptionEn
                    const inclusions = rentalPackage.id === 'essential'
                      ? t.packageEssentialIncludes
                      : rentalPackage.id === 'styled'
                        ? t.packageStyledIncludes
                        : t.packageCompleteIncludes
                    return (
                      <button
                        className={`rental-package-card ${selected ? 'is-selected' : ''}`}
                        type="button"
                        key={rentalPackage.id}
                        aria-pressed={selected}
                        onClick={() => setPackageId(rentalPackage.id)}
                      >
                        <strong>{name}</strong>
                        <span className="package-card-price">{money(rentalPackage.price)} <small>/ {t.packagePrice}</small></span>
                        <span className="package-card-description">{description}</span>
                        <span className="package-card-inclusions"><b>{t.included}:</b> {inclusions}</span>
                      </button>
                    )
                  })}
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(1); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="button" onClick={toContactStep}>{t.continue}<span aria-hidden="true"> →</span></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="booking-step contact-step" onSubmit={confirmBooking}>
                <h2>{t.checkoutTitle}</h2>
                <p>{t.checkoutHint}</p>
                <div className="contact-grid">
                  <label className="form-field"><span>{t.name}</span><input autoComplete="name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} required /></label>
                  <label className="form-field"><span>{t.phone}</span><input type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+()\\-\\s]{8,20}" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} required /></label>
                  <label className="form-field field-full"><span>{t.email}</span><input type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} required /></label>
                  <label className="form-field"><span>{t.originCountry}</span><input autoComplete="country-name" placeholder={t.countryPlaceholder} value={contact.countryOfOrigin ?? ''} onChange={(event) => setContact({ ...contact, countryOfOrigin: event.target.value })} required /></label>
                  <label className="form-field">
                    <span>{t.serviceLanguage}</span>
                    <select value={contact.serviceLanguage ?? language} onChange={(event) => setContact({ ...contact, serviceLanguage: event.target.value as ServiceLanguage })}>
                      <option value="en">English</option>
                      <option value="ko">한국어</option>
                      <option value="zh">中文</option>
                    </select>
                  </label>
                </div>
                <label className="checkbox-option consent-option">
                  <input type="checkbox" checked={contact.smsReminderConsent ?? false} onChange={(event) => setContact({ ...contact, smsReminderConsent: event.target.checked })} />
                  <span><strong>{t.smsReminderConsent}</strong><small>{t.smsConsentHint}</small></span>
                </label>
                <fieldset className="payment-options">
                  <legend>{t.paymentTitle}</legend>
                  <label className={`payment-option ${paymentType === 'full' ? 'is-selected' : ''}`}>
                    <input type="radio" name="payment" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} />
                    <span><strong>{t.fullPayment}</strong><small>{money(total)}</small></span>
                  </label>
                  <label className={`payment-option ${paymentType === 'deposit' ? 'is-selected' : ''}`}>
                    <input type="radio" name="payment" value="deposit" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} />
                    <span><strong>{t.depositPayment}</strong><small>{money(getPaymentAmounts(total, 'deposit').amountDueNow)}</small></span>
                  </label>
                </fieldset>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(2); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="submit">{t.continueToStyling}<span aria-hidden="true"> →</span></button>
                </div>
              </form>
            )}
          </section>
          <div className="summary-column">{renderSummary()}</div>
        </div>
      </main>
    )
  }

  function renderCustomization() {
    if (!currentBooking?.packageId) return renderHome()
    const rentalPackage = RENTAL_PACKAGES.find((item) => item.id === currentBooking.packageId)
    if (!rentalPackage) throw new Error(`Unknown rental package: ${currentBooking.packageId}`)
    return (
      <Customization
        language={language}
        text={t}
        rentalPackage={rentalPackage}
        guests={guests}
        onGuestsChange={setGuests}
        onComplete={completeCustomization}
      />
    )
  }

  function renderConfirmation() {
    if (!currentBooking) return renderHome()
    const qrValue = currentBooking.id
    const paid = getPaymentAmounts(currentBooking.total, currentBooking.paymentType)
    const selectedPackage = currentBooking.packageId
      ? RENTAL_PACKAGES.find((item) => item.id === currentBooking.packageId)
      : undefined
    return (
      <main className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon">✿</div>
          <p className="eyebrow">{t.bookingCode} · {currentBooking.id}</p>
          <h1>{t.confirmedTitle}</h1>
          <p className="confirmation-lead">{t.confirmedText}</p>
          <div className="confirmation-details">
            <div><span>{t.summaryDate}</span><strong>{displayDate(currentBooking.date, language)}</strong></div>
            <div><span>{t.summaryTime}</span><strong>{formatTime(currentBooking.startMin)}</strong></div>
            <div><span>{t.summaryDuration}</span><strong>{t.durations[currentBooking.duration].duration}</strong></div>
            <div><span>{t.summaryGuests}</span><strong>{currentBooking.guests.length}</strong></div>
            {selectedPackage && <div><span>{t.packageLabel}</span><strong>{language === 'ko' ? selectedPackage.nameKo : language === 'zh' ? selectedPackage.nameZh : selectedPackage.nameEn}</strong></div>}
            <div><span>{t.serviceLanguage}</span><strong>{currentBooking.contact.serviceLanguage === 'ko' ? '한국어' : currentBooking.contact.serviceLanguage === 'zh' ? '中文' : 'English'}</strong></div>
            <div><span>{t.summaryTotal}</span><strong>{money(currentBooking.total)}</strong></div>
            <div><span>{t.amountPaid}</span><strong>{money(paid.amountDueNow)}</strong></div>
          </div>
          <section className="confirmation-outfits">
            <h2>{t.reviewTitle}</h2>
            {currentBooking.guests.map((guest, index) => (
              <article className="confirmation-outfit" key={`${currentBooking.id}-${index}`}>
                <strong>{t.guest} {index + 1}</strong>
                <span>{t.jeogori}: {wardrobeName(JEOGORI_OPTIONS, guest.jeogoriId, language)}</span>
                <span>{t.chima}: {wardrobeName(CHIMA_OPTIONS, guest.chimaId, language)}</span>
                {selectedPackage?.includesHairstyling && <span>{t.hairstyle}: {wardrobeName(HAIRSTYLES, guest.hairstyleId, language)}</span>}
                {selectedPackage?.includesHairAccessories && (
                  <>
                    <span>{t.hairAccessories}: {wardrobeName(HAIR_ACCESSORIES, guest.hairAccessoryId, language)}</span>
                    <span>{t.norigae}: {wardrobeName(NORIGAE_OPTIONS, guest.norigaeId, language)}</span>
                  </>
                )}
                <small>{t.height}: {guest.heightCm ?? '—'} cm · {t.clothingSize}: {guest.clothingSize ?? '—'} · {t.shoeSize}: {guest.shoeSize || '—'} mm</small>
              </article>
            ))}
          </section>
          <div className="qr-card">
            <div className="qr-code"><QRCodeSVG value={qrValue} size={176} level="M" includeMargin /></div>
            <div className="qr-copy"><p className="eyebrow">{t.qrTitle}</p><p>{t.qrHelp}</p></div>
          </div>
          <div className="confirmation-actions">
            <button className="button button-outline" type="button" onClick={() => setPage('home')}>{t.startOver}</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      {renderHeader()}
      {storageError && <div className="storage-alert" role="alert">{t.storageError}</div>}
      {page === 'home' ? renderHome()
        : page === 'booking' ? renderBooking()
          : page === 'customization' ? renderCustomization()
            : renderConfirmation()}
    </div>
  )
}

export default App
