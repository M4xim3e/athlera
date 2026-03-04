// src/pages/ProfilePage.jsx
import { useState } from 'react'
import { useAuth }    from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useLang }    from '../contexts/LangContext'
import TopBar  from '../components/layout/TopBar'
import Input   from '../components/ui/Input'
import Button  from '../components/ui/Button'
import Card    from '../components/ui/Card'
import Tag     from '../components/ui/Tag'
import Icons   from '../components/ui/Icons'

export default function ProfilePage({ onBack }) {
  const { user, signOut }        = useAuth()
  const { profile, saveProfile, streak } = useProfile()
  const { t, lang, setLanguage } = useLang()

  const [form,  setForm]  = useState({
    name:   profile?.name   || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    age:    profile?.age    || '',
    target_weight: profile?.target_weight || '',
    injuries: profile?.injuries || '',
  })
  const [saved,   setSaved]   = useState(false)
  const [saving,  setSaving]  = useState(false)

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    await saveProfile({ ...form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const GOAL_LABEL = {
    MUSCLE_GAIN: 'Prise de masse', FAT_LOSS: 'Perte de graisse',
    STRENGTH: 'Force', MAINTENANCE: 'Maintien', PERFORMANCE: 'Performance',
  }
  const LEVEL_LABEL = {
    BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé',
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 40 }}>
      <TopBar onBack={onBack} title={t('profTitle')} />

      <div style={{ padding: '20px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Avatar + Info */}
        <Card className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56,
              background: 'var(--acc-dim)',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--acc)',
            }}>
              <Icons.user size={24} color="var(--acc-txt)" />
            </div>
            <div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22, color: 'var(--txt)',
                letterSpacing: '0.03em', lineHeight: 1,
              }}>
                {profile?.name || user?.email?.split('@')[0] || 'Athlète'}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--txt-sub)', marginTop: 3 }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats résumé */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profile?.goal  && <Tag label={GOAL_LABEL[profile.goal]  || profile.goal}  color="acc"   small />}
            {profile?.level && <Tag label={LEVEL_LABEL[profile.level] || profile.level} color="blue"  small />}
            {profile?.freq  && <Tag label={`${profile.freq}j/sem`}                      color="gray"  small />}
            {streak?.current > 0 && (
              <Tag label={`🔥 ${streak.current} ${t('days')}`} color="green" small />
            )}
          </div>
        </Card>

        {/* Formulaire */}
        <Card className="fade-up fade-up-1">
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 14,
          }}>
            Informations personnelles
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label={t('nameLbl')}   value={form.name}   onChange={v => up('name', v)}   placeholder="Alex" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input label={t('height')}  value={form.height} onChange={v => up('height', v)} type="number" suffix={t('cm')} />
              <Input label={t('weight')}  value={form.weight} onChange={v => up('weight', v)} type="number" suffix={t('kg')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input label={t('age')}     value={form.age}    onChange={v => up('age', v)}    type="number" suffix={t('yrs')} />
              <Input label={t('tgtW')}    value={form.target_weight} onChange={v => up('target_weight', v)} type="number" suffix={t('kg')} />
            </div>
            <Input
              label={t('injLbl')} value={form.injuries}
              onChange={v => up('injuries', v)}
              type="textarea" placeholder={t('injPl')}
            />
          </div>
        </Card>

        {/* Préférences */}
        <Card className="fade-up fade-up-2">
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 14,
          }}>
            Préférences
          </p>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '10px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icons.globe size={16} color="var(--txt-sub)" />
              <span style={{ fontSize: 14, color: 'var(--txt)' }}>{t('menuLang')}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['fr', 'en'].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: lang === l ? 'var(--acc)' : 'var(--surface-up)',
                  color:      lang === l ? 'var(--txt-inv)' : 'var(--txt-sub)',
                  border: `1px solid ${lang === l ? 'var(--acc)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Sauvegarder */}
        <div className="fade-up fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button
            label={saved ? `✓ ${t('profSaved')}` : t('profSave')}
            full size="lg" loading={saving} onClick={handleSave}
          />
          <Button
            label={t('menuOut')} variant="danger" full
            onClick={signOut}
            iconLeft={<Icons.logout size={14} color="var(--err)" />}
          />
        </div>
      </div>
    </div>
  )
}