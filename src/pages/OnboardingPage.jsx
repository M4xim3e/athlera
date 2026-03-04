// src/pages/OnboardingPage.jsx
import { useState } from 'react'
import { useAuth }    from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useLang }    from '../contexts/LangContext'
import Icons   from '../components/ui/Icons'
import Button  from '../components/ui/Button'
import Input   from '../components/ui/Input'
import Chip    from '../components/ui/Chip'

const STEPS = ['personal', 'body', 'goals', 'gym']

const GOALS = [
  { id: 'MUSCLE_GAIN',  key: 'gMuscle',   icon: 'dumbbell' },
  { id: 'FAT_LOSS',     key: 'gFat',      icon: 'flame'    },
  { id: 'STRENGTH',     key: 'gStrength', icon: 'bolt'     },
  { id: 'MAINTENANCE',  key: 'gMaintain', icon: 'target'   },
  { id: 'PERFORMANCE',  key: 'gPerf',     icon: 'activity' },
]

const calcAge = (dob) => {
  if (!dob) return null
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function OnboardingPage({ onDone }) {
  const { user }        = useAuth()
  const { saveProfile } = useProfile()
  const { t }           = useLang()

  const [step,   setStep]   = useState(0)
  const [saving, setSaving] = useState(false)
  const [data,   setData]   = useState({
    name:       user?.user_metadata?.name || '',
    gender:     null,
    dob:        '',
    height:     '',
    weight:     '',
    target_weight: '',
    goal:       null,
    level:      null,
    freq:       null,
    injuries:   '',
    has_gym:    null,
    gym_id:     null,
    equipment:  [],
  })

  const up = (k, v) => setData(d => ({ ...d, [k]: v }))
  const toggleEq = (eq) => setData(d => ({
    ...d,
    equipment: d.equipment.includes(eq)
      ? d.equipment.filter(e => e !== eq)
      : [...d.equipment, eq],
  }))

  const age = calcAge(data.dob)

  const FREQ_WARNING = {
    1: t('freq1Warn'),
    7: t('freq7Warn'),
  }

  const canAdvance = {
    personal: !!(data.gender && data.dob),
    body:     !!(data.weight && data.height),
    goals:    !!(data.goal && data.level && data.freq),
    gym:      data.has_gym !== null,
  }[STEPS[step]]

  const next   = () => setStep(s => s + 1)
  const back   = () => setStep(s => s - 1)

  const finish = async () => {
    setSaving(true)
    await saveProfile({ ...data, age, email: user?.email })
    setSaving(false)
    onDone()
  }

  const progress = (step + 1) / STEPS.length

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* Progress header */}
      <div style={{
        padding: '24px 24px 0',
        position: 'sticky', top: 0,
        background: 'var(--bg-base)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: 'var(--acc-txt)', letterSpacing: '0.05em' }}>
            ATHLERA
          </span>
          <span style={{ fontSize: 12, color: 'var(--txt-muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
            {t('step')} {step + 1} {t('of')} {STEPS.length}
          </span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: 100, height: 2 }}>
          <div style={{
            background: 'var(--acc)', height: '100%', borderRadius: 100,
            width: `${progress * 100}%`,
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>

      {/* Content */}
      <div key={step} style={{
        flex: 1, padding: '28px 24px 0',
        overflowY: 'auto',
        animation: 'fadeUp 0.24s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* STEP 0 — Personnel */}
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: 'var(--txt)', lineHeight: 1.05, marginBottom: 6 }}>
              {t('createProfile')}
            </h2>
            <p style={{ color: 'var(--txt-sub)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              {t('obSub')}
            </p>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
              {t('gender')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 22 }}>
              {[['MALE','male'],['FEMALE','female'],['OTHER','other']].map(([v,k]) => (
                <Chip key={v} selected={data.gender === v} onClick={() => up('gender', v)}
                  style={{ flexDirection: 'column', padding: '18px 8px', gap: 8, fontSize: 13, borderRadius: 14 }}>
                  <Icons.user size={20} color={data.gender === v ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                  {t(k)}
                </Chip>
              ))}
            </div>

            <Input
              label={t('dob')}
              value={data.dob}
              onChange={v => up('dob', v)}
              type="date"
            />
            {age !== null && age >= 0 && (
              <p style={{ fontSize: 13, color: 'var(--txt-sub)', marginTop: 8 }}>
                {age} {t('yrs')}
              </p>
            )}
          </>
        )}

        {/* STEP 1 — Corps */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: 'var(--txt)', lineHeight: 1.05, marginBottom: 6 }}>
              {t('height')} & {t('weight')}
            </h2>
            <p style={{ color: 'var(--txt-sub)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>{t('obSub')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <Input label={t('height')} value={data.height} onChange={v => up('height', v)}
                type="number" placeholder="178" suffix={t('cm')} min="100" max="250" />
              <Input label={t('weight')} value={data.weight} onChange={v => up('weight', v)}
                type="number" placeholder="75" suffix={t('kg')} min="30" max="300" />
            </div>
            <Input label={t('tgtW')} value={data.target_weight} onChange={v => up('target_weight', v)}
              type="number" placeholder="72" suffix={t('kg')} min="30" max="300" />
            <div style={{ marginTop: 16 }}>
              <Input label={t('injLbl')} value={data.injuries} onChange={v => up('injuries', v)}
                type="textarea" placeholder={t('injPl')} />
            </div>
          </>
        )}

        {/* STEP 2 — Objectifs */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: 'var(--txt)', lineHeight: 1.05, marginBottom: 6 }}>
              {t('goalLbl')}
            </h2>
            <p style={{ color: 'var(--txt-sub)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>{t('obSub')}</p>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
              {t('goalLbl')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 22 }}>
              {GOALS.map(({ id, key, icon }) => {
                const IC = Icons[icon]
                return (
                  <Chip key={id} selected={data.goal === id} onClick={() => up('goal', id)}
                    style={{ flexDirection: 'column', padding: '18px 12px', gap: 8, fontSize: 13, borderRadius: 16 }}>
                    <IC size={22} color={data.goal === id ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                    <span style={{ fontWeight: 600, lineHeight: 1.2, textAlign: 'center' }}>{t(key)}</span>
                  </Chip>
                )
              })}
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
              {t('lvlLbl')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {[['BEGINNER','lvlBeg','lvlBegS'],['INTERMEDIATE','lvlInt','lvlIntS'],['ADVANCED','lvlAdv','lvlAdvS']].map(([v,k,sk]) => (
                <Chip key={v} selected={data.level === v} onClick={() => up('level', v)}
                  style={{ justifyContent: 'space-between', padding: '14px 18px', borderRadius: 14 }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t(k)}</div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{t(sk)}</div>
                  </div>
                  {data.level === v && <Icons.check size={14} color="var(--acc-txt)" />}
                </Chip>
              ))}
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
              {t('freqLbl')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 12 }}>
              {[1,2,3,4,5,6,7].map(f => (
                <Chip key={f} selected={data.freq === f} onClick={() => up('freq', f)}
                  style={{ flexDirection: 'column', padding: '10px 4px', gap: 2, borderRadius: 12 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, lineHeight: 1 }}>{f}</span>
                </Chip>
              ))}
            </div>
            {FREQ_WARNING[data.freq] && (
              <div style={{
                padding: '12px 14px',
                background: data.freq === 7 ? 'rgba(255,69,58,0.08)' : 'rgba(255,159,10,0.08)',
                borderRadius: 14,
                display: 'flex', gap: 10, alignItems: 'flex-start',
                animation: 'fadeUp 0.2s',
              }}>
                <Icons.info size={15} color={data.freq === 7 ? 'var(--err)' : 'var(--warn)'} style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: data.freq === 7 ? 'var(--err)' : 'var(--warn)', lineHeight: 1.6 }}>
                  {FREQ_WARNING[data.freq]}
                </p>
              </div>
            )}
          </>
        )}

        {/* STEP 3 — Salle */}
        {step === 3 && (
          <>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: 'var(--txt)', lineHeight: 1.05, marginBottom: 6 }}>
              {t('hasGym')}
            </h2>
            <p style={{ color: 'var(--txt-sub)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>{t('obSub')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 22 }}>
              <Chip selected={data.has_gym === true}  onClick={() => up('has_gym', true)}
                style={{ borderRadius: 14, padding: 18, fontSize: 15, fontWeight: 700, flexDirection: 'column', gap: 8 }}>
                <Icons.pin size={22} color={data.has_gym === true ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                {t('atGym')}
              </Chip>
              <Chip selected={data.has_gym === false} onClick={() => { up('has_gym', false); up('gym_id', null) }}
                style={{ borderRadius: 14, padding: 18, fontSize: 15, fontWeight: 700, flexDirection: 'column', gap: 8 }}>
                <Icons.dumbbell size={22} color={data.has_gym === false ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                {t('atHome')}
              </Chip>
            </div>

            {data.has_gym === true && (
              <div style={{ animation: 'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
                  {t('gymLbl')}
                </p>
                {[
                  ['onair',       'On Air Fitness',  'Hammer Strength / Technogym'],
                  ['basicfit',    'Basic-Fit',       'Matrix / Technogym'],
                  ['fitnesspark', 'Fitness Park',    'Life Fitness'],
                  ['keepcool',    'KeepCool',        'Technogym'],
                  ['other',       'Autre salle',     'Standard'],
                ].map(([id, name, brand]) => (
                  <Chip key={id} selected={data.gym_id === id} onClick={() => up('gym_id', id)}
                    style={{ justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icons.pin size={15} color={data.gym_id === id ? 'var(--acc-txt)' : 'var(--txt-sub)'} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>{brand}</div>
                      </div>
                    </div>
                    {data.gym_id === id && <Icons.check size={13} color="var(--acc-txt)" />}
                  </Chip>
                ))}
              </div>
            )}

            {data.has_gym === false && (
              <div style={{ animation: 'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 10 }}>
                  {t('eqLbl')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['eqBar','eqDb','eqCbl','eqMch','eqPull','eqBand','eqKb','eqBench','eqBW'].map(eq => (
                    <Chip key={eq} selected={data.equipment.includes(eq)} onClick={() => toggleEq(eq)}
                      style={{ fontSize: 13, padding: '12px 10px', borderRadius: 12, justifyContent: 'flex-start', gap: 8 }}>
                      {data.equipment.includes(eq)
                        ? <Icons.check size={13} color="var(--acc-txt)" />
                        : <div style={{ width: 13, height: 13, borderRadius: 4, border: '1.5px solid var(--border)' }} />
                      }
                      {t(eq)}
                    </Chip>
                  ))}
                </div>
                {/* Info domicile */}
                <div style={{
                  marginTop: 14, padding: '12px 14px',
                  background: 'var(--acc-dim)', borderRadius: 14,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <Icons.info size={14} color="var(--acc-txt)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: 'var(--acc-txt)', lineHeight: 1.6 }}>
                    Même sans salle, on peut créer des séances efficaces adaptées à ton matériel.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 24px 48px', display: 'flex', gap: 10, background: 'var(--bg-base)' }}>
        {step > 0 && (
          <Button variant="ghost" label={t('back')} onClick={back}
            iconLeft={<Icons.chevLeft size={13} color="var(--txt-sub)" />} />
        )}
        <Button
          full disabled={!canAdvance} loading={saving}
          label={step < STEPS.length - 1 ? t('next') : t('finish')}
          onClick={step < STEPS.length - 1 ? next : finish}
          iconRight={step < STEPS.length - 1 ? <Icons.chevRight size={15} color="var(--txt-inv)" /> : null}
        />
      </div>
    </div>
  )
}