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
  HANBOK_TIERS,
  createGuestSelection,
  formatTime,
  getBookingTotal,
  getBookingEndMinute,
  getPackageTotal,
  getPaymentAmounts,
  getTimeSlots,
  isBookingRecord,
  localDateString,
  MAKEUP_PRICES,
  SHOE_RENTAL_PRICE,
  type BookingRecord,
  type ContactDetails,
  type DurationKey,
  type GuestSelection,
  type MakeupService,
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
    stepOneText: 'Pick 2 hours, 4 hours, or a full day.',
    stepTwo: 'Choose your Hanbok',
    stepTwoText: 'Compare Hanbok tiers and select any makeup services.',
    stepThree: 'Customize your look',
    stepThreeText: 'Choose your outfit after payment.',
    visitEyebrow: 'FIND US IN SEOUL',
    visitTitle: 'A little more time for the good parts.',
    visitText: 'Reserve ahead, skip the fitting-room wait, and spend more of your day making memories.',
    hours: 'OPEN EVERY DAY',
    hourRange: '9:00 AM – 7:00 PM',
    addressLabel: 'OUR NEIGHBORHOOD',
    address: 'Seoul, South Korea',
    addressNote: '8, Jahamun-ro 2-gil, Jongno-gu, Seoul, Republic of Korea',
    footerText: 'Hanbok rental shop · Seoul, South Korea',
    bookYourVisit: 'Book your visit',
    language: 'Language',
    bookingTitle: 'Let’s plan your visit',
    bookingIntro: 'A few thoughtful choices now, and more time to enjoy Seoul later.',
    stepLabel: ['Date & time', 'Hanbok & makeup', 'Details', 'Payment'],
    durationTitle: 'How long would you like to explore?',
    durations: {
      short: { title: '2-hour rental', duration: '2 hours', note: 'A lovely first look' },
      long: { title: '4-hour rental', duration: '4 hours', note: 'Time to wander and explore' },
      day: { title: 'Full day', duration: 'Full day', note: 'Start before 4 PM · Return by 7 PM' },
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
    packageTitle: 'Choose your Hanbok tier',
    packageHint: 'Prices are per guest. Optional makeup is added to your total.',
    packagePrice: 'per guest',
    selectedPrice: 'Selected duration',
    tierSubtotal: 'Hanbok subtotal',
    makeupHint: 'Choose a service for each guest; the listed fee is added to the Hanbok price.',
    makeupNone: 'No makeup',
    menMakeup: "Men's makeup",
    womenMakeup: "Women's makeup",
    noneOption: 'None',
    included: 'Available',
    originCountry: 'Country or region of origin',
    serviceLanguage: 'Preferred service language',
    smsReminderConsent: 'Would you like a return reminder?',
    smsConsentHint: 'Set your reminder preference.',
    continueToStyling: 'Continue to styling',
    continueToPayment: 'Continue to payment',
    paymentTitle: 'Complete your payment',
    paymentOptionsTitle: 'Choose a payment amount',
    paymentMethodTitle: 'Payment method',
    cardPayment: 'Credit or debit card',
    payNow: 'Pay now',
    paymentSuccessTitle: 'Payment complete',
    paymentSuccessText: 'Your booking is ready. Continue to styling.',
    customizationTitle: 'Customize your hanbok',
    customizationIntro: 'Your Hanbok tier and services are selected. Enter measurements and choose a look for each guest.',
    measurementsTitle: 'Measurements',
    measurementsHint: 'Enter each guest’s height and clothing size. Shoe size is needed only if shoes are added.',
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
    reviewTitle: 'Review your outfit',
    reviewHint: 'Check the selections and measurements before finishing your booking.',
    packageLabel: 'Hanbok tier',
    measurementsError: 'Enter a valid height and clothing size for every guest, and shoe size if shoes are selected.',
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
    fullPayment: 'Pay in full',
    depositPayment: 'Pay a 20% deposit',
    dueToday: 'Due now',
    dueAtVenue: 'Remaining at venue',
    orderSummary: 'Your visit',
    summaryDate: 'Date',
    summaryTime: 'Start',
    summaryDuration: 'Session',
    summaryGuests: 'Guests',
    summaryTotal: 'Total',
    confirmedTitle: 'Your Seoul visit details are ready!',
    confirmedText: 'Keep your booking code with your visit details.',
    bookingCode: 'BOOKING CODE',
    amountPaid: 'Amount paid',
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
    stepOneText: '2시간, 4시간 또는 종일 이용을 선택해요.',
    stepTwo: '나만의 스타일',
    stepTwoText: '한복 등급을 비교하고 원하는 스타일을 선택해요.',
    stepThree: '나만의 스타일',
    stepThreeText: '결제를 완료한 뒤 나만의 한복 스타일을 꾸며 보세요.',
    visitEyebrow: '서울에서 만나요',
    visitTitle: '좋아하는 순간에 더 많은 시간을.',
    visitText: '미리 예약하고 피팅 대기 시간을 줄여 서울의 하루를 더 여유롭게 즐겨 보세요.',
    hours: '운영 시간',
    hourRange: '매일 오전 9시 – 오후 7시',
    addressLabel: '위치',
    address: '대한민국 서울',
    addressNote: '서울특별시 종로구 자하문로2길 8(적선동98), 3층',
    footerText: '한복 대여점 · 대한민국 서울',
    bookYourVisit: '방문 예약하기',
    language: '언어',
    bookingTitle: '방문을 준비해 볼까요?',
    bookingIntro: '미리 몇 가지만 선택하면 서울에서 더 여유롭게 즐길 수 있어요.',
    stepLabel: ['날짜와 시간', '한복 및 메이크업', '정보 입력', '결제'],
    durationTitle: '얼마나 이용하고 싶으세요?',
    durations: {
      short: { title: '2시간 대여', duration: '2시간', note: '한복을 처음 입어 보는 날' },
      long: { title: '4시간 대여', duration: '4시간', note: '천천히 둘러보고 싶은 날' },
      day: { title: '종일 이용', duration: '종일', note: '오후 4시 전 시작 · 오후 7시 반납' },
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
    packageTitle: '한복 등급을 선택해 주세요',
    packageHint: '가격은 1인 기준이며, 선택한 메이크업 비용은 총액에 추가돼요.',
    packagePrice: '1인 기준',
    selectedPrice: '선택한 이용 시간',
    tierSubtotal: '한복 대여 소계',
    makeupHint: '방문객별 메이크업을 선택해 주세요. 선택한 서비스 비용이 한복 가격에 추가돼요.',
    makeupNone: '메이크업 없음',
    menMakeup: '남성 메이크업',
    womenMakeup: '여성 메이크업',
    noneOption: '없음',
    included: '선택 가능',
    originCountry: '국적 또는 거주 국가',
    serviceLanguage: '원하는 서비스 언어',
    smsReminderConsent: '반납 알림을 원하시나요?',
    smsConsentHint: '알림 선호도를 선택해 주세요.',
    continueToStyling: '스타일 선택 계속하기',
    continueToPayment: '결제 페이지로',
    paymentTitle: '결제를 진행해 주세요',
    paymentOptionsTitle: '결제 금액을 선택해 주세요',
    paymentMethodTitle: '결제 방법',
    cardPayment: '신용/체크카드',
    payNow: '결제하기',
    paymentSuccessTitle: '결제가 완료됐어요',
    paymentSuccessText: '예약 정보가 준비됐어요. 스타일을 골라 보세요.',
    customizationTitle: '나만의 한복 꾸미기',
    customizationIntro: '한복 등급과 서비스를 선택했어요. 방문객별 사이즈를 입력하고 스타일을 골라 보세요.',
    measurementsTitle: '신체 사이즈',
    measurementsHint: '방문객별 키와 의류 사이즈를 입력해 주세요. 신발을 선택한 경우에만 신발 사이즈가 필요해요.',
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
    reviewTitle: '의상 확인',
    reviewHint: '예약을 마치기 전에 의상과 사이즈를 확인해 주세요.',
    packageLabel: '한복 등급',
    measurementsError: '모든 방문객의 키와 의류 사이즈를 입력하고, 신발을 선택한 경우 신발 사이즈도 입력해 주세요.',
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
    fullPayment: '전액 결제',
    depositPayment: '20% 예약금 결제',
    dueToday: '지금 결제할 금액',
    dueAtVenue: '매장 결제 잔액',
    orderSummary: '예약 내용',
    summaryDate: '날짜',
    summaryTime: '시작 시간',
    summaryDuration: '이용 시간',
    summaryGuests: '인원',
    summaryTotal: '총 금액',
    confirmedTitle: '서울 방문 정보가 준비됐어요!',
    confirmedText: '방문 정보와 함께 예약 번호를 보관해 주세요.',
    bookingCode: '예약 번호',
    amountPaid: '결제 금액',
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
    serviceText: '提前选择日期、韩服等级和细节，让您到店后尽情享受首尔时光。',
    stepOne: '选择时段',
    stepOneText: '选择 2 小时、4 小时或全天体验。',
    stepTwo: '选择韩服',
    stepTwoText: '比较韩服等级，并为每位客人选择妆容服务。',
    stepThree: '定制造型',
    stepThreeText: '选择韩服等级并完成付款后，再搭配韩服造型。',
    visitEyebrow: '首尔见',
    visitTitle: '为美好时光多留一点时间。',
    visitText: '提前预约，减少试衣等待，在首尔享受更轻松的一天。',
    hours: '营业时间',
    hourRange: '每天 9:00 – 19:00',
    addressLabel: '地点',
    address: '韩国首尔',
    addressNote: '首尔特别市钟路区',
    footerText: '韩服租赁店 · 韩国首尔',
    bookYourVisit: '预约到访',
    language: '语言',
    bookingTitle: '计划您的到访',
    bookingIntro: '提前做好选择，让您在首尔拥有更多轻松时光。',
    stepLabel: ['日期和时间', '韩服与妆容', '信息', '付款'],
    durations: {
      short: { title: '2 小时租赁', duration: '2 小时', note: '初次体验的好选择' },
      long: { title: '4 小时租赁', duration: '4 小时', note: '慢慢探索首尔' },
      day: { title: '全天体验', duration: '全天', note: '16:00 前开始 · 19:00 前归还' },
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
    packageTitle: '选择韩服等级',
    packageHint: '价格按每位客人计算。所选妆容服务费用会加入总价。',
    packagePrice: '每位',
    selectedPrice: '所选时长价格',
    tierSubtotal: '韩服小计',
    makeupHint: '请为每位客人选择妆容服务；费用将加在韩服价格上。',
    makeupNone: '不需要妆容',
    menMakeup: '男士妆容',
    womenMakeup: '女士妆容',
    noneOption: '无',
    included: '可选择',
    originCountry: '国家或地区',
    serviceLanguage: '服务语言偏好',
    smsReminderConsent: '您需要归还提醒吗？',
    smsConsentHint: '设置您的提醒偏好。',
    continueToStyling: '继续搭配造型',
    continueToPayment: '继续付款',
    paymentTitle: '完成付款',
    paymentOptionsTitle: '选择付款金额',
    paymentMethodTitle: '付款方式',
    cardPayment: '信用卡/借记卡',
    payNow: '立即付款',
    paymentSuccessTitle: '付款完成',
    paymentSuccessText: '预约信息已准备就绪。继续搭配造型。',
    customizationTitle: '定制您的韩服造型',
    customizationIntro: '韩服等级和服务已选择。请填写每位客人的尺寸并挑选造型。',
    measurementsTitle: '尺寸信息',
    measurementsHint: '请填写每位客人的身高和服装尺码；仅在租鞋时需要填写鞋码。',
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
    reviewTitle: '确认您的造型',
    reviewHint: '完成预约前，请确认造型和尺寸。',
    packageLabel: '韩服等级',
    measurementsError: '请为每位客人填写有效身高和服装尺码；如选择租鞋，还需填写鞋码。',
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
    fullPayment: '全额付款',
    depositPayment: '支付 20% 定金',
    dueToday: '现在支付',
    dueAtVenue: '到店支付余额',
    orderSummary: '预约内容',
    summaryDate: '日期',
    summaryTime: '开始时间',
    summaryDuration: '时长',
    summaryGuests: '人数',
    summaryTotal: '总金额',
    confirmedTitle: '您的首尔行程信息已准备就绪！',
    confirmedText: '请与到访信息一同保存预约编号。',
    bookingCode: '预约编号',
    amountPaid: '已支付金额',
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

function packageName(tierId: PackageId, language: Language): string {
  const tier = HANBOK_TIERS.find((item) => item.id === tierId)
  if (!tier) throw new Error(`Unknown Hanbok tier: ${tierId}`)
  if (language === 'ko') return tier.nameKo
  if (language === 'zh') return tier.nameZh
  return tier.nameEn
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
  const [tierId, setTierId] = useState<PackageId>('special')
  const [contact, setContact] = useState<ContactDetails>({
    name: '',
    phone: '',
    email: '',
    countryOfOrigin: '',
    serviceLanguage: 'en',
    smsReminderConsent: false,
  })
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full')
  const [paymentStatus, setPaymentStatus] = useState<'ready' | 'complete'>('ready')
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
  const total = getBookingTotal(tierId, duration, guests)
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
    setTierId('special')
    setContact({
      name: '',
      phone: '',
      email: '',
      countryOfOrigin: '',
      serviceLanguage: language,
      smsReminderConsent: false,
    })
    setPaymentType('full')
    setPaymentStatus('ready')
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

  function changeMakeup(index: number, makeupService?: MakeupService) {
    setGuests((current) =>
      current.map((guest, guestIndex) =>
        guestIndex === index
          ? { ...guest, makeup: makeupService !== undefined, makeupService }
          : guest,
      ),
    )
  }

  function changeShoes(index: number, shoes: boolean) {
    setGuests((current) =>
      current.map((guest, guestIndex) => guestIndex === index ? { ...guest, shoes } : guest),
    )
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

  function toPaymentStep(event: FormEvent<HTMLFormElement>) {
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
    setFormError('')
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function processPayment() {
    if (paymentStatus === 'complete') return
    if (!date || date < localDateString()) {
      setFormError(t.dateError)
      setStep(1)
      return
    }
    if (startMin === null) {
      setFormError(t.chooseTimeError)
      setStep(1)
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

    const totalPrice = getBookingTotal(tierId, duration, guests)
    const amounts = getPaymentAmounts(totalPrice, paymentType)
    const packageGuests = guests.map((guest) => ({
      ...guest,
      bag: true,
    }))
    const booking: BookingRecord = {
      id: `HG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date,
      startMin,
      endMin: getBookingEndMinute(startMin, duration),
      duration,
      guests: packageGuests,
      tierId,
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
    setPaymentStatus('complete')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function continueToStyling() {
    if (!currentBooking || paymentStatus !== 'complete') {
      setStorageError(true)
      return
    }
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
            <div className="hero-art">
              <div className="photo-frame photo-frame-main">
                <img src="/images/home-hanbok.png" alt="Two guests wearing hanbok" />
              </div>
              <div className="photo-frame photo-frame-small">
                <img src="/images/home-styling.png" alt="Portrait beside cherry blossoms" />
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
    const tierTotal = getPackageTotal(tierId, duration, guests.length)
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
            <li><span>{t.packageLabel}</span><span>{packageName(tierId, language)}</span></li>
            <li><span>{t.tierSubtotal}</span><span>{money(tierTotal)}</span></li>
            {guests.map((guest, index) => guest.makeupService && (
              <li key={`makeup-summary-${index}`}>
                <span>{t.guest} {index + 1} · {guest.makeupService === 'men' ? t.menMakeup : t.womenMakeup}</span>
                <span>{money(MAKEUP_PRICES[guest.makeupService])}</span>
              </li>
            ))}
            {guests.map((guest, index) => guest.shoes && (
              <li key={`shoes-summary-${index}`}>
                <span>{t.guest} {index + 1} · {t.shoesTitle}</span>
                <span>{money(SHOE_RENTAL_PRICE)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="summary-total"><span>{t.summaryTotal}</span><strong>{money(total)}</strong></div>
        {step === 4 && (
          <>
            <div className="summary-total summary-due">
              <span>{paymentStatus === 'complete' ? t.amountPaid : t.dueToday}</span>
              <strong>{money(payment.amountDueNow)}</strong>
            </div>
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
                  {HANBOK_TIERS.map((tier) => {
                    const selected = tierId === tier.id
                    const name = language === 'ko' ? tier.nameKo : language === 'zh' ? tier.nameZh : tier.nameEn
                    const description = language === 'ko' ? tier.descriptionKo : language === 'zh' ? tier.descriptionZh : tier.descriptionEn
                    return (
                      <button
                        className={`rental-package-card ${selected ? 'is-selected' : ''}`}
                        type="button"
                        key={tier.id}
                        aria-pressed={selected}
                        onClick={() => setTierId(tier.id)}
                      >
                        <strong>{name}</strong>
                        <span className="package-card-price-list">
                          {(['short', 'long', 'day'] as const).map((key) => (
                            <span className={duration === key ? 'is-current-duration' : ''} key={key}>
                              <small>{t.durations[key].duration}</small>
                              <strong>{money(tier.prices[key])}</strong>
                            </span>
                          ))}
                        </span>
                        <span className="package-card-current-price">
                          {t.selectedPrice}: {money(tier.prices[duration])} <small>/ {t.packagePrice}</small>
                        </span>
                        <span className="package-card-description">{description}</span>
                      </button>
                    )
                  })}
                </div>
                <section className="makeup-selection-section" aria-label={t.makeupTitle}>
                  <div className="step-title-row">
                    <div><h3>{t.makeupTitle}</h3><p>{t.makeupHint}</p></div>
                  </div>
                  <div className="makeup-selection-grid">
                    {guests.map((guest, index) => (
                      <fieldset className="makeup-selection-card" key={`makeup-${index}`}>
                        <legend>{t.guest} {index + 1}</legend>
                        <label className={`makeup-option ${!guest.makeupService ? 'is-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`makeup-${index}`}
                            checked={!guest.makeupService}
                            onChange={() => changeMakeup(index)}
                          />
                          <span><strong>{t.makeupNone}</strong><small>{t.free}</small></span>
                        </label>
                        <label className={`makeup-option ${guest.makeupService === 'men' ? 'is-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`makeup-${index}`}
                            checked={guest.makeupService === 'men'}
                            onChange={() => changeMakeup(index, 'men')}
                          />
                          <span><strong>{t.menMakeup}</strong><small>{money(MAKEUP_PRICES.men)}</small></span>
                        </label>
                        <label className={`makeup-option ${guest.makeupService === 'women' ? 'is-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`makeup-${index}`}
                            checked={guest.makeupService === 'women'}
                            onChange={() => changeMakeup(index, 'women')}
                          />
                          <span><strong>{t.womenMakeup}</strong><small>{money(MAKEUP_PRICES.women)}</small></span>
                        </label>
                      </fieldset>
                    ))}
                  </div>
                </section>
                <section className="makeup-selection-section" aria-label={t.shoesTitle}>
                  <div className="step-title-row">
                    <div><h3>{t.shoesTitle}</h3></div>
                  </div>
                  <div className="makeup-selection-grid">
                    {guests.map((guest, index) => (
                      <fieldset className="makeup-selection-card" key={`shoes-${index}`}>
                        <legend>{t.guest} {index + 1}</legend>
                        <label className={`makeup-option ${guest.shoes ? 'is-selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={guest.shoes}
                            onChange={(event) => changeShoes(index, event.target.checked)}
                          />
                          <span><strong>{t.addShoes}</strong><small>{money(SHOE_RENTAL_PRICE)}</small></span>
                        </label>
                      </fieldset>
                    ))}
                  </div>
                </section>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(1); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="button" onClick={toContactStep}>{t.continue}<span aria-hidden="true"> →</span></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="booking-step contact-step" onSubmit={toPaymentStep}>
                <h2>{t.contactTitle}</h2>
                <p>{t.contactHint}</p>
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
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(2); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="submit">{t.continueToPayment}<span aria-hidden="true"> →</span></button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="booking-step payment-step">
                {paymentStatus === 'complete' ? (
                  <div className="payment-success-panel" role="status">
                    <span className="payment-success-icon" aria-hidden="true">✓</span>
                    <p className="eyebrow">{t.paymentSuccessTitle}</p>
                    <h2>{money(currentBooking?.amountPaid ?? payment.amountDueNow)}</h2>
                    <p>{t.paymentSuccessText}</p>
                    {currentBooking && (
                      <p className="payment-reference">{t.bookingCode}: {currentBooking.id}</p>
                    )}
                    <div className="step-actions">
                      <button className="button button-plum" type="button" onClick={continueToStyling}>
                        {t.continueToStyling}<span aria-hidden="true"> →</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2>{t.paymentTitle}</h2>
                    <div className="payment-method-card">
                      <span className="payment-method-icon" aria-hidden="true">▰</span>
                      <span>
                        <strong>{t.paymentMethodTitle}</strong>
                        <small>{t.cardPayment}</small>
                      </span>
                      <span className="payment-method-check" aria-hidden="true">✓</span>
                    </div>
                    <fieldset className="payment-options">
                      <legend>{t.paymentOptionsTitle}</legend>
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
                      <button className="button button-outline" type="button" onClick={() => { setStep(3); setFormError('') }}>← {t.back}</button>
                      <button className="button button-plum" type="button" onClick={processPayment}>
                        {t.payNow} {money(payment.amountDueNow)}<span aria-hidden="true"> →</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
          <div className="summary-column">{renderSummary()}</div>
        </div>
      </main>
    )
  }

  function renderCustomization() {
    if (!currentBooking?.tierId) return renderHome()
    return (
      <Customization
        language={language}
        text={t}
        tierName={packageName(currentBooking.tierId, language)}
        bookingTotal={currentBooking.total}
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
    const selectedTier = currentBooking.tierId
      ? HANBOK_TIERS.find((item) => item.id === currentBooking.tierId)
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
            {selectedTier && <div><span>{t.packageLabel}</span><strong>{language === 'ko' ? selectedTier.nameKo : language === 'zh' ? selectedTier.nameZh : selectedTier.nameEn}</strong></div>}
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
                <span>{t.hairstyle}: {wardrobeName(HAIRSTYLES, guest.hairstyleId, language)}</span>
                {guest.hairAccessoryId && <span>{t.hairAccessories}: {wardrobeName(HAIR_ACCESSORIES, guest.hairAccessoryId, language)}</span>}
                {guest.norigaeId && <span>{t.norigae}: {wardrobeName(NORIGAE_OPTIONS, guest.norigaeId, language)}</span>}
                {guest.makeupService && <span>{t.makeupTitle}: {guest.makeupService === 'men' ? t.menMakeup : t.womenMakeup}</span>}
                {guest.shoes && <span>{t.shoesTitle}: {money(SHOE_RENTAL_PRICE)}</span>}
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
