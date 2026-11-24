import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import {
  CHIMA_OPTIONS,
  CLOTHING_SIZES,
  HAIR_ACCESSORIES,
  HAIRSTYLES,
  JEOGORI_OPTIONS,
  NORIGAE_OPTIONS,
  SHOE_SIZES,
  getCompatibleOptions,
  suggestColorPalette,
  type ColorQuestionnaireAnswers,
  type ColorPalette,
  type ClothingSize,
  type GuestSelection,
  type RentalPackage,
  type ServiceLanguage,
  type WardrobeOption,
} from './booking'

type CustomizationText = {
  customizationTitle: string
  customizationIntro: string
  measurementsTitle: string
  measurementsHint: string
  height: string
  clothingSize: string
  shoeSize: string
  colorTitle: string
  colorHint: string
  colorDisclosure: string
  warmPalette: string
  coolPalette: string
  neutralPalette: string
  skipColor: string
  photoUploadTitle: string
  photoUploadHint: string
  photoChoose: string
  photoRemove: string
  photoError: string
  jewelryQuestion: string
  goldTone: string
  silverTone: string
  bothTones: string
  colorPreferenceQuestion: string
  warmColorPreference: string
  coolColorPreference: string
  neutralColorPreference: string
  suggestedPalette: string
  wardrobeTitle: string
  wardrobeHint: string
  jeogori: string
  chima: string
  hairstyle: string
  hairAccessories: string
  norigae: string
  preview: string
  included: string
  recommended: string
  photoComing: string
  packageLocked: string
  reviewTitle: string
  reviewHint: string
  packageLabel: string
  guest: string
  measurementsError: string
  continue: string
  back: string
  finishCustomization: string
}

type CustomizationProps = {
  language: ServiceLanguage
  text: CustomizationText
  rentalPackage: RentalPackage
  guests: GuestSelection[]
  onGuestsChange: (guests: GuestSelection[]) => void
  onComplete: (guests: GuestSelection[]) => boolean
}

const stages = ['measurements', 'colors', 'wardrobe', 'review'] as const
type Stage = (typeof stages)[number]
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function optionName(
  option: Pick<WardrobeOption, 'nameEn' | 'nameKo' | 'nameZh'>,
  language: ServiceLanguage,
): string {
  if (language === 'ko') return option.nameKo
  if (language === 'zh') return option.nameZh
  return option.nameEn
}

function packageName(rentalPackage: RentalPackage, language: ServiceLanguage): string {
  if (language === 'ko') return rentalPackage.nameKo
  if (language === 'zh') return rentalPackage.nameZh
  return rentalPackage.nameEn
}

function money(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

function updateGuest(
  guests: GuestSelection[],
  index: number,
  update: Partial<GuestSelection>,
): GuestSelection[] {
  return guests.map((guest, guestIndex) =>
    guestIndex === index ? { ...guest, ...update } : guest,
  )
}

function prioritizePalette(
  options: readonly WardrobeOption[],
  palette?: ColorPalette,
): WardrobeOption[] {
  if (!palette) return [...options]
  return [...options].sort(
    (left, right) => Number(right.palette === palette) - Number(left.palette === palette),
  )
}

function OptionGallery({
  options,
  selectedId,
  palette,
  language,
  text,
  onSelect,
}: {
  options: readonly WardrobeOption[]
  selectedId?: string
  palette?: ColorPalette
  language: ServiceLanguage
  text: CustomizationText
  onSelect: (id: string) => void
}) {
  return (
    <div className="look-option-gallery">
      {prioritizePalette(options, palette).map((option) => {
        const selected = selectedId === option.id
        const recommended = palette === option.palette
        return (
          <button
            className={`look-option ${selected ? 'is-selected' : ''} ${option.id === 'natural' ? 'look-option-natural' : ''}`}
            type="button"
            key={option.id}
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
            style={{ '--option-color': option.color } as CSSProperties}
          >
            <span className="look-option-media">
              {option.imageUrl ? (
                <img className="look-option-image" src={option.imageUrl} alt="" loading="lazy" />
              ) : (
                <span className="look-option-placeholder">
                  <span aria-hidden="true">✿</span>
                  <small>{text.photoComing}</small>
                </span>
              )}
            </span>
            <span className="look-option-copy">
              <strong>{optionName(option, language)}</strong>
              <small>{recommended ? text.recommended : text.included}</small>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function OutfitPreview({
  guest,
  packageInfo,
  text,
  language,
}: {
  guest: GuestSelection
  packageInfo: RentalPackage
  text: CustomizationText
  language: ServiceLanguage
}) {
  const top = JEOGORI_OPTIONS.find((option) => option.id === guest.jeogoriId) ?? JEOGORI_OPTIONS[0]
  const skirt = CHIMA_OPTIONS.find((option) => option.id === guest.chimaId) ?? CHIMA_OPTIONS[0]
  const hair = HAIRSTYLES.find((option) => option.id === guest.hairstyleId) ?? HAIRSTYLES[0]
  const hairAccessory =
    HAIR_ACCESSORIES.find((option) => option.id === guest.hairAccessoryId) ?? HAIR_ACCESSORIES[0]
  const norigae = NORIGAE_OPTIONS.find((option) => option.id === guest.norigaeId) ?? NORIGAE_OPTIONS[0]

  return (
    <div className="outfit-preview">
      <p className="eyebrow">{text.preview}</p>
      <svg viewBox="0 0 220 310" role="img" aria-label={`${text.preview}: ${packageName(packageInfo, language)}`}>
        <ellipse cx="110" cy="292" rx="72" ry="10" fill="#e9e1d7" />
        <path d="M91 46c-6-29 9-39 21-39 20 0 29 18 21 43l-8 12H97z" fill="#40312f" />
        <circle cx="110" cy="43" r="22" fill="#f1cbb1" />
        <path d="M88 42c1-26 13-34 25-34 18 0 28 16 24 36-8-7-13-15-16-22-9 12-19 18-33 20z" fill="#40312f" />
        <path d="M103 60h14l8 13-15 17-15-17z" fill="#f1cbb1" />
        <path d="M77 80l25-9 8 21 8-21 25 9 23 62-34-5-7-23v35H92v-35l-7 23-34 5z" fill={top.color} stroke="#765c58" strokeWidth="2" />
        <path d="M102 72l8 20 8-20 11 8-16 20-16-20z" fill="#fff8eb" stroke="#765c58" strokeWidth="1.5" />
        <path d="M91 146h38l39 123c-30 24-86 24-116 0z" fill={skirt.color} stroke="#765c58" strokeWidth="2" />
        <path d="M110 101v82" stroke="#fff4dd" strokeWidth="3" />
        {packageInfo.includesHairAccessories && (
          <circle cx="128" cy="27" r="6" fill={hairAccessory.color} stroke="#765c58" strokeWidth="2" />
        )}
        {packageInfo.includesHairAccessories && (
          <path d="M126 152c12 5 15 15 8 24-7 7-14 3-13-4 1-7 7-9 5-20z" fill={norigae.color} stroke="#765c58" strokeWidth="1.5" />
        )}
        {packageInfo.includesHairstyling && (
          <path d="M85 34c-6 10-4 21 3 26" fill="none" stroke={hair.color} strokeWidth="5" strokeLinecap="round" />
        )}
      </svg>
    </div>
  )
}

export default function Customization({
  language,
  text,
  rentalPackage,
  guests,
  onGuestsChange,
  onComplete,
}: CustomizationProps) {
  const [stage, setStage] = useState<Stage>('measurements')
  const [error, setError] = useState('')
  const [photoPreviews, setPhotoPreviews] = useState<(string | undefined)[]>([])
  const photoPreviewsRef = useRef<(string | undefined)[]>([])
  const [colorAnswers, setColorAnswers] = useState<ColorQuestionnaireAnswers[]>(() =>
    guests.map(() => ({})),
  )
  const update = (index: number, patch: Partial<GuestSelection>) =>
    onGuestsChange(updateGuest(guests, index, patch))

  useEffect(
    () => () => {
      photoPreviewsRef.current.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview)
      })
    },
    [],
  )

  function setPhotoPreview(index: number, preview?: string) {
    const next = [...photoPreviewsRef.current]
    if (next[index]) URL.revokeObjectURL(next[index])
    next[index] = preview
    photoPreviewsRef.current = next
    setPhotoPreviews(next)
  }

  function choosePhoto(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES) {
      setError(text.photoError)
      return
    }
    setError('')
    setPhotoPreview(index, URL.createObjectURL(file))
  }

  function updateColorAnswers(index: number, answers: ColorQuestionnaireAnswers) {
    const next = [...colorAnswers]
    next[index] = answers
    setColorAnswers(next)
    update(index, { colorPalette: suggestColorPalette(answers) })
  }

  function paletteLabel(palette: ColorPalette): string {
    if (palette === 'warm') return text.warmPalette
    if (palette === 'cool') return text.coolPalette
    return text.neutralPalette
  }

  function continueFromMeasurements() {
    const complete = guests.every(
      (guest) =>
        typeof guest.heightCm === 'number' &&
        guest.heightCm >= 80 &&
        guest.heightCm <= 230 &&
        !!guest.clothingSize &&
        !!guest.shoeSize,
    )
    if (!complete) {
      setError(text.measurementsError)
      return
    }
    setError('')
    setStage('colors')
  }

  function changeClothingSize(index: number, size: ClothingSize) {
    const topOptions = getCompatibleOptions(JEOGORI_OPTIONS, size)
    const skirtOptions = getCompatibleOptions(CHIMA_OPTIONS, size)
    const guest = guests[index]
    update(index, {
      clothingSize: size,
      jeogoriId: topOptions.some((option) => option.id === guest.jeogoriId)
        ? guest.jeogoriId
        : topOptions[0]?.id,
      chimaId: skirtOptions.some((option) => option.id === guest.chimaId)
        ? guest.chimaId
        : skirtOptions[0]?.id,
    })
  }

  const stepIndex = stages.indexOf(stage)
  const clothingSize = (guest: GuestSelection) => guest.clothingSize ?? 'M'

  return (
    <main className="customization-page">
      <section className="customization-card">
        <p className="eyebrow">{text.customizationTitle}</p>
        <h1>{text.customizationTitle}</h1>
        <p className="customization-intro">{text.customizationIntro}</p>
        <ol className="customization-stepper" aria-label={text.customizationTitle}>
          {stages.map((item, index) => (
            <li className={index === stepIndex ? 'is-active' : index < stepIndex ? 'is-complete' : ''} key={item}>
              <span>{index < stepIndex ? '✓' : `0${index + 1}`}</span>
              {item === 'measurements' ? text.measurementsTitle
                : item === 'colors' ? text.colorTitle
                  : item === 'wardrobe' ? text.wardrobeTitle
                    : text.reviewTitle}
            </li>
          ))}
        </ol>

        {stage === 'measurements' && (
          <section className="customization-stage">
            <h2>{text.measurementsTitle}</h2>
            <p>{text.measurementsHint}</p>
            <div className="guest-style-list">
              {guests.map((guest, index) => (
                <article className="guest-style-card" key={`measure-${index}`}>
                  <div className="guest-style-heading"><span className="guest-badge">{String(index + 1).padStart(2, '0')}</span><h3>{text.guest} {index + 1}</h3></div>
                  <div className="measurement-grid">
                    <label className="form-field">
                      <span>{text.height}</span>
                      <input
                        type="number"
                        min="80"
                        max="230"
                        value={guest.heightCm ?? ''}
                        onChange={(event) => update(index, { heightCm: event.target.value === '' ? undefined : event.target.valueAsNumber })}
                        required
                      />
                    </label>
                    <label className="form-field">
                      <span>{text.clothingSize}</span>
                      <select value={guest.clothingSize ?? ''} onChange={(event) => changeClothingSize(index, event.target.value as ClothingSize)} required>
                        <option value="">—</option>
                        {CLOTHING_SIZES.map((size) => <option value={size} key={size}>{size}</option>)}
                      </select>
                    </label>
                    <label className="form-field">
                      <span>{text.shoeSize}</span>
                      <select value={guest.shoeSize} onChange={(event) => update(index, { shoeSize: event.target.value })} required>
                        <option value="">—</option>
                        {SHOE_SIZES.map((size) => <option value={size} key={size}>{size} mm</option>)}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="step-actions"><button className="button button-plum" type="button" onClick={continueFromMeasurements}>{text.continue}<span aria-hidden="true"> →</span></button></div>
          </section>
        )}

        {stage === 'colors' && (
          <section className="customization-stage">
            <h2>{text.colorTitle}</h2>
            <p>{text.colorHint}</p>
            <p className="photo-disclosure">{text.colorDisclosure}</p>
            {guests.map((_, index) => {
              const answers = colorAnswers[index] ?? {}
              const suggestion = suggestColorPalette(answers)
              return (
                <article className="color-profile-card" key={`palette-${index}`}>
                  <div className="guest-style-heading">
                    <span className="guest-badge">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{text.guest} {index + 1}</h3>
                  </div>
                  <div className="color-profile-layout">
                    <div className="photo-upload-card">
                      {photoPreviews[index] ? (
                        <img
                          className="color-photo-preview"
                          src={photoPreviews[index]}
                          alt={`${text.guest} ${index + 1}`}
                        />
                      ) : (
                        <div className="color-photo-placeholder" aria-hidden="true">✿</div>
                      )}
                      <label className="photo-upload-button">
                        <span>{photoPreviews[index] ? text.photoChoose : text.photoUploadTitle}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => choosePhoto(index, event)}
                        />
                      </label>
                      {photoPreviews[index] && (
                        <button
                          className="photo-remove-button"
                          type="button"
                          onClick={() => setPhotoPreview(index)}
                        >
                          {text.photoRemove}
                        </button>
                      )}
                      <small>{text.photoUploadHint}</small>
                    </div>
                    <div className="color-questionnaire">
                      <fieldset className="palette-question">
                        <legend>{text.jewelryQuestion}</legend>
                        <div className="palette-options">
                          {([
                            ['gold', text.goldTone],
                            ['silver', text.silverTone],
                            ['both', text.bothTones],
                          ] as const).map(([tone, label]) => (
                            <button
                              className={answers.jewelryTone === tone ? 'is-selected' : ''}
                              type="button"
                              key={tone}
                              aria-pressed={answers.jewelryTone === tone}
                              onClick={() => updateColorAnswers(index, { ...answers, jewelryTone: tone })}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="palette-question">
                        <legend>{text.colorPreferenceQuestion}</legend>
                        <div className="palette-options">
                          {([
                            ['warm', text.warmColorPreference],
                            ['cool', text.coolColorPreference],
                            ['neutral', text.neutralColorPreference],
                          ] as const).map(([palette, label]) => (
                            <button
                              className={answers.preferredPalette === palette ? 'is-selected' : ''}
                              type="button"
                              key={palette}
                              aria-pressed={answers.preferredPalette === palette}
                              onClick={() => updateColorAnswers(index, { ...answers, preferredPalette: palette })}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      {suggestion && (
                        <p className="palette-result" role="status">
                          {text.suggestedPalette}: {paletteLabel(suggestion)}
                        </p>
                      )}
                      <button
                        className="skip-color-button"
                        type="button"
                        onClick={() => updateColorAnswers(index, {})}
                      >
                        {text.skipColor}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="step-actions step-actions-between">
              <button className="button button-outline" type="button" onClick={() => setStage('measurements')}>← {text.back}</button>
              <button className="button button-plum" type="button" onClick={() => setStage('wardrobe')}>{text.continue}<span aria-hidden="true"> →</span></button>
            </div>
          </section>
        )}

        {stage === 'wardrobe' && (
          <section className="customization-stage">
            <h2>{text.wardrobeTitle}</h2>
            <p>{text.wardrobeHint}</p>
            <p className="wardrobe-package-summary">
              {text.packageLabel}: {packageName(rentalPackage, language)} · {money(rentalPackage.price * guests.length)}
            </p>
            <div className="guest-style-list">
              {guests.map((guest, index) => {
                const size = clothingSize(guest)
                const tops = getCompatibleOptions(JEOGORI_OPTIONS, size)
                const skirts = getCompatibleOptions(CHIMA_OPTIONS, size)
                const hairstyles = rentalPackage.includesHairstyling
                  ? getCompatibleOptions(HAIRSTYLES, size)
                  : HAIRSTYLES.filter((style) => style.id === 'natural')
                return (
                  <article className="guest-style-card wardrobe-guest" key={`wardrobe-${index}`}>
                    <div className="guest-style-heading"><span className="guest-badge">{String(index + 1).padStart(2, '0')}</span><h3>{text.guest} {index + 1}</h3></div>
                    <div className="outfit-layout">
                      <OutfitPreview guest={guest} packageInfo={rentalPackage} text={text} language={language} />
                      <div className="wardrobe-choices">
                        <fieldset className="look-gallery-fieldset">
                          <legend>{text.jeogori} · {size}</legend>
                          <OptionGallery options={tops} selectedId={guest.jeogoriId} palette={guest.colorPalette} language={language} text={text} onSelect={(id) => update(index, { jeogoriId: id })} />
                        </fieldset>
                        <fieldset className="look-gallery-fieldset">
                          <legend>{text.chima} · {size}</legend>
                          <OptionGallery options={skirts} selectedId={guest.chimaId} palette={guest.colorPalette} language={language} text={text} onSelect={(id) => update(index, { chimaId: id })} />
                        </fieldset>
                        <fieldset className="look-gallery-fieldset">
                          <legend>{text.hairstyle}</legend>
                          <OptionGallery options={hairstyles} selectedId={guest.hairstyleId} palette={guest.colorPalette} language={language} text={text} onSelect={(id) => update(index, { hairstyleId: id })} />
                        </fieldset>
                        {rentalPackage.includesHairAccessories ? (
                          <>
                            <fieldset className="look-gallery-fieldset">
                              <legend>{text.hairAccessories}</legend>
                              <OptionGallery options={HAIR_ACCESSORIES} selectedId={guest.hairAccessoryId} palette={guest.colorPalette} language={language} text={text} onSelect={(id) => update(index, { hairAccessoryId: id })} />
                            </fieldset>
                            <fieldset className="look-gallery-fieldset">
                              <legend>{text.norigae}</legend>
                              <OptionGallery options={NORIGAE_OPTIONS} selectedId={guest.norigaeId} palette={guest.colorPalette} language={language} text={text} onSelect={(id) => update(index, { norigaeId: id })} />
                            </fieldset>
                          </>
                        ) : (
                          <p className="package-note">{text.packageLocked}</p>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="step-actions step-actions-between">
              <button className="button button-outline" type="button" onClick={() => setStage('colors')}>← {text.back}</button>
              <button className="button button-plum" type="button" onClick={() => setStage('review')}>{text.continue}<span aria-hidden="true"> →</span></button>
            </div>
          </section>
        )}

        {stage === 'review' && (
          <section className="customization-stage">
            <h2>{text.reviewTitle}</h2>
            <p>{text.reviewHint}</p>
            <div className="review-looks">
              {guests.map((guest, index) => (
                <article className="review-look" key={`review-${index}`}>
                  <div className="guest-style-heading"><span className="guest-badge">{String(index + 1).padStart(2, '0')}</span><h3>{text.guest} {index + 1}</h3></div>
                  <OutfitPreview guest={guest} packageInfo={rentalPackage} text={text} language={language} />
                  <p>{text.height}: {guest.heightCm} cm · {text.clothingSize}: {guest.clothingSize} · {text.shoeSize}: {guest.shoeSize} mm</p>
                </article>
              ))}
            </div>
            <div className="step-actions step-actions-between">
              <button className="button button-outline" type="button" onClick={() => setStage('wardrobe')}>← {text.back}</button>
              <button className="button button-plum" type="button" onClick={() => onComplete(guests)}>{text.finishCustomization}<span aria-hidden="true"> →</span></button>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
