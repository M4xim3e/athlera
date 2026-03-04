// src/components/anatomy/MuscleDiagram.jsx
// Diagramme anatomique SVG — style illustration médicale simplifiée
// Muscles colorés avec leur vraie forme, reconnaissables au premier coup d'oeil

import { useState } from 'react'

// ─── DÉFINITION DES MUSCLES ───────────────────────
// Chaque muscle = un path SVG précis sur silhouette 200x480

const FRONT_MUSCLES = {
  // PECTORAUX
  chest_upper: {
    label: 'Pectoraux sup.',
    path: 'M88,58 C88,58 95,52 100,54 C105,52 112,58 112,58 L114,68 C114,68 107,64 100,66 C93,64 86,68 86,68 Z',
  },
  chest_mid: {
    label: 'Pectoraux',
    path: 'M86,68 C86,68 93,64 100,66 C107,64 114,68 114,68 L116,82 C116,82 108,77 100,79 C92,77 84,82 84,82 Z',
  },
  chest_low: {
    label: 'Pectoraux inf.',
    path: 'M84,82 C84,82 92,77 100,79 C108,77 116,82 116,82 L115,93 C115,93 107,90 100,91 C93,90 85,93 85,93 Z',
  },
  // ÉPAULES
  delt_ant: {
    label: 'Deltoïde ant.',
    path: 'M70,52 C66,48 62,54 63,63 C64,70 69,74 73,72 L76,61 C74,59 72,56 70,52 Z M130,52 C134,48 138,54 137,63 C136,70 131,74 127,72 L124,61 C126,59 128,56 130,52 Z',
  },
  delt_lat: {
    label: 'Deltoïde lat.',
    path: 'M62,64 C58,61 57,68 58,76 C59,83 63,87 67,85 L70,74 C67,72 64,68 62,64 Z M138,64 C142,61 143,68 142,76 C141,83 137,87 133,85 L130,74 C133,72 136,68 138,64 Z',
  },
  // BICEPS
  biceps_long: {
    label: 'Biceps',
    path: 'M62,87 C58,84 57,92 58,100 C59,107 63,111 67,112 L70,100 C68,97 64,93 62,87 Z M138,87 C142,84 143,92 142,100 C141,107 137,111 133,112 L130,100 C132,97 136,93 138,87 Z',
  },
  biceps_short: {
    label: 'Biceps court',
    path: 'M67,112 C65,116 64,123 65,130 L70,129 C70,123 69,117 67,112 Z M133,112 C135,116 136,123 135,130 L130,129 C130,123 131,117 133,112 Z',
  },
  brachialis: {
    label: 'Brachial',
    path: 'M65,118 C63,122 62,128 64,134 L69,132 C68,127 67,122 65,118 Z M135,118 C137,122 138,128 136,134 L131,132 C132,127 133,122 135,118 Z',
  },
  // AVANT-BRAS
  brachioradialis: {
    label: 'Avant-bras',
    path: 'M64,134 L69,133 L73,158 L68,158 Z M136,134 L131,133 L127,158 L132,158 Z',
  },
  // ABDOMINAUX
  core: {
    label: 'Abdominaux',
    path: 'M92,99 L92,143 C92,143 96,146 100,146 C104,146 108,143 108,143 L108,99 C108,99 104,97 100,97 C96,97 92,99 92,99 Z',
  },
  transverse: {
    label: 'Transverse',
    path: 'M87,126 L92,124 L92,143 L87,141 Z M113,126 L108,124 L108,143 L113,141 Z',
  },
  // QUADRICEPS
  quads_rect: {
    label: 'Droit fémoral',
    path: 'M94,172 L106,172 L107,220 C107,220 104,222 100,222 C96,222 93,220 93,220 Z',
  },
  quads_out: {
    label: 'Vaste latéral',
    path: 'M79,171 L93,171 L93,218 C93,218 87,222 82,218 C77,214 76,206 76,206 Z M121,171 L107,171 L107,218 C107,218 113,222 118,218 C123,214 124,206 124,206 Z',
  },
  quads_in: {
    label: 'Vaste médial',
    path: 'M93,218 C93,218 96,222 100,222 C104,222 107,220 107,218 L107,232 C107,232 104,236 100,236 C96,236 93,232 93,232 Z',
  },
  // TIBIALIS
  tibialis: {
    label: 'Tibial ant.',
    path: 'M78,264 L83,264 L85,304 L80,306 L76,302 Z M122,264 L117,264 L115,304 L120,306 L124,302 Z',
  },
}

const BACK_MUSCLES = {
  // TRAPÈZES
  traps_upper: {
    label: 'Trapèzes sup.',
    path: 'M80,30 C86,25 93,23 100,26 C107,23 114,25 120,30 L118,50 C113,46 107,44 100,46 C93,44 87,46 82,50 Z',
  },
  traps_mid: {
    label: 'Trapèzes moy.',
    path: 'M82,62 L118,62 L116,82 L84,82 Z',
  },
  // RHOMBOÏDES
  rhomboids: {
    label: 'Rhomboïdes',
    path: 'M88,58 L112,58 L110,82 L90,82 Z',
  },
  // GRAND DORSAL
  lats_upper: {
    label: 'Grand dorsal sup.',
    path: 'M70,63 L89,58 L88,88 C83,88 75,83 70,77 Z M130,63 L111,58 L112,88 C117,88 125,83 130,77 Z',
  },
  lats_mid: {
    label: 'Grand dorsal',
    path: 'M68,77 L88,88 L86,116 C79,116 70,108 67,98 Z M132,77 L112,88 L114,116 C121,116 130,108 133,98 Z',
  },
  lats_low: {
    label: 'Grand dorsal inf.',
    path: 'M67,98 L86,116 L85,138 C78,136 69,128 67,118 Z M133,98 L114,116 L115,138 C122,136 131,128 133,118 Z',
  },
  // DELTOÏDE POST
  delt_post: {
    label: 'Deltoïde post.',
    path: 'M67,46 C62,43 61,51 62,59 C63,67 67,71 72,69 L75,57 C72,55 69,51 67,46 Z M133,46 C138,43 139,51 138,59 C137,67 133,71 128,69 L125,57 C128,55 131,51 133,46 Z',
  },
  // TRICEPS
  triceps_long: {
    label: 'Triceps long',
    path: 'M63,84 C59,81 57,89 58,97 C59,105 61,111 65,114 L68,102 C66,98 64,92 63,84 Z M137,84 C141,81 143,89 142,97 C141,105 139,111 135,114 L132,102 C134,98 136,92 137,84 Z',
  },
  triceps_lat: {
    label: 'Triceps latéral',
    path: 'M65,114 C63,118 62,124 63,130 L68,130 C68,124 67,118 65,114 Z M135,114 C137,118 138,124 137,130 L132,130 C132,124 133,118 135,114 Z',
  },
  triceps_all: {
    label: 'Triceps',
    path: 'M63,84 C59,81 57,89 58,97 C59,105 63,114 65,114 C63,118 62,124 63,130 L68,130 C68,124 67,118 65,114 C65,114 63,105 63,97 C63,92 64,88 63,84 Z M137,84 C141,81 143,89 142,97 C141,105 137,114 135,114 C137,118 138,124 137,130 L132,130 C132,124 133,118 135,114 C135,114 137,105 137,97 C137,92 136,88 137,84 Z',
  },
  // ÉRECTEURS
  erectors: {
    label: 'Érecteurs',
    path: 'M91,132 L96,131 L96,168 L91,168 Z M109,132 L104,131 L104,168 L109,168 Z',
  },
  // FESSIERS
  glute_max: {
    label: 'Grand fessier',
    path: 'M77,173 L99,173 L100,208 C98,217 90,220 84,216 C78,212 75,204 75,194 Z M123,173 L101,173 L100,208 C102,217 110,220 116,216 C122,212 125,204 125,194 Z',
  },
  glute_med: {
    label: 'Moyen fessier',
    path: 'M73,160 L82,160 L83,175 L76,175 C74,170 72,166 73,160 Z M127,160 L118,160 L117,175 L124,175 C126,170 128,166 127,160 Z',
  },
  // ISCHIO-JAMBIERS
  hamstring_bicep: {
    label: 'Biceps fémoral',
    path: 'M78,215 L90,215 L91,258 L81,260 L75,250 Z M122,215 L110,215 L109,258 L119,260 L125,250 Z',
  },
  hamstring_semis: {
    label: 'Demi-tendineux',
    path: 'M90,215 L101,215 L101,258 L91,258 Z M110,215 L99,215 L99,258 L109,258 Z',
  },
  // MOLLETS
  gastro_med: {
    label: 'Gastrocnémien',
    path: 'M76,263 L86,263 L85,310 L81,314 L75,310 Z',
  },
  gastro_lat: {
    label: 'Gastrocnémien lat.',
    path: 'M124,263 L114,263 L115,310 L119,314 L125,310 Z',
  },
  soleus: {
    label: 'Soléaire',
    path: 'M85,282 L91,282 L91,314 L85,314 Z M115,282 L109,282 L109,314 L115,314 Z',
  },
  // ROTATION
  rotator_cuff: {
    label: 'Coiffe rotateurs',
    path: 'M71,55 C68,52 66,57 67,63 L72,63 C72,59 72,57 71,55 Z M129,55 C132,52 134,57 133,63 L128,63 C128,59 128,57 129,55 Z',
  },
  teres_major: {
    label: 'Grand rond',
    path: 'M78,72 L88,68 L87,85 L77,82 Z M122,72 L112,68 L113,85 L123,82 Z',
  },
}

// Silhouette corps — face et dos
const BODY_FRONT = `M100,14 C87,13 79,21 76,33 L71,56 C68,70 64,82 61,94
  L56,122 C53,136 51,150 50,165 L48,197 C46,213 48,225 50,237
  L53,263 C55,275 57,285 59,295 L61,327 C62,340 62,354 62,366
  L61,396 L57,450 C56,456 60,460 64,460 L67,456 C69,450 68,442 67,434
  L66,402 L67,367 L68,334 C69,322 71,310 73,298 L76,266 C78,254 81,244 84,234
  L88,202 C90,190 92,180 93,170 L92,154 L108,154 L107,170
  C108,180 110,190 112,202 L116,234 C119,244 122,254 124,266
  L127,298 C129,310 131,322 132,334 L133,367 L134,402 L133,434
  C132,442 131,450 133,456 L136,460 C140,460 144,456 143,450
  L139,396 L138,366 L138,354 L139,327 L141,295 C143,285 145,275 147,263
  L150,237 C152,225 154,213 152,197 L150,165 C149,150 147,136 144,122
  L139,94 C136,82 133,70 129,56 L124,33 C121,21 113,13 100,14Z`

const HEAD = `M88,8 C85,0 89,-5 100,0 C111,-5 115,0 112,8 C116,20 116,33 100,35 C84,33 84,20 88,8Z`
const NECK = `M93,35 L93,47 C96,51 104,51 107,47 L107,35Z`

// Map exercice → muscles activés
const ACTIVATION_MAP = {
  bench_barbell:      { front: ['chest_mid', 'chest_upper'],             back: [],                                     front_sec: ['delt_ant', 'triceps_all'], back_sec: [] },
  bench_dumbbell:     { front: ['chest_mid', 'chest_low'],               back: [],                                     front_sec: ['delt_ant'],               back_sec: [] },
  incline_dumbbell:   { front: ['chest_upper', 'delt_ant'],              back: [],                                     front_sec: ['chest_mid'],              back_sec: [] },
  machine_chest_press:{ front: ['chest_mid', 'chest_upper'],             back: [],                                     front_sec: [],                         back_sec: [] },
  cable_fly:          { front: ['chest_mid', 'chest_low'],               back: [],                                     front_sec: ['delt_ant'],               back_sec: [] },
  pec_deck:           { front: ['chest_mid'],                            back: [],                                     front_sec: [],                         back_sec: [] },
  ohp_barbell:        { front: ['delt_ant', 'delt_lat'],                 back: ['traps_upper'],                        front_sec: [],                         back_sec: ['triceps_all'] },
  db_shoulder_press:  { front: ['delt_ant', 'delt_lat'],                 back: [],                                     front_sec: [],                         back_sec: ['traps_upper'] },
  lateral_raise:      { front: ['delt_lat'],                             back: [],                                     front_sec: [],                         back_sec: [] },
  face_pull:          { front: [],                                        back: ['delt_post', 'rhomboids'],             front_sec: [],                         back_sec: ['traps_mid'] },
  tricep_pushdown:    { front: [],                                        back: ['triceps_lat'],                        front_sec: [],                         back_sec: [] },
  tricep_overhead:    { front: [],                                        back: ['triceps_long'],                       front_sec: [],                         back_sec: ['triceps_lat'] },
  skull_crushers:     { front: [],                                        back: ['triceps_long', 'triceps_lat'],        front_sec: [],                         back_sec: [] },
  lat_pulldown:       { front: [],                                        back: ['lats_upper', 'lats_mid'],             front_sec: ['biceps_long'],            back_sec: ['delt_post'] },
  pullup:             { front: [],                                        back: ['lats_upper', 'lats_mid'],             front_sec: ['biceps_long', 'biceps_short'], back_sec: [] },
  barbell_row:        { front: [],                                        back: ['rhomboids', 'lats_mid', 'traps_mid'], front_sec: ['biceps_short'],           back_sec: ['delt_post'] },
  seated_cable_row:   { front: [],                                        back: ['rhomboids', 'traps_mid', 'lats_low'], front_sec: ['biceps_short'],           back_sec: [] },
  db_row:             { front: [],                                        back: ['lats_mid', 'lats_low', 'rhomboids'],  front_sec: ['biceps_long'],            back_sec: ['delt_post'] },
  ez_curl:            { front: ['biceps_long', 'biceps_short'],           back: [],                                     front_sec: ['brachialis'],             back_sec: [] },
  hammer_curl:        { front: ['brachialis', 'biceps_short'],            back: [],                                     front_sec: ['brachioradialis'],        back_sec: [] },
  cable_curl:         { front: ['biceps_long', 'biceps_short'],           back: [],                                     front_sec: [],                         back_sec: [] },
  barbell_squat:      { front: ['quads_rect', 'quads_out'],               back: ['glute_max', 'hamstring_bicep'],       front_sec: ['quads_in'],               back_sec: ['erectors'] },
  leg_press:          { front: ['quads_rect', 'quads_in'],                back: ['glute_max'],                          front_sec: ['quads_out'],              back_sec: [] },
  lunges:             { front: ['quads_rect', 'quads_out'],               back: ['glute_max', 'glute_med'],             front_sec: ['quads_in'],               back_sec: [] },
  leg_extension:      { front: ['quads_rect', 'quads_out', 'quads_in'],   back: [],                                     front_sec: [],                         back_sec: [] },
  goblet_squat:       { front: ['quads_rect', 'core'],                    back: ['glute_max'],                          front_sec: ['quads_in'],               back_sec: [] },
  rdl:                { front: [],                                        back: ['hamstring_bicep', 'hamstring_semis', 'glute_max'], front_sec: [],            back_sec: ['erectors'] },
  leg_curl:           { front: [],                                        back: ['hamstring_bicep', 'hamstring_semis'], front_sec: [],                         back_sec: [] },
  hip_thrust:         { front: [],                                        back: ['glute_max', 'glute_med'],             front_sec: [],                         back_sec: ['hamstring_bicep'] },
  calf_raise_standing:{ front: ['tibialis'],                              back: ['gastro_lat', 'gastro_med'],           front_sec: [],                         back_sec: ['soleus'] },
  deadlift:           { front: ['core'],                                  back: ['erectors', 'glute_max', 'hamstring_bicep', 'lats_low'], front_sec: ['quads_rect'], back_sec: ['traps_upper'] },
  plank:              { front: ['core', 'transverse'],                    back: ['erectors'],                           front_sec: [],                         back_sec: ['glute_max'] },
}

export default function MuscleDiagram({ exerciseId, size = 110 }) {
  const [view, setView] = useState('front')

  const act = ACTIVATION_MAP[exerciseId] || { front: [], back: [], front_sec: [], back_sec: [] }
  const primary   = view === 'front' ? act.front     : act.back
  const secondary = view === 'front' ? act.front_sec : act.back_sec
  const muscles   = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES

  const hasFront = act.front.length > 0 || act.front_sec.length > 0
  const hasBack  = act.back.length  > 0 || act.back_sec.length  > 0

  const getMuscleStyle = (name) => {
    if (primary.includes(name))   return { fill: 'var(--mus-pri)', opacity: 1,   filter: 'drop-shadow(0 0 5px var(--acc))' }
    if (secondary.includes(name)) return { fill: 'var(--mus-sec)', opacity: 0.9, filter: 'none' }
    return { fill: 'var(--mus-off)', opacity: 1, filter: 'none' }
  }

  const h = size * 2.4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

      {/* Toggle vue */}
      <div style={{ display: 'flex', gap: 4 }}>
        {[['front', 'Face'], ['back', 'Dos']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{
            background: view === id ? 'var(--acc)' : 'transparent',
            color:      view === id ? 'var(--txt-inv)' : 'var(--txt-muted)',
            border: `1px solid ${view === id ? 'var(--acc)' : 'var(--border)'}`,
            borderRadius: 999, padding: '3px 11px',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.16s',
            position: 'relative',
          }}>
            {label}
            {/* Point vert si muscles actifs dans cette vue */}
            {((id === 'front' && hasFront) || (id === 'back' && hasBack)) && view !== id && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--acc)',
                boxShadow: '0 0 5px var(--acc)',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* SVG */}
      <div style={{ position: 'relative' }}>
        {/* Glow ambiant si muscles actifs */}
        {primary.length > 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 38%, var(--acc-glo-m) 0%, transparent 70%)',
            borderRadius: 10, pointerEvents: 'none',
          }} />
        )}

        <svg
          viewBox="0 0 200 480"
          width={size} height={h}
          style={{ overflow: 'visible', transition: 'all 0.3s' }}
        >
          {/* Silhouette */}
          <path d={BODY_FRONT} fill="var(--body-fill)" stroke="var(--body-stroke)" strokeWidth="1.2" />
          <path d={HEAD}       fill="var(--body-fill)" stroke="var(--body-stroke)" strokeWidth="1.2" />
          <path d={NECK}       fill="var(--body-fill)" stroke="var(--body-stroke)" strokeWidth="1.2" />

          {/* Muscles */}
          {Object.entries(muscles).map(([name, muscle]) => {
            const s = getMuscleStyle(name)
            return (
              <path
                key={name}
                d={muscle.path}
                fill={s.fill}
                style={{
                  filter: s.filter,
                  transition: 'fill 0.3s, filter 0.3s',
                }}
                strokeLinejoin="round"
              />
            )
          })}
        </svg>
      </div>

      {/* Légende */}
      {(primary.length > 0 || secondary.length > 0) && (
        <div style={{ display: 'flex', gap: 10 }}>
          {primary.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--acc)',
                boxShadow: '0 0 4px var(--acc)',
                display: 'block', flexShrink: 0,
              }} />
              <span style={{
                fontSize: 9, color: 'var(--txt-muted)',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Principal
              </span>
            </div>
          )}
          {secondary.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--mus-sec)',
                border: '1px solid var(--acc)',
                display: 'block', flexShrink: 0,
              }} />
              <span style={{
                fontSize: 9, color: 'var(--txt-muted)',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Secondaire
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}